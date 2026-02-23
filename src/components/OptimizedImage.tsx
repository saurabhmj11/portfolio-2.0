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
    ...rest
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Optimize Unsplash URLs by appending size/quality params
    const optimizedSrc = React.useMemo(() => {
        if (src.includes('images.unsplash.com')) {
            const url = new URL(src);
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
        if (!sentinelRef.current) return;
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
    }, []);

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

            {shouldRender && (
                <img
                    src={optimizedSrc}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                    {...rest}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
