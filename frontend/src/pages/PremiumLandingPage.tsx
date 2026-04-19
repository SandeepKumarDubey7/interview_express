import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import PlatformOverview from '@/components/landing/PlatformOverview';
import ResumeBuilderSection from '@/components/landing/ResumeBuilderSection';
import AptitudeSection from '@/components/landing/AptitudeSection';
import DSAArenaSection from '@/components/landing/DSAArenaSection';
import MockInterviewSection from '@/components/landing/MockInterviewSection';
import PerformanceDashboard from '@/components/landing/PerformanceDashboard';
import CareerNavigatorSection from '@/components/landing/CareerNavigatorSection';
import LandingFooter from '@/components/landing/LandingFooter';

gsap.registerPlugin(ScrollTrigger);

export default function PremiumLandingPage() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return (
        <div className="bg-[#050510] text-white min-h-screen overflow-x-hidden">
            <LandingNavbar />
            <HeroSection />
            <PlatformOverview />
            <ResumeBuilderSection />
            <AptitudeSection />
            <DSAArenaSection />
            <MockInterviewSection />
            <PerformanceDashboard />
            <CareerNavigatorSection />
            <LandingFooter />
        </div>
    );
}
