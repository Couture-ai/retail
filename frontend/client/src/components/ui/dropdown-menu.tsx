import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle, MoreVertical, Search } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-sm px-2 py-1 text-xs outline-none transition-colors duration-200",
      "text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))/60] focus:bg-[hsl(var(--dark-7))] data-[state=open]:bg-[hsl(var(--dark-7))]",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-70" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#5a5a5f]/80 bg-[#1f2026] p-1 text-white shadow-lg backdrop-blur-sm",
      "shadow-[0_4px_14px_0px_rgba(0,0,0,0.3)]", 
      "animate-in fade-in-75 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#5a5a5f]/80 bg-[#1f2026] p-1.5 text-white shadow-md",
        "shadow-[0_4px_14px_0px_rgba(0,0,0,0.3)]",
        "animate-in fade-in-75 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
    icon?: React.ReactNode
  }
>(({ className, inset, icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-[4px] px-2 py-1.5 text-xs outline-none",
      "transition-all duration-200 ease-in-out",
      "text-[hsl(var(--dark-1))] hover:text-white hover:bg-[hsl(var(--primary))/15] focus:bg-[hsl(var(--primary))/10] focus:text-white",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {icon && (
      <span className="mr-1.5 h-3.5 w-3.5 flex items-center justify-center text-[hsl(var(--primary))/80]">
        {icon}
      </span>
    )}
    {children}
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs outline-none",
      "transition-colors duration-200",
      "hover:text-white hover:bg-[hsl(var(--primary))/15] focus:bg-[hsl(var(--primary))/10] focus:text-white",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs outline-none",
      "transition-colors duration-200",
      "hover:text-white hover:bg-[hsl(var(--primary))/15] focus:bg-[hsl(var(--primary))/10] focus:text-white",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-medium text-[hsl(var(--dark-2))]",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[#5a5a5f]/30", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-[10px] tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}


// --- Generic Dropdown Component Wrapper ---

interface MenuItem {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  action: () => void
  disabled?: boolean
}

interface GenericDropdownProps {
  trigger: React.ReactNode
  menuItems: MenuItem[]
  contentProps?: React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
  itemProps?: React.ComponentPropsWithoutRef<typeof DropdownMenuItem>
  side?: "top" | "right" | "bottom" | "left"
  showSearch?: boolean
}

const GenericDropdown: React.FC<GenericDropdownProps> = ({
  trigger,
  menuItems,
  contentProps,
  itemProps,
  side = "right",
  showSearch = false,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return menuItems
    
    return menuItems.filter(item => {
      const label = typeof item.label === 'string' 
        ? item.label.toLowerCase() 
        : '';
      return label.includes(searchQuery.toLowerCase())
    })
  }, [menuItems, searchQuery])
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        side={side}
        sideOffset={6}
        className="w-44 p-1"
        {...contentProps}
      >
        {showSearch && (
          <div className="px-1 pt-1 pb-2 sticky top-0">
            <div className="relative rounded-md overflow-hidden bg-[#18191f] ring-1 ring-[#3a3a45]/50 focus-within:ring-[hsl(var(--primary))/40] transition-all duration-200">
              <Search 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--dark-3))]" 
                size={11} 
                strokeWidth={2.5}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent border-none py-1.5 pl-7 pr-2 text-xs text-[hsl(var(--dark-1))] outline-none placeholder:text-[hsl(var(--dark-4))]"
              />
            </div>
            
            {searchQuery && (
              <DropdownMenuSeparator className="mt-2" />
            )}
          </div>
        )}
        
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <DropdownMenuItem
              key={item.id}
              icon={item.icon}
              onClick={item.action}
              disabled={item.disabled}
              {...itemProps}
            >
              {item.label}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-2 text-xs text-[hsl(var(--dark-3))] text-center italic">
            No results found
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { GenericDropdown }
