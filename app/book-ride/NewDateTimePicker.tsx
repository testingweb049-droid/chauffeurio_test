"use client"

import { useRef, useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns"
import { ChevronRight, TimerIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import useFormStore, { FormDataType } from "@/stores/FormStore"

interface DateTimePickerProps {
  selectedDate: string
  selectedTime: string
  placeholder: string
  setFormData: (
    key: keyof FormDataType,
    value: string | number | boolean,
    coardinates?: string,
    index?: number
  ) => void
  dateFieldName: keyof FormDataType
  timeFieldName: keyof FormDataType
  minSelectableDate?: Date | null
  isDisable?: boolean
}

export default function NewDateTimePicker({
  selectedDate,
  selectedTime,
  setFormData,
  dateFieldName,
  timeFieldName,
  minSelectableDate,
  placeholder,
  isDisable,
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [open, setOpen] = useState(false)
  const { formData } = useFormStore()
  const timeInputRef = useRef<HTMLInputElement | null>(null)

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Calendar days generator
  const getCalendarDays = () => {
    const startOfCurrentMonth = startOfMonth(currentMonth)
    const startDayOfWeek = (getDay(startOfCurrentMonth) + 6) % 7

    const startDate = new Date(startOfCurrentMonth)
    startDate.setDate(startOfCurrentMonth.getDate() - startDayOfWeek)

    const days = eachDayOfInterval({
      start: startDate,
      end: new Date(startDate.getTime() + 41 * 24 * 60 * 60 * 1000),
    })

    return days
  }

  const handleDateSelect = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd")
    setFormData(dateFieldName, formatted)
    setTimeout(() => {
      timeInputRef.current?.focus()
      timeInputRef.current?.showPicker?.()
    }, 100)
  }

  const handleTimeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(timeFieldName, e.target.value)
  }

  const handleTimeInputClick = () => {
    timeInputRef.current?.showPicker?.()
  }

  const isError =
    (!Array.isArray(formData[dateFieldName]) && formData[dateFieldName].error) ||
    (!Array.isArray(formData[timeFieldName]) && formData[timeFieldName].error)

  return (
    <div className="relative w-full">
      {/* Input field */}
      <div
        className={cn(
          "p-2 rounded-md w-full border text-sm flex items-center gap-2 md:gap-5 bg-white",
          isError ? "border-red-500" : "border-gray-300"
        )}
      >
        <TimerIcon color="gray" />
        <input
          type="text"
          readOnly
          value={
            selectedDate || selectedTime
              ? `${selectedDate ? format(new Date(selectedDate), "EEE, dd MMM yyyy") : ""} ${selectedTime ? selectedTime : ""
              }`
              : ""
          }
          onClick={() => {
            if (isDisable) return
            setOpen((prev) => !prev)
          }}
          className={cn(
            "w-full focus:outline-none bg-transparent border-transparent",
            selectedDate || selectedTime ? "text-primary" : "text-gray-500 placeholder:text-primary/60"
          )}
          placeholder={placeholder}
        />
      </div>

      {/* Calendar popup */}
      {open && (
        <div className="absolute top-full left-0 mt-2 z-30 bg-white text-primary rounded-xl shadow-2xl border border-gray-200 p-3 w-full max-w-72 md:max-w-80">
          {/* Header */}
          <div className="flex items-center justify-between text-sm mb-2">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="h-4 w-4 rotate-180 text-primary" />
            </button>
            <span className="font-medium">{format(currentMonth, "MMMM yyyy")}</span>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="h-4 w-4 text-primary" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-xs mb-1 text-primary/70">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 text-center text-sm gap-1">
            {getCalendarDays().map((date, idx) => {
              const inactive = date.getMonth() !== currentMonth.getMonth()
              const today = startOfDay(new Date())
              const disabled =
                (minSelectableDate && isBefore(date, startOfDay(minSelectableDate))) ||
                !isBefore(today, date)
              const isSelected = selectedDate && isSameDay(date, new Date(selectedDate))

              return (
                <div
                  key={idx}
                  onClick={() => !disabled && handleDateSelect(date)}
                  className={cn(
                    "py-1 rounded-lg cursor-pointer transition-all",
                    disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : inactive
                        ? "text-gray-400"
                        : "hover:bg-primary/10 hover:text-primary",
                    isSelected ? "bg-primary/10 text-primary font-semibold" : ""
                  )}
                >
                  {date.getDate()}
                </div>
              )
            })}
          </div>

          {/* Time selector - Cross-browser compatible */}
          {!Array.isArray(formData[dateFieldName]) && formData[dateFieldName].value && (
            <div className="mt-3 md:mt-4 flex items-center justify-between gap-10">
              <div className="font-semibold text-[#FFB400]">Time</div>
              <div
                className="relative w-full max-w-32 cursor-pointer"
                onClick={handleTimeInputClick}
              >
                <input
                  type="time"
                  ref={timeInputRef}
                  className={cn(
                    "w-full rounded-lg  bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer w-[90%] py-1",
                    selectedTime ? "text-primary font-semibold" : "text-transparent"
                  )}
                  value={selectedTime || ""}
                  onChange={handleTimeSelect}
                  style={{
                    colorScheme: 'light',
                  }}
                />
                {!selectedTime && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-3 pb-1">
                    <span className="text-primary text-sm ">Select time</span>
                    {/* <Clock className="h-4 w-4 text-primary/60" /> */}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Done button */}
          {!Array.isArray(formData[timeFieldName]) &&
            !Array.isArray(formData[dateFieldName]) &&
            formData[timeFieldName].value &&
            formData[dateFieldName].value && (
              <div className="mt-3 md:mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-medium py-2 rounded-lg transition-all"
              >
                ✓ Done
              </button>
              </div>
            )}
        </div>
      )}
    </div>
  )
}