import type { ComponentProps } from "react";

import cn from "@/lib/utils";

type ContainerProps = ComponentProps<"div"> & {
  size?: "default" | "narrow"; // narrow = forms and long text
};

export function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-10",
        size === "narrow" ? "max-w-3xl" : "max-w-7xl",
        className,
      )}
      {...props}
    />
  );
}