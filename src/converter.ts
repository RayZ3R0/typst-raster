import sharp from 'sharp';

export async function svgToBuffer(
    svg: string,
    format: 'png' | 'jpeg' | 'webp',
    ppi: number,
    scale: number = 1,
    quality: number = 100,
    backgroundColor?: string
): Promise<Buffer> {
    const density = ppi * scale;

    let pipeline = sharp(Buffer.from(svg), { density });

    if (backgroundColor) {
        pipeline = pipeline.flatten({ background: backgroundColor });
    }

    if (format === 'png') {
        pipeline = pipeline.png({
            quality: quality < 100 ? quality : undefined,
            compressionLevel: 9
        });
    } else if (format === 'jpeg') {
        pipeline = pipeline.jpeg({ quality });
    } else if (format === 'webp') {
        pipeline = pipeline.webp({ quality });
    }

    return pipeline.toBuffer();
}
