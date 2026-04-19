
import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  descriptionClassName?: string;
  titleClassName?: string;
  centered?: boolean;
}

export function Heading({
  title,
  description,
  className,
  descriptionClassName,
  titleClassName,
  centered = false,
  ...props
}: HeadingProps) {
  return (
    <div
      className={cn(
        "mb-6", 
        centered && "text-center",
        className
      )}
      {...props}
    >
      <h2 className={cn("text-3xl font-bold tracking-tight text-slate-900 dark:text-white", titleClassName)}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-2 text-muted-foreground",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
