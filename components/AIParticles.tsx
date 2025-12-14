import React, { useEffect, useRef } from 'react';

const AIParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    canvas.width = width;
    canvas.height = height;

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const particles: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number; originalVx: number; originalVy: number }[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      const vx = (Math.random() - 0.5) * 0.2;
      const vy = (Math.random() - 0.5) * 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: vx,
        vy: vy,
        originalVx: vx,
        originalVy: vy,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const render = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        // Mouse interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 2; // Strength
          const directionY = forceDirectionY * force * 2;

          p.vx += directionX;
          p.vy += directionY;
        } else {
          // Return to original speed (friction)
          if (p.vx > p.originalVx) p.vx -= 0.05;
          if (p.vx < p.originalVx) p.vx += 0.05;
          if (p.vy > p.originalVy) p.vy -= 0.05;
          if (p.vy < p.originalVy) p.vy += 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 60, 0, ${p.alpha})`; // Red/Orange "Ember" look
        ctx.shadowBlur = 15;
        ctx.shadowColor = "red";
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    const animate = render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50"
    />
  );
};

export default AIParticles;
