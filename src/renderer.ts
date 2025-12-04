import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import { RenderOptions, TypstOptions } from './types';
import { svgToBuffer } from './converter';
import { getFontPath } from './fonts';
import { TypstRenderError } from './errors';

export class Typst {
    private compiler: NodeCompiler | null = null;
    private fontPath: string | undefined;

    constructor(options: TypstOptions = {}) {
        this.fontPath = options.fontPath;
    }

    private async getCompiler(): Promise<NodeCompiler> {
        if (this.compiler) return this.compiler;

        const fontArgs = await getFontPath(this.fontPath);
        this.compiler = NodeCompiler.create({
            ...fontArgs,
        });
        return this.compiler;
    }

    async render(options: RenderOptions): Promise<Buffer> {
        const compiler = await this.getCompiler();

        let code = options.code;

        if (options.preamble) {
            code = options.preamble + '\n' + code;
        }

        if (options.snippet) {
            code = `#set page(width: auto, height: auto, margin: 1cm)\n${code}`;
        }

        const inputs: Record<string, string> = {};
        if (options.variables) {
            for (const [key, value] of Object.entries(options.variables)) {
                inputs[key] = String(value);
            }
        }

        const format = options.format || 'png';

        try {
            if (format === 'pdf') {
                const pdf = compiler.pdf({
                    mainFileContent: code,
                    inputs: inputs,
                });
                return Buffer.from(pdf);
            }

            const svg = compiler.svg({
                mainFileContent: code,
                inputs: inputs,
            });

            return await svgToBuffer(
                svg,
                format,
                options.ppi || 192,
                options.scale,
                options.quality,
                options.backgroundColor
            );
        } catch (error: any) {
            this.compiler = null; // Reset compiler on error to recover from potential state corruption
            const message = error.message || 'Unknown Typst error';
            throw new TypstRenderError(`Failed to render Typst code: ${message}`, error);
        }
    }
}
