import { Typst } from '../src';
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const renderer = new Typst();

    console.log('Rendering showcase example...');

    const buffer = await renderer.render({
        snippet: true,
        scale: 4,
        ppi: 300,
        quality: 100,
        code: `
#set page(width: auto, height: auto, fill: rgb("#1e1e2e"), margin: 20pt)
#set text(fill: white, font: "New Computer Modern", size: 14pt)

#rect(
  fill: rgb("#252535"),
  stroke: 2pt + gradient.linear(rgb("#89b4fa"), rgb("#f38ba8")),
  radius: 10pt,
  inset: 20pt,
  width: 400pt
)[
  #set align(center)
  #text(size: 24pt, weight: "bold")[typst-raster] \
  #v(5pt)
  #text(fill: rgb("#a6adc8"))[Server-side Typst rendering for Node.js]
  
  #line(length: 100%, stroke: 1pt + rgb("#45475a"))
  #v(10pt)
  
  #grid(
    columns: (1fr, 1fr),
    align: (center, center),
    [
      *Vector Math* \
      $ sum_(k=0)^n k = (n(n+1)) / 2 $
    ],
    [
      *Fast Compilation*
      #v(5pt)
      #text(fill: rgb("#a6e3a1"))[✔ Native Rust]
      #v(3pt)
      #text(fill: rgb("#f9e2af"))[✔ Bundled Fonts]
    ]
  )
]
        `
    });

    await fs.writeFile(path.join(__dirname, 'showcase.png'), buffer);
    console.log('✓ Rendered showcase.png');
}

main().catch(console.error);
