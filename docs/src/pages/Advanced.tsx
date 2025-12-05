import { CodeBlock } from '../components/CodeBlock';

export function Batch() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Batch Rendering</h1>
            <p className="text-text-muted mb-8">Efficiently render multiple items in one call.</p>

            <p className="text-text-muted mb-4">
                The <code className="bg-surface px-2 py-0.5 rounded text-sm">renderBatch</code> method reuses the compiler instance, making it significantly faster than individual render calls.
            </p>

            <h2 className="text-2xl font-bold text-text mb-4">Basic Usage</h2>
            <CodeBlock language="typescript" code={`const results = await renderer.renderBatch([
  { code: '$ a^2 + b^2 = c^2 $', snippet: true },
  { code: '$ E = mc^2 $', snippet: true },
  { code: '$ F = ma $', snippet: true }
]);

// results is Buffer[]
for (let i = 0; i < results.length; i++) {
  await writeFile(\`equation-\${i}.png\`, results[i]);
}`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Mixed Formats</h2>
            <CodeBlock language="typescript" code={`const results = await renderer.renderBatch([
  { code: '$ x $', format: 'png', snippet: true },
  { code: '$ y $', format: 'svg', snippet: true },
  { code: '= Report', format: 'pdf' }
]);`} />

            <div className="mt-8 p-4 rounded-lg bg-surface border border-border">
                <p className="text-text-muted text-sm">
                    <strong className="text-text">Performance:</strong> Batch rendering with 100 items takes ~4.5ms per item due to compiler reuse and caching.
                </p>
            </div>
        </article>
    );
}

export function Caching() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Caching</h1>
            <p className="text-text-muted mb-8">4000x speedup for repeated renders.</p>

            <p className="text-text-muted mb-4">
                An LRU (Least Recently Used) cache is <strong className="text-text">enabled by default</strong>. Repeated renders of the same code and options return instantly from cache.
            </p>

            <h2 className="text-2xl font-bold text-text mb-4">Performance Impact</h2>
            <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                    <thead className="bg-surface">
                        <tr>
                            <th className="text-left px-4 py-2 font-semibold">Scenario</th>
                            <th className="text-left px-4 py-2 font-semibold">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr><td className="px-4 py-2">Cold render (no cache)</td><td className="px-4 py-2 text-text-muted">~30ms</td></tr>
                        <tr><td className="px-4 py-2">Warm render (cached)</td><td className="px-4 py-2 text-primary font-semibold">~0.01ms</td></tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-text mb-4">Configure Cache Size</h2>
            <CodeBlock language="typescript" code={`const renderer = new Typst({
  cacheSize: 500  // default: 100
});`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Disable Cache</h2>
            <CodeBlock language="typescript" code={`const renderer = new Typst({
  cache: false
});`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Benchmark Test Code</h2>
            <p className="text-text-muted mb-4">
                The performance numbers above were measured using this Typst code:
            </p>
            <CodeBlock language="typst" code={`$ sum_(k=1)^n k = (n(n+1))/2 $`} />
            <p className="text-text-muted mt-4 text-sm">
                Rendered with <code className="bg-surface px-1 rounded">snippet: true</code> at default PPI (192).
            </p>
        </article>
    );
}

export function Streaming() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Streaming</h1>
            <p className="text-text-muted mb-8">Lower memory usage for HTTP responses.</p>

            <p className="text-text-muted mb-4">
                The <code className="bg-surface px-2 py-0.5 rounded text-sm">renderStream</code> method returns a Node.js Readable stream instead of a Buffer. Perfect for piping directly to HTTP responses.
            </p>

            <h2 className="text-2xl font-bold text-text mb-4">Basic Usage</h2>
            <CodeBlock language="typescript" code={`import { createWriteStream } from 'fs';

const stream = await renderer.renderStream({
  code: '$ \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a} $',
  format: 'png',
  snippet: true
});

stream.pipe(createWriteStream('equation.png'));`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Express Example</h2>
            <CodeBlock language="typescript" code={`app.get('/equation', async (req, res) => {
  const stream = await renderer.renderStream({
    code: req.query.code as string,
    format: 'png',
    snippet: true
  });

  res.setHeader('Content-Type', 'image/png');
  stream.pipe(res);
});`} />

            <div className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-primary-dark dark:text-primary-light text-sm">
                    <strong>Note:</strong> Streaming only supports raster formats (PNG, JPEG, WebP). Use regular <code>render()</code> for SVG and PDF.
                </p>
            </div>
        </article>
    );
}

export function Metadata() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Metadata Extraction</h1>
            <p className="text-text-muted mb-8">Get image dimensions and properties.</p>

            <h2 className="text-2xl font-bold text-text mb-4">Usage</h2>
            <CodeBlock language="typescript" code={`import { Typst, getMetadata } from 'typst-raster';

const renderer = new Typst();
const buffer = await renderer.render({
  code: '$ x^2 $',
  snippet: true,
  ppi: 300
});

const metadata = await getMetadata(buffer);
console.log(metadata);
// {
//   width: 120,
//   height: 80,
//   format: 'png',
//   density: 300,
//   channels: 4,
//   hasAlpha: true
// }`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Available Properties</h2>
            <ul className="list-disc list-inside text-text-muted space-y-1">
                <li><code className="bg-surface px-1 rounded">width</code> — Image width in pixels</li>
                <li><code className="bg-surface px-1 rounded">height</code> — Image height in pixels</li>
                <li><code className="bg-surface px-1 rounded">format</code> — Image format (png, jpeg, etc.)</li>
                <li><code className="bg-surface px-1 rounded">density</code> — DPI/PPI of the image</li>
                <li><code className="bg-surface px-1 rounded">channels</code> — Number of color channels</li>
                <li><code className="bg-surface px-1 rounded">hasAlpha</code> — Whether image has transparency</li>
            </ul>
        </article>
    );
}

export function Errors() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Error Handling</h1>
            <p className="text-text-muted mb-8">Handle render failures gracefully.</p>

            <h2 className="text-2xl font-bold text-text mb-4">TypstRenderError</h2>
            <p className="text-text-muted mb-4">All render failures throw a <code className="bg-surface px-2 py-0.5 rounded text-sm">TypstRenderError</code>:</p>
            <CodeBlock language="typescript" code={`import { Typst, TypstRenderError } from 'typst-raster';

const renderer = new Typst();

try {
  await renderer.render({
    code: '#invalid-typst-code'
  });
} catch (error) {
  if (error instanceof TypstRenderError) {
    console.error('Typst error:', error.message);
    // Handle gracefully
  }
  throw error;
}`} />

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Automatic Recovery</h2>
            <p className="text-text-muted mb-4">
                The compiler automatically resets after errors, so subsequent renders work normally:
            </p>
            <CodeBlock language="typescript" code={`// This fails
try {
  await renderer.render({ code: '#invalid' });
} catch (e) {}

// This still works!
const buffer = await renderer.render({
  code: '$ x $',
  snippet: true
});`} />
        </article>
    );
}

export function Api() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">API Reference</h1>
            <p className="text-text-muted mb-8">Complete API documentation.</p>

            <h2 className="text-2xl font-bold text-text mb-4">Typst Class</h2>

            <div className="space-y-6">
                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-mono font-bold text-primary mb-2">constructor(options?)</h3>
                    <p className="text-text-muted text-sm mb-3">Creates a new renderer instance.</p>
                    <CodeBlock language="typescript" code={`interface TypstOptions {
  fontPath?: string;   // Custom font directory
  cache?: boolean;     // Enable LRU cache (default: true)
  cacheSize?: number;  // Max cache items (default: 100)
}`} />
                </div>

                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-mono font-bold text-primary mb-2">render(options): Promise&lt;Buffer&gt;</h3>
                    <p className="text-text-muted text-sm mb-3">Renders Typst code to a buffer.</p>
                    <CodeBlock language="typescript" code={`interface RenderOptions {
  code: string;
  format?: 'png' | 'jpeg' | 'webp' | 'svg' | 'pdf';
  quality?: number;
  scale?: number;
  ppi?: number;
  snippet?: boolean;
  variables?: Record<string, string>;
  preamble?: string;
  backgroundColor?: string;
}`} />
                </div>

                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-mono font-bold text-primary mb-2">renderBatch(options[]): Promise&lt;Buffer[]&gt;</h3>
                    <p className="text-text-muted text-sm">Renders multiple items efficiently.</p>
                </div>

                <div className="p-5 rounded-xl bg-surface border border-border">
                    <h3 className="text-lg font-mono font-bold text-primary mb-2">renderStream(options): Promise&lt;Readable&gt;</h3>
                    <p className="text-text-muted text-sm">Returns a readable stream (raster formats only).</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-text mb-4 mt-10">Utility Functions</h2>
            <div className="p-5 rounded-xl bg-surface border border-border">
                <h3 className="text-lg font-mono font-bold text-primary mb-2">getMetadata(buffer): Promise&lt;ImageMetadata&gt;</h3>
                <p className="text-text-muted text-sm">Extracts image metadata from a buffer.</p>
            </div>
        </article>
    );
}

export function Examples() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Examples Gallery</h1>
            <p className="text-text-muted mb-8">Visual examples of rendered output.</p>

            <div className="space-y-8">
                <div className="rounded-xl bg-surface border border-border overflow-hidden">
                    <div className="p-4 border-b border-border bg-background">
                        <h3 className="font-bold text-text">Math Equation</h3>
                    </div>
                    <div className="p-6 flex justify-center bg-white dark:bg-gray-900">
                        <img src="/images/math.png" alt="Math equation" className="max-w-full rounded shadow-lg" />
                    </div>
                    <div className="p-4 border-t border-border">
                        <CodeBlock language="typescript" code={`await renderer.render({
  code: '$ sum_(k=1)^n k = (n(n+1))/2 $',
  snippet: true,
  scale: 2
});`} />
                    </div>
                </div>

                <div className="rounded-xl bg-surface border border-border overflow-hidden">
                    <div className="p-4 border-b border-border bg-background">
                        <h3 className="font-bold text-text">Code Block</h3>
                    </div>
                    <div className="p-6 flex justify-center bg-white dark:bg-gray-900">
                        <img src="/images/code.png" alt="Code block" className="max-w-full rounded shadow-lg" />
                    </div>
                </div>
            </div>
        </article>
    );
}

export function Performance() {
    return (
        <article>
            <h1 className="text-4xl font-bold text-text mb-4">Performance</h1>
            <p className="text-text-muted mb-8">Benchmark results and optimization tips.</p>

            <h2 className="text-2xl font-bold text-text mb-4">Benchmark Results</h2>
            <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                    <thead className="bg-surface">
                        <tr>
                            <th className="text-left px-4 py-2 font-semibold">Scenario</th>
                            <th className="text-left px-4 py-2 font-semibold">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr><td className="px-4 py-2">Cold render</td><td className="px-4 py-2 text-text-muted">~32ms</td></tr>
                        <tr><td className="px-4 py-2">Cached render</td><td className="px-4 py-2 text-primary font-semibold">~0.01ms (4000x faster)</td></tr>
                        <tr><td className="px-4 py-2">SVG format</td><td className="px-4 py-2 text-text-muted">~0.44ms</td></tr>
                        <tr><td className="px-4 py-2">JPEG format</td><td className="px-4 py-2 text-text-muted">~4.12ms</td></tr>
                        <tr><td className="px-4 py-2">PNG format</td><td className="px-4 py-2 text-text-muted">~9.72ms</td></tr>
                        <tr><td className="px-4 py-2">WebP format</td><td className="px-4 py-2 text-text-muted">~10.37ms</td></tr>
                        <tr><td className="px-4 py-2">Batch (10 items)</td><td className="px-4 py-2 text-text-muted">~4.5ms/item</td></tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold text-text mb-4">Resolution Impact</h2>
            <p className="text-text-muted mb-4">Higher PPI and scale increase render time linearly:</p>
            <ul className="list-disc list-inside text-text-muted space-y-1">
                <li>72 PPI: ~5ms</li>
                <li>192 PPI (default): ~9ms</li>
                <li>300 PPI: ~16ms</li>
                <li>600 PPI: ~39ms</li>
            </ul>

            <h2 className="text-2xl font-bold text-text mb-4 mt-8">Optimization Tips</h2>
            <ul className="list-disc list-inside text-text-muted space-y-2">
                <li><strong className="text-text">Use caching</strong> — Enabled by default, 4000x speedup</li>
                <li><strong className="text-text">Choose format wisely</strong> — SVG is fastest, PNG slowest</li>
                <li><strong className="text-text">Lower resolution for previews</strong> — 72 PPI for thumbnails</li>
                <li><strong className="text-text">Use batch rendering</strong> — Reuses compiler instance</li>
            </ul>

            <h2 className="text-2xl font-bold text-text mb-4 mt-10">Benchmark Details</h2>
            <p className="text-text-muted mb-4">
                All benchmarks were run using this Typst code:
            </p>
            <CodeBlock language="typst" code={`$ sum_(k=1)^n k = (n(n+1))/2 $`} />

            <p className="text-text-muted mt-4 mb-4">
                For complex document tests, this code was used:
            </p>
            <CodeBlock language="typst" code={`#set page(width: auto, height: auto, margin: 1cm)
#set text(size: 12pt)

= Mathematics

$ integral_0^infinity e^(-x^2) dx = sqrt(pi)/2 $

$ sum_(n=1)^infinity 1/n^2 = pi^2/6 $

$ det(A) = sum_(sigma in S_n) "sgn"(sigma) product_(i=1)^n a_(i,sigma(i)) $`} />

            <div className="mt-6 p-4 rounded-lg bg-surface border border-border">
                <p className="text-text-muted text-sm">
                    <strong className="text-text">Environment:</strong> Node.js v20, Apple M1, default PPI (192), <code className="bg-background px-1 rounded">snippet: true</code> for single renders.
                </p>
            </div>
        </article>
    );
}
