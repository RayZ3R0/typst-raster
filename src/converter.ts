import sharp from 'sharp';

export async function svgToBuffer(
    svg: string,
    format: 'png' | 'jpeg' | 'webp',
    ppi: number
): Promise<Buffer> {
    const density = ppi;

    let pipeline = sharp(Buffer.from(svg), { density });

    if (format === 'png') {
        pipeline = pipeline.png();
    } else if (format === 'jpeg') {
        pipeline = pipeline.jpeg();
    } else if (format === 'webp') {
        pipeline = pipeline.webp();
    }

    return pipeline.toBuffer();
}
