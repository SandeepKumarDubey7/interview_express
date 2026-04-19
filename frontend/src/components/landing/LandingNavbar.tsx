import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function LandingNavbar() {
    const navRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Entrance animation
        if (navRef.current) {
            gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { label: 'Features', href: '#features' },
        { label: 'Resume', href: '#resume' },
        { label: 'Practice', href: '#aptitude' },
        { label: 'DSA Arena', href: '#dsa' },
        { label: 'Mock Interview', href: '#interview' },
    ];

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-[#0a0a1a]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/20'
                    : 'bg-transparent'
                }`}
            style={{ opacity: 0 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                            <span className="text-white font-bold text-sm">IE</span>
                        </div>
                        <span className="font-display font-bold text-lg text-white tracking-tight">
                            Interview<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Express</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-3.5 py-2 text-sm text-white/60 hover:text-white font-medium rounded-lg hover:bg-white/[0.06] transition-all duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm text-white/70 hover:text-white font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white"
                        aria-label="Toggle menu"
                    >
                        <span className={`w-5 h-0.5 bg-white rounded transition-all ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
                        <span className={`w-5 h-0.5 bg-white rounded transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-5 h-0.5 bg-white rounded transition-all ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 py-4 bg-[#0a0a1a]/95 backdrop-blur-2xl border-t border-white/[0.06] space-y-1">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all text-sm font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-3 flex flex-col gap-2">
                        <Link to="/login" className="px-4 py-3 text-center text-white/70 hover:text-white rounded-xl border border-white/10 text-sm font-medium">
                            Sign In
                        </Link>
                        <Link to="/register" className="px-4 py-3 text-center text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-sm">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
