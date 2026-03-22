"use client";

import * as React from "react";

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button ref={ref} {...props}>
    {children}
  </button>
));
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="hidden">{children}</div>;
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
