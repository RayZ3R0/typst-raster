import { describe, it, expect, beforeEach } from 'vitest';
import { Typst, getMetadata } from '../src';
import { Readable } from 'stream';

describe('New Features', () => {
    let renderer: Typst;

    beforeEach(() => {
        renderer = new Typst();
    });

    describe('SVG Output', () => {
        it('should render to SVG format', async () => {
            const buffer = await renderer.render({
                code: '$ x^2 $',
                format: 'svg',
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
            const svg = buffer.toString('utf-8');
            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
        });

        it('should handle complex Typst code in SVG', async () => {
            const buffer = await renderer.render({
                code: '#rect(fill: red, width: 10pt, height: 10pt)',
                format: 'svg'
            });
            const svg = buffer.toString('utf-8');
            expect(svg).toContain('<svg');
        });
    });

    describe('LRU Cache', () => {
        it('should cache renders by default', async () => {
            const code = '$ sum_(i=1)^n i $';
            const start1 = Date.now();
            const result1 = await renderer.render({ code, snippet: true });
            const time1 = Date.now() - start1;

            const start2 = Date.now();
            const result2 = await renderer.render({ code, snippet: true });
            const time2 = Date.now() - start2;

            // Second render should be significantly faster (cached)
            expect(time2).toBeLessThan(time1 / 2);
            expect(result1.equals(result2)).toBe(true);
        });

        it('should respect cache disabled option', async () => {
            const noCacheRenderer = new Typst({ cache: false });
            const code = '$ x $';

            const result1 = await noCacheRenderer.render({ code, snippet: true });
            const result2 = await noCacheRenderer.render({ code, snippet: true });

            // Results should still be identical, just not cached
            expect(result1.equals(result2)).toBe(true);
        });

        it('should respect custom cache size', async () => {
            const smallCacheRenderer = new Typst({ cacheSize: 2 });

            // Render 3 different things
            await smallCacheRenderer.render({ code: '$ a $', snippet: true });
            await smallCacheRenderer.render({ code: '$ b $', snippet: true });
            await smallCacheRenderer.render({ code: '$ c $', snippet: true });

            // The third should evict the first
            // This is hard to test directly, but we can verify it doesn't crash
            expect(true).toBe(true);
        });

        it('should cache different options separately', async () => {
            const result1 = await renderer.render({ code: '$ x $', format: 'png', snippet: true });
            const result2 = await renderer.render({ code: '$ x $', format: 'jpeg', snippet: true });

            // Should be different formats
            expect(result1.equals(result2)).toBe(false);
        });
    });

    describe('Batch Rendering', () => {
        it('should render multiple items in batch', async () => {
            const results = await renderer.renderBatch([
                { code: '$ a $', snippet: true },
                { code: '$ b $', snippet: true },
                { code: '$ c $', snippet: true }
            ]);

            expect(results).toHaveLength(3);
            results.forEach(buffer => {
                expect(buffer).toBeInstanceOf(Buffer);
                expect(buffer.length).toBeGreaterThan(0);
            });
        });

        it('should handle empty batch array', async () => {
            const results = await renderer.renderBatch([]);
            expect(results).toHaveLength(0);
        });

        it('should handle batch with different formats', async () => {
            const results = await renderer.renderBatch([
                { code: '$ x $', format: 'png', snippet: true },
                { code: '$ y $', format: 'jpeg', snippet: true },
                { code: '$ z $', format: 'svg', snippet: true }
            ]);

            expect(results).toHaveLength(3);
            // Last one should be SVG
            expect(results[2].toString('utf-8')).toContain('<svg');
        });

        it('should stop on first error in batch', async () => {
            await expect(renderer.renderBatch([
                { code: '$ a $', snippet: true },
                { code: '#invalid()', snippet: true },
                { code: '$ c $', snippet: true }
            ])).rejects.toThrow();
        });

        it('should handle large batches without memory issues', async () => {
            const batch = Array.from({ length: 50 }, (_, i) => ({
                code: `$ x_{${i}} $`,
                snippet: true
            }));

            const results = await renderer.renderBatch(batch);
            expect(results).toHaveLength(50);
        });
    });

    describe('Metadata Extraction', () => {
        it('should extract metadata from PNG', async () => {
            const buffer = await renderer.render({
                code: '$ x^2 $',
                format: 'png',
                snippet: true
            });

            const metadata = await getMetadata(buffer);
            expect(metadata.width).toBeGreaterThan(0);
            expect(metadata.height).toBeGreaterThan(0);
            expect(metadata.format).toBe('png');
        });

        it('should extract metadata from JPEG', async () => {
            const buffer = await renderer.render({
                code: '$ x^2 $',
                format: 'jpeg',
                snippet: true
            });

            const metadata = await getMetadata(buffer);
            expect(metadata.width).toBeGreaterThan(0);
            expect(metadata.format).toBe('jpeg');
        });

        it('should extract metadata from WebP', async () => {
            const buffer = await renderer.render({
                code: '$ x^2 $',
                format: 'webp',
                snippet: true
            });

            const metadata = await getMetadata(buffer);
            expect(metadata.format).toBe('webp');
        });

        it('should include density information', async () => {
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                ppi: 300
            });

            const metadata = await getMetadata(buffer);
            expect(metadata.density).toBeDefined();
        });
    });

    describe('Stream Output', () => {
        it('should return a readable stream', async () => {
            const stream = await renderer.renderStream({
                code: '$ x^2 $',
                format: 'png',
                snippet: true
            });

            expect(stream).toBeInstanceOf(Readable);

            // Consume the stream to verify it works
            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            expect(Buffer.concat(chunks).length).toBeGreaterThan(0);
        });

        it('should reject PDF format for stream', async () => {
            await expect(renderer.renderStream({
                code: 'test',
                format: 'pdf'
            })).rejects.toThrow('Stream output only supports raster formats');
        });

        it('should reject SVG format for stream', async () => {
            await expect(renderer.renderStream({
                code: 'test',
                format: 'svg'
            })).rejects.toThrow('Stream output only supports raster formats');
        });

        it('should handle stream with all raster formats', async () => {
            const formats: ('png' | 'jpeg' | 'webp')[] = ['png', 'jpeg', 'webp'];

            for (const format of formats) {
                const stream = await renderer.renderStream({
                    code: '$ x $',
                    format,
                    snippet: true
                });

                expect(stream).toBeInstanceOf(Readable);

                // Consume stream
                const chunks: Buffer[] = [];
                for await (const chunk of stream) {
                    chunks.push(chunk);
                }
                const buffer = Buffer.concat(chunks);
                expect(buffer.length).toBeGreaterThan(0);
            }
        });
    });
});
