"use client"

import { useState } from "react"
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
  const [hour, setHour] = useState<number | null>(null)
  const [minute, setMinute] = useState<number | null>(null)
  const [ampm, setAmPm] = useState<"AM" | "PM">("AM")
  const { formData } = useFormStore()

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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

  const handleSaveTime = () => {
    if (hour !== null && minute !== null) {
      let hours24 = ampm === "PM" && hour < 12 ? hour + 12 : hour
      if (ampm === "AM" && hour === 12) hours24 = 0
      const timeStr = `${hours24.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
      setFormData(timeFieldName, timeStr)
      setTimeOpen(false)
    }
  }

  const formatTimeDisplay = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {/* DATE PICKER */}
        <div className="relative bg-gray-100 rounded-lg px-4 py-3">
          <label className="block text-[11px] sm:text-[13px] font-medium text-gray-600 mb-1">
            Pickup date
          </label>

          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer bg-transparent",
              isDisable ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={() => {
              if (isDisable) return
              setDateOpen((prev) => !prev)
              setTimeOpen(false)
            }}
          >
            <Calendar size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" />
            <div className="text-[13px] sm:text-[15px] text-gray-800 font-medium truncate">
              {selectedDate
                ? format(new Date(selectedDate), "dd MMM yyyy")
                : "Select date"}
            </div>
          </div>

          {dateOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-4 w-[280px] sm:w-[400px] max-h-96 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 rotate-180 text-gray-600" />
                </button>
                <span className="font-semibold text-base sm:text-lg">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium mb-2 text-gray-600">
                {daysOfWeek.map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

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
                        "py-1.5 sm:py-2 rounded-lg cursor-pointer transition-all border-2 border-transparent text-xs sm:text-sm",
                        disabled
                          ? "text-gray-300 cursor-not-allowed"
                          : inactive
                            ? "text-gray-400"
                            : "hover:bg-primary/10 hover:text-primary",
                        isSelected
                          ? "bg-primary text-white border-primary font-semibold hover:bg-primary/90"
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

        {/* TIME PICKER */}
        <div className="relative bg-gray-100 rounded-lg px-4 py-3">
          <label className="block text-[11px] sm:text-[13px] font-medium text-gray-600 mb-1">
            Pickup time
          </label>

          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer bg-transparent",
              isDisable ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={() => {
              if (isDisable) return
              setTimeOpen((prev) => !prev)
              setDateOpen(false)
            }}
          >
            <Clock size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" />
            <div className="text-[13px] sm:text-[15px] text-gray-800 font-medium truncate">
              {selectedTime ? formatTimeDisplay(selectedTime) : "Select time"}
            </div>
          </div>

          {/* Custom Time Picker Popup - RESPONSIVE */}
          {timeOpen && (
            <div className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto mt-2 z-50 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-5 w-full sm:min-w-[320px]">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 text-center">
                Select Time
              </h3>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
                {/* Hour Column */}
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 text-center">
                    Hour
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden max-h-40 sm:max-h-48 overflow-y-auto">
                    {[...Array(12)].map((_, i) => {
                      const hourValue = i + 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          className={cn(
                            "w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0",
                            hour === hourValue
                              ? "bg-primary text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          )}
                          onClick={() => setHour(hourValue)}
                        >
                          {hourValue}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minute Column */}
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 text-center">
                    Minute
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden max-h-40 sm:max-h-48 overflow-y-auto">
                    {[...Array(60)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={cn(
                          "w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0",
                          minute === i
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setMinute(i)}
                      >
                        {i.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM Column */}
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 text-center">
                    Period
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {["AM", "PM"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={cn(
                          "w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0",
                          ampm === val
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setAmPm(val as "AM" | "PM")}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveTime}
                  disabled={hour === null || minute === null}
                  className={cn(
                    "text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-all focus:ring-2 focus:ring-primary/30",
                    hour === null || minute === null
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  Save Time
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}