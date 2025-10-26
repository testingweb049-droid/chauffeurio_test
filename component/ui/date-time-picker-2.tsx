"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
import { ChevronRight, Clock, ChevronUp, ChevronDown } from "lucide-react"
import useCustomForm from "@/hooks/useFormContext"
import { cn } from "@/lib/utils"

interface Time {
  hour: number
  minute: number
}

interface DateTimePickerProps {
  label: string
  selectedDate: Date | null
  selectedTime?: Time | null
  setValue: (field: string, value: any) => void
  dateFieldName: string
  timeFieldName: string
  minSelectableDate?: Date | null
}

export default function DateTimePicker({
  label,
  selectedDate,
  selectedTime,
  setValue,
  dateFieldName,
  timeFieldName,
  minSelectableDate = null,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())
  const timeRef = useRef<HTMLDivElement>(null)
  const scrollableContentRef = useRef<HTMLDivElement>(null)
  const {
    form: {
      formState: { errors },
    },
  } = useCustomForm()
  const [isDate, setIsDate] = useState(true)

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  function formatTime12(hour?: number, minute?: number): string {
    if (typeof hour !== "number" || typeof minute !== "number") {
      hour = 12
      minute = 0
    }
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const minuteStr = (minute ?? 0).toString().padStart(2, "0")
    const amPm = hour >= 12 ? "PM" : "AM"
    return `${hour12}:${minuteStr} ${amPm}`
  }

  function getDisplayHour(hour: number): number {
    return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  }

  function getAmPm(hour: number): string {
    return hour >= 12 ? "PM" : "AM"
  }

  // Calculate calendar days dynamically
  const getCalendarDays = useCallback(() => {
    const startOfCurrentMonth = startOfMonth(currentMonth)
    const endOfCurrentMonth = endOfMonth(currentMonth)

    const startDayOfWeek = (getDay(startOfCurrentMonth) + 6) % 7

    const daysInPrevMonth = startDayOfWeek
    const prevMonthStart = subMonths(startOfCurrentMonth, 1)
    const prevMonthEnd = endOfMonth(prevMonthStart)

    const prevDays = eachDayOfInterval({
      start: new Date(prevMonthEnd.setDate(prevMonthEnd.getDate() - daysInPrevMonth + 1)),
      end: prevMonthEnd,
    }).map((date) => ({ day: date.getDate(), date, inactive: true }))

    const currentDays = eachDayOfInterval({
      start: startOfCurrentMonth,
      end: endOfCurrentMonth,
    }).map((date) => ({ day: date.getDate(), date, inactive: false }))

    const allDays = [...prevDays, ...currentDays]

    const daysInNextMonth = 42 - allDays.length
    const nextMonthStart = addMonths(startOfCurrentMonth, 1)
    const nextDays = eachDayOfInterval({
      start: nextMonthStart,
      end: new Date(nextMonthStart.setDate(nextMonthStart.getDate() + daysInNextMonth - 1)),
    }).map((date) => ({ day: date.getDate(), date, inactive: true }))

    return [...allDays, ...nextDays]
  }, [currentMonth])

  const calendarDays = getCalendarDays()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDateSelect = (date: Date) => {
    setValue(dateFieldName, date)
    setCurrentMonth(date)
    setIsDate(false)
  }

  const handleHourChange = (increment: boolean) => {
    const currentHour = selectedTime?.hour ?? 12
    let newHour = currentHour

    if (increment) {
      newHour = currentHour === 23 ? 0 : currentHour + 1
    } else {
      newHour = currentHour === 0 ? 23 : currentHour - 1
    }

    const updated = { ...selectedTime, hour: newHour, minute: selectedTime?.minute ?? 0 }
    setValue(timeFieldName, updated)
  }

  const handleMinuteChange = (increment: boolean) => {
    const currentMinute = selectedTime?.minute ?? 0
    let newMinute = currentMinute
    if (increment) {
      newMinute = (currentMinute + 5) % 60
    } else {
      newMinute = (currentMinute - 5 + 60) % 60
    }
    const updated = { ...selectedTime, minute: newMinute, hour: selectedTime?.hour ?? 12 }
    setValue(timeFieldName, updated)
  }

  const toggleAmPm = () => {
    const currentHour = selectedTime?.hour ?? 12
    const newHour = currentHour < 12 ? currentHour + 12 : currentHour - 12
    const updated = { ...selectedTime, hour: newHour, minute: selectedTime?.minute ?? 0 }
    setValue(timeFieldName, updated)
  }

  return (
    <div ref={containerRef} className="relative max-w-5xl">
      <label className="block text-sm font-medium text-black mb-1">{label}</label>
      <input
        type="text"
        readOnly
        value={
          selectedDate || selectedTime
            ? `${selectedDate ? format(selectedDate, "EEEE do MMM yyyy") : "date"}, ${selectedTime ? formatTime12(selectedTime?.hour, selectedTime?.minute) : "12:00 PM"}`
            : ""
        }
        onClick={() => setOpen(true)}
        className={cn(
          "w-full px-3 py-2 rounded-lg text-sm shadow-sm bg-white cursor-pointer text-black border",
          errors[dateFieldName as "pickup_date"] || errors[timeFieldName as "pickup_time"]
            ? "border-red-500"
            : "border-gray-500",
        )}
        placeholder="Select Date & Time"
      />
      {open && (
        <div className="absolute left-0 top-full mt-2 z-30 w-full max-w-sm bg-[#333333] text-white rounded-md shadow-lg">
          {/* Tab header */}
          <div className="w-full grid grid-cols-2 gap-2 p-2 bg-gray-900 font-semibold">
            <div
              onClick={() => {
                setIsDate(true)
              }}
              className={cn(
                "p-2 cursor-pointer rounded-lg w-full text-center border border-gray-500 transition-colors",
                isDate ? "bg-yellow-600 text-black" : "bg-black text-yellow-600 hover:bg-gray-800",
              )}
            >
              Date
            </div>
            <div
              onClick={() => {
                setIsDate(false)
              }}
              className={cn(
                "p-2 cursor-pointer rounded-lg w-full text-center border border-gray-500 transition-colors",
                isDate ? "bg-black text-yellow-600 hover:bg-gray-800" : "bg-yellow-600 text-black",
              )}
            >
              Time
            </div>
          </div>

          {isDate ? (
            <>
              {/* Month header */}
              <div className="bg-brand text-black font-bold text-lg py-2 px-4 flex items-center justify-between rounded-t-md">
                <div
                  className="h-8 w-8 text-black hover:bg-yellow-400 rounded cursor-pointer flex items-center justify-center transition-colors"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span className="sr-only">Previous month</span>
                </div>
                <span className="flex-grow text-center">{format(currentMonth, "MMMM yyyy")}</span>
                <div
                  className="h-8 w-8 text-black hover:bg-yellow-400 rounded cursor-pointer flex items-center justify-center transition-colors"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next month</span>
                </div>
              </div>

              {/* Scrollable content wrapper */}
              <div ref={scrollableContentRef} className="overflow-y-auto max-h-[300px]">
                {/* Calendar Grid */}
                <div className="px-2">
                  <div className="grid grid-cols-7 text-center text-sm font-semibold gap-4">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 text-center text-xs">
                    {calendarDays.map((dayObj, index) => (
                      <div
                        key={index}
                        className={`
                          py-2 px-1 m-0.5 rounded-sm flex items-center justify-center transition-colors
                          ${
                            dayObj.inactive ||
                            (minSelectableDate && isBefore(dayObj.date, startOfDay(minSelectableDate)))
                              ? "text-gray-500"
                              : "text-white"
                          }
                          ${
                            isSameDay(dayObj.date, selectedDate || new Date()) && !dayObj.inactive
                              ? "bg-blue-600 text-white font-bold rounded-md"
                              : isSameDay(dayObj.date, new Date()) && !dayObj.inactive
                                ? "border border-blue-500 rounded-md"
                                : ""
                          }
                          ${
                            !dayObj.inactive &&
                            !isSameDay(dayObj.date, selectedDate || new Date()) &&
                            (minSelectableDate && isBefore(dayObj.date, startOfDay(minSelectableDate)))
                              ? "text-gray-500 cursor-not-allowed"
                              : "hover:bg-zinc-700 cursor-pointer"
                          }
                        `}
                        onClick={() => {
                          if (
                            !dayObj.inactive &&
                            !(minSelectableDate && isBefore(dayObj.date, startOfDay(minSelectableDate)))
                          ) {
                            handleDateSelect(dayObj.date)
                          }
                        }}
                      >
                        {dayObj.day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div ref={timeRef} className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Clock className="size-5 text-yellow-600 mr-2" />
                <span className="text-lg font-semibold text-yellow-600">Select Time</span>
              </div>

              {/* Time Display */}
              <div className="flex items-center justify-center mb-6">
                <div className="text-4xl font-bold text-white tracking-wider">
                  {getDisplayHour(selectedTime?.hour ?? 12)
                    .toString()
                    .padStart(2, "0")}
                  <span className="text-gray-400 mx-2">:</span>
                  {(selectedTime?.minute ?? 0).toString().padStart(2, "0")}
                  <span className="text-2xl ml-3 text-yellow-600">{getAmPm(selectedTime?.hour ?? 12)}</span>
                </div>
              </div>

              {/* Time Controls */}
              <div className="flex items-center justify-center gap-8">
                {/* Hour Controls */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleHourChange(true)}
                    className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors mb-2"
                  >
                    <ChevronUp className="size-6 text-white" />
                  </button>
                  <div className="text-sm text-gray-400 mb-2">Hour</div>
                  <button
                    onClick={() => handleHourChange(false)}
                    className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ChevronDown className="size-6 text-white" />
                  </button>
                </div>

                {/* Minute Controls */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleMinuteChange(true)}
                    className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors mb-2"
                  >
                    <ChevronUp className="size-6 text-white" />
                  </button>
                  <div className="text-sm text-gray-400 mb-2">Min</div>
                  <button
                    onClick={() => handleMinuteChange(false)}
                    className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ChevronDown className="size-6 text-white" />
                  </button>
                </div>

                {/* AM/PM Toggle */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={toggleAmPm}
                    className="w-16 h-12 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg flex items-center justify-center transition-colors mb-2"
                  >
                    {getAmPm(selectedTime?.hour ?? 12)}
                  </button>
                  <div className="text-sm text-gray-400 mb-2">Period</div>
                  <button
                    onClick={toggleAmPm}
                    className="w-16 h-12 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center transition-colors text-sm"
                  >
                    {getAmPm(selectedTime?.hour ?? 12) === "AM" ? "PM" : "AM"}
                  </button>
                </div>
              </div>

              {/* Quick Time Presets */}
              <div className="mt-6 pt-4 border-t border-zinc-700">
                <div className="text-sm text-gray-400 mb-3 text-center">Quick Select</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "9:00 AM", hour: 9, minute: 0 },
                    { label: "12:00 PM", hour: 12, minute: 0 },
                    { label: "3:00 PM", hour: 15, minute: 0 },
                    { label: "6:00 PM", hour: 18, minute: 0 },
                    { label: "8:00 PM", hour: 20, minute: 0 },
                    { label: "10:00 PM", hour: 22, minute: 0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setValue(timeFieldName, { hour: preset.hour, minute: preset.minute })}
                      className="px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
