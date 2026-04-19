import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const roadmapSteps = [
    { phase: '01', title: 'Resume Analysis', desc: 'ML-powered extraction of your skills, experience, and career trajectory.', color: 'from-blue-500 to-indigo-500' },
    { phase: '02', title: 'Career Prediction', desc: 'AI predicts your best-fit roles with confidence scoring.', color: 'from-purple-500 to-violet-500' },
    { phase: '03', title: 'Salary Estimation', desc: 'Market-calibrated salary ranges based on your profile.', color: 'from-pink-500 to-rose-500' },
    { phase: '04', title: 'Learning Roadmap', desc: 'Personalized skill gap analysis and curated learning paths.', color: 'from-emerald-500 to-teal-500' },
];

export default function CareerNavigatorSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.cn-header', { y: 30, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.cn-header', start: 'top 85%' },
            });
            gsap.fromTo('.cn-step', { y: 40, opacity: 0, x: -20 }, {
                y: 0, opacity: 1, x: 0, duration: 0.6, stagger: 0.15,
                scrollTrigger: { trigger: '.cn-timeline', start: 'top 80%' },
            });
            gsap.fromTo('.cn-preview', { x: 60, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.cn-preview', start: 'top 80%' },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-28 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050510 0%, #080818 50%, #050510 100%)' }}
        >
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="cn-header text-center mb-16" style={{ opacity: 0 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">AI Career Navigator</span>
                    </div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-[-0.02em] leading-[0.95]">
                        Navigate Your<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Career Path
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Timeline / Roadmap */}
                    <div className="cn-timeline space-y-5">
                        {roadmapSteps.map((step, i) => (
                            <div key={i} className="cn-step flex gap-5 group" style={{ opacity: 0 }}>
                                {/* Timeline line */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xs font-bold shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                                        {step.phase}
                                    </div>
                                    {i < roadmapSteps.length - 1 && (
                                        <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent mt-2 min-h-[20px]" />
                                    )}
                                </div>
                                {/* Content */}
                                <div className="pb-5">
                                    <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                                    <p className="text-sm text-white/35 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}

                        <Link
                            to="/career-navigator"
                            className="inline-flex ml-[60px] px-7 py-3.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.03]"
                        >
                            Launch Navigator
                        </Link>
                    </div>

                    {/* ML Prediction Preview Card */}
                    <div className="cn-preview" style={{ opacity: 0 }}>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-3xl blur-2xl" />
                            <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                        </div>
                                        <span className="text-sm font-bold text-white/70">ML Career Prediction</span>
                                    </div>
                                </div>

                                {/* Predictions */}
                                <div className="p-6 space-y-4">
                                    {[
                                        { role: 'Senior Frontend Engineer', confidence: 94, salary: '$130K–$170K' },
                                        { role: 'Full-Stack Developer', confidence: 87, salary: '$120K–$155K' },
                                        { role: 'Tech Lead', confidence: 73, salary: '$150K–$200K' },
                                    ].map((pred, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-bold text-white/80">{pred.role}</span>
                                                <span className={`text-xs font-bold ${pred.confidence >= 90 ? 'text-emerald-400' : pred.confidence >= 80 ? 'text-blue-400' : 'text-amber-400'}`}>
                                                    {pred.confidence}% match
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-white/30">{pred.salary}</span>
                                                <div className="h-1.5 w-20 bg-white/[0.06] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${pred.confidence >= 90 ? 'bg-emerald-400' : pred.confidence >= 80 ? 'bg-blue-400' : 'bg-amber-400'}`}
                                                        style={{ width: `${pred.confidence}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Skills */}
                                    <div className="pt-3 border-t border-white/[0.04]">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-3 block">Top Skills to Develop</span>
                                        <div className="flex flex-wrap gap-2">
                                            {['System Design', 'TypeScript', 'AWS', 'GraphQL'].map((skill) => (
                                                <span key={skill} className="px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
