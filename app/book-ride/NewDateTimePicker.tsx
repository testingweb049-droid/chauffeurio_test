"use client"

import { useState, useEffect, useRef } from "react"
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
import { ChevronRight, Calendar, Clock, ChevronUp, ChevronDown, X } from "lucide-react"
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
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h")
  const { formData } = useFormStore()
  
  const hourScrollRef = useRef<HTMLDivElement>(null)
  const minuteScrollRef = useRef<HTMLDivElement>(null)
  const ampmScrollRef = useRef<HTMLDivElement>(null)

  // Initialize hour/minute/ampm from selectedTime when time picker opens
  useEffect(() => {
    if (timeOpen && selectedTime) {
      const [hours, minutes] = selectedTime.split(":")
      const hour24 = parseInt(hours)
      const minuteVal = parseInt(minutes)
      
      if (timeFormat === "12h") {
        const hour12 = hour24 % 12 || 12
        setHour(hour12)
        setAmPm(hour24 >= 12 ? "PM" : "AM")
      } else {
        setHour(hour24)
      }
      setMinute(minuteVal)
    } else if (timeOpen && !selectedTime) {
      // Reset when opening without a selected time
      setHour(null)
      setMinute(null)
      setAmPm("AM")
    }
  }, [timeOpen, selectedTime, timeFormat])

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

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

  const scrollColumn = (ref: React.RefObject<HTMLDivElement | null>, direction: "up" | "down") => {
    if (ref.current) {
      const scrollAmount = 40 // Adjust based on item height
      const currentScroll = ref.current.scrollTop
      const newScroll = direction === "up" 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount
      ref.current.scrollTo({ top: newScroll, behavior: "smooth" })
    }
  }

  const scrollToSelected = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
    if (ref.current) {
      const itemHeight = 40 // Approximate height of each item
      const scrollPosition = index * itemHeight
      ref.current.scrollTo({ top: scrollPosition, behavior: "smooth" })
    }
  }

  // Scroll to selected values when they change
  useEffect(() => {
    if (timeOpen && hour !== null) {
      const hourIndex = getHours().indexOf(hour)
      if (hourIndex !== -1) {
        setTimeout(() => scrollToSelected(hourScrollRef, hourIndex), 100)
      }
    }
  }, [timeOpen, hour, timeFormat])

  useEffect(() => {
    if (timeOpen && minute !== null) {
      setTimeout(() => scrollToSelected(minuteScrollRef, minute), 100)
    }
  }, [timeOpen, minute])

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
            <>
              {/* Mobile Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                onClick={() => setDateOpen(false)}
              />
              
              {/* Calendar Popup */}
              <div
                className={cn(
                  // Mobile: Fixed bottom sheet modal
                  "fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl shadow-2xl",
                  "max-h-[85vh] overflow-y-auto",
                  // Desktop: Absolute positioning
                  "sm:absolute sm:top-full sm:mt-2 sm:bottom-auto sm:rounded-xl sm:shadow-2xl sm:border sm:border-gray-200",
                  "sm:w-[320px] sm:left-auto sm:right-0 sm:max-h-none",
                  "p-3 sm:p-4 flex flex-col"
                )}
              >
                {/* Cancel Header - Mobile Only */}
                <div className="bg-gray-800 text-white py-3 px-4 -mx-3 -mt-3 mb-4 sm:hidden relative z-10 rounded-t-xl">
                  <button
                    type="button"
                    onClick={() => setDateOpen(false)}
                    className="w-full text-center text-base font-medium"
                  >
                    Cancel
                  </button>
                </div>

                {/* Month and Year Display */}
                <div className="flex items-center justify-center mb-4 sm:mb-3 sm:justify-between">
                  {/* Left Arrow - Desktop Only */}
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180 text-gray-600" />
                  </button>
                  
                  {/* Month/Year - Centered on Mobile */}
                  <span className="font-bold text-lg sm:text-base sm:font-semibold text-center sm:text-left">
                    {format(currentMonth, "MMMM yyyy")}
                  </span>
                  
                  {/* Right Arrow */}
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto sm:ml-0"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium mb-2 text-gray-600">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 text-center text-sm gap-1">
                  {getCalendarDays().map((date, idx) => {
                    const inactive = date.getMonth() !== currentMonth.getMonth()
                    const today = startOfDay(new Date())
                    const disabled =
                      (minSelectableDate && isBefore(date, startOfDay(minSelectableDate))) ||
                      isBefore(date, startOfDay(new Date()))

                    const isSelected =
                      selectedDate && isSameDay(date, new Date(selectedDate))

                    return (
                      <div
                        key={idx}
                        onClick={() => !disabled && handleDateSelect(date)}
                        className={cn(
                          "py-1.5 sm:py-2 cursor-pointer transition-all text-xs sm:text-sm flex items-center justify-center",
                          disabled
                            ? "text-gray-300 cursor-not-allowed"
                            : inactive
                              ? "text-gray-400"
                              : "hover:bg-gray-100 text-gray-700",
                          isSelected
                            ? "bg-primary text-white font-semibold"
                            : ""
                        )}
                      >
                        {date.getDate()}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
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
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 z-40 sm:bg-black/20"
                onClick={() => setTimeOpen(false)}
              />
              
              {/* Time Picker Popup */}
              <div
                className={cn(
                  // Mobile: Fixed bottom sheet modal
                  "fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl shadow-2xl",
                  "max-h-[85vh] overflow-y-auto",
                  // Desktop: Absolute positioning
                  "sm:absolute sm:top-full sm:mt-2 sm:bottom-auto sm:rounded-xl sm:shadow-2xl sm:border sm:border-gray-200",
                  "sm:w-full sm:max-w-[320px] sm:left-auto sm:right-0 sm:max-h-none",
                  "p-4 sm:p-5 flex flex-col"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Cancel Header - Mobile Only */}
                <div className="bg-gray-800 text-white py-3 px-4 -mx-4 -mt-4 mb-4 sm:hidden relative z-10 rounded-t-xl flex items-center justify-between">
                  <span className="text-base font-medium">Select Time</span>
                  <button
                    type="button"
                    onClick={() => setTimeOpen(false)}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              
              {/* Time Format Tabs */}
              <div className="flex border border-gray-300 rounded-lg mb-4 sm:mb-5 overflow-hidden">
                <button
                  type="button"
                  className={cn(
                    "flex-1 py-2 text-xs sm:text-sm font-medium transition-colors",
                    timeFormat === "24h"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-200 text-gray-500"
                  )}
                  onClick={() => setTimeFormat("24h")}
                >
                  24h
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex-1 py-2 text-xs sm:text-sm font-medium transition-colors",
                    timeFormat === "12h"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-200 text-gray-500"
                  )}
                  onClick={() => setTimeFormat("12h")}
                >
                  12h
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
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => scrollColumn(hourScrollRef, "up")}
                      className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-white hover:bg-gray-50 py-1 border-b border-gray-200"
                    >
                      <ChevronUp className="h-4 w-4 text-gray-600" />
                    </button>
                    <div 
                      ref={hourScrollRef}
                      className="overflow-hidden max-h-40 sm:max-h-48 overflow-y-scroll scrollbar-hide pt-6 pb-6"
                    >
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
                            : hourValue.toString().padStart(2, "0")}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollColumn(hourScrollRef, "down")}
                      className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-white hover:bg-gray-50 py-1 border-t border-gray-200"
                    >
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Minute Column */}
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 text-center">
                    Minute
                  </label>
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => scrollColumn(minuteScrollRef, "up")}
                      className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-white hover:bg-gray-50 py-1 border-b border-gray-200"
                    >
                      <ChevronUp className="h-4 w-4 text-gray-600" />
                    </button>
                    <div 
                      ref={minuteScrollRef}
                      className="overflow-hidden max-h-40 sm:max-h-48 overflow-y-scroll scrollbar-hide pt-6 pb-6"
                    >
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
                    <button
                      type="button"
                      onClick={() => scrollColumn(minuteScrollRef, "down")}
                      className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-white hover:bg-gray-50 py-1 border-t border-gray-200"
                    >
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* AM/PM Column */}
                {timeFormat === "12h" && (
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 text-center">
                      Period
                    </label>
                    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => scrollColumn(ampmScrollRef, "up")}
                        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-white hover:bg-gray-50 py-1 border-b border-gray-200"
                      >
                        <ChevronUp className="h-4 w-4 text-gray-600" />
                      </button>
                      <div 
                        ref={ampmScrollRef}
                        className="overflow-hidden scrollbar-hide pt-6 pb-6"
                      >
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
                      <button
                        type="button"
                        onClick={() => scrollColumn(ampmScrollRef, "down")}
                        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-white hover:bg-gray-50 py-1 border-t border-gray-200"
                      >
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      </button>
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
                    "text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-all",
                    hour === null || minute === null
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  )}
                >
                  Save
                </button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
