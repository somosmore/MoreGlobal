import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#2A3A4A] text-white hover:bg-[#3A4D5E] shadow-lg hover:shadow-xl",
        secondary:
          "bg-white text-[#1a1a2e] border border-[#2A3A4A]/20 hover:bg-gray-50 hover:text-[#1a1a2e] shadow-sm hover:shadow-md",
        ghost:
          "text-[#2A3A4A] hover:bg-[#2A3A4A]/5",
        // CTA del sistema 2026: naranja sólido, pastilla y barrido de luz (.cta-shine)
        gold:
          "cta-shine rounded-full bg-orange text-white shadow-md shadow-orange/25 hover:bg-orange-dark hover:shadow-lg hover:shadow-orange/35 focus-visible:ring-orange",
        outline:
          "border-2 border-[#2A3A4A] text-[#2A3A4A] bg-transparent hover:bg-[#2A3A4A] hover:text-white",
      },
      size: {
        default: "h-11 px-6 py-2",
        // 44px: mínimo táctil accesible (antes 36px)
        sm: "min-h-[44px] px-5 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
