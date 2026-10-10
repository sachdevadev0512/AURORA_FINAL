"use client";

import React, { useRef, useEffect } from "react";

const ParticleSphereAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: { theta: number; phi: number; size: number; speed: number; isGold: boolean }[] = [];
    const numParticles = 280;
    const radius = 0.35;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(2 * Math.random() - 1),
        size: Math.random() * 1.4 + 0.6,
        speed: (Math.random() - 0.5) * 0.0018,
        isGold: Math.random() > 0.75, // 25% subtle gold particles, 75% navy/blue particles
      });
    }

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let rotation = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || canvas.width;
      const height = parent?.clientHeight || canvas.height;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * radius;

      rotation += 0.0035;

      particles.forEach((p) => {
        p.theta += p.speed;

        const x = r * Math.sin(p.phi) * Math.cos(p.theta + rotation);
        const y = r * Math.cos(p.phi);
        const z = r * Math.sin(p.phi) * Math.sin(p.theta + rotation);

        const scale = (z + r) / (2 * r);
        const alpha = Math.max(0.12, Math.min(0.85, 0.15 + scale * 0.65));
        const size = p.size * (0.5 + scale * 0.5);

        ctx.beginPath();
        ctx.arc(cx + x, cy + y, size, 0, Math.PI * 2);
        if (p.isGold) {
          ctx.fillStyle = `rgba(212, 167, 55, ${alpha * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(30, 58, 102, ${alpha * 0.75})`;
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default ParticleSphereAnimation;
