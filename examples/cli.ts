import { Typst } from '../src';
import fs from 'fs/promises';
import path from 'path';

const code = process.argv[2] || '= Test\nHello from CLI!';
const filename = process.argv[3] || 'output.png';

(async () => {
    console.log(`Rendering: "${code}"`);
    const renderer = new Typst();
    try {
        const png = await renderer.render({ code, snippet: true, ppi: 144 });
        await fs.writeFile(filename, png);
        console.log(`Success! Saved to ${filename}`);
    } catch (e: any) {
        console.error('Error:', e.message);
    }
})();
