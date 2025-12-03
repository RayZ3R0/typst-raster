import { Typst } from '../src';
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const renderer = new Typst();

    const code = `
  = Hello Typst
  
  This is a *basic* example rendered with typst-raster.
  
  $ x^2 + y^2 = 10 $
  `;

    try {
        const png = await renderer.render({
            code,
            format: 'png',
            snippet: true,
            scale: 2
        });

        await fs.writeFile(path.join(__dirname, 'basic.png'), png);
        console.log('Rendered basic.png');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
