import { describe, it, expect } from 'vitest';
import { Typst } from '../src';

describe('Typst Renderer', () => {
    const renderer = new Typst();

    it('should render a simple equation to PNG', async () => {
        const buffer = await renderer.render({
            code: '$ 1 + 1 = 2 $',
            format: 'png',
            snippet: true
        });
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
    });

    it('should handle variables', async () => {
        const code = '#sys.inputs.name';
        const buffer = await renderer.render({
            code,
            variables: { name: 'World' },
            snippet: true
        });
        expect(buffer).toBeInstanceOf(Buffer);
    });

    it('should handle non-string variables safely', async () => {
        const code = '#sys.inputs.count';
        const buffer = await renderer.render({
            code,
            variables: { count: 123 as any }, // Force non-string
            snippet: true
        });
        expect(buffer).toBeInstanceOf(Buffer);
    });

    it('should respect scale option', async () => {
        const code = '#circle(radius: 10pt)';
        const buf1 = await renderer.render({ code, scale: 1, snippet: true });
        const buf2 = await renderer.render({ code, scale: 2, snippet: true });

        // Higher scale should result in larger file size (roughly)
        expect(buf2.length).toBeGreaterThan(buf1.length);
    });

    it('should respect quality option', async () => {
        const code = '#circle(radius: 10pt, fill: red)';
        const bufLow = await renderer.render({ code, quality: 10, format: 'jpeg', snippet: true });
        const bufHigh = await renderer.render({ code, quality: 100, format: 'jpeg', snippet: true });

        expect(bufHigh.length).toBeGreaterThan(bufLow.length);
    });

    it('should throw error on invalid code', async () => {
        await expect(renderer.render({
            code: '#invalid-function()',
            snippet: true
        })).rejects.toThrow('Failed to render Typst code');
    });

    it('should recover from errors', async () => {
        // First fail
        await expect(renderer.render({
            code: '#invalid()',
            snippet: true
        })).rejects.toThrow();

        // Then succeed
        const buffer = await renderer.render({
            code: '$ 1 + 1 = 2 $',
            snippet: true
        });
        expect(buffer).toBeInstanceOf(Buffer);
    });
});
