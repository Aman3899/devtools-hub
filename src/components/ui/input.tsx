import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-border/70 bg-muted/10 px-2.5 py-1 text-sm transition-all duration-200 outline-none hover:bg-muted/30 hover:border-border placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/5 focus-visible:bg-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/5 dark:bg-input/10 dark:border-border/30 dark:hover:bg-input/20 dark:hover:border-border/50 dark:focus-visible:bg-background/5",
        className
      )}
      {...props}
    />
  )
}

export { Input }
