/**
 * Navigation Menu — a horizontal site/app navigation with optional rich dropdown panels,
 * built on @radix-ui/react-navigation-menu.
 *
 * Cuándo usar: navegación principal de un sitio/marketing o app con secciones que despliegan
 * submenús ricos (con descripciones, columnas). Cuándo no: acciones (usar Menu/Dropdown);
 * navegación lateral de app (usar el app-shell sidebar); pestañas dentro de una página (usar Tabs).
 * Reemplaza a: navbars custom con menús desplegables hechos a mano.
 *
 * shadcn NavigationMenu structure, Embassy tokens. Triggers/links reuse the shared "blue hover"
 * menu language; the panel is the white Surface container. Canonical implementation.
 */
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import { cn } from "../lib/utils"

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
    {...props}
  />
))
NavigationMenuList.displayName = "NavigationMenuList"

export const NavigationMenuItem = NavigationMenuPrimitive.Item

export const navigationMenuTriggerStyle = cva(
  cn(
    "inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-body-md font-medium text-on-surface outline-none",
    "hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-hover-content)]",
    "focus:bg-[var(--color-nav-hover)] focus:text-[var(--color-nav-hover-content)] focus-visible:focus-ring",
    "data-[state=open]:bg-[var(--color-nav-hover)] data-[state=open]:text-[var(--color-nav-hover-content)]",
    "disabled:pointer-events-none disabled:opacity-50"
  )
)

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger ref={ref} className={cn(navigationMenuTriggerStyle(), "group", className)} {...props}>
    {children}
    <ChevronDown
      className="relative top-px ml-1 size-3.5 transition-transform duration-fast group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full p-2 md:absolute md:w-auto",
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
      "duration-fast ease-default",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = "NavigationMenuContent"

export const NavigationMenuLink = NavigationMenuPrimitive.Link

export const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm border border-border bg-surface-container" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName = "NavigationMenuIndicator"

export const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute left-0 top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      className={cn(
        "origin-top-center relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-border bg-surface-container text-on-surface shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 duration-fast md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = "NavigationMenuViewport"

export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = "NavigationMenu"
