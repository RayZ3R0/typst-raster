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

    it('should throw error on invalid code', async () => {
        await expect(renderer.render({
            code: '#invalid-function()',
            snippet: true
        })).rejects.toThrow('Failed to render Typst code');
    });
});
