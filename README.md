# typst-raster

[![npm](https://img.shields.io/npm/v/typst-raster.svg)](https://www.npmjs.com/package/typst-raster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/RayZ3R0/typst-raster/actions/workflows/release.yml/badge.svg)](https://github.com/RayZ3R0/typst-raster/actions/workflows/release.yml)

A fast, no-nonsense Node.js library for rendering Typst to PNG, JPEG, WebP, or PDF.

It uses the official Typst compiler through native Rust bindings (`@myriaddreamin/typst-ts-node-compiler`) and Sharp for rasterization, so you get near-native performance with pixel-perfect results. I built it because I needed a reliable way to generate crisp math equations and document snippets in backend services and bots, and nothing else quite cut it.

Comes with New Computer Modern fonts bundled, works out of the box on Lambda, Vercel, Docker, or anywhere else, no system font dependencies required.

## Features

- Native-speed compilation via direct Rust bindings  
- SVG → raster pipeline with Sharp (sub-pixel accurate, any DPI)  
- Zero-config font setup (New Computer Modern Book included)  
- Automatic tight cropping in snippet mode (perfect for equations)  
- Full TypeScript support with proper types  
- Variable injection, custom font paths, quality/scale control  
- Tiny bundle size, no heavyweight dependencies  

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

## API

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

## Credits

Huge thanks to the projects this wouldn't exist without:

- [Typst](https://typst.app/) – the reason we're all here  
- [@myriaddreamin/typst.ts](https://github.com/Myriad-Dreamin/typst.ts) – incredible compiler and Node.js bindings  
- [Sharp](https://sharp.pixelplumbing.com/) – the fastest image library there is  
- [New Computer Modern](https://ctan.org/pkg/newcomputermodern) – beautiful default fonts  

## License

MIT © 2025 RayZ3R0