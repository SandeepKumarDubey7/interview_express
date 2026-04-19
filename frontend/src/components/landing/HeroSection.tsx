import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Particle Canvas ---------- */
function drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const count = 80;
    for (let i = 0; i < count; i++) {
        const seed = i * 1337.1;
        const x = ((seed * 0.6847) % 1) * w;
        const baseY = ((seed * 0.3571) % 1) * h;
        const y = baseY + Math.sin(t * 0.0008 + i) * 30;
        const r = 1 + ((seed * 0.123) % 1) * 2;
        const alpha = 0.15 + ((seed * 0.891) % 1) * 0.25;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.fill();
    }
}

/* ---------- Connection Lines ---------- */
function drawConnections(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const points: [number, number][] = [];
    for (let i = 0; i < 20; i++) {
        const seed = i * 2341.7;
        const x = ((seed * 0.4847) % 1) * w;
        const y = ((seed * 0.7571) % 1) * h + Math.sin(t * 0.001 + i * 0.5) * 20;
        points.push([x, y]);
    }
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i][0] - points[j][0];
            const dy = points[i][1] - points[j][1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 250) {
                ctx.beginPath();
                ctx.moveTo(points[i][0], points[i][1]);
                ctx.lineTo(points[j][0], points[j][1]);
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 250)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

/* ---------- Ambient Orbs ---------- */
function drawOrbs(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, progress: number) {
    const orbs = [
        { cx: 0.3, cy: 0.4, r: 200, color: [99, 102, 241] },
        { cx: 0.7, cy: 0.6, r: 180, color: [139, 92, 246] },
        { cx: 0.5, cy: 0.3, r: 150, color: [236, 72, 153] },
    ];
    orbs.forEach((orb, i) => {
        const x = orb.cx * w + Math.sin(t * 0.0005 + i * 2) * 60;
        const y = orb.cy * h + Math.cos(t * 0.0004 + i * 3) * 40;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, orb.r + progress * 50);
        grad.addColorStop(0, `rgba(${orb.color.join(',')}, ${0.15 + progress * 0.05})`);
        grad.addColorStop(1, `rgba(${orb.color.join(',')}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    });
}

export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ambientCanvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);

    /* ---------- Canvas Animation Loop ---------- */
    useEffect(() => {
        const fg = canvasRef.current;
        const bg = ambientCanvasRef.current;
        if (!fg || !bg) return;
        const fgCtx = fg.getContext('2d')!;
        const bgCtx = bg.getContext('2d')!;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = fg.getBoundingClientRect();
            fg.width = rect.width * dpr;
            fg.height = rect.height * dpr;
            bg.width = rect.width * dpr;
            bg.height = rect.height * dpr;
            fgCtx.scale(dpr, dpr);
            bgCtx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener('resize', resize);

        let rafId: number;
        const animate = (t: number) => {
            const w = fg.getBoundingClientRect().width;
            const h = fg.getBoundingClientRect().height;
            const p = progressRef.current;

            // Clear
            fgCtx.clearRect(0, 0, w, h);
            bgCtx.clearRect(0, 0, w, h);

            // Background canvas — zoomed & blurred via CSS
            drawOrbs(bgCtx, w, h, t, p);

            // Foreground canvas
            drawOrbs(fgCtx, w, h, t, p);
            drawConnections(fgCtx, w, h, t);
            drawParticles(fgCtx, w, h, t);

            rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    /* ---------- GSAP ScrollTrigger ---------- */
    useEffect(() => {
        if (!sectionRef.current || !contentRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                pin: false,
            },
        });

        tl.to(contentRef.current, {
            y: -120,
            opacity: 0,
            scale: 0.95,
            ease: 'none',
        });

        // Track scroll progress for canvas
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            onUpdate: (self) => {
                progressRef.current = self.progress;
            },
        });

        // Entrance animations
        const ctx = gsap.context(() => {
            gsap.fromTo('.hero-badge', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: 'power3.out' });
            gsap.fromTo('.hero-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.7, ease: 'power3.out' });
            gsap.fromTo('.hero-subtitle', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1, ease: 'power3.out' });
            gsap.fromTo('.hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: 'power3.out' });
            gsap.fromTo('.hero-trust', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 1.5, ease: 'power3.out' });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0a2e 40%, #0f0a1a 100%)' }}
        >
            {/* Ambient Canvas (zoomed, blurred backdrop) */}
            <canvas
                ref={ambientCanvasRef}
                id="ambient-canvas"
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'blur(60px)', transform: 'scale(1.3)', opacity: 0.6 }}
            />

            {/* Foreground Canvas (sharp) */}
            <canvas
                ref={canvasRef}
                id="career-canvas"
                className="absolute inset-0 w-full h-full"
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                }}
            />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                }}
            />

            {/* Content */}
            <div ref={contentRef} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                {/* Badge */}
                <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm mb-8" style={{ opacity: 0 }}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium text-purple-300 tracking-wide">AI-Powered Interview Preparation</span>
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>

                {/* Title */}
                <h1 className="hero-title font-display font-bold uppercase tracking-[-0.03em] leading-[0.9] mb-6" style={{ opacity: 0 }}>
                    <span className="block text-[clamp(2.5rem,8vw,6rem)] text-white">LAND YOUR</span>
                    <span className="block text-[clamp(3rem,10vw,7.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        DREAM JOB
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed font-light" style={{ opacity: 0 }}>
                    The all-in-one AI platform to build resumes, master DSA, ace aptitude tests,
                    and crush technical interviews with real-time feedback.
                </p>

                {/* CTA */}
                <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ opacity: 0 }}>
                    <Link
                        to="/practice/aptitude"
                        className="group relative px-8 py-4 rounded-full text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(139, 92, 246, 0.2)' }} />
                        <span className="relative flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Start Practicing
                        </span>
                    </Link>
                    <Link
                        to="/resume-builder"
                        className="px-8 py-4 rounded-full text-white/80 font-semibold text-base border border-white/15 hover:border-white/30 hover:bg-white/[0.06] backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Build Resume
                    </Link>
                </div>

                {/* Trust */}
                <div className="hero-trust flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-14 text-white/30 text-sm" style={{ opacity: 0 }}>
                    {['Free forever', 'No credit card', 'Instant access'].map((text, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">Scroll</span>
                <div className="w-5 h-9 border border-white/15 rounded-full flex justify-center">
                    <div className="w-1 h-2 bg-white/30 rounded-full mt-2 animate-bounce" />
                </div>
            </div>
        </section>
    );
}
