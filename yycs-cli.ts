/*
**  YYCS -- Yin-Yang Color Scheme
**  Copyright (c) 2023-2025 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  import dependencies  */
import yargs               from "yargs"
import objectPath          from "object-path"
import mergeOptions        from "merge-options"
import jsYAML              from "js-yaml"
import YYCS, { YYCSInput } from "./yycs-api"

/*  establish environment  */
;(async () => {
    /*  parse command-line arguments  */
    // @ts-ignore
    const args = yargs
        /* eslint @stylistic/indent: off */
        .usage("Usage: $0 <options> [<uri>]")
        .help("h").alias("h", "help").default("h", false)
            .describe("h", "show usage help")
        .string("reg-bg").nargs("reg-bg", 1).alias("reg-bg", "r")
            .describe("reg-bg", "regular background color")
        .string("acc-bg").nargs("acc-bg", 1).alias("acc-bg", "a")
            .describe("acc-bg", "accent background color")
        .string("sig-bg").nargs("sig-bg", 1).alias("sig-bg", "s")
            .describe("sig-bg", "signal background color")
        .string("reg-fg").nargs("reg-fg", 1).alias("reg-fg", "R")
            .describe("reg-fg", "regular foreground color")
        .string("acc-fg").nargs("acc-fg", 1).alias("acc-fg", "A")
            .describe("acc-fg", "accent foreground color")
        .string("sig-fg").nargs("sig-fg", 1).alias("sig-fg", "S")
            .describe("sig-fg", "signal foreground color")
        .string("axr-fg").nargs("axr-fg", 1).alias("axr-fg", "X")
            .describe("axr-fg", "accent/regular-cross foreground color")
        .string("sxr-fg").nargs("sxr-fg", 1).alias("sxr-fg", "Y")
            .describe("sxr-fg", "signal/regular-cross foreground color")
        .number("N").nargs("N", 1).alias("N", "spread-bg-amount")
            .describe("N", "background spread amount")
        .number("K").nargs("K", 1).alias("K", "spread-bg-step")
            .describe("K", "background spread step")
        .number("M").nargs("M", 1).alias("M", "spread-fg-amount")
            .describe("M", "foreground spread amount")
        .number("L").nargs("L", 1).alias("L", "spread-fg-step")
            .describe("L", "foreground spread step")
        .string("format").nargs("format", 1).alias("format", "f").default("format", "css")
            .describe("format", "output format ('json', 'yaml', 'css', 'uri')")
        .version(false)
        .strict()
        .showHelpOnFail(true)
        .demandCommand(0, 1)
        .parse(process.argv.slice(2)) as any

    /*  one of acc-bg/reg-bg or URI is required  */
    if (args._.length !== 1 && !(args.accBg && args.regBg))
        throw new Error("either URI or --acc-bg/--reg-bg is required")

    /*  start color scheme specification  */
    let spec = {} as YYCSInput

    /*  optionally load URI options  */
    if (args._.length === 1) {
        const uri = args._[0]
        const specURI = YYCS.uri2spec(uri)
        spec = mergeOptions(spec, specURI) as YYCSInput
    }

    /*  optionally apply CLI options  */
    if (args.regBg) objectPath.set(spec, "reg.bg", args.regBg)
    if (args.accBg) objectPath.set(spec, "acc.bg", args.accBg)
    if (args.sigBg) objectPath.set(spec, "sig.bg", args.sigBg)
    if (args.regFg) objectPath.set(spec, "reg.fg", args.regFg)
    if (args.accFg) objectPath.set(spec, "acc.fg", args.accFg)
    if (args.sigFg) objectPath.set(spec, "sig.fg", args.sigFg)
    if (args.axrFg) objectPath.set(spec, "axr.fg", args.axrFg)
    if (args.sxrFg) objectPath.set(spec, "sxr.fg", args.sxrFg)
    if (args.N)     spec.N = args.N
    if (args.M)     spec.M = args.M
    if (args.K)     spec.K = args.K
    if (args.L)     spec.L = args.L

    /*  generate color scheme  */
    const yycs = new YYCS(spec)

    /*  output color scheme  */
    if (args.format === "json")
        process.stdout.write(JSON.stringify(yycs, null, "    ") + "\n")
    else if (args.format === "yaml")
        process.stdout.write(jsYAML.dump(yycs, { indent: 4, flowLevel: 2, noCompatMode: true, quotingType: "\"" }) + "\n")
    else if (args.format === "css")
        process.stdout.write(yycs.css() + "\n")
    else if (args.format === "uri")
        process.stdout.write(YYCS.spec2uri(spec) + "\n")
    else
        throw new Error("invalid output format")
})().catch((ex) => {
    process.stderr.write(`yycs: ERROR: ${ex.toString()}\n`)
})

