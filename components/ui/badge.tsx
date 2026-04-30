import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#DBEAFE] text-[#2563EB]",
        teal: "bg-[#CCFBF1] text-[#14B8A6]",
        amber: "bg-[#FEF3C7] text-[#F59E0B]",
        green: "bg-[#DCFCE7] text-[#16A34A]",
        red: "bg-[#FEE2E2] text-[#EF4444]",
        purple: "bg-[#EDE9FE] text-[#7C3AED]",
        muted: "bg-[#F7F8FC] text-[#5C667A] border border-[#E7EAF1]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
