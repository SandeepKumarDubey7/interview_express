import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ResumeBuilderSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.rb-text', { x: -60, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.rb-text', start: 'top 80%' },
            });
            gsap.fromTo('.rb-preview', { x: 60, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.rb-preview', start: 'top 80%' },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="resume"
            ref={sectionRef}
            className="relative py-28 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050510 0%, #080818 100%)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left — Text */}
                    <div className="rb-text" style={{ opacity: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Resume Builder</span>
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-[-0.02em] leading-[0.95] mb-6">
                            Build Professional<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                Resumes in Minutes
                            </span>
                        </h2>
                        <p className="text-white/40 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                            Create ATS-friendly resumes using professional templates and AI-powered suggestions.
                            Stand out from the crowd with pixel-perfect formatting.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/resume-builder"
                                className="px-7 py-3.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                            >
                                Create Resume
                            </Link>
                            <Link
                                to="/resume-builder"
                                className="px-7 py-3.5 rounded-full text-white/70 font-semibold text-sm border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300"
                            >
                                Upload Resume
                            </Link>
                        </div>
                    </div>

                    {/* Right — Resume Preview Mockup */}
                    <div className="rb-preview relative" style={{ opacity: 0 }}>
                        <div className="relative mx-auto max-w-md">
                            {/* Glow behind */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent rounded-3xl blur-2xl" />

                            {/* Resume card */}
                            <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">JD</div>
                                    <div>
                                        <div className="h-4 w-36 bg-white/20 rounded mb-2" />
                                        <div className="h-3 w-48 bg-white/10 rounded" />
                                    </div>
                                </div>

                                {/* Sections */}
                                {['Experience', 'Education', 'Skills'].map((section, i) => (
                                    <div key={section} className="mb-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${i === 0 ? 'from-blue-400 to-cyan-400' : i === 1 ? 'from-purple-400 to-pink-400' : 'from-emerald-400 to-teal-400'
                                                }`} />
                                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">{section}</span>
                                        </div>
                                        <div className="space-y-2 pl-4">
                                            <div className="h-3 bg-white/[0.06] rounded w-full" />
                                            <div className="h-3 bg-white/[0.06] rounded w-4/5" />
                                            {i === 0 && <div className="h-3 bg-white/[0.06] rounded w-3/5" />}
                                        </div>
                                    </div>
                                ))}

                                {/* AI Badge */}
                                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-xs font-semibold text-emerald-300">ATS Score: 92/100</span>
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
