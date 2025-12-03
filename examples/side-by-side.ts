import { Typst } from '../src';
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const renderer = new Typst();

    console.log('Generating side-by-side showcase...');

    const typstCode = `#set page(width: auto, height: auto, fill: rgb("#1e1e2e"), margin: 20pt)
#set text(fill: white, font: "New Computer Modern", size: 14pt)

#rect(
  fill: rgb("#252535"),
  stroke: 2pt + gradient.linear(rgb("#89b4fa"), rgb("#f38ba8")),
  radius: 10pt,
  inset: 20pt,
  width: 400pt
)[
  #set align(center)
  #text(size: 24pt, weight: "bold")[typst-raster] \\\\
  #v(5pt)
  #text(fill: rgb("#a6adc8"))[Server-side Typst rendering for Node.js]
  
  #line(length: 100%, stroke: 1pt + rgb("#45475a"))
  #v(10pt)
  
  #grid(
    columns: (1fr, 1fr),
    align: (center, center),
    [
      *Vector Math* \\\\
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
]`;

    const showcasePath = path.join(__dirname, 'showcase.png');
    const imageBuffer = await fs.readFile(showcasePath);

    const codeForDisplay = typstCode
        .replace(/\\\\/g, '\\')
        .trim();

    const buffer = await renderer.render({
        snippet: true,
        scale: 4,
        ppi: 300,
        quality: 100,
        code: `
#set page(fill: rgb("#0d0d1e"), margin: 30pt)
#set text(fill: white, font: "New Computer Modern", size: 11pt)

#grid(
  columns: (520pt, 450pt),
  column-gutter: 25pt,
  align: (left + horizon, center + horizon),
  [
    #text(size: 20pt, weight: "bold", fill: rgb("#89b4fa"))[Typst Code] \\
    #v(12pt)
    #block(
      fill: rgb("#1a1a2e"),
      stroke: 1.5pt + rgb("#313244"),
      radius: 8pt,
      inset: 14pt,
      width: 100%
    )[
      #set text(size: 8pt, font: "monospace", fill: rgb("#cdd6f4"))
      #set par(leading: 0.6em)
      \`\`\`typ
${codeForDisplay}
      \`\`\`
    ]
  ],
  [
    #text(size: 20pt, weight: "bold", fill: rgb("#f38ba8"))[Rendered Output] \\
    #v(12pt)
    #image.decode(bytes((${Array.from(imageBuffer).join(', ')})), format: "png", width: 100%)
  ]
)
        `
    });

    await fs.writeFile(path.join(__dirname, 'side-by-side.png'), buffer);
    console.log('✓ Generated side-by-side.png');
}

main().catch(console.error);
