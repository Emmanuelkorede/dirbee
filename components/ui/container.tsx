import type { ComponentProps } from "react";

import cn from "@/lib/utils";

const sizes = {
  default: "max-w-7xl",
  medium: "max-w-5xl",
  narrow: "max-w-3xl",
};

type ContainerProps = ComponentProps<"div"> & { size?: keyof typeof sizes };

export function Container({ size = "default", className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-6 sm:px-10", sizes[size], className)} {...props} />;
}