import { Typst } from '../src';

async function verify() {
    const renderer = new Typst();
    const code = '#circle(radius: 10pt, fill: red)';

    console.log('Verifying scale...');
    const bufScale1 = await renderer.render({ code, scale: 1, format: 'png' });
    const bufScale2 = await renderer.render({ code, scale: 2, format: 'png' });

    console.log(`Scale 1 size: ${bufScale1.length}`);
    console.log(`Scale 2 size: ${bufScale2.length}`);

    if (bufScale1.length === bufScale2.length) {
        console.log('FAIL: Scale option is ignored (buffers are identical size)');
    } else {
        console.log('PASS: Scale option affects output');
    }

    console.log('\nVerifying quality...');
    const bufQ10 = await renderer.render({ code, quality: 10, format: 'jpeg' });
    const bufQ100 = await renderer.render({ code, quality: 100, format: 'jpeg' });

    console.log(`Quality 10 size: ${bufQ10.length}`);
    console.log(`Quality 100 size: ${bufQ100.length}`);

    if (bufQ10.length === bufQ100.length) {
        console.log('FAIL: Quality option is ignored (buffers are identical size)');
    } else {
        console.log('PASS: Quality option affects output');
    }
}

verify().catch(console.error);
