import path from 'path';
import fs from 'fs';

export async function getFontPath(userFontPath?: string): Promise<{ fontArgs: { fontPaths: string[] }[] }> {
    if (userFontPath) {
        return { fontArgs: [{ fontPaths: [userFontPath] }] };
    }

    // Bundled font path
    const bundledFontPath = path.join(__dirname, '../assets/fonts');

    // Check if bundled fonts exist
    if (fs.existsSync(bundledFontPath)) {
        return { fontArgs: [{ fontPaths: [bundledFontPath] }] };
    }

    // Fallback or warning? For now, return empty which might use system fonts if available, but the goal is to be self-contained.
    console.warn('No fonts found. Typst might fail to render text.');
    return { fontArgs: [] };
}
