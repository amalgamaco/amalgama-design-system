/**
 * Toggle Group — a set of two-state buttons that share a single or multiple selection,
 * built on @radix-ui/react-toggle-group. The primitive layer under Segmented Button.
 *
 * Cuándo usar: agrupar varios Toggle relacionados (formato de texto: negrita/cursiva/subrayado;
 * alineación). type="single" = elegir 1; type="multiple" = varios on/off a la vez.
 * Cuándo no: elegir 1 de N mutuamente excluyentes con etiqueta de vista (usar Segmented Button,
 * que compone este primitivo con su propia forma); filtros tipo tag (usar Chip).
 * Reemplaza a: grupos de botones on/off ad-hoc.
 *
 * shadcn ToggleGroup structure, Embassy tokens. Items inherit variant/size from the group via
 * context (shadcn pattern) and reuse `toggleVariants` so every item matches a standalone Toggle.
 */
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import { toggleVariants } from "./toggle"

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({ variant: context.variant || variant, size: context.size || size }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
