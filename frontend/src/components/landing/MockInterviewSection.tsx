import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    { icon: '🤖', title: 'AI-Generated Questions', desc: 'Dynamic questions tailored to your target role and experience level.' },
    { icon: '🎙️', title: 'Voice Interview Simulation', desc: 'Practice with natural voice interactions for a realistic experience.' },
    { icon: '⚡', title: 'Instant Feedback', desc: 'Get real-time scoring and improvement suggestions after each answer.' },
];

export default function MockInterviewSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.mi-left', { x: -50, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.mi-left', start: 'top 80%' },
            });
            gsap.fromTo('.mi-right', { x: 50, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.mi-right', start: 'top 80%' },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="interview"
            ref={sectionRef}
            className="relative py-28 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a20 50%, #050510 100%)' }}
        >
            {/* Glow */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-orange-500/[0.03] rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left — AI Avatar */}
                    <div className="mi-left order-2 lg:order-1" style={{ opacity: 0 }}>
                        <div className="relative max-w-md mx-auto">
                            {/* Glow ring */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent blur-3xl" />
                            </div>

                            {/* AI Avatar Card */}
                            <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-sm">
                                {/* Avatar */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-orange-500/30">
                                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        {/* Pulse rings */}
                                        <div className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-ping" style={{ animationDuration: '2s' }} />
                                        <div className="absolute -inset-3 rounded-full border border-orange-400/10 animate-ping" style={{ animationDuration: '3s' }} />
                                    </div>
                                </div>

                                {/* Interview simulation */}
                                <div className="space-y-3">
                                    <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400/70 mb-2 block">AI Interviewer</span>
                                        <p className="text-sm text-white/60 leading-relaxed">"Tell me about a time you optimized a complex algorithm. What was the approach?"</p>
                                    </div>
                                    <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/70 mb-2 block">Your Response</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-0.5">
                                                {[...Array(12)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 bg-indigo-400/60 rounded-full"
                                                        style={{ height: `${8 + Math.sin(i * 0.8) * 8 + Math.random() * 6}px` }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-indigo-400/50 ml-2">Recording...</span>
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="text-xs font-bold text-emerald-400">Score: 8.5/10</div>
                                            <div className="h-1.5 w-24 bg-white/[0.06] rounded-full overflow-hidden">
                                                <div className="h-full w-[85%] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Text */}
                    <div className="mi-right order-1 lg:order-2" style={{ opacity: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">AI Mock Interview</span>
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-[-0.02em] leading-[0.95] mb-6">
                            Practice With<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                                AI Interviewer
                            </span>
                        </h2>
                        <p className="text-white/40 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                            Simulate real interview scenarios with our AI-powered interviewer that adapts to your responses and provides actionable feedback.
                        </p>

                        {/* Feature list */}
                        <div className="space-y-4 mb-8">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white/80 mb-0.5">{f.title}</h4>
                                        <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/practice/interview"
                            className="inline-flex px-7 py-3.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-[1.03]"
                        >
                            Start Mock Interview
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
