import { useState, useEffect } from 'preact/hooks';

export interface TableOfContentsItem {
    id: string;
    text: string;
    level: number;
}

export function useTableOfContents() {
    const [headings, setHeadings] = useState<TableOfContentsItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const updateHeadings = () => {
            const elements = Array.from(document.querySelectorAll('main h2, main h3'));
            const items: TableOfContentsItem[] = elements.map((element) => {
                if (!element.id) {
                    element.id = element.textContent
                        ?.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '') || '';
                }
                return {
                    id: element.id,
                    text: element.textContent || '',
                    level: Number(element.tagName.substring(1))
                };
            });
            setHeadings(items);
        };

        // Initial update
        updateHeadings();

        // MutationObserver to handle dynamic content changes (if any)
        const observer = new MutationObserver(updateHeadings);
        const main = document.querySelector('main');
        if (main) {
            observer.observe(main, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, [window.location.pathname]); // Re-run on route change

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    return { headings, activeId };
}
