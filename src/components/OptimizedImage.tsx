import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    /** Width hint for Unsplash optimization (default: 800) */
    width?: number;
    /** Quality hint for Unsplash optimization (default: 75) */
    quality?: number;
    /** CSS class for the wrapper container */
    wrapperClassName?: string;
    /**
     * Above-the-fold / LCP image: load immediately with high priority instead of
     * waiting for the IntersectionObserver and native lazy loading.
     */
    priority?: boolean;
    /** Called once the image has loaded (e.g. to refresh ScrollTrigger positions). */
    onLoaded?: () => void;
}

/**
 * Performance-optimized image component:
 * - Native lazy loading + async decoding
 * - Intersection Observer for early load trigger (200px margin)
 * - Unsplash URL auto-optimization (appends w= and q= params)
 * - Smooth fade-in on load (opacity transition)
 * - Blur placeholder while loading
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width = 800,
    quality = 75,
    wrapperClassName = '',
    className = '',
    priority = false,
    onLoaded,
    ...rest
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [shouldRender, setShouldRender] = useState(priority);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Optimize Unsplash URLs by appending size/quality params
    const optimizedSrc = React.useMemo(() => {
        if (src.includes('images.unsplash.com')) {
            const url = new URL(src, window.location.origin);
            url.searchParams.set('w', String(width));
            url.searchParams.set('q', String(quality));
            url.searchParams.set('auto', 'format');
            url.searchParams.set('fit', 'crop');
            return url.toString();
        }
        return src;
    }, [src, width, quality]);

    // IntersectionObserver to start loading when within 200px of viewport
    useEffect(() => {
        if (priority || !sentinelRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldRender(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [priority]);

    return (
        <div
            ref={sentinelRef}
            className={`relative overflow-hidden ${wrapperClassName}`}
        >
            {/* Blur placeholder background */}
            <div
                className="absolute inset-0 bg-[#111] transition-opacity duration-700"
                style={{ opacity: isLoaded ? 0 : 1 }}
            />

            {shouldRender && !failed && (
                <img
                    {...rest}
                    src={optimizedSrc}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding={priority ? 'sync' : 'async'}
                    // React 18 warns on camelCase fetchPriority; pass the DOM attribute.
                    {...(priority ? { fetchpriority: 'high' } : {})}
                    onLoad={() => { setIsLoaded(true); onLoaded?.(); }}
                    onError={() => { setFailed(true); onLoaded?.(); }}
                    className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
