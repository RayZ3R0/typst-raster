import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import { RenderOptions, TypstOptions } from './types';
import { svgToBuffer } from './converter';
import { getFontPath } from './fonts';
import { TypstRenderError } from './errors';
import { LRUCache, hashRenderOptions } from './cache';
import { Readable } from 'stream';

export class Typst {
    private compiler: NodeCompiler | null = null;
    private fontPath: string | undefined;
    private renderQueue: Promise<any> = Promise.resolve();
    private cache: LRUCache<string, Buffer> | null;

    constructor(options: TypstOptions = {}) {
        this.fontPath = options.fontPath;
        const cacheEnabled = options.cache !== false; // default true
        const cacheSize = options.cacheSize || 100;
        this.cache = cacheEnabled ? new LRUCache<string, Buffer>(cacheSize) : null;
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
        // Queue renders to prevent concurrent access to the compiler
        return this.renderQueue = this.renderQueue.then(() => this.executeRender(options), () => this.executeRender(options));
    }

    private async executeRender(options: RenderOptions): Promise<Buffer> {
        // Check cache first
        if (this.cache) {
            const cacheKey = hashRenderOptions(options);
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
        }

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
        const scale = options.scale ?? 1;
        const qualityRaw = options.quality ?? 100;
        const quality = Math.min(Math.max(isNaN(qualityRaw) ? 100 : qualityRaw, 1), 100);

        if (scale <= 0 || isNaN(scale) || !isFinite(scale)) {
            throw new TypstRenderError('Scale must be a positive finite number');
        }

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

            // Return SVG directly if requested
            if (format === 'svg') {
                return Buffer.from(svg, 'utf-8');
            }

            const result = await svgToBuffer(
                svg,
                format,
                options.ppi || 192,
                scale,
                quality,
                options.backgroundColor
            );

            // Cache the result if enabled
            if (this.cache) {
                const cacheKey = hashRenderOptions(options);
                this.cache.set(cacheKey, result);
            }

            return result;
        } catch (error: any) {
            this.compiler = null; // Reset compiler on error to recover from potential state corruption
            const message = error.message || 'Unknown Typst error';
            throw new TypstRenderError(`Failed to render Typst code: ${message}`, error);
        }
    }

    async renderBatch(optionsArray: RenderOptions[]): Promise<Buffer[]> {
        const results: Buffer[] = [];
        for (const options of optionsArray) {
            results.push(await this.render(options));
        }
        return results;
    }

    async renderStream(options: RenderOptions): Promise<Readable> {
        // Queue to prevent concurrent access
        return this.renderQueue = this.renderQueue.then(
            async () => {
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
                if (format === 'pdf' || format === 'svg') {
                    throw new TypstRenderError('Stream output only supports raster formats (png, jpeg, webp)');
                }

                const scale = options.scale ?? 1;
                const qualityRaw = options.quality ?? 100;
                const quality = Math.min(Math.max(isNaN(qualityRaw) ? 100 : qualityRaw, 1), 100);

                if (scale <= 0 || isNaN(scale) || !isFinite(scale)) {
                    throw new TypstRenderError('Scale must be a positive finite number');
                }

                try {
                    const svg = compiler.svg({
                        mainFileContent: code,
                        inputs: inputs,
                    });

                    const { svgToStream } = await import('./stream');
                    return svgToStream(
                        svg,
                        format,
                        options.ppi || 192,
                        scale,
                        quality,
                        options.backgroundColor
                    );
                } catch (error: any) {
                    this.compiler = null;
                    const message = error.message || 'Unknown Typst error';
                    throw new TypstRenderError(`Failed to render Typst code: ${message}`, error);
                }
            },
            async () => {
                throw new TypstRenderError('Previous render failed');
            }
        );
    }
}
