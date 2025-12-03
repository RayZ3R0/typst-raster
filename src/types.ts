export interface RenderOptions {
    /**
     * The Typst code to render.
     */
    code: string;

    /**
     * Output format.
     * @default 'png'
     */
    format?: 'png' | 'jpeg' | 'webp' | 'pdf';

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

    /**
     * Background color to flatten transparent areas onto.
     * Useful when image viewers don't handle transparency well.
     * @example 'white', '#2b2d31', 'rgb(43, 45, 49)'
     */
    backgroundColor?: string;

    /**
     * Typst code to prepend to every render.
     * Useful for setting up themes, page defaults, or text styling.
     * @example '#set page(fill: rgb("#2b2d31"))\n#set text(fill: white)'
     */
    preamble?: string;
}

export interface TypstOptions {
    /**
     * Path to a directory containing fonts.
     * If not provided, the library will use its bundled font.
     */
    fontPath?: string;
}
