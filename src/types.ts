export interface RenderOptions {
    /**
     * The Typst code to render.
     */
    code: string;

    /**
     * Output format.
     * @default 'png'
     */
    format?: 'png' | 'jpeg' | 'webp';

    /**
     * Quality of the output image (1-100).
     * @default 100
     */
    quality?: number;

    /**
     * Pixel density (pixels per inch). Higher values mean higher resolution.
     * @default 72
     */
    ppi?: number;

    /**
     * Scale factor for the output image.
     * @default 1
     */
    scale?: number;

    /**
     * If true, wraps the code in a page setup that crops to the content.
     * @default false
     */
    snippet?: boolean;

    /**
     * Variables to pass to the Typst compiler.
     */
    variables?: Record<string, string>;
}

export interface TypstOptions {
    /**
     * Path to a directory containing fonts.
     * If not provided, the library will use its bundled font.
     */
    fontPath?: string;
}
