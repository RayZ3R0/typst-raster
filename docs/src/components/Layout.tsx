import { useState, useEffect, useRef } from 'preact/hooks';
import { Link, useLocation } from 'wouter';
import { Menu, Moon, Sun, Github, Search, ChevronRight, ChevronDown, ArrowLeft, ArrowRight, FileText, Hash } from 'lucide-preact';
import Fuse from 'fuse.js';
import { SEARCH_INDEX, SIDEBAR_STRUCTURE, getPageNavigation } from '../data/searchIndex';
import type { SearchItem } from '../data/searchIndex';
import { useTableOfContents } from '../hooks/useTableOfContents';

export function Layout({ children }: { children: any }) {
    const [isDark, setIsDark] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(SIDEBAR_STRUCTURE.map(c => c.category));
    const [location] = useLocation();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const pageNav = getPageNavigation(location);
    const { headings, activeId } = useTableOfContents();

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const fuse = new Fuse(SEARCH_INDEX, {
        keys: [
            { name: 'title', weight: 2 },
            { name: 'content', weight: 1 },
            { name: 'keywords', weight: 1.5 }
        ],
        threshold: 0.4,
        includeMatches: true,
        minMatchCharLength: 2
    });

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const results = fuse.search(searchQuery).slice(0, 8);
            setSearchResults(results.map(r => r.item));
            setSelectedIndex(0);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const openSearch = () => {
        setIsSearchOpen(true);
        setSearchQuery('');
        setSelectedIndex(0);
        setTimeout(() => searchInputRef.current?.focus(), 50);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    const handleSearchKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, searchResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && searchResults.length > 0) {
            e.preventDefault();
            window.location.href = searchResults[selectedIndex].href;
            closeSearch();
        } else if (e.key === 'Escape') {
            closeSearch();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Header height + padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-background text-text">
            {/* Navbar - Fixed at top */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 text-text-muted hover:text-text" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu size={20} />
                        </button>
                        <Link href="/" className="text-lg font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="bg-primary text-white px-2 py-0.5 rounded text-sm font-mono">TR</span>
                            <span className="hidden sm:inline">typst-raster</span>
                        </Link>
                        <span className="hidden md:inline text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">v0.1.0</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={openSearch}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-text-muted hover:border-primary/50 hover:text-text transition-all w-40 md:w-56"
                        >
                            <Search size={14} />
                            <span className="hidden sm:inline text-left flex-1">Search...</span>
                            <kbd className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono">⌘K</kbd>
                        </button>

                        <div className="h-5 w-px bg-border mx-1"></div>

                        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors" title={isDark ? 'Light mode' : 'Dark mode'}>
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <a href="https://github.com/RayZ3R0/typst-raster" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors" title="GitHub">
                            <Github size={18} />
                        </a>
                    </div>
                </div>
            </header>

            {/* Left Sidebar - Navigation */}
            <aside className={`fixed top-14 bottom-0 left-0 z-40 w-64 sidebar-glass border-r border-border/50 overflow-y-auto transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <nav className="p-4">
                    {SIDEBAR_STRUCTURE.map(section => (
                        <div key={section.category} className="mb-4">
                            <button
                                onClick={() => toggleCategory(section.category)}
                                className="flex items-center justify-between w-full px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted hover:text-text transition-colors"
                            >
                                <span>{section.category}</span>
                                {expandedCategories.includes(section.category) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            </button>
                            {expandedCategories.includes(section.category) && (
                                <div className="mt-1 space-y-0.5">
                                    {section.items.map(item => {
                                        const isActive = location === item.href;
                                        return (
                                            <Link key={item.href} href={item.href}>
                                                <a
                                                    onClick={() => setIsSidebarOpen(false)}
                                                    className={`group flex items-center gap-2 px-2 py-2 text-sm rounded-lg transition-all duration-200 ${isActive
                                                            ? 'nav-item-active text-white'
                                                            : 'nav-item text-text-muted hover:text-text'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${isActive
                                                            ? 'bg-white/80'
                                                            : 'bg-primary/0 group-hover:bg-primary/50'
                                                        }`} />
                                                    {item.title}
                                                </a>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Main Content Wrapper */}
            <div className="pt-14 lg:pl-64 flex justify-center min-h-screen">
                {/* Center Column - Content */}
                <main className="flex-1 min-w-0 max-w-3xl px-6 py-8 lg:px-10 lg:py-10">
                    {/* Previous / Next Navigation (Top) */}
                    {(pageNav.prev || pageNav.next) && (
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border text-sm">
                            {pageNav.prev ? (
                                <Link href={pageNav.prev.href}>
                                    <a className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors">
                                        <ArrowLeft size={14} />
                                        <span>{pageNav.prev.title}</span>
                                    </a>
                                </Link>
                            ) : <div />}
                            {pageNav.next ? (
                                <Link href={pageNav.next.href}>
                                    <a className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors">
                                        <span>{pageNav.next.title}</span>
                                        <ArrowRight size={14} />
                                    </a>
                                </Link>
                            ) : <div />}
                        </div>
                    )}

                    {children}

                    {/* Previous / Next Navigation (Bottom) */}
                    {(pageNav.prev || pageNav.next) && (
                        <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-border">
                            {pageNav.prev ? (
                                <Link href={pageNav.prev.href}>
                                    <a className="flex flex-col p-4 rounded-lg border border-border hover:border-primary hover:bg-surface transition-all group">
                                        <span className="text-xs text-text-muted mb-1">Previous</span>
                                        <span className="flex items-center gap-2 font-medium text-text group-hover:text-primary">
                                            <ArrowLeft size={16} />
                                            {pageNav.prev.title}
                                        </span>
                                    </a>
                                </Link>
                            ) : <div />}
                            {pageNav.next ? (
                                <Link href={pageNav.next.href}>
                                    <a className="flex flex-col items-end p-4 rounded-lg border border-border hover:border-primary hover:bg-surface transition-all group">
                                        <span className="text-xs text-text-muted mb-1">Next</span>
                                        <span className="flex items-center gap-2 font-medium text-text group-hover:text-primary">
                                            {pageNav.next.title}
                                            <ArrowRight size={16} />
                                        </span>
                                    </a>
                                </Link>
                            ) : <div />}
                        </div>
                    )}
                </main>

                {/* Right Sidebar - Table of Contents */}
                <aside className="hidden xl:block w-64 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-border/50 p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                        On This Page
                    </div>
                    <ul className="space-y-2 text-sm">
                        {headings.map(heading => (
                            <li key={heading.id} style={{ paddingLeft: (heading.level - 2) * 12 }}>
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToHeading(heading.id);
                                    }}
                                    className={`block transition-colors border-l-2 pl-3 -ml-px ${activeId === heading.id
                                            ? 'border-primary text-primary font-medium'
                                            : 'border-transparent text-text-muted hover:text-text hover:border-text-muted/30'
                                        }`}
                                >
                                    {heading.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>

            {/* Search Modal */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
                    <div className="fixed inset-0 bg-black/50" onClick={closeSearch} />
                    <div className="relative w-full max-w-xl bg-surface rounded-lg shadow-2xl border border-border overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
                            <Search size={18} className="text-text-muted shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search documentation..."
                                className="flex-1 bg-transparent border-none outline-none text-base text-text placeholder:text-text-muted"
                                value={searchQuery}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                            <button onClick={closeSearch} className="text-xs text-text-muted hover:text-text px-2 py-1 rounded bg-surface border border-border">
                                ESC
                            </button>
                        </div>

                        <div className="max-h-[50vh] overflow-y-auto">
                            {searchQuery.length < 2 ? (
                                <div className="p-8 text-center">
                                    <Search size={32} className="mx-auto text-text-muted/30 mb-3" />
                                    <p className="text-sm text-text-muted">Type to search documentation</p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-text-muted">No results for "<span className="text-text">{searchQuery}</span>"</p>
                                </div>
                            ) : (
                                <ul className="py-2">
                                    {searchResults.map((result, i) => (
                                        <li key={result.href}>
                                            <Link href={result.href}>
                                                <a
                                                    onClick={closeSearch}
                                                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${i === selectedIndex ? 'bg-primary/10' : 'hover:bg-surface-alt'
                                                        }`}
                                                >
                                                    <FileText size={16} className="mt-0.5 text-text-muted shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-medium ${i === selectedIndex ? 'text-primary' : 'text-text'}`}>
                                                                {result.title}
                                                            </span>
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-alt text-text-muted">
                                                                {result.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-text-muted truncate mt-0.5">
                                                            {result.content.slice(0, 80)}...
                                                        </p>
                                                    </div>
                                                    {i === selectedIndex && (
                                                        <Hash size={14} className="text-primary shrink-0 mt-1" />
                                                    )}
                                                </a>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {searchResults.length > 0 && (
                            <div className="px-4 py-2 border-t border-border bg-background flex items-center gap-4 text-xs text-text-muted">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded font-mono">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded font-mono">↓</kbd>
                                    navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded font-mono">↵</kbd>
                                    select
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
