# typst-raster

[![npm](https://img.shields.io/npm/v/typst-raster.svg)](https://www.npmjs.com/package/typst-raster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/RayZ3R0/typst-raster/actions/workflows/release.yml/badge.svg)](https://github.com/RayZ3R0/typst-raster/actions/workflows/release.yml)
[![Documentation](https://img.shields.io/badge/docs-typst--raster-blue)](https://typst-raster.vercel.app/)

<div align="center">
  <img src="https://i.imgur.com/oHWvW1f.png" alt="typst-raster showcase" width="100%">
  <p><i>This entire showcase image was generated with Typst – <a href="https://github.com/RayZ3R0/typst-raster/blob/main/examples/side-by-side.ts">view the code</a></i></p>
</div>

---

A fast, no-nonsense Node.js library for rendering Typst to PNG, JPEG, WebP, or PDF.

It uses the official Typst compiler through native Rust bindings (`@myriaddreamin/typst-ts-node-compiler`) and Sharp for rasterization, so you get near-native performance with pixel-perfect results. I built it because I needed a reliable way to generate crisp math equations and document snippets in backend services and bots, and nothing else quite cut it.

Comes with New Computer Modern fonts bundled, works out of the box on Lambda, Vercel, Docker, or anywhere else, no system font dependencies required.

## Features

- Native-speed compilation via direct Rust bindings  
- SVG → raster pipeline with Sharp (sub-pixel accurate, any DPI)  
- **SVG output** support for vector graphics
- **Built-in caching** (LRU, enabled by default)
- **Batch rendering** API for multiple renders
- Zero-config font setup (New Computer Modern Book included)  
- Automatic tight cropping in snippet mode (perfect for equations)  
- Full TypeScript support with proper types  
- Variable injection, custom font paths, quality/scale control
- **Metadata extraction** from rendered images
- **Stream output** for efficient HTTP responses  
- Tiny bundle size, no heavyweight dependencies  

## Comparison with Alternatives

`typst-raster` offers a lightweight, all-in-one solution for rendering documents and equations, avoiding the complexity of installing system-level dependencies.

| Feature | **typst-raster** | **System LaTeX** (node-latex) | **MathJax** (mathjax-node) | **Puppeteer** (Headless Chrome) |
| :--- | :--- | :--- | :--- | :--- |
| **Engine** | Native Rust (Node Bindings) | System Binary (pdflatex) | JavaScript | Chromium Browser |
| **Prerequisites** | **None** (npm install only) | **Heavy** (Requires TeXLive) | None | Chromium Binary |
| **Install Size** | **~8.9 MB** | **2GB - 4GB** | ~50 MB | ~280 MB+ |
| **Speed** | Fast (Native compilation) | Slow (Spawns process) | Medium | Very Slow (Browser startup) |
| **Output** | PDF, PNG, JPEG, SVG, WEBP | PDF only | SVG/HTML only | PDF, PNG |
| **Serverless**| ✅ Ready (Fonts included) | ❌ Difficult (Too large) | ✅ Ready | ⚠️ Hard (High RAM usage) |
| **Scope** | Full Documents + Math | Full Documents + Math | Math Equations Only | Webpages |

### Why choose typst-raster?

**1. No external dependencies required**
Running standard LaTeX wrappers in Node.js usually requires installing a full TeX distribution (like TeXLive) on the host machine. This is often impossible on managed hosting platforms like Vercel or standard shared hosting. This package runs entirely within Node.js with no external requirements.

**2. Solves the missing font issue**
Generating PDFs or images on cloud functions (AWS Lambda, Google Cloud) often results in broken text because the environments lack standard fonts. This package bundles high-quality fonts internally, ensuring documents render correctly on any server without manual configuration.

**3. Direct conversion to multiple formats**
Most alternatives specialize in one output format. LaTeX tools output PDF; MathJax outputs SVG. `typst-raster` handles the full pipeline internally, allowing you to generate PDFs for reports or PNGs for web previews using a single library. This removes the need for additional conversion tools like ImageMagick.


## Installation

```bash
npm install typst-raster
```

## Usage

### Simple render

```typescript
import { Typst } from 'typst-raster';
import { writeFile } from 'fs/promises';

const renderer = new Typst();

const buffer = await renderer.render({
  code: '= Hello from Typst!\nThis is a quick test of the renderer.',
});

await writeFile('hello.png', buffer);
```

### Math equations / snippet mode (recommended for formulas)

```typescript
const buffer = await renderer.render({
  code: '$ sum_(k=1)^n k = (n(n+1))/2 $',
  snippet: true,     // auto-crop to content
  scale: 3,          // 3× resolution for retina displays
  format: 'png',
});
```

### Passing variables

```typescript
const buffer = await renderer.render({
  code: 'Hello #sys.inputs.name, welcome to #sys.inputs.project!',
  variables: {
    name: 'Alice',
    project: 'typst-raster',
  },
});
```

### Flatten transparent backgrounds

```typescript
const buffer = await renderer.render({
  code: '$ E = m c^2 $',
  snippet: true,
  backgroundColor: 'white',
});
```

### Use preamble for theming

```typescript
const myTheme = `
#set page(fill: rgb("#2b2d31"), margin: 1cm)
#set text(fill: white, font: "Roboto")
`;

const buffer = await renderer.render({
  preamble: myTheme,
  code: '$ sum_(k=1)^n k = (n(n+1))/2 $',
  snippet: true,
});
```

### Render to PDF

```typescript
const buffer = await renderer.render({
  code: '= Document Title\n\nThis is a *PDF* document.',
  format: 'pdf',
});

await writeFile('document.pdf', buffer);
```

### Render to SVG

```typescript
const buffer = await renderer.render({
  code: '$ E = mc^2 $',
  format: 'svg',
  snippet: true
});

await writeFile('equation.svg', buffer);
```

### Batch rendering

```typescript
const results = await renderer.renderBatch([
  { code: '$ a^2 + b^2 = c^2 $', snippet: true },
  { code: '$ \\int_0^\\infty e^{-x} dx = 1 $', snippet: true },
  { code: '$ \\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6} $', snippet: true }
]);

// Save all results
for (let i = 0; i < results.length; i++) {
  await writeFile(`equation-${i}.png`, results[i]);
}
```

### Extract metadata

```typescript
import { getMetadata } from 'typst-raster';

const buffer = await renderer.render({
  code: '$ x^2 $',
  snippet: true,
  ppi: 300
});

const metadata = await getMetadata(buffer);
console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
console.log(`Format: ${metadata.format}`);
console.log(`DPI: ${metadata.density}`);
```

### Stream output (for HTTP responses)

```typescript
import { createWriteStream } from 'fs';

const stream = await renderer.renderStream({
  code: '$ \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $',
  format: 'png',
  snippet: true
});

stream.pipe(createWriteStream('equation.png'));

// Or in Express/Fastify:
// stream.pipe(res);
```

### Disable caching

```typescript
// Disable cache entirely
const renderer = new Typst({ cache: false });

// Or customize cache size
const renderer = new Typst({ cacheSize: 500 }); // default: 100
```

## API

For more details, visit the [Documentation Site](https://typst-raster.vercel.app/).

```ts
new Typst(options?: {
  fontPath?: string;  // folder with additional .ttf/.otf files
})
```

```ts
renderer.render(options): Promise<Buffer>
```

| Option      | Type                            | Default | Description                                      |
|-------------|---------------------------------|---------|--------------------------------------------------|
| `code`      | `string`                        | —       | Required Typst source                            |
| `format`    | `'png' \| 'jpeg' \| 'webp' \| 'pdf'` | `'png'` | Output format                                    |
| `quality`   | `number` (1–100)                | `100`   | JPEG/WebP quality (ignored for PDF)              |
| `ppi`       | `number`                        | `192`   | Raster resolution (ignored for PDF)              |
| `scale`     | `number`                        | `1`     | Additional multiplier (ignored for PDF)          |
| `snippet`   | `boolean`                       | `false` | Crop tightly to content (great for equations)    |
| `variables` | `Record<string, string \| number \| boolean>` | `{}` | Injected as `#sys.inputs.key`                     |
| `backgroundColor` | `string`                  | —       | Flatten transparency (raster only)               |
| `preamble`  | `string`                        | —       | Typst code prepended to every render             |

## Error Handling

The library exports a `TypstRenderError` class that you can catch to handle rendering failures specifically.

```typescript
import { Typst, TypstRenderError } from 'typst-raster';

try {
  await renderer.render({ code: '#invalid()' });
} catch (error) {
  if (error instanceof TypstRenderError) {
    console.error('Typst compilation failed:', error.message);
  }
}
```

## Credits

Huge thanks to the projects this wouldn't exist without:

- [Typst](https://typst.app/) – the reason we're all here  
- [@myriaddreamin/typst.ts](https://github.com/Myriad-Dreamin/typst.ts) – incredible compiler and Node.js bindings  
- [Sharp](https://sharp.pixelplumbing.com/) – the fastest image library there is  
- [New Computer Modern](https://ctan.org/pkg/newcomputermodern) – beautiful default fonts  

## License

MIT © 2025 RayZ3R0
