import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const codeSnippet = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

const leaderboard = [
    { rank: 1, name: 'Alex Chen', score: 2847, badge: '🏆' },
    { rank: 2, name: 'Priya Sharma', score: 2691, badge: '🥈' },
    { rank: 3, name: 'James Wilson', score: 2534, badge: '🥉' },
    { rank: 4, name: 'Sofia Martinez', score: 2410, badge: '' },
    { rank: 5, name: 'You', score: 2389, badge: '⭐' },
];

export default function DSAArenaSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.dsa-header', { y: 30, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.dsa-header', start: 'top 85%' },
            });
            gsap.fromTo('.dsa-editor', { x: -50, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.dsa-editor', start: 'top 80%' },
            });
            gsap.fromTo('.dsa-sidebar', { x: 50, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.8, delay: 0.2, scrollTrigger: { trigger: '.dsa-sidebar', start: 'top 80%' },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="dsa"
            ref={sectionRef}
            className="relative py-28 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #080818 0%, #050510 100%)' }}
        >
            {/* Subtle glow */}
            <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="dsa-header text-center mb-16" style={{ opacity: 0 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">DSA Coding Arena</span>
                    </div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-[-0.02em] leading-[0.95]">
                        Crack Coding<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Interviews</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Code Editor Preview */}
                    <div className="dsa-editor lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden" style={{ opacity: 0 }}>
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-white/30 font-mono">solution.js</span>
                                <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="text-[10px] font-bold text-emerald-400">MEDIUM</span>
                                </div>
                            </div>
                        </div>
                        {/* Problem title */}
                        <div className="px-5 py-3 border-b border-white/[0.04]">
                            <span className="text-sm font-bold text-white/80">1. Two Sum</span>
                            <span className="text-xs text-white/30 ml-3">Array · Hash Table</span>
                        </div>
                        {/* Code */}
                        <div className="p-5 font-mono text-sm">
                            {codeSnippet.split('\n').map((line, i) => (
                                <div key={i} className="flex">
                                    <span className="w-8 text-right mr-4 text-white/15 select-none text-xs leading-6">{i + 1}</span>
                                    <span className="text-white/60 leading-6 whitespace-pre">
                                        {line
                                            .replace(/(function|const|for|let|if|return|new)/g, '<kw>$1</kw>')
                                            .split(/<kw>(.*?)<\/kw>/)
                                            .map((part, j) =>
                                                j % 2 === 1 ? (
                                                    <span key={j} className="text-purple-400">{part}</span>
                                                ) : (
                                                    <span key={j}>{part}</span>
                                                )
                                            )}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Status bar */}
                        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04] bg-white/[0.01]">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs text-emerald-400">All test cases passed</span>
                            </div>
                            <span className="text-xs text-white/20">Runtime: 4ms · Memory: 42.1 MB</span>
                        </div>
                    </div>

                    {/* Sidebar — Problem + Leaderboard */}
                    <div className="dsa-sidebar space-y-5" style={{ opacity: 0 }}>
                        {/* Leaderboard */}
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/[0.06]">
                                <span className="text-sm font-bold text-white/80">🏆 Leaderboard</span>
                            </div>
                            <div className="p-3">
                                {leaderboard.map((entry) => (
                                    <div
                                        key={entry.rank}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${entry.name === 'You' ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/[0.03]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-white/25 w-4">{entry.rank}</span>
                                            <span className="text-sm text-white/70">{entry.badge} {entry.name}</span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-white/40">{entry.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/practice/dsa"
                                className="w-full py-3.5 rounded-xl text-center text-white font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02]"
                            >
                                Solve Problems
                            </Link>
                            <Link
                                to="/practice/dsa"
                                className="w-full py-3.5 rounded-xl text-center text-white/60 font-semibold text-sm border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all"
                            >
                                View Leaderboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
