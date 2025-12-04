export class LRUCache<K, V> {
    private cache = new Map<K, V>();
    private maxSize: number;

    constructor(maxSize: number = 100) {
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        const value = this.cache.get(key);
        if (value !== undefined) {
            // Move to end (most recently used)
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return value;
    }

    set(key: K, value: V): void {
        // Delete if exists to re-add at end
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }

        this.cache.set(key, value);

        // Evict least recently used if size exceeded
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
    }

    clear(): void {
        this.cache.clear();
    }

    get size(): number {
        return this.cache.size;
    }
}

export function hashRenderOptions(options: any): string {
    // Simple deterministic hash for cache key
    return JSON.stringify({
        code: options.code,
        format: options.format,
        quality: options.quality,
        ppi: options.ppi,
        scale: options.scale,
        snippet: options.snippet,
        variables: options.variables,
        backgroundColor: options.backgroundColor,
        preamble: options.preamble
    });
}
