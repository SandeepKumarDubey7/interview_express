import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        ),
        title: 'AI Resume Builder',
        desc: 'Create ATS-friendly resumes with AI-powered suggestions and professional templates.',
        gradient: 'from-blue-500 to-cyan-400',
        link: '/resume-builder',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        ),
        title: 'Aptitude Practice',
        desc: 'Master quantitative, logical, and verbal reasoning with targeted practice sessions.',
        gradient: 'from-violet-500 to-purple-400',
        link: '/practice/aptitude',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        ),
        title: 'DSA Coding Arena',
        desc: 'Solve real coding challenges with a built-in editor, test cases, and live leaderboards.',
        gradient: 'from-emerald-500 to-teal-400',
        link: '/practice/dsa',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        ),
        title: 'AI Mock Interviews',
        desc: 'Simulate real interviews with AI-generated questions, voice interaction, and instant feedback.',
        gradient: 'from-orange-500 to-amber-400',
        link: '/practice/interview',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
        ),
        title: 'AI Career Navigator',
        desc: 'Upload your resume for ML-powered career predictions, salary estimates, and learning roadmaps.',
        gradient: 'from-blue-600 to-indigo-400',
        link: '/career-navigator',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        ),
        title: 'Performance Analytics',
        desc: 'Track your progress across all modules with visual dashboards and improvement insights.',
        gradient: 'from-pink-500 to-rose-400',
        link: '/dashboard',
    },
];

export default function PlatformOverview() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.po-eyebrow', { y: 20, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: '.po-eyebrow', start: 'top 85%' },
            });
            gsap.fromTo('.po-title', { y: 30, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.po-title', start: 'top 85%' },
            });
            gsap.fromTo('.po-card', { y: 50, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.1,
                scrollTrigger: { trigger: '.po-cards', start: 'top 80%' },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="features"
            ref={sectionRef}
            className="relative py-28 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a20 50%, #050510 100%)' }}
        >
            {/* Subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <div className="po-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6" style={{ opacity: 0 }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Platform Overview</span>
                    </div>
                    <h2 className="po-title font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-[-0.02em] leading-[0.95]" style={{ opacity: 0 }}>
                        Your Complete Interview<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Preparation Platform
                        </span>
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="po-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {features.map((f, i) => (
                        <Link
                            to={f.link}
                            key={i}
                            className="po-card group relative p-7 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-1"
                            style={{ opacity: 0 }}
                        >
                            {/* Hover glow */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 transition-all">
                                    {f.title}
                                </h3>
                                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-white/30 group-hover:text-indigo-400 transition-colors">
                                    <span>Explore</span>
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
