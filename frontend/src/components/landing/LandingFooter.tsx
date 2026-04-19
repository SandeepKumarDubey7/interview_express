import { Link } from 'react-router-dom';

const footerLinks = {
    Products: [
        { label: 'Resume Builder', href: '/resume-builder' },
        { label: 'Aptitude Practice', href: '/practice/aptitude' },
        { label: 'DSA Arena', href: '/practice/dsa' },
        { label: 'Mock Interview', href: '/practice/interview' },
        { label: 'Career Navigator', href: '/career-navigator' },
    ],
    Resources: [
        { label: 'Study Resources', href: '/resources' },
        { label: 'Documentation', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Changelog', href: '#' },
    ],
    Company: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '#' },
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
    ],
};

export default function LandingFooter() {
    return (
        <footer
            className="relative border-t border-white/[0.04]"
            style={{ background: 'linear-gradient(180deg, #050510 0%, #030308 100%)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <span className="text-white font-bold text-xs">IE</span>
                            </div>
                            <span className="font-display font-bold text-base text-white tracking-tight">
                                Interview<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Express</span>
                            </span>
                        </Link>
                        <p className="text-sm text-white/30 leading-relaxed mb-6 max-w-xs">
                            AI-powered platform to ace technical interviews, build professional resumes, and land your dream job.
                        </p>
                        {/* Social */}
                        <div className="flex items-center gap-3">
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            <a href="mailto:contact@interviewexpress.com" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">{title}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-white/30 hover:text-white/70 transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-white/20">© 2026 Interview Express. All rights reserved.</span>
                    <div className="flex items-center gap-6">
                        <Link to="#" className="text-xs text-white/20 hover:text-white/50 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="text-xs text-white/20 hover:text-white/50 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
