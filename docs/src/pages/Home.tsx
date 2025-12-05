import { Link } from 'wouter';
import { ArrowRight, Zap, Image, Layers, Code, Cpu, Palette } from 'lucide-preact';

export function Home() {
    return (
        <div className="space-y-24 pb-12">
            {/* Hero Section */}
            <section className="text-center space-y-8 pt-12 md:pt-24">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary-dark dark:text-primary-light">
                    typst-raster
                </h1>
                <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto">
                    A fast, no-nonsense Node.js library for rendering Typst to PNG, JPEG, WebP, SVG, or PDF.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/docs/installation" className="px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                        Get Started <ArrowRight size={20} />
                    </Link>
                    <a href="https://github.com/RayZ3R0/typst-raster" target="_blank" rel="noreferrer" className="px-8 py-3 rounded-lg bg-surface border border-border hover:bg-surface-alt transition-colors font-semibold text-text">
                        View on GitHub
                    </a>
                </div>

                {/* Code Preview */}
                <div className="mt-12 max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border bg-[#1e1e1e] text-left">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333]">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <pre className="p-6 overflow-x-auto text-sm md:text-base font-mono text-[#d4d4d4]">
                        <code>
                            <span className="text-[#c586c0]">import</span> {'{'} Typst {'}'} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'typst-raster'</span>;{'\n\n'}
                            <span className="text-[#569cd6]">const</span> renderer = <span className="text-[#569cd6]">new</span> <span className="text-[#4ec9b0]">Typst</span>();{'\n\n'}
                            <span className="text-[#569cd6]">const</span> buffer = <span className="text-[#c586c0]">await</span> renderer.<span className="text-[#dcdcaa]">render</span>({'{'}{'\n'}
                            {'  '}code: <span className="text-[#ce9178]">'$ E = mc^2 $'</span>,{'\n'}
                            {'  '}format: <span className="text-[#ce9178]">'png'</span>,{'\n'}
                            {'  '}snippet: <span className="text-[#569cd6]">true</span>,{'\n'}
                            {'  '}scale: <span className="text-[#b5cea8]">3</span>{'\n'}
                            {'}'});
                        </code>
                    </pre>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<Zap />}
                    title="Native Speed"
                    description="Direct Rust bindings via typst-ts-node-compiler ensure blazing fast compilation (~30ms cold, ~0.01ms cached)."
                />
                <FeatureCard
                    icon={<Image />}
                    title="Multi-Format"
                    description="Output to PNG, JPEG, WebP, SVG, or PDF. Perfect for web previews, reports, or vector graphics."
                />
                <FeatureCard
                    icon={<Layers />}
                    title="Built-in Caching"
                    description="Smart LRU caching enabled by default. Repeated renders are instant (4000x speedup)."
                />
                <FeatureCard
                    icon={<Code />}
                    title="Snippet Mode"
                    description="Automatically crops output to content. Ideal for rendering standalone equations or diagrams."
                />
                <FeatureCard
                    icon={<Cpu />}
                    title="Batch Processing"
                    description="Efficiently render multiple items reusing the compiler instance to save resources."
                />
                <FeatureCard
                    icon={<Palette />}
                    title="Zero Config"
                    description="Fonts included. Works out of the box on Lambda, Vercel, and Docker without system dependencies."
                />
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-6 rounded-xl bg-surface border border-border hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-text">{title}</h3>
            <p className="text-text-muted">{description}</p>
        </div>
    );
}
