import { describe, it, expect } from 'vitest';
import { Typst, TypstRenderError } from '../src';

describe('Edge Cases & Security', () => {
    const renderer = new Typst();

    describe('Input Validation Bypass Attempts', () => {
        it('should reject negative scale', async () => {
            await expect(renderer.render({
                code: 'test',
                scale: -1
            })).rejects.toThrow('Scale must be a positive finite number');
        });

        it('should reject NaN scale', async () => {
            await expect(renderer.render({
                code: 'test',
                scale: NaN
            })).rejects.toThrow('Scale must be a positive finite number');
        });

        it('should handle Infinity scale gracefully', async () => {
            await expect(renderer.render({
                code: 'test',
                scale: Infinity
            })).rejects.toThrow('Scale must be a positive finite number');
        });

        it('should clamp quality above 100', async () => {
            // Should not throw, quality clamped to 100
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                quality: 500,
                format: 'jpeg'
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should clamp quality below 1', async () => {
            // Should not throw, quality clamped to 1
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                quality: -50,
                format: 'jpeg'
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle NaN quality gracefully', async () => {
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                quality: NaN,
                format: 'jpeg'
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });
    });

    describe('Empty and Null Inputs', () => {
        it('should handle empty code by rendering blank page', async () => {
            // Typst accepts empty code and renders a blank page
            const buffer = await renderer.render({
                code: ''
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle whitespace-only code by rendering blank page', async () => {
            // Typst accepts whitespace and renders a blank page
            const buffer = await renderer.render({
                code: '   \n\t  '
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle empty variables object', async () => {
            const buffer = await renderer.render({
                code: 'test',
                variables: {},
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle null/undefined in variables', async () => {
            const buffer = await renderer.render({
                code: '#sys.inputs.val',
                variables: { val: null as any },
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });
    });

    describe('Type Confusion Attack', () => {
        it('should safely handle objects in variables', async () => {
            const buffer = await renderer.render({
                code: '#sys.inputs.obj',
                variables: { obj: { toString: () => 'hacked' } as any },
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should safely handle arrays in variables', async () => {
            const buffer = await renderer.render({
                code: '#sys.inputs.arr',
                variables: { arr: [1, 2, 3] as any },
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should safely handle boolean variables', async () => {
            const buffer = await renderer.render({
                code: '#sys.inputs.flag',
                variables: { flag: true as any },
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });
    });

    describe('Special Characters & Encoding', () => {
        it('should handle Unicode characters', async () => {
            const buffer = await renderer.render({
                code: '你好世界 🌍 مرحبا',
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle emoji in code', async () => {
            const buffer = await renderer.render({
                code: '😀 😃 😄',
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle special Typst characters', async () => {
            const buffer = await renderer.render({
                code: '#text[\\# \\$ \\@ \\\\]',
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle newlines and tabs', async () => {
            const buffer = await renderer.render({
                code: 'Line 1\nLine 2\n\tIndented',
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });
    });

    describe('Concurrent Rendering', () => {
        it('should handle multiple concurrent renders', async () => {
            const promises = Array.from({ length: 5 }, (_, i) =>
                renderer.render({
                    code: `$ x_{${i}} $`,
                    snippet: true
                })
            );

            const results = await Promise.all(promises);
            expect(results).toHaveLength(5);
            results.forEach(buffer => {
                expect(buffer).toBeInstanceOf(Buffer);
                expect(buffer.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Large Inputs', () => {
        it('should handle reasonably large code', async () => {
            const largeCode = Array.from({ length: 100 }, (_, i) => `$ x_{${i}} $`).join('\n');
            const buffer = await renderer.render({
                code: largeCode,
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle large variable values', async () => {
            const largeValue = 'A'.repeat(1000);
            const buffer = await renderer.render({
                code: '#sys.inputs.large',
                variables: { large: largeValue },
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle many variables', async () => {
            const manyVars: Record<string, string> = {};
            for (let i = 0; i < 50; i++) {
                manyVars[`var${i}`] = `value${i}`;
            }
            const buffer = await renderer.render({
                code: '#sys.inputs.var0',
                variables: manyVars,
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });
    });

    describe('Format Edge Cases', () => {
        it('should handle pdf format with snippet mode', async () => {
            const buffer = await renderer.render({
                code: '$ x^2 $',
                format: 'pdf',
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
            // PDF magic number
            expect(buffer.toString('utf8', 0, 5)).toBe('%PDF-');
        });

        it('should handle all raster formats', async () => {
            const formats: ('png' | 'jpeg' | 'webp')[] = ['png', 'jpeg', 'webp'];
            for (const format of formats) {
                const buffer = await renderer.render({
                    code: '$ x $',
                    snippet: true,
                    format
                });
                expect(buffer).toBeInstanceOf(Buffer);
                expect(buffer.length).toBeGreaterThan(0);
            }
        });
    });

    describe('Error Recovery & State', () => {
        it('should maintain state after multiple errors', async () => {
            // Fail multiple times
            await expect(renderer.render({ code: '#bad1()' })).rejects.toThrow();
            await expect(renderer.render({ code: '#bad2()' })).rejects.toThrow();
            await expect(renderer.render({ code: '#bad3()' })).rejects.toThrow();

            // Should still work
            const buffer = await renderer.render({
                code: '$ 1+1 $',
                snippet: true
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle alternating success and failure', async () => {
            for (let i = 0; i < 3; i++) {
                const buffer = await renderer.render({
                    code: '$ x $',
                    snippet: true
                });
                expect(buffer).toBeInstanceOf(Buffer);

                await expect(renderer.render({
                    code: '#invalid()'
                })).rejects.toThrow();
            }
        });
    });

    describe('PPI and Scale Combinations', () => {
        it('should handle very high PPI', async () => {
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                ppi: 600
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle very high scale', async () => {
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                scale: 10
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle high PPI + high scale', async () => {
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                ppi: 300,
                scale: 3
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });

        it('should handle fractional scale', async () => {
            const buffer = await renderer.render({
                code: '$ x $',
                snippet: true,
                scale: 0.5
            });
            expect(buffer).toBeInstanceOf(Buffer);
        });
    });

    describe('Background Color Edge Cases', () => {
        it('should handle various color formats', async () => {
            const colors = ['white', '#000000', '#fff', 'rgb(255,0,0)', 'rgba(0,255,0,0.5)'];
            for (const color of colors) {
                const buffer = await renderer.render({
                    code: '$ x $',
                    snippet: true,
                    backgroundColor: color
                });
                expect(buffer).toBeInstanceOf(Buffer);
            }
        });

        it('should handle invalid color format gracefully', async () => {
            // Sharp might throw or ignore invalid colors
            await expect(async () => {
                await renderer.render({
                    code: '$ x $',
                    snippet: true,
                    backgroundColor: 'not-a-color'
                });
            }).rejects.toThrow();
        });
    });
});
