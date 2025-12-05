import { CodeBlock } from '../components/CodeBlock';

export function Introduction() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Introduction</h1>
            <p className="text-xl text-text-muted mb-8 leading-relaxed">
                <strong className="text-text">typst-raster</strong> is a high-performance Node.js library for rendering Typst markup to images and documents.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">Native Speed</h3>
                    <p className="text-text-muted text-sm">Direct Rust bindings via typst-ts-node-compiler. ~30ms cold start, ~0.01ms cached.</p>
                </div>
                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">Zero Config</h3>
                    <p className="text-text-muted text-sm">Fonts included (New Computer Modern). Works on Lambda, Vercel, Docker out of the box.</p>
                </div>
                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">Multi-Format</h3>
                    <p className="text-text-muted text-sm">Output to PNG, JPEG, WebP, SVG, or PDF with quality and scale control.</p>
                </div>
                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">Snippet Mode</h3>
                    <p className="text-text-muted text-sm">Auto-crop to content bounding box. Perfect for equations and diagrams.</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-text mb-4 mt-10">Why typst-raster?</h2>
            <p className="text-text-muted mb-4">
                Most Typst wrappers require installing a system binary or rely on slow CLI calls. We use <strong>native Rust bindings</strong> to call the compiler directly from Node.js, making it incredibly fast and portable.
            </p>
            <p className="text-text-muted mb-4">
                Perfect for Discord bots, web apps needing dynamic document generation, or backend services generating reports.
            </p>

            <h2 className="text-2xl font-bold text-text mb-4 mt-10">Quick Example</h2>
            <CodeBlock language="typescript" code={`import { Typst } from 'typst-raster';
import { writeFile } from 'fs/promises';

const renderer = new Typst();

const buffer = await renderer.render({
  code: '$ E = mc^2 $',
  snippet: true,
  scale: 3
});

await writeFile('equation.png', buffer);`} />
        </article>
    );
}

export function Installation() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Installation</h1>
            <p className="text-text-muted mb-8">Install typst-raster using your preferred package manager.</p>

            <h2 className="text-2xl font-bold text-text mb-4">Prerequisites</h2>
            <ul className="list-disc list-inside text-text-muted mb-8 space-y-1">
                <li>Node.js v18 or higher</li>
                <li>Linux, macOS, or Windows (x64 or arm64)</li>
            </ul>

            <h2 className="text-2xl font-bold text-text mb-4">npm</h2>
            <CodeBlock language="bash" code="npm install typst-raster" />

            <h2 className="text-2xl font-bold text-text mb-4 mt-6">yarn</h2>
            <CodeBlock language="bash" code="yarn add typst-raster" />

            <h2 className="text-2xl font-bold text-text mb-4 mt-6">pnpm</h2>
            <CodeBlock language="bash" code="pnpm add typst-raster" />

            <div className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-primary-dark dark:text-primary-light text-sm">
                    <strong>Note:</strong> This package includes native binaries. If deploying to a different architecture (e.g., local Mac → Linux Lambda), ensure your build process handles native modules correctly.
                </p>
            </div>
        </article>
    );
}

export function QuickStart() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Quick Start</h1>
            <p className="text-text-muted mb-8">Get up and running in under a minute.</p>

            <h2 className="text-2xl font-bold text-text mb-4">1. Create a new project</h2>
            <CodeBlock language="bash" code={`mkdir my-typst-app && cd my-typst-app
npm init -y
npm install typst-raster tsx`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">2. Create your first render</h2>
            <p className="text-text-muted mb-4">Create a file named <code className="bg-surface px-2 py-0.5 rounded text-sm">index.ts</code>:</p>
            <CodeBlock language="typescript" code={`import { Typst } from 'typst-raster';
import { writeFile } from 'fs/promises';

async function main() {
  const renderer = new Typst();

  // Render a math equation
  const buffer = await renderer.render({
    code: '$ sum_(k=1)^n k = (n(n+1))/2 $',
    snippet: true,
    scale: 3
  });

  await writeFile('equation.png', buffer);
  console.log('✓ Rendered equation.png');
}

main();`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">3. Run it</h2>
            <CodeBlock language="bash" code="npx tsx index.ts" />

            <p className="text-text-muted mt-4">
                You should see an <code className="bg-surface px-2 py-0.5 rounded text-sm">equation.png</code> file generated in your project directory!
            </p>
        </article>
    );
}

export function Rendering() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Rendering Basics</h1>
            <p className="text-text-muted mb-8">Learn the core rendering options and how to use them.</p>

            <h2 className="text-2xl font-bold text-text mb-4">Basic Render</h2>
            <CodeBlock language="typescript" code={`const buffer = await renderer.render({
  code: '= Hello World\\nThis is Typst!',
  format: 'png'  // default
});`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">All Render Options</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                    <thead className="bg-surface">
                        <tr>
                            <th className="text-left px-4 py-2 font-semibold">Option</th>
                            <th className="text-left px-4 py-2 font-semibold">Type</th>
                            <th className="text-left px-4 py-2 font-semibold">Default</th>
                            <th className="text-left px-4 py-2 font-semibold">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr><td className="px-4 py-2 font-mono text-primary">code</td><td className="px-4 py-2">string</td><td className="px-4 py-2">required</td><td className="px-4 py-2 text-text-muted">Typst source code</td></tr>
                        <tr><td className="px-4 py-2 font-mono text-primary">format</td><td className="px-4 py-2">string</td><td className="px-4 py-2">'png'</td><td className="px-4 py-2 text-text-muted">png, jpeg, webp, svg, pdf</td></tr>
                        <tr><td className="px-4 py-2 font-mono text-primary">snippet</td><td className="px-4 py-2">boolean</td><td className="px-4 py-2">false</td><td className="px-4 py-2 text-text-muted">Auto-crop to content</td></tr>
                        <tr><td className="px-4 py-2 font-mono text-primary">scale</td><td className="px-4 py-2">number</td><td className="px-4 py-2">1</td><td className="px-4 py-2 text-text-muted">Scale multiplier</td></tr>
                        <tr><td className="px-4 py-2 font-mono text-primary">ppi</td><td className="px-4 py-2">number</td><td className="px-4 py-2">192</td><td className="px-4 py-2 text-text-muted">Pixels per inch</td></tr>
                        <tr><td className="px-4 py-2 font-mono text-primary">quality</td><td className="px-4 py-2">number</td><td className="px-4 py-2">80</td><td className="px-4 py-2 text-text-muted">JPEG/WebP quality (1-100)</td></tr>
                        <tr><td className="px-4 py-2 font-mono text-primary">variables</td><td className="px-4 py-2">object</td><td className="px-4 py-2">{'{}'}</td><td className="px-4 py-2 text-text-muted">Variables for sys.inputs</td></tr>
                        <tr><td className="px-4 py-2 font-mono text-primary">preamble</td><td className="px-4 py-2">string</td><td className="px-4 py-2">''</td><td className="px-4 py-2 text-text-muted">Code prepended before render</td></tr>
                        <tr><td className="px-4 py-2 font-mono text-primary">backgroundColor</td><td className="px-4 py-2">string</td><td className="px-4 py-2">transparent</td><td className="px-4 py-2 text-text-muted">Flatten transparency</td></tr>
                    </tbody>
                </table>
            </div>
        </article>
    );
}

export function SnippetMode() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Snippet Mode</h1>
            <p className="text-text-muted mb-8">Auto-crop output to content for equations and diagrams.</p>

            <p className="text-text-muted mb-4">
                By default, Typst renders a full A4 page. <strong className="text-text">Snippet mode</strong> automatically crops the output to the content's bounding box plus a small margin.
            </p>

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Enable Snippet Mode</h2>
            <CodeBlock language="typescript" code={`const buffer = await renderer.render({
  code: '$ E = mc^2 $',
  snippet: true,  // Enable cropping
  scale: 3        // High resolution
});`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">When to Use</h2>
            <ul className="list-disc list-inside text-text-muted space-y-2">
                <li><strong className="text-text">Math equations</strong> — Clean, cropped formulas</li>
                <li><strong className="text-text">Diagrams</strong> — Vector graphics and shapes</li>
                <li><strong className="text-text">Code snippets</strong> — Syntax-highlighted blocks</li>
                <li><strong className="text-text">Small text</strong> — Labels, badges, captions</li>
            </ul>

            <div className="mt-8 p-4 rounded-lg bg-surface border border-border">
                <p className="text-text-muted text-sm">
                    <strong className="text-text">Tip:</strong> Combine with <code className="bg-background px-1 rounded">scale: 3</code> for crisp retina displays.
                </p>
            </div>
        </article>
    );
}

export function Formats() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Output Formats</h1>
            <p className="text-text-muted mb-8">Choose the right format for your use case.</p>

            <div className="space-y-6">
                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">PNG (Default)</h3>
                    <p className="text-text-muted text-sm mb-3">Lossless compression with alpha transparency. Best for equations and graphics.</p>
                    <CodeBlock language="typescript" code={`format: 'png'`} />
                </div>

                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">JPEG</h3>
                    <p className="text-text-muted text-sm mb-3">Lossy compression, smaller file size. No transparency. Best for photos.</p>
                    <CodeBlock language="typescript" code={`format: 'jpeg', quality: 85`} />
                </div>

                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">WebP</h3>
                    <p className="text-text-muted text-sm mb-3">Modern format with excellent compression. Good browser support.</p>
                    <CodeBlock language="typescript" code={`format: 'webp', quality: 80`} />
                </div>

                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">SVG</h3>
                    <p className="text-text-muted text-sm mb-3">Vector graphics. Infinite scaling. Best for web embedding.</p>
                    <CodeBlock language="typescript" code={`format: 'svg'`} />
                </div>

                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">PDF</h3>
                    <p className="text-text-muted text-sm mb-3">Standard document format. Best for reports and printing.</p>
                    <CodeBlock language="typescript" code={`format: 'pdf'`} />
                </div>
            </div>
        </article>
    );
}

export function Variables() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Variables & Preamble</h1>
            <p className="text-text-muted mb-8">Inject dynamic data and customize styling.</p>

            <h2 className="text-2xl font-bold text-text mb-4">Passing Variables</h2>
            <p className="text-text-muted mb-4">Use <code className="bg-surface px-2 py-0.5 rounded text-sm">sys.inputs</code> to access variables in your Typst code:</p>
            <CodeBlock language="typescript" code={`const buffer = await renderer.render({
  code: 'Hello #sys.inputs.name!',
  variables: {
    name: 'World',
    version: '1.0.0'
  }
});`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Using Preamble</h2>
            <p className="text-text-muted mb-4">Add setup code that runs before your main content:</p>
            <CodeBlock language="typescript" code={`const darkTheme = \`
#set page(fill: rgb("#2b2d31"), margin: 1cm)
#set text(fill: white, font: "Roboto")
\`;

const buffer = await renderer.render({
  preamble: darkTheme,
  code: '= Dark Mode Title',
  snippet: true
});`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Background Color</h2>
            <p className="text-text-muted mb-4">Flatten transparent backgrounds:</p>
            <CodeBlock language="typescript" code={`const buffer = await renderer.render({
  code: '$ E = mc^2 $',
  snippet: true,
  backgroundColor: 'white'  // or '#ffffff'
});`} />
        </article>
    );
}
