import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const trigger = ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => setValue(Math.round(obj.val)),
                });
            },
        });
        return () => trigger.kill();
    }, [target]);

    return <span ref={ref}>{value}{suffix}</span>;
}

function DonutChart({ percentage, color, label }: { percentage: number; color: string; label: string }) {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-[2s] ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{percentage}%</span>
                </div>
            </div>
            <span className="text-xs text-white/40 font-medium">{label}</span>
        </div>
    );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    return (
        <div className="space-y-3">
            {data.map((item, i) => (
                <div key={i}>
                    <div className="flex justify-between mb-1">
                        <span className="text-xs text-white/50">{item.label}</span>
                        <span className="text-xs font-bold text-white/60">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-[2s] ease-out"
                            style={{ width: `${item.value}%`, background: item.color }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function PerformanceDashboard() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.pd-header', { y: 30, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.pd-header', start: 'top 85%' },
            });
            gsap.fromTo('.pd-card', { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.15,
                scrollTrigger: { trigger: '.pd-cards', start: 'top 80%' },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-28 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a25 50%, #050510 100%)' }}
        >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pink-500/[0.03] rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="pd-header text-center mb-16" style={{ opacity: 0 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-300">Performance Analytics</span>
                    </div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-[-0.02em] leading-[0.95]">
                        Track Your<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Progress</span>
                    </h2>
                </div>

                {/* Dashboard Preview */}
                <div className="pd-cards grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {/* Donut Charts */}
                    <div className="pd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6" style={{ opacity: 0 }}>
                        <h3 className="text-sm font-bold text-white/60 mb-6">Score Overview</h3>
                        <div className="flex justify-around">
                            <DonutChart percentage={85} color="#8b5cf6" label="Aptitude" />
                            <DonutChart percentage={72} color="#10b981" label="DSA" />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="pd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6" style={{ opacity: 0 }}>
                        <h3 className="text-sm font-bold text-white/60 mb-6">Key Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Problems', value: 247, color: 'text-indigo-400' },
                                { label: 'Accuracy', value: 78, suffix: '%', color: 'text-emerald-400' },
                                { label: 'Streak', value: 14, suffix: 'd', color: 'text-amber-400' },
                                { label: 'Rank', value: 156, color: 'text-pink-400' },
                            ].map((stat, i) => (
                                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] text-center">
                                    <div className={`text-xl font-bold ${stat.color} mb-0.5`}>
                                        <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="pd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6" style={{ opacity: 0 }}>
                        <h3 className="text-sm font-bold text-white/60 mb-6">Interview Readiness</h3>
                        <BarChart data={[
                            { label: 'Technical Skills', value: 82, color: '#6366f1' },
                            { label: 'Communication', value: 75, color: '#8b5cf6' },
                            { label: 'Problem Solving', value: 88, color: '#ec4899' },
                            { label: 'System Design', value: 65, color: '#f59e0b' },
                        ]} />
                        <div className="mt-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <span className="text-xs font-semibold text-emerald-300">+12% this week</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
