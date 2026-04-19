
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  image,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  className,
}: HeroSectionProps) {
  return (
    <div className={cn("relative isolate py-12 lg:py-24", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {subtitle}
            </p>
            {description && (
              <p className="mt-4 text-base text-gray-500">
                {description}
              </p>
            )}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {primaryButtonText && (
                <Link to={primaryButtonLink || "#"}>
                  <Button size="lg" className="px-8">
                    {primaryButtonText}
                  </Button>
                </Link>
              )}
              {secondaryButtonText && (
                <Link to={secondaryButtonLink || "#"}>
                  <Button variant="outline" size="lg" className="px-8">
                    {secondaryButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {image && (
        <div className="mt-12 sm:mt-16 relative">
          <img
            src={image}
            alt="App screenshot"
            className="mx-auto rounded-xl shadow-xl ring-1 ring-gray-400/10 w-full max-w-4xl"
          />
        </div>
      )}
    </div>
  )
}
