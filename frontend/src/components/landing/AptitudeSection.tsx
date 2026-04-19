import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
    {
        title: 'Quantitative Aptitude',
        desc: 'Number systems, percentages, algebra, and probability.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        ),
        gradient: 'from-violet-500 to-purple-500',
        count: '150+',
    },
    {
        title: 'Logical Reasoning',
        desc: 'Patterns, sequences, puzzles, and analytical thinking.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        ),
        gradient: 'from-amber-500 to-orange-500',
        count: '120+',
    },
    {
        title: 'Verbal Ability',
        desc: 'Reading comprehension, vocabulary, and grammar.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
        ),
        gradient: 'from-emerald-500 to-teal-500',
        count: '100+',
    },
    {
        title: 'Data Interpretation',
        desc: 'Charts, tables, graphs, and data analysis.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
        ),
        gradient: 'from-blue-500 to-indigo-500',
        count: '80+',
    },
];

export default function AptitudeSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.apt-title', { y: 30, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.apt-title', start: 'top 85%' },
            });
            gsap.fromTo('.apt-card', { y: 40, opacity: 0, scale: 0.95 }, {
                y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12,
                scrollTrigger: { trigger: '.apt-cards', start: 'top 80%' },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="aptitude"
            ref={sectionRef}
            className="relative py-28 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #080818 0%, #0a0a25 50%, #080818 100%)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="apt-title" style={{ opacity: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Aptitude Practice</span>
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-[-0.02em] leading-[0.95]">
                            Master Every<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                                Aptitude Category
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Cards */}
                <div className="apt-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map((cat, i) => (
                        <Link
                            to="/practice/aptitude"
                            key={i}
                            className="apt-card group relative p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-2"
                            style={{ opacity: 0 }}
                        >
                            {/* Hover glow */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`} />
                            <div className="relative">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">{cat.title}</h3>
                                <p className="text-sm text-white/35 leading-relaxed mb-4">{cat.desc}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/20">{cat.count} Questions</span>
                                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.12] transition-colors">
                                        <svg className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
