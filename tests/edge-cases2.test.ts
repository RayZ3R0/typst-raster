import { describe, it, expect } from 'vitest';
import { Typst, getMetadata } from '../src';
import { Readable } from 'stream';

describe('New Features Edge Cases', () => {
    describe('SVG Output Edge Cases', () => {
        it('should handle very large SVG output', async () => {
            const renderer = new Typst();
            // Generate large Typst document
            const largeCode = Array.from({ length: 100 }, (_, i) => `#rect(width: ${i}pt, height: ${i}pt)`).join('\n');

            const buffer = await renderer.render({
                code: largeCode,
                format: 'svg'
            });

            const svg = buffer.toString('utf-8');
            expect(svg).toContain('<svg');
            expect(svg.length).toBeGreaterThan(10000);
        });

        it('should handle SVG with unicode characters', async () => {
            const renderer = new Typst();
            const buffer = await renderer.render({
                code: '你好 مرحبا 🌍',
                format: 'svg',
                snippet: true
            });

            const svg = buffer.toString('utf-8');
            expect(svg).toContain('<svg');
        });

        it('should handle SVG with variables', async () => {
            const renderer = new Typst();
            const buffer = await renderer.render({
                code: '#sys.inputs.text',
                variables: { text: 'Dynamic SVG Content' },
                format: 'svg',
                snippet: true
            });

            const svg = buffer.toString('utf-8');
            expect(svg).toContain('<svg');
        });

        it('should handle SVG with preamble', async () => {
            const renderer = new Typst();
            const buffer = await renderer.render({
                code: 'Test',
                preamble: '#set text(fill: red)',
                format: 'svg',
                snippet: true
            });

            const svg = buffer.toString('utf-8');
            expect(svg).toContain('<svg');
        });
    });

    describe('Cache Edge Cases', () => {
        it('should evict oldest item when cache is full', async () => {
            const renderer = new Typst({ cacheSize: 3 });

            // Fill cache
            await renderer.render({ code: '$ a $', snippet: true });
            await renderer.render({ code: '$ b $', snippet: true });
            await renderer.render({ code: '$ c $', snippet: true });

            // This should evict '$ a $'
            await renderer.render({ code: '$ d $', snippet: true });

            // Should still work (testing no crash)
            const result = await renderer.render({ code: '$ e $', snippet: true });
            expect(result).toBeInstanceOf(Buffer);
        });

        it('should cache SVG and PNG separately', async () => {
            const renderer = new Typst();
            const code = '$ x^2 $';

            const svg = await renderer.render({ code, format: 'svg', snippet: true });
            const png = await renderer.render({ code, format: 'png', snippet: true });

            expect(svg.toString('utf-8')).toContain('<svg');
            expect(png[0]).toBe(137); // PNG magic number
        });

        it('should differentiate cache by all options', async () => {
            const renderer = new Typst();
            const code = '$ x $';

            const r1 = await renderer.render({ code, snippet: true, ppi: 72 });
            const r2 = await renderer.render({ code, snippet: true, ppi: 144 });

            // Different PPI should produce different results
            expect(r1.equals(r2)).toBe(false);
        });

        it('should handle cache with zero size gracefully', async () => {
            const renderer = new Typst({ cacheSize: 0 });

            const result = await renderer.render({ code: '$ x $', snippet: true });
            expect(result).toBeInstanceOf(Buffer);
        });

        it('should cache PDF format', async () => {
            const renderer = new Typst();
            const code = '= Title';

            const start = Date.now();
            await renderer.render({ code, format: 'pdf' });
            const time1 = Date.now() - start;

            const start2 = Date.now();
            await renderer.render({ code, format: 'pdf' });
            const time2 = Date.now() - start2;

            // Should be faster (note: PDF doesn't go through svgToBuffer so caching happens differently)
            expect(time2).toBeLessThan(time1);
        });
    });

    describe('Batch Rendering Edge Cases', () => {
        it('should handle batch with one item', async () => {
            const renderer = new Typst();
            const results = await renderer.renderBatch([
                { code: '$ x $', snippet: true }
            ]);

            expect(results).toHaveLength(1);
        });

        it('should handle batch with mixed formats', async () => {
            const renderer = new Typst();
            const results = await renderer.renderBatch([
                { code: '$ a $', format: 'png', snippet: true },
                { code: '$ b $', format: 'svg', snippet: true },
                { code: '$ c $', format: 'pdf' }
            ]);

            expect(results).toHaveLength(3);
            expect(results[1].toString('utf-8')).toContain('<svg');
            expect(results[2].toString('utf-8', 0, 5)).toBe('%PDF-');
        });

        it('should benefit from cache in batch', async () => {
            const renderer = new Typst();

            // Render once to cache
            await renderer.render({ code: '$ x $', snippet: true });

            // Batch with same item should be fast
            const start = Date.now();
            await renderer.renderBatch([
                { code: '$ x $', snippet: true },
                { code: '$ x $', snippet: true },
                { code: '$ x $', snippet: true }
            ]);
            const time = Date.now() - start;

            // Should be very fast due to caching
            expect(time).toBeLessThan(500);
        });

        it('should handle batch with duplicate items', async () => {
            const renderer = new Typst();
            const sameOptions = { code: '$ y $', snippet: true };

            const results = await renderer.renderBatch([
                sameOptions,
                sameOptions,
                sameOptions
            ]);

            expect(results).toHaveLength(3);
            // All should be identical
            expect(results[0].equals(results[1])).toBe(true);
            expect(results[1].equals(results[2])).toBe(true);
        });

        it('should handle very large batch efficiently', async () => {
            const renderer = new Typst();
            const batch = Array.from({ length: 100 }, (_, i) => ({
                code: `$ x_{${i % 10}} $`, // Repeat patterns to test cache
                snippet: true
            }));

            const start = Date.now();
            const results = await renderer.renderBatch(batch);
            const time = Date.now() - start;

            expect(results).toHaveLength(100);
            // Should complete in reasonable time due to caching
            expect(time).toBeLessThan(10000);
        });
    });

    describe('Metadata Extraction Edge Cases', () => {
        it('should extract metadata from very small image', async () => {
            const renderer = new Typst();
            const buffer = await renderer.render({
                code: '.',
                snippet: true,
                ppi: 72
            });

            const metadata = await getMetadata(buffer);
            expect(metadata.width).toBeGreaterThan(0);
            expect(metadata.height).toBeGreaterThan(0);
        });

        it('should extract metadata from high DPI image', async () => {
            const renderer = new Typst();
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                ppi: 600
            });

            const metadata = await getMetadata(buffer);
            expect(metadata.density).toBeGreaterThan(500);
        });

        it('should handle metadata with background color', async () => {
            const renderer = new Typst();
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                backgroundColor: '#ff0000'
            });

            const metadata = await getMetadata(buffer);
            expect(metadata.hasAlpha).toBe(false);
        });

        it('should extract metadata from scaled image', async () => {
            const renderer = new Typst();
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                scale: 5
            });

            const metadata = await getMetadata(buffer);
            expect(metadata.width).toBeGreaterThan(50);
        });

        it('should fail gracefully on invalid buffer', async () => {
            const invalidBuffer = Buffer.from('not an image');
            await expect(getMetadata(invalidBuffer)).rejects.toThrow();
        });
    });

    describe('Stream Output Edge Cases', () => {
        it('should handle stream with very small output', async () => {
            const renderer = new Typst();
            const stream = await renderer.renderStream({
                code: '.',
                format: 'png',
                snippet: true
            });

            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            expect(Buffer.concat(chunks).length).toBeGreaterThan(0);
        });

        it('should handle stream with high quality', async () => {
            const renderer = new Typst();
            const stream = await renderer.renderStream({
                code: '$ x $',
                format: 'jpeg',
                quality: 100,
                snippet: true
            });

            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            expect(Buffer.concat(chunks).length).toBeGreaterThan(0);
        });

        it('should handle stream with background color', async () => {
            const renderer = new Typst();
            const stream = await renderer.renderStream({
                code: '$ x $',
                format: 'png',
                backgroundColor: 'white',
                snippet: true
            });

            expect(stream).toBeInstanceOf(Readable);

            // Consume stream
            for await (const _ of stream) {
                // Just consume
            }
        });

        it('should handle stream with preamble', async () => {
            const renderer = new Typst();
            const stream = await renderer.renderStream({
                code: 'Test',
                preamble: '#set text(fill: red)',
                format: 'png',
                snippet: true
            });

            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            expect(Buffer.concat(chunks).length).toBeGreaterThan(0);
        });

        it('should validate stream format restrictions', async () => {
            const renderer = new Typst();

            await expect(renderer.renderStream({
                code: 'test',
                format: 'pdf'
            })).rejects.toThrow('Stream output only supports raster formats');
        });
    });

    describe('Feature Interaction Edge Cases', () => {
        it('should handle batch with caching disabled', async () => {
            const renderer = new Typst({ cache: false });

            const results = await renderer.renderBatch([
                { code: '$ a $', snippet: true },
                { code: '$ a $', snippet: true } // Same code
            ]);

            expect(results).toHaveLength(2);
            expect(results[0].equals(results[1])).toBe(true);
        });

        it('should extract metadata from SVG buffer', async () => {
            const renderer = new Typst();
            const svgBuffer = await renderer.render({
                code: '$ x $',
                format: 'svg',
                snippet: true
            });

            // Sharp can actually process SVG and extract metadata
            const metadata = await getMetadata(svgBuffer);
            expect(metadata.format).toBe('svg');
            expect(metadata.width).toBeGreaterThan(0);
        });

        it('should handle stream with variables', async () => {
            const renderer = new Typst();
            const stream = await renderer.renderStream({
                code: '#sys.inputs.value',
                variables: { value: '123' },
                format: 'png',
                snippet: true
            });

            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            expect(Buffer.concat(chunks).length).toBeGreaterThan(0);
        });
    });
});
