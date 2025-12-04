// AI generated slop

import { Typst } from './src';

async function benchmark() {
    console.log('🚀 Typst Raster Performance Benchmark\n');

    // Test 1: Cold start (no cache)
    console.log('Test 1: Cold Start (cache disabled)');
    const noCacheRenderer = new Typst({ cache: false });
    const code = '$ sum_(k=1)^n k = (n(n+1))/2 $';

    const coldTimes: number[] = [];
    for (let i = 0; i < 5; i++) {
        const start = performance.now();
        await noCacheRenderer.render({ code, snippet: true });
        coldTimes.push(performance.now() - start);
    }
    const avgCold = coldTimes.reduce((a, b) => a + b) / coldTimes.length;
    console.log(`  Average: ${avgCold.toFixed(2)}ms`);
    console.log(`  Min: ${Math.min(...coldTimes).toFixed(2)}ms`);
    console.log(`  Max: ${Math.max(...coldTimes).toFixed(2)}ms\n`);

    // Test 2: With cache (warm)
    console.log('Test 2: With Cache (default)');
    const cachedRenderer = new Typst();

    // First render to populate cache
    await cachedRenderer.render({ code, snippet: true });

    const warmTimes: number[] = [];
    for (let i = 0; i < 10; i++) {
        const start = performance.now();
        await cachedRenderer.render({ code, snippet: true });
        warmTimes.push(performance.now() - start);
    }
    const avgWarm = warmTimes.reduce((a, b) => a + b) / warmTimes.length;
    console.log(`  Average: ${avgWarm.toFixed(2)}ms`);
    console.log(`  Min: ${Math.min(...warmTimes).toFixed(2)}ms`);
    console.log(`  Max: ${Math.max(...warmTimes).toFixed(2)}ms`);
    console.log(`  🎯 Speedup: ${(avgCold / avgWarm).toFixed(1)}x faster\n`);

    // Test 3: Different formats
    console.log('Test 3: Format Performance');
    const formats: ('png' | 'jpeg' | 'webp' | 'svg' | 'pdf')[] = ['png', 'jpeg', 'webp', 'svg', 'pdf'];

    for (const format of formats) {
        const times: number[] = [];
        for (let i = 0; i < 3; i++) {
            const start = performance.now();
            await noCacheRenderer.render({ code, format, snippet: format !== 'pdf' });
            times.push(performance.now() - start);
        }
        const avg = times.reduce((a, b) => a + b) / times.length;
        console.log(`  ${format.toUpperCase().padEnd(5)}: ${avg.toFixed(2)}ms`);
    }
    console.log();

    // Test 4: Resolution impact
    console.log('Test 4: Resolution Impact');
    const ppis = [72, 144, 192, 300, 600];

    for (const ppi of ppis) {
        const start = performance.now();
        await noCacheRenderer.render({ code, snippet: true, ppi });
        const time = performance.now() - start;
        console.log(`  ${ppi} PPI: ${time.toFixed(2)}ms`);
    }
    console.log();

    // Test 5: Scale impact
    console.log('Test 5: Scale Impact');
    const scales = [1, 2, 3, 4, 5];

    for (const scale of scales) {
        const start = performance.now();
        await noCacheRenderer.render({ code, snippet: true, scale });
        const time = performance.now() - start;
        console.log(`  ${scale}x scale: ${time.toFixed(2)}ms`);
    }
    console.log();

    // Test 6: Batch rendering
    console.log('Test 6: Batch Rendering (10 items)');
    const batchItems = Array.from({ length: 10 }, (_, i) => ({
        code: `$ x_{${i}} $`,
        snippet: true
    }));

    const batchStart = performance.now();
    await cachedRenderer.renderBatch(batchItems);
    const batchTime = performance.now() - batchStart;
    console.log(`  Total: ${batchTime.toFixed(2)}ms`);
    console.log(`  Per item: ${(batchTime / 10).toFixed(2)}ms\n`);

    // Test 7: Complex document
    console.log('Test 7: Complex Document');
    const complexCode = `
#set page(width: auto, height: auto, margin: 1cm)
#set text(size: 12pt)

= Mathematics

$ integral_0^infinity e^(-x^2) dx = sqrt(pi)/2 $

$ sum_(n=1)^infinity 1/n^2 = pi^2/6 $

$ det(A) = sum_(sigma in S_n) "sgn"(sigma) product_(i=1)^n a_(i,sigma(i)) $
    `.trim();

    const complexTimes: number[] = [];
    for (let i = 0; i < 3; i++) {
        const start = performance.now();
        await noCacheRenderer.render({ code: complexCode });
        complexTimes.push(performance.now() - start);
    }
    const avgComplex = complexTimes.reduce((a, b) => a + b) / complexTimes.length;
    console.log(`  Average: ${avgComplex.toFixed(2)}ms\n`);

    // Summary
    console.log('📊 Summary:');
    console.log(`  Cold render: ${avgCold.toFixed(2)}ms`);
    console.log(`  Cached render: ${avgWarm.toFixed(2)}ms (${((1 - avgWarm / avgCold) * 100).toFixed(1)}% faster)`);
    console.log(`  Complex document: ${avgComplex.toFixed(2)}ms`);
}

benchmark().catch(console.error);
