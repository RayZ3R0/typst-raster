export class TypstRenderError extends Error {
    constructor(message: string, public originalError?: unknown) {
        super(message);
        this.name = 'TypstRenderError';
    }
}
