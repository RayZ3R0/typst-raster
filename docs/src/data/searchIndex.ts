// Full-text searchable content index for documentation
export interface SearchItem {
    title: string;
    href: string;
    category: string;
    content: string;
    keywords: string[];
}

export const SEARCH_INDEX: SearchItem[] = [
    {
        title: 'Introduction',
        href: '/',
        category: 'Getting Started',
        content: 'typst-raster is a high-performance Node.js library for rendering Typst code to images. Native speed compilation via Rust bindings. Zero config fonts included. Multi-format output PNG JPEG WebP SVG PDF. Snippet mode auto-crop. Built-in LRU caching.',
        keywords: ['overview', 'what is', 'features', 'why']
    },
    {
        title: 'Installation',
        href: '/docs/installation',
        category: 'Getting Started',
        content: 'Install typst-raster using npm yarn or pnpm. Prerequisites Node.js v18 or higher. npm install typst-raster. Native binaries included for Linux macOS Windows.',
        keywords: ['npm', 'yarn', 'pnpm', 'install', 'setup', 'requirements']
    },
    {
        title: 'Quick Start',
        href: '/docs/quick-start',
        category: 'Getting Started',
        content: 'First render example. Import Typst from typst-raster. Create renderer instance. Call render with code option. Save buffer to file. Snippet mode for equations.',
        keywords: ['first', 'example', 'hello world', 'tutorial', 'basic']
    },
    {
        title: 'Rendering Basics',
        href: '/docs/rendering',
        category: 'Core Concepts',
        content: 'Render options code format quality scale ppi snippet variables backgroundColor preamble. Full page vs snippet mode. Output formats PNG JPEG WebP SVG PDF.',
        keywords: ['render', 'options', 'format', 'quality', 'scale', 'ppi']
    },
    {
        title: 'Snippet Mode',
        href: '/docs/snippet-mode',
        category: 'Core Concepts',
        content: 'Snippet mode auto-crops output to content bounding box. Perfect for equations diagrams and small components. Set snippet true to enable.',
        keywords: ['crop', 'auto', 'equation', 'math', 'trim']
    },
    {
        title: 'Output Formats',
        href: '/docs/formats',
        category: 'Core Concepts',
        content: 'PNG lossless transparency default format. JPEG lossy smaller file size no transparency. WebP modern format good compression. SVG vector graphics infinite scaling. PDF standard document format.',
        keywords: ['png', 'jpeg', 'jpg', 'webp', 'svg', 'pdf', 'image']
    },
    {
        title: 'Variables & Preamble',
        href: '/docs/variables',
        category: 'Core Concepts',
        content: 'Pass dynamic variables to Typst code using sys.inputs. Use preamble for theming and setup code. Custom fonts colors page styling.',
        keywords: ['variables', 'input', 'preamble', 'theme', 'dynamic']
    },
    {
        title: 'Batch Rendering',
        href: '/docs/batch',
        category: 'Advanced',
        content: 'renderBatch method for multiple items. Reuses compiler instance. More efficient than individual render calls. Returns array of buffers.',
        keywords: ['batch', 'multiple', 'array', 'bulk']
    },
    {
        title: 'Caching',
        href: '/docs/caching',
        category: 'Advanced',
        content: 'LRU cache enabled by default. 4000x speedup for repeated renders. Configure cache size. Disable with cache false option.',
        keywords: ['cache', 'lru', 'performance', 'speed', 'fast']
    },
    {
        title: 'Streaming',
        href: '/docs/streaming',
        category: 'Advanced',
        content: 'renderStream returns Node.js Readable stream. Perfect for HTTP responses. Lower memory usage. Supports PNG JPEG WebP formats.',
        keywords: ['stream', 'pipe', 'http', 'response', 'memory']
    },
    {
        title: 'Metadata Extraction',
        href: '/docs/metadata',
        category: 'Advanced',
        content: 'getMetadata function extracts image information. Width height format density channels. Uses Sharp metadata API.',
        keywords: ['metadata', 'width', 'height', 'info', 'dimensions']
    },
    {
        title: 'Error Handling',
        href: '/docs/errors',
        category: 'Advanced',
        content: 'TypstRenderError for render failures. Compiler resets on error. Input validation prevents crashes. Recovery from invalid code.',
        keywords: ['error', 'exception', 'catch', 'try', 'fail']
    },
    {
        title: 'API Reference',
        href: '/docs/api',
        category: 'Reference',
        content: 'Typst class constructor render renderBatch renderStream. RenderOptions interface. TypstOptions interface. getMetadata function. ImageMetadata type.',
        keywords: ['api', 'reference', 'class', 'method', 'type', 'interface']
    },
    {
        title: 'Examples Gallery',
        href: '/docs/examples',
        category: 'Reference',
        content: 'Visual examples of rendered output. Math equations code blocks diagrams tables. Real output images from the library.',
        keywords: ['examples', 'gallery', 'demo', 'showcase']
    },
    {
        title: 'Performance',
        href: '/docs/performance',
        category: 'Reference',
        content: 'Benchmark results. Cold render 30ms. Cached render 0.01ms. SVG fastest 0.44ms. PNG 9.72ms. Resolution and scale impact on speed.',
        keywords: ['performance', 'benchmark', 'speed', 'fast', 'timing']
    }
];

export const SIDEBAR_STRUCTURE = [
    {
        category: 'Getting Started',
        items: [
            { title: 'Introduction', href: '/' },
            { title: 'Installation', href: '/docs/installation' },
            { title: 'Quick Start', href: '/docs/quick-start' },
        ]
    },
    {
        category: 'Core Concepts',
        items: [
            { title: 'Rendering Basics', href: '/docs/rendering' },
            { title: 'Snippet Mode', href: '/docs/snippet-mode' },
            { title: 'Output Formats', href: '/docs/formats' },
            { title: 'Variables & Preamble', href: '/docs/variables' },
        ]
    },
    {
        category: 'Advanced',
        items: [
            { title: 'Batch Rendering', href: '/docs/batch' },
            { title: 'Caching', href: '/docs/caching' },
            { title: 'Streaming', href: '/docs/streaming' },
            { title: 'Metadata Extraction', href: '/docs/metadata' },
            { title: 'Error Handling', href: '/docs/errors' },
        ]
    },
    {
        category: 'Reference',
        items: [
            { title: 'API Reference', href: '/docs/api' },
            { title: 'Examples Gallery', href: '/docs/examples' },
            { title: 'Performance', href: '/docs/performance' },
        ]
    }
];

// Flatten for navigation
export const ALL_PAGES = SIDEBAR_STRUCTURE.flatMap(cat => cat.items);

export function getPageNavigation(currentHref: string) {
    const index = ALL_PAGES.findIndex(p => p.href === currentHref);
    return {
        prev: index > 0 ? ALL_PAGES[index - 1] : null,
        next: index < ALL_PAGES.length - 1 ? ALL_PAGES[index + 1] : null
    };
}
