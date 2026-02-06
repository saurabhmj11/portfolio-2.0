import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Overlay from './Overlay';

const ScrollyCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Load images sequence if available (Logic for later)
    useEffect(() => {
        // In a real scenario with assets, we would preload frame_00 to frame_89 here
        // For now, we set loaded to true to trigger the procedural fallback
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Render loop
        const render = (progress: number) => {
            if (!ctx || !canvas) return;

            // Clear
            ctx.fillStyle = "#121212";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;

            // --- PROCEDURAL FALLBACK: 3D Data Grid ---
            // Perspective projection simulation
            const fov = 300;
            const spacing = 40;
            const numLines = 40;

            // Rotate and move based on scroll
            // Progress 0 -> 1 moves the camera through the grid
            const speed = progress * 2000;
            const rotation = progress * Math.PI * 0.5;

            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + progress * 0.2})`;
            ctx.lineWidth = 1;

            // Draw Floor Grid
            ctx.beginPath();
            for (let i = -numLines; i <= numLines; i++) {
                // Z movement
                let z = (i * spacing + speed) % (numLines * spacing);
                if (z < 10) z += numLines * spacing;

                // Simple projection for vertical lines (illusion of movement)
                const scale = fov / (fov + z);
                const x2d = cx + (i * spacing * 2) * scale;

                if (i === -numLines) ctx.moveTo(x2d, cy);
                else ctx.lineTo(x2d, cy + 2000 * scale); // Draw downwards
            }
            ctx.stroke();

            // Draw Particles/Nodes
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                // Deterministic random based on index
                const rx = Math.sin(i * 132.1) * w;
                const ry = Math.cos(i * 12.3) * h;
                const rz = (Math.sin(i * 44.2) * 2000 + speed * 2) % 2000;

                if (rz < 10) continue;

                const pScale = fov / (fov + rz);
                const px = cx + rx * pScale * Math.cos(rotation) - ry * pScale * Math.sin(rotation);
                const py = cy + rx * pScale * Math.sin(rotation) + ry * pScale * Math.cos(rotation);

                if (px > 0 && px < w && py > 0 && py < h) {
                    ctx.fillStyle = `rgba(100, 200, 255, ${1 - rz / 2000})`;
                    ctx.beginPath();
                    ctx.arc(px, py, 2 * (1 + pScale * 2), 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };

        // Initial Render
        render(scrollYProgress.get());

        // Subscribe to scroll changes to re-render
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            requestAnimationFrame(() => render(latest));
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubscribe();
        };
    }, [scrollYProgress, isLoaded]);

    return (
        <div ref={containerRef} className="relative w-full h-[500vh] bg-[#121212]">
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="block w-full h-full object-cover absolute inset-0"
                />
                <Overlay containerRef={containerRef} />
            </div>
        </div>
    );
};

export default ScrollyCanvas;
