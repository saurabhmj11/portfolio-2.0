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
    let tilt = { x: 0, y: 0 };
    let hasGyro = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      // Gamma: Left/Right tilt (-90 to 90)
      // Beta: Front/Back tilt (-180 to 180)
      hasGyro = true;
      // Normalize tile to range -1 to 1 approximately
      tilt.x = Math.max(-1, Math.min(1, e.gamma / 45));
      tilt.y = Math.max(-1, Math.min(1, e.beta / 45));
    };

    // Only add listener if supported
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

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

      particles.forEach((p, index) => {
        // Interaction Logic
        let forceDirectionX = 0;
        let forceDirectionY = 0;
        let force = 0;

        if (hasGyro) {
          // Gyro Interaction: Global drift based on tilt
          // We adding a velocity bias to all particles based on tilt
          const gyroForce = 0.05; // Strength of gravity
          p.vx += tilt.x * gyroForce * 0.1;
          p.vy += tilt.y * gyroForce * 0.1;

          // Cap velocity so they don't fly off too fast
          const maxSpeed = 2;
          if (p.vx > maxSpeed) p.vx = maxSpeed;
          if (p.vx < -maxSpeed) p.vx = -maxSpeed;
          if (p.vy > maxSpeed) p.vy = maxSpeed;
          if (p.vy < -maxSpeed) p.vy = -maxSpeed;

        } else {
          // Mouse Interaction (Desktop)
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            forceDirectionX = dx / distance;
            forceDirectionY = dy / distance;
            force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * 2;
            const directionY = forceDirectionY * force * 2;

            p.vx += directionX;
            p.vy += directionY;
          } else {
            // Return to original speed
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
        ctx.fillStyle = `rgba(255, 60, 0, ${p.alpha})`; // Red/Orange "Ember" look
        ctx.shadowBlur = 15;
        ctx.shadowColor = "red";
        ctx.fill();

        // Neural Connect: Draw lines between nearby particles
        for (let j = index; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 60, 0, ${1 - dist2 / 100})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
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
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
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
