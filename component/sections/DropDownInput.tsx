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
  showLabel?: boolean // new optional prop to control label visibility
}

export default function NewDropdownInput({
  Icon,
  fieldName,
  placeholder,
  options,
  showLabel = true, // default true
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
    <div className="flex flex-col gap-1">
      {showLabel && (
        <label htmlFor={fieldName as string} className="text-sm font-bold">
          {placeholder}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full justify-between text-left p-2 rounded-md border text-sm flex items-center gap-2 bg-white text-black",
              error ? "border-red-500" : "border-gray-300"
            )}
          >
            <Icon color="gray" className="shrink-0" />
            <span className="flex-1 truncate">
              {value
                ? options.find((opt) => opt.value === value)?.label
                : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border border-gray-200 shadow-lg rounded-md z-[9999] !opacity-100 !bg-opacity-100 backdrop-blur-none text-primary"
          sideOffset={4}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={setSearch}
              className="text-primary placeholder:text-gray-400"
            />
            <CommandEmpty className="text-gray-400">No results found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="max-h-56 overflow-y-auto">
                <div className="py-1">
                  {filtered.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => handleSelect(opt.value)}
                      className="flex items-center justify-between px-2 py-2 cursor-pointer text-primary hover:bg-[#FFF4E5]"
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
    </div>
  )
}
