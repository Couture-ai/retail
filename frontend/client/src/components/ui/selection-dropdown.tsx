import * as React from "react"
import { Check, ChevronDown, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"

export interface Option {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SelectionDropdownProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
  showSelectedIcon?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
}

export function SelectionDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className,
  buttonClassName,
  showSelectedIcon = true,
  showSearch = false,
  searchPlaceholder = "Search..."
}: SelectionDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  const selectedOption = React.useMemo(() => 
    options.find(option => option.value === value),
    [options, value]
  )
  
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    return options.filter(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-7 items-center rounded-md bg-transparent py-1 pl-2 pr-1 text-xs text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))/50] transition-colors duration-200 w-full",
            buttonClassName
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center min-w-0 flex-1 overflow-hidden space-x-1">
            {selectedOption?.icon && (
              <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                {selectedOption.icon}
              </span>
            )}
            <span className="truncate">{selectedOption?.label || placeholder}</span>
            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 flex-shrink-0 ml-0.5" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className={cn("w-48 p-1", className)}
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
                placeholder={searchPlaceholder}
                className="w-full bg-transparent border-none py-1.5 pl-7 pr-2 text-xs text-[hsl(var(--dark-1))] outline-none placeholder:text-[hsl(var(--dark-4))]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
        
        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                icon={option.icon && (
                  <span className="w-4 h-4 flex items-center justify-center">
                    {option.icon}
                  </span>
                )}
                className={cn(
                  value === option.value && "bg-[hsl(var(--primary))/10]"
                )}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                  setSearchQuery("")
                }}
              >
                <span className="truncate">{option.label}</span>
                {showSelectedIcon && value === option.value && (
                  <Check className="ml-auto h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-2 text-xs text-[hsl(var(--dark-3))] text-center italic">
              No results found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 