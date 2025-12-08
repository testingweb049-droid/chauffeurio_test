"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import useFormStore, { FormDataType } from "@/stores/FormStore"
import { LucideProps } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/component/ui/popover"
import { ScrollArea } from "@/component/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/component/ui/command"

interface DropdownOption {
  label: string
  value: string
}

interface CustomDropdownProps {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
  fieldName: keyof FormDataType
  placeholder: string
  options: DropdownOption[]
}

export default function NewDropdownInput({
  Icon,
  fieldName,
  placeholder,
  options,
}: CustomDropdownProps) {
  const { formData, setFormData } = useFormStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const value =
    !Array.isArray(formData[fieldName]) && formData[fieldName].value
      ? String(formData[fieldName].value)
      : ""

  const error =
    !Array.isArray(formData[fieldName]) && formData[fieldName].error

  const filtered = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.value.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (val: string) => {
    setFormData(fieldName, val)
    setOpen(false)
  }

  useEffect(() => {
    setSearch("")
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full justify-between text-left p-2 rounded-md border text-sm flex items-center gap-2 bg-white text-primary",
            error ? "border-red-500" : "border-gray-300"
          )}
        >
          <Icon color="gray" className="shrink-0" />
          <span className="flex-1 truncate">
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 text-primary" />
        </button>
      </PopoverTrigger>

      {/* Dropdown Content */}
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border border-gray-200 rounded-md shadow-lg text-primary z-[9999]">
        <Command shouldFilter={false}>
          {/* Search Input */}
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
            className="text-primary placeholder:text-primary/60"
          />
          <CommandEmpty className="text-primary/70 px-2 py-2">
            No results found.
          </CommandEmpty>

          <CommandGroup>
            <ScrollArea className="max-h-56 bg-white overflow-y-auto">
              <div className="py-1">
                {filtered.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={() => handleSelect(opt.value)}
                    className={cn(
                      "flex items-center justify-between px-2 py-2 cursor-pointer transition-colors",
                      "text-primary hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </div>
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
