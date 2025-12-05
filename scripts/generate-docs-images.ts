import { Typst } from '../src';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const OUTPUT_DIR = join(__dirname, '../docs/public/images');

async function generate() {
    console.log('Generating documentation images...');
    await mkdir(OUTPUT_DIR, { recursive: true });

    const renderer = new Typst();

    // 1. Math Equation
    console.log('Rendering math.png...');
    const math = await renderer.render({
        code: `
#set page(width: auto, height: auto, margin: 1cm)
#set text(size: 20pt)
$ sum_(k=1)^n k = (n(n+1))/2 $
        `.trim(),
        format: 'png',
        scale: 2
    });
    await writeFile(join(OUTPUT_DIR, 'math.png'), math);

    // 2. Code Snippet
    console.log('Rendering code.png...');
    const code = await renderer.render({
        code: `
#set page(width: auto, height: auto, margin: 1cm)
#set text(size: 14pt, font: "Courier New")
#block(
  fill: luma(240),
  inset: 8pt,
  radius: 4pt,
  [
    \`\`\`rust
    fn main() {
        println!("Hello World!");
    }
    \`\`\`
  ]
)
        `.trim(),
        format: 'png',
        scale: 2
    });
    await writeFile(join(OUTPUT_DIR, 'code.png'), code);

    // 3. Diagram (using Typst's drawing capabilities if available, or just shapes)
    console.log('Rendering diagram.png...');
    const diagram = await renderer.render({
        code: `
#set page(width: auto, height: auto, margin: 1cm)
#circle(radius: 20pt, fill: red)
#place(center + horizon, dx: 30pt, dy: 30pt, circle(radius: 20pt, fill: blue))
        `.trim(),
        format: 'png',
        scale: 2
    });
    await writeFile(join(OUTPUT_DIR, 'diagram.png'), diagram);

    console.log('Done!');
}

generate().catch(console.error);
