"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import useFormStore, { FormDataType } from "@/stores/FormStore"
import { LucideProps } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command"
import { ScrollArea } from "../ui/scroll-area"

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
    !Array.isArray(formData[fieldName]) && formData[fieldName]?.value
      ? String(formData[fieldName].value)
      : ""

  const error =
    !Array.isArray(formData[fieldName]) && formData[fieldName]?.error
  // Filtered options: remove "1 Hour" and add description
  const filtered = options
    .filter((opt) => {
      const num = parseFloat(opt.value)
      // Only integer values starting from 2
      return Number.isInteger(num) && num >= 2
    })
    .map((opt) => {
      const num = parseInt(opt.value)
      const km = num * 20
      const miles = Math.round(km * 0.621371) // km to miles
      return {
        ...opt,
        label: `${num} hours (includes up to ${km} km / ${miles} miles)`,
      }
    })


  // Default: select "2 Hours" if exists
  useEffect(() => {
    if (!value && options.length > 0) {
      const defaultOpt =
        options.find(
          (opt) =>
            opt.label.toLowerCase().includes("2 hour") ||
            opt.value === "2"
        ) || options[0]
      setFormData(fieldName, defaultOpt.value)
    }
  }, [value, options, fieldName, setFormData])

  const handleSelect = (val: string) => {
    setFormData(fieldName, val)
    setOpen(false)
  }

  useEffect(() => {
    setSearch("")
  }, [open])

  return (
    <div className="w-full rounded-lg bg-gray-100 px-4 py-2">
      {/* Label inside box like LocationInput */}
      <label className="block text-[13px] font-medium text-gray-600 mb-1">
        {placeholder}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-2 text-[15px] font-medium bg-transparent text-gray-800 rounded-lg py-1.5 focus:outline-none",
              error ? "text-red-600" : ""
            )}
          >
            <Icon className="text-gray-500" size={18} />
            <span className="flex-1 truncate text-left">
              {value
                ? options.find((opt) => opt.value === value)?.label
                : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </PopoverTrigger>

        {/* Dropdown list */}
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 bg-white border border-gray-200 shadow-xl rounded-xl z-9999"
          sideOffset={6}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={setSearch}
              className="border-b border-gray-100 px-3 py-2 text-[14px] text-gray-800 placeholder:text-gray-400 focus:ring-0"
            />
            <CommandEmpty className="text-gray-400 px-3 py-2">
              No results found.
            </CommandEmpty>
            <CommandGroup>
              <ScrollArea className="max-h-56 overflow-y-auto">
                <div className="py-1">
                  {filtered.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => handleSelect(opt.value)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-[14px] rounded-md transition-colors",
                        value === opt.value
                          ? "bg-primary text-white font-medium"
                          : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      <span>{opt.label}</span>
                      {value === opt.value && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </CommandItem>
                  ))}
                </div>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Optional error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{formData[fieldName]?.error}</p>
      )}
    </div>
  )
}