import { Link } from 'wouter';

export function Introduction() {
    return (
        <div className="prose prose-stone dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-light mb-6">Introduction</h1>
            <p className="text-xl text-text-muted leading-relaxed mb-8">
                <strong>typst-raster</strong> is a high-performance Node.js library designed to render Typst code into raster images (PNG, JPEG, WebP) or vector graphics (SVG, PDF).
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="p-6 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">Why typst-raster?</h3>
                    <p className="text-text-muted">
                        Most Typst wrappers require installing a system binary or rely on slow CLI calls. We use <strong>native Rust bindings</strong> to call the compiler directly from Node.js, making it incredibly fast and portable.
                    </p>
                </div>
                <div className="p-6 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-bold text-primary mb-2">Who is this for?</h3>
                    <p className="text-text-muted">
                        Perfect for Discord bots, web apps needing dynamic document generation, or backend services generating reports.
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-text mb-4">Key Features</h2>
            <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Native Speed:</strong> ~30ms cold start, ~0.01ms cached renders.</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Zero Config:</strong> Fonts included (New Computer Modern). Works on Lambda/Vercel.</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Snippet Mode:</strong> Auto-crop equations and diagrams.</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Multi-Format:</strong> PNG, JPEG, WebP, SVG, PDF.</span>
                </li>
            </ul>

            <div className="flex gap-4">
                <Link href="/docs/getting-started">
                    <a className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                        Get Started &rarr;
                    </a>
                </Link>
            </div>
        </div>
    );
}

export function GettingStarted() {
    return (
        <div className="prose prose-stone dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-light mb-6">Getting Started</h1>

            <h2 className="text-2xl font-bold text-text mb-4">Prerequisites</h2>
            <ul className="list-disc list-inside mb-8 text-text-muted">
                <li>Node.js v18 or higher</li>
                <li>Linux, macOS, or Windows (x64 or arm64)</li>
            </ul>

            <h2 className="text-2xl font-bold text-text mb-4">Installation</h2>
            <div className="bg-surface-alt p-4 rounded-lg border border-border mb-8 font-mono text-sm">
                npm install typst-raster
            </div>

            <h2 className="text-2xl font-bold text-text mb-4">First Render</h2>
            <p className="text-text-muted mb-4">Create a file named <code>index.ts</code>:</p>

            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-border overflow-x-auto mb-8">
                <pre className="text-sm font-mono text-[#d4d4d4]">
                    <code>{`import { Typst } from 'typst-raster';
import { writeFile } from 'fs/promises';

const renderer = new Typst();

// Render a simple equation
const buffer = await renderer.render({
  code: '$ E = mc^2 $',
  snippet: true,
  scale: 3
});

await writeFile('equation.png', buffer);`}</code>
                </pre>
            </div>

            <p className="text-text-muted">
                Run it with <code>tsx index.ts</code> (or compile with tsc). You should see an <code>equation.png</code> file generated!
            </p>
        </div>
    );
}

export function CoreConcepts() {
    return (
        <div className="prose prose-stone dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-light mb-6">Core Concepts</h1>

            <h2 className="text-2xl font-bold text-text mb-4">Snippet Mode</h2>
            <p className="text-text-muted mb-6">
                By default, Typst renders a full A4 page. <strong>Snippet mode</strong> (`snippet: true`) automatically crops the output to the content's bounding box plus a small margin. This is ideal for rendering equations, diagrams, or small text blocks.
            </p>

            <h2 className="text-2xl font-bold text-text mb-4">Formats</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-surface border border-border rounded-lg">
                    <h3 className="font-bold text-primary">PNG (Default)</h3>
                    <p className="text-sm text-text-muted">Lossless, supports transparency. Best for equations.</p>
                </div>
                <div className="p-4 bg-surface border border-border rounded-lg">
                    <h3 className="font-bold text-primary">JPEG</h3>
                    <p className="text-sm text-text-muted">Lossy, smaller file size. No transparency.</p>
                </div>
                <div className="p-4 bg-surface border border-border rounded-lg">
                    <h3 className="font-bold text-primary">SVG</h3>
                    <p className="text-sm text-text-muted">Vector graphics. Infinite scaling. Best for web.</p>
                </div>
                <div className="p-4 bg-surface border border-border rounded-lg">
                    <h3 className="font-bold text-primary">PDF</h3>
                    <p className="text-sm text-text-muted">Standard document format. Best for reports.</p>
                </div>
            </div>
        </div>
    );
}

export function Advanced() {
    return (
        <div className="prose prose-stone dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-light mb-6">Advanced Features</h1>

            <h2 className="text-2xl font-bold text-text mb-4">Batch Rendering</h2>
            <p className="text-text-muted mb-4">
                Rendering items one by one can be slow if you create a new renderer each time. <code>renderBatch</code> reuses the compiler instance, making it significantly faster for multiple items.
            </p>
            <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border overflow-x-auto mb-8">
                <pre className="text-sm font-mono text-[#d4d4d4]">
                    <code>{`const results = await renderer.renderBatch([
  { code: '$ a $', snippet: true },
  { code: '$ b $', snippet: true }
]);`}</code>
                </pre>
            </div>

            <h2 className="text-2xl font-bold text-text mb-4">Caching</h2>
            <p className="text-text-muted mb-4">
                An LRU cache is enabled by default (size: 100). Repeated renders of the same code and options are instant (~0.01ms).
            </p>
            <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border overflow-x-auto mb-8">
                <pre className="text-sm font-mono text-[#d4d4d4]">
                    <code>{`// Customize cache
const renderer = new Typst({ 
  cache: true,
  cacheSize: 500 
});`}</code>
                </pre>
            </div>

            <h2 className="text-2xl font-bold text-text mb-4">Streaming</h2>
            <p className="text-text-muted mb-4">
                For web servers, use <code>renderStream</code> to pipe output directly to the response, reducing memory usage for large images.
            </p>
        </div>
    );
}

export function Api() {
    return (
        <div className="prose prose-stone dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-light mb-6">API Reference</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-text mb-4">Typst Class</h2>
                <p className="text-text-muted mb-6">The main entry point for the library.</p>

                <div className="space-y-6">
                    <div className="border border-border rounded-lg p-6 bg-surface">
                        <h3 className="text-xl font-mono font-bold text-primary mb-2">constructor(options?)</h3>
                        <p className="text-text-muted mb-4">Creates a new renderer instance.</p>
                        <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                            <li><code>fontPath</code>: Custom font directory path</li>
                            <li><code>cache</code>: Enable/disable LRU cache (default: true)</li>
                            <li><code>cacheSize</code>: Max cache items (default: 100)</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-lg p-6 bg-surface">
                        <h3 className="text-xl font-mono font-bold text-primary mb-2">render(options)</h3>
                        <p className="text-text-muted mb-2">Renders a single item. Returns <code>Promise&lt;Buffer&gt;</code>.</p>
                    </div>

                    <div className="border border-border rounded-lg p-6 bg-surface">
                        <h3 className="text-xl font-mono font-bold text-primary mb-2">renderBatch(options[])</h3>
                        <p className="text-text-muted mb-2">Renders multiple items sequentially. Returns <code>Promise&lt;Buffer[]&gt;</code>.</p>
                    </div>

                    <div className="border border-border rounded-lg p-6 bg-surface">
                        <h3 className="text-xl font-mono font-bold text-primary mb-2">renderStream(options)</h3>
                        <p className="text-text-muted mb-2">Returns a <code>Promise&lt;Readable&gt;</code> stream (raster formats only).</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export function Examples() {
    return (
        <div className="prose prose-stone dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-light mb-6">Examples</h1>

            <div className="space-y-12">
                <ExampleCard
                    title="Math Equation"
                    description="High-quality mathematical typesetting with snippet mode."
                    image="/images/math.png"
                />
                <ExampleCard
                    title="Code Block"
                    description="Syntax highlighting and code formatting."
                    image="/images/code.png"
                />
                <ExampleCard
                    title="Vector Graphics"
                    description="Drawing shapes and diagrams natively."
                    image="/images/diagram.png"
                />
            </div>
        </div>
    );
}

function ExampleCard({ title, description, image }: { title: string, description: string, image: string }) {
    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-border bg-surface-alt/50">
                <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
                <p className="text-text-muted">{description}</p>
            </div>
            <div className="p-8 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMUMxeiIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')]">
                <img src={image} alt={title} className="max-w-full shadow-lg rounded" />
            </div>
        </div>
    );
}
