/*
**  YYCS -- Yin-Yang Color Scheme
**  Copyright (c) 2023 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

/*  external dependencies  */
import tc         from "tinycolor2"
import objectPath from "object-path"

/*  input and output colors  */
type YYCSInputColors  = { bg: string,   fg?: string   }
type YYCSOutputColors = { bg: string[], fg:  string[] }

/*  color scheme input specification  */
export type YYCSInput = {
    acc:   YYCSInputColors,
    axr?:  YYCSInputColors,
    reg:   YYCSInputColors,
    sxr?:  YYCSInputColors,
    sig?:  YYCSInputColors,
    N?:    number,
    M?:    number,
    K?:    number,
    L?:    number
}

export default class YYCS {
    /*  color scheme output  */
    public acc: YYCSOutputColors = { bg: [], fg: [] }
    public axr: YYCSOutputColors = { bg: [], fg: [] }
    public reg: YYCSOutputColors = { bg: [], fg: [] }
    public sxr: YYCSOutputColors = { bg: [], fg: [] }
    public sig: YYCSOutputColors = { bg: [], fg: [] }
    public N:   number
    public M:   number
    public K:   number
    public L:   number

    /*  construct a new color scheme  */
    constructor (spec: YYCSInput) {
        /*  determine spread parameters  */
        this.N = spec.N ?? 3
        this.M = spec.M ?? 1
        this.K = spec.K ?? 0.05
        this.L = spec.L ?? 0.20

        /*  determine: background base colors  */
        this.reg.bg[this.N] = spec.reg.bg
        this.acc.bg[this.N] = spec.acc.bg
        if (spec.sig?.bg)
            this.sig.bg[this.N] = spec.sig.bg
        else
            this.sig.bg[this.N] = this.complement(this.acc.bg[this.N])

        /*  determine: foreground base colors (transposed from background)  */
        if (spec.reg.fg)
            this.reg.fg[this.M] = spec.reg.fg
        else
            this.reg.fg[this.M] = this.transpose(this.reg.bg[this.N])
        if (spec.acc.fg)
            this.acc.fg[this.M] = spec.acc.fg
        else
            this.acc.fg[this.M] = this.transpose(this.acc.bg[this.N])
        if (spec.sig?.fg)
            this.sig.fg[this.M] = spec.sig.fg
        else
            this.sig.fg[this.M] = this.transpose(this.sig.bg[this.N])

        /*  determine: foreground base colors (mixed from foregrounds/backgrounds)  */
        if (spec.axr?.fg)
            this.axr.fg[this.M] = spec.axr.fg
        else
            this.axr.fg[this.M] = this.cross(this.acc.fg[this.M], this.acc.bg[this.N])
        if (spec.sxr?.fg)
            this.sxr.fg[this.M] = spec.sxr.fg
        else
            this.sxr.fg[this.M] = this.cross(this.sig.fg[this.M], this.sig.bg[this.N])

        /*  determine: background base colors of cross-colors  */
        this.axr.bg[this.N] = this.reg.bg[this.N]
        this.sxr.bg[this.N] = this.reg.bg[this.N]

        /*  determine background color gradients  */
        for (let n = 0; n < this.N; n++) {
            this.acc.bg[this.N - 1 - n] = this.darken( this.acc.bg[this.N], (n + 1) * this.K)
            this.acc.bg[this.N + 1 + n] = this.lighten(this.acc.bg[this.N], (n + 1) * this.K)
            this.axr.bg[this.N - 1 - n] = this.darken( this.axr.bg[this.N], (n + 1) * this.K)
            this.axr.bg[this.N + 1 + n] = this.lighten(this.axr.bg[this.N], (n + 1) * this.K)
            this.reg.bg[this.N - 1 - n] = this.darken( this.reg.bg[this.N], (n + 1) * this.K)
            this.reg.bg[this.N + 1 + n] = this.lighten(this.reg.bg[this.N], (n + 1) * this.K)
            this.sxr.bg[this.N - 1 - n] = this.darken( this.sxr.bg[this.N], (n + 1) * this.K)
            this.sxr.bg[this.N + 1 + n] = this.lighten(this.sxr.bg[this.N], (n + 1) * this.K)
            this.sig.bg[this.N - 1 - n] = this.darken( this.sig.bg[this.N], (n + 1) * this.K)
            this.sig.bg[this.N + 1 + n] = this.lighten(this.sig.bg[this.N], (n + 1) * this.K)
        }

        /*  determine foreground color gradients  */
        for (let m = 0; m < this.M; m++) {
            this.acc.fg[this.M - 1 - m] = this.darken( this.acc.fg[this.M], (m + 1) * this.L)
            this.acc.fg[this.M + 1 + m] = this.lighten(this.acc.fg[this.M], (m + 1) * this.L)
            this.axr.fg[this.M - 1 - m] = this.darken( this.axr.fg[this.M], (m + 1) * this.L)
            this.axr.fg[this.M + 1 + m] = this.lighten(this.axr.fg[this.M], (m + 1) * this.L)
            this.reg.fg[this.M - 1 - m] = this.darken( this.reg.fg[this.M], (m + 1) * this.L)
            this.reg.fg[this.M + 1 + m] = this.lighten(this.reg.fg[this.M], (m + 1) * this.L)
            this.sxr.fg[this.M - 1 - m] = this.darken( this.sxr.fg[this.M], (m + 1) * this.L)
            this.sxr.fg[this.M + 1 + m] = this.lighten(this.sxr.fg[this.M], (m + 1) * this.L)
            this.sig.fg[this.M - 1 - m] = this.darken( this.sig.fg[this.M], (m + 1) * this.L)
            this.sig.fg[this.M + 1 + m] = this.lighten(this.sig.fg[this.M], (m + 1) * this.L)
        }
    }

    /*  lighten a color  */
    private lighten (color: string, percent: number) {
        return tc(color).lighten(percent * 100).toHexString()
    }

    /*  darken a color  */
    private darken (color: string, percent: number) {
        return tc(color).darken(percent * 100).toHexString()
    }

    /*  derive complement color  */
    private complement (color: string) {
        return tc(color).spin(180).toString()
    }

    /*  derive transposed color (foreground vs. background)  */
    private transpose (color: string) {
        const hsl = tc(color).toHsl()
        if (hsl.l <= 0.5)
            hsl.l = 1.00 - (hsl.l / 0.50) * 0.15
        else
            hsl.l = 0.00 + (hsl.l / 0.50) * 0.15
        return tc(hsl).toHexString()
    }

    /*  derive crossed color (hue/saturation of background, lightning towards foreground)  */
    private cross (fg: string, bg: string) {
        const cFg = tc(fg)
        const cBg = tc(bg)
        const hsl1 = cFg.toHsl()
        const hsl2 = cBg.toHsl()
        hsl2.l = hsl2.l + ((hsl1.l - hsl2.l) * 0.5)
        return tc(hsl2).toHexString()
    }

    /*  generate CSS variable definitions  */
    css () {
        let html = ""
        const genColorList = (colorList: string[], prefix: string) => {
            let html = ""
            for (let i = 0; i < colorList.length; i++)
                html += `--yycs-${prefix}-${i + 1}: ${colorList[i]}\n`
            return html
        }
        const genColorSet = (colorSet: YYCSOutputColors, prefix: string) => {
            let html = ""
            html += genColorList(colorSet.fg, `${prefix}-fg`)
            html += genColorList(colorSet.bg, `${prefix}-bg`)
            return html
        }
        html += genColorSet(this.acc, "acc")
        html += genColorSet(this.axr, "axr")
        html += genColorSet(this.reg, "reg")
        html += genColorSet(this.sxr, "sxr")
        html += genColorSet(this.sig, "sig")
        html = ":root {\n" + html.replace(/^(.)/mg, "    $1") + "}\n"
        return html
    }

    /*  convert URI to input specification  */
    static uri2spec (uri: string) {
        uri = uri.replace(/^yycs:/, "")
        uri = uri.replace(/\+(\d+)\+/g, (m, d) => (new Array(parseInt(d))).join("-"))
        const segs = uri.split("-")
        for (let i = 0; i < 12; i++)
            if (segs[i] === undefined || segs[i] === "")
                segs[i] = ""
        const spec = {} as YYCSInput
        objectPath.set(spec, "reg.bg", tc(segs[0]).toHexString())
        objectPath.set(spec, "acc.bg", tc(segs[1]).toHexString())
        if (segs[2]) objectPath.set(spec, "sig.bg", tc(segs[2]).toHexString())
        if (segs[3]) objectPath.set(spec, "reg.fg", tc(segs[3]).toHexString())
        if (segs[4]) objectPath.set(spec, "acc.fg", tc(segs[4]).toHexString())
        if (segs[5]) objectPath.set(spec, "sig.fg", tc(segs[5]).toHexString())
        if (segs[6]) objectPath.set(spec, "axr.fg", tc(segs[6]).toHexString())
        if (segs[7]) objectPath.set(spec, "sxr.fg", tc(segs[7]).toHexString())
        if (segs[8]) spec.N = parseInt(segs[8])
        if (segs[9]) spec.M = parseInt(segs[9])
        if (segs[10]) spec.K = parseInt(segs[10]) / 100
        if (segs[11]) spec.L = parseInt(segs[11]) / 100
        return spec
    }

    /*  convert input specification to URI  */
    static spec2uri (spec: YYCSInput) {
        let uri = "yycs:"
        uri += tc(spec.reg.bg).toHex() + "-"
        uri += tc(spec.acc.bg).toHex() + "-"
        uri += (spec.sig?.bg ? tc(spec.sig.bg).toHex() : "") + "-"
        uri += (spec.reg?.fg ? tc(spec.reg.fg).toHex() : "") + "-"
        uri += (spec.acc?.fg ? tc(spec.acc.fg).toHex() : "") + "-"
        uri += (spec.sig?.fg ? tc(spec.sig.fg).toHex() : "") + "-"
        uri += (spec.axr?.fg ? tc(spec.axr.fg).toHex() : "") + "-"
        uri += (spec.sxr?.fg ? tc(spec.sxr.fg).toHex() : "") + "-"
        uri += (spec.N !== undefined && spec.N !== 3 ? spec.N : "") + "-"
        uri += (spec.M !== undefined && spec.M !== 1 ? spec.M : "") + "-"
        uri += (spec.K !== undefined && spec.K !== 0.05 ? (spec.K * 100) : "") + "-"
        uri += (spec.L !== undefined && spec.L !== 0.20 ? (spec.L * 100) : "")
        uri = uri.replace(/-+$/, "")
        uri = uri.replace(/---+/g, (m) => `+${m.length}+`)
        return uri
    }
}

