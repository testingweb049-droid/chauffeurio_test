"use client"

import { useRef, useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns"
import { ChevronRight, Calendar, Clock } from "lucide-react"
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
  const [dateOpen, setDateOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
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
    setDateOpen(false)
  }

  const handleTimeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(timeFieldName, e.target.value)
    setTimeOpen(false)
  }

  const formatTimeDisplay = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="w-full">
      {/* Date and Time Inputs - Separate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Date Picker */}
        <div className="relative">
          <div
            className={cn(
              "p-3 rounded-lg w-full border text-sm flex items-center gap-3 bg-white hover:border-gray-400 transition-colors border-gray-300",
              isDisable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={() => {
              if (isDisable) return
              setDateOpen((prev) => !prev)
              setTimeOpen(false)
            }}
          >
            <Calendar size={20} className="text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {selectedDate ? format(new Date(selectedDate), "EEE, dd MMM. yyyy") : "Select date"}
              </div>
            </div>
          </div>

          {/* Date Calendar Popup - Compact Height */}
          {dateOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 p-4 w-full min-w-[400px] max-h-96 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 rotate-180 text-gray-600" />
                </button>
                <span className="font-semibold text-lg">{format(currentMonth, "MMMM yyyy")}</span>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 text-center text-sm font-medium mb-2 text-gray-600">
                {daysOfWeek.map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days - Compact */}
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
                        "py-2 rounded-lg cursor-pointer transition-all border-2 border-transparent text-sm",
                        disabled
                          ? "text-gray-300 cursor-not-allowed"
                          : inactive
                            ? "text-gray-400"
                            : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 font-semibold hover:bg-blue-700"
                          : ""
                      )}
                    >
                      {date.getDate()}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Time Picker */}
        <div className="relative">
          <div
            className={cn(
              "p-3 rounded-lg w-full border text-sm flex items-center gap-3 bg-white hover:border-gray-400 transition-colors border-gray-300",
              isDisable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={() => {
              if (isDisable) return
              setTimeOpen((prev) => !prev)
              setDateOpen(false)
              setTimeout(() => {
                timeInputRef.current?.showPicker?.()
              }, 100)
            }}
          >
            <Clock size={20} className="text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {selectedTime ? formatTimeDisplay(selectedTime) : "Select time"}
              </div>
            </div>
          </div>

          {/* Time Input (Hidden but functional) */}
          <input
            type="time"
            ref={timeInputRef}
            className="absolute opacity-0 pointer-events-none d-none"
            value={selectedTime || ""}
            onChange={handleTimeSelect}
          />

          {/* Custom Time Picker Popup - Compact */}
          {/* {timeOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 p-4 w-full max-w-80 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {Array.from({ length: 24 * 4 }, (_, i) => {
                  const hour = Math.floor(i / 4)
                  const minute = (i % 4) * 15
                  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                  const displayTime = formatTimeDisplay(timeString)

                  return (
                    <div
                      key={timeString}
                      onClick={() => {
                        setFormData(timeFieldName, timeString)
                        setTimeOpen(false)
                      }}
                      className={cn(
                        "p-2 rounded-lg cursor-pointer transition-all text-center text-sm",
                        selectedTime === timeString
                          ? "bg-blue-600 text-white font-semibold"
                          : "hover:bg-gray-100"
                      )}
                    >
                      {displayTime}
                    </div>
                  )
                })}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}