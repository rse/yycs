
YYCS
====

**Yin-Yang Color Scheme**

<p/>
<img src="https://nodei.co/npm/yycs.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/yycs.png" alt=""/>

Abstract
--------

**YYCS** (Yin-Yang Color Scheme) is a simple, effective and flexible
meta color scheme, designed by Dr. Ralf S. Engelschall. It can be used
to generate particular color schemes for use in applications, websites,
diagrams, etc.

**YYCS** supports 2 to 8 base colors as its input and provides 5 to
5x2xN colors (N: number of lighter/darker color spreads) as its output.

**YYCS** is based on the following foundational rules:

1. *Triad Coloring*:
   The color scheme is based on three optical colorings:
   - a primary   "**reg**(ular)" coloring, used about 75% of all times,
   - a secondary "**acc**(ent)"  coloring, used about 20% of all times, and
   - a tertiary  "**sig**(nal)"  coloring, used about 5%  of all times.

2. *Coloring Spread*:
   The color scheme provides for each of the three colorings 1 or an arbitrary
   odd number of pairs of foreground/background colors.

1. *Minimalistic Specification*:
   The color scheme can be unambiguously specified
   with a minimum amount of input information.

3. *Pairing Rule*:
   The color scheme input specification consists of:
   - 2 primary background/foreground color pairs ("reg-bg" / "reg-fg" and "acc-bg" / "acc-fg"),
   - 1 secondary background/foreground color pair ("sig-bg" / "sig-fg"), and
   - 2 tertiary cross-derived foreground colors ("axr-fg" and "sxr-fg").

3. *Spread Rule*:
   The color scheme's 8 base colors

Installation
------------

```sh
$ npm install [-g] yycs
```

Usage
-----

**YYCS** can be used from the command-line via its CLI. Specify the two
mandatory base colors ("reg-bg" and "acc-bg") either via options or via
a compact YYCS URI, and choose an output format (`css`, `json`, `yaml`,
or `uri`):

```sh
$ yycs --reg-bg "#336699" --acc-bg "#996633" --format uri
yycs:336699-996633

$ yycs "yycs:336699-996633" --format css
:root {
    --yycs-acc-fg-1: #d7ac84;
    --yycs-acc-fg-2: #f0e0d1;
    --yycs-acc-fg-3: #ffffff;
    --yycs-acc-bg-1: #604020;
    --yycs-acc-bg-2: #734d26;
    --yycs-acc-bg-3: #86592d;
    --yycs-acc-bg-4: #996633;
    [...]
}
```

Alternatively, **YYCS** can be used programmatically via its
TypeScript/JavaScript API:

```ts
import YYCS from "yycs"

/*  generate color scheme from the two mandatory base colors  */
const yycs = new YYCS({
    reg: { bg: "#336699" },
    acc: { bg: "#996633" }
})

/*  access the generated color arrays (2N+1 background, 2M+1 foreground colors)  */
yycs.reg.bg  /*  [ "#204060", "#264c73", "#2d5986", "#336699",
                   "#3973ac", "#407fbf", "#538cc6" ]  */
yycs.reg.fg  /*  [ "#84acd7", "#d1e0f0", "#ffffff" ]  */

/*  generate CSS variable definitions  */
const css = yycs.css()

/*  convert between input specification and compact URI  */
const uri  = YYCS.spec2uri({ reg: { bg: "#336699" }, acc: { bg: "#996633" } })
const spec = YYCS.uri2spec("yycs:336699-996633")
```

License
-------

Copyright &copy; 2023-2025 Dr. Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

