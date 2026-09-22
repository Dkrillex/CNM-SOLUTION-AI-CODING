import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const variants = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:-translate-y-0.5",
  outline:
    "border border-border bg-background hover:bg-accent hover:border-primary/40 hover:text-primary",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

const sizes = {
  default: "h-10 px-4 py-2",
  lg: "h-12 px-7",
  full: "h-10 px-4 py-2 w-full",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
  }
>(function Button(
  { className, variant = "default", size = "default", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-mono text-xs uppercase tracking-widest",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});
