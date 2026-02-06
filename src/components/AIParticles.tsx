import { useEffect, useRef } from 'react';

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

    let mouse = { x: -1000, y: -1000 };
    let tilt = { x: 0, y: 0 };
    let hasGyro = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      hasGyro = true;
      tilt.x = Math.max(-1, Math.min(1, e.gamma / 45));
      tilt.y = Math.max(-1, Math.min(1, e.beta / 45));
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    const particles: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number; originalVx: number; originalVy: number }[] = [];
    const isMobile = width < 768;
    // Reduced particle count for performance
    const particleCount = isMobile ? 15 : 40;

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

    let animationFrameId: number;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, index) => {
        let forceDirectionX = 0;
        let forceDirectionY = 0;
        let force = 0;

        if (hasGyro) {
          const gyroForce = 0.05;
          p.vx += tilt.x * gyroForce * 0.1;
          p.vy += tilt.y * gyroForce * 0.1;

          const maxSpeed = 2;
          if (p.vx > maxSpeed) p.vx = maxSpeed;
          if (p.vx < -maxSpeed) p.vx = -maxSpeed;
          if (p.vy > maxSpeed) p.vy = maxSpeed;
          if (p.vy < -maxSpeed) p.vy = -maxSpeed;
        } else {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            forceDirectionX = dx / distance;
            forceDirectionY = dy / distance;
            force = (maxDistance - distance) / maxDistance;
            p.vx += forceDirectionX * force * 2;
            p.vy += forceDirectionY * force * 2;
          } else {
            if (p.vx > p.originalVx) p.vx -= 0.05;
            if (p.vx < p.originalVx) p.vx += 0.05;
            if (p.vy > p.originalVy) p.vy -= 0.05;
            if (p.vy < p.originalVy) p.vy += 0.05;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 60, 0, ${p.alpha})`;
        ctx.fill();

        if (!isMobile) {
          // Connections optimization
          const connectionDist = 7000; // Squared distance

          for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];

            // AABB Check
            const dx = p.x - p2.x;
            if (dx > 100 || dx < -100) continue;

            const dy = p.y - p2.y;
            if (dy > 100 || dy < -100) continue;

            const dist2 = dx * dx + dy * dy;

            if (dist2 < connectionDist) {
              ctx.beginPath();
              // Linear fade calculation
              const opacity = 1 - dist2 / connectionDist;
              if (opacity > 0) {
                ctx.strokeStyle = `rgba(255, 60, 0, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50"
    />
  );
};

export default AIParticles;
