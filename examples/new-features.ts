import { Typst } from '../src';
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const renderer = new Typst();

    console.log('Testing backgroundColor option...');
    const withBackground = await renderer.render({
        code: '$ E = m c^2 $',
        snippet: true,
        backgroundColor: 'white',
        scale: 2
    });
    await fs.writeFile(path.join(__dirname, 'with-background.png'), withBackground);
    console.log('✓ Rendered with-background.png');

    console.log('Testing preamble option...');
    const myTheme = `
#set page(fill: rgb("#2b2d31"), margin: 1cm)
#set text(fill: white)
`;

    const withPreamble = await renderer.render({
        preamble: myTheme,
        code: '$ sum_(k=1)^n k = (n(n+1))/2 $',
        snippet: true,
        scale: 2
    });
    await fs.writeFile(path.join(__dirname, 'with-preamble.png'), withPreamble);
    console.log('✓ Rendered with-preamble.png');

    console.log('Testing both options together...');
    const both = await renderer.render({
        preamble: '#set text(size: 20pt, font: "serif")',
        code: '$ integral_0^infinity e^(-x^2) dif x = sqrt(pi)/2 $',
        snippet: true,
        backgroundColor: '#f0f0f0',
        scale: 2
    });
    await fs.writeFile(path.join(__dirname, 'both-options.png'), both);
    console.log('✓ Rendered both-options.png');

    console.log('\nAll tests passed! ✓');
}

main().catch(console.error);
