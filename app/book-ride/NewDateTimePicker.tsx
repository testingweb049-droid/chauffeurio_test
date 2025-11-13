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
import useFormStore, { FieldType, FormDataType } from "@/stores/FormStore"

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
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("24h")
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
      let hours24 = hour
      if (timeFormat === "12h") {
        hours24 = ampm === "PM" && hour < 12 ? hour + 12 : hour
        if (ampm === "AM" && hour === 12) hours24 = 0
      }

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
    if (timeFormat === "12h") {
      const ampm = hour >= 12 ? "PM" : "AM"
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } else {
      return `${hours}:${minutes}`
    }
  }

  const getHours = () => {
    if (timeFormat === "12h") {
      return Array.from({ length: 12 }, (_, i) => i + 1)
    } else {
      return Array.from({ length: 24 }, (_, i) => i)
    }
  }

  const handleHourSelect = (selectedHour: number) => {
    setHour(selectedHour)
    if (timeFormat === "12h") {
      if (selectedHour === 12) {
        setAmPm("PM")
      } else if (selectedHour >= 1 && selectedHour <= 11) {
        setAmPm("AM")
      }
    }
  }

  const dateFieldData = formData[dateFieldName] as FieldType<string>
  const timeFieldData = formData[timeFieldName] as FieldType<string>

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {/* DATE PICKER */}
        <div className="relative w-full">
          <div
            className={`bg-gray-100 rounded-lg px-4 py-3 border ${dateFieldData.error ? "border-red-500" : "border-gray-100"
              }`}
          >
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
              <Calendar
                size={16}
                className="text-gray-500 sm:w-[18px] sm:h-[18px]"
              />
              <div className="text-[13px] sm:text-[15px] text-gray-800 font-medium truncate">
                {selectedDate
                  ? format(new Date(selectedDate), "dd MMM yyyy")
                  : "Select date"}
              </div>
            </div>
          </div>

          {dateOpen && (
            <div
              className={cn(
                "absolute top-full mt-2 z-50 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-4",
                "max-w-[1200px]",
                "left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0"
              )}
            >


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
                    (minSelectableDate &&
                      isBefore(date, startOfDay(minSelectableDate))) ||
                    !isBefore(today, date)
                  const isSelected =
                    selectedDate && isSameDay(date, new Date(selectedDate))

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
        <div className="relative w-full">
          <div
            className={`bg-gray-100 rounded-lg px-4 py-3 border ${timeFieldData.error ? "border-red-500" : "border-gray-100"
              }`}
          >
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
              <Clock
                size={16}
                className="text-gray-500 sm:w-[18px] sm:h-[18px]"
              />
              <div className="text-[13px] sm:text-[15px] text-gray-800 font-medium truncate">
                {selectedTime
                  ? formatTimeDisplay(selectedTime)
                  : "Select time"}
              </div>
            </div>
          </div>

          {timeOpen && (
            <div
              className={cn(
                "absolute top-full mt-2 z-50 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-5",
                "w-full max-w-[320px]",
                "left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0"
              )}
            >
              {/* Time Format Tabs */}
              <div className="flex border border-gray-300 rounded-lg mb-4 sm:mb-5 overflow-hidden">
                <button
                  type="button"
                  className={cn(
                    "flex-1 py-2 text-xs sm:text-sm font-medium transition-colors",
                    timeFormat === "24h"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setTimeFormat("24h")}
                >
                  24 Hours
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex-1 py-2 text-xs sm:text-sm font-medium transition-colors",
                    timeFormat === "12h"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setTimeFormat("12h")}
                >
                  12 Hours
                </button>
              </div>

              {/* Time Columns */}
              <div
                className={cn(
                  "grid gap-2 sm:gap-3 mb-4 sm:mb-5",
                  timeFormat === "12h" ? "grid-cols-3" : "grid-cols-2"
                )}
              >
                {/* Hour Column */}
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 text-center">
                    Hour
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden max-h-40 sm:max-h-48 overflow-y-scroll scrollbar-hide">
                    {getHours().map((hourValue) => (
                      <button
                        key={hourValue}
                        type="button"
                        className={cn(
                          "w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0",
                          hour === hourValue
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => handleHourSelect(hourValue)}
                      >
                        {timeFormat === "24h"
                          ? hourValue.toString().padStart(2, "0")
                          : hourValue}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minute Column */}
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 text-center">
                    Minute
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden max-h-40 sm:max-h-48 overflow-y-scroll scrollbar-hide">
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
                {timeFormat === "12h" && (
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 text-center">
                      Period
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden scrollbar-hide">
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
                )}
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
