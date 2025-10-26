"use client"

import type React from "react"

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
import { ChevronRight, ChevronUp, ChevronDown } from "lucide-react"
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

function useSharedDateTimeLogic({
  selectedDate,
  selectedTime,
  setValue,
  dateFieldName,
  timeFieldName,
  minSelectableDate,
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())
  const [isDate, setIsDate] = useState(true)
  const [isDragging, setIsDragging] = useState<"hour" | "minute" | null>(null)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartValue, setDragStartValue] = useState(0)

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  function formatTime12(hour?: number, minute?: number): string {
    if (typeof hour !== "number" || typeof minute !== "number") {
      return ""
    }
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const minuteStr = (minute ?? 0).toString().padStart(2, "0")
    const amPm = hour >= 12 ? "PM" : "AM"
    return `${hour12.toString().padStart(2, "0")}:${minuteStr} ${amPm}`
  }

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

  const handleDateSelect = (date: Date) => {
    setValue(dateFieldName, date)
    setCurrentMonth(date)
    setIsDate(false)
  }

  function getDisplayHour(hour: number): number {
    return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  }

  function getAmPm(hour: number): string {
    return hour >= 12 ? "PM" : "AM"
  }

  const handleHourChange = (increment: boolean) => {
    const currentHour = selectedTime?.hour ?? 0
    let newHour = currentHour
    if (increment && currentHour < 23) {
      newHour = currentHour + 1
    } else if (increment && currentHour === 23) {
      newHour = 0
    } else if (!increment && currentHour > 0) {
      newHour = currentHour - 1
    } else if (!increment && currentHour === 0) {
      newHour = 23
    }
    const updated = { ...selectedTime, hour: newHour, minute: selectedTime?.minute ?? 0 }
    setValue(timeFieldName, updated)
  }

  const handleMinuteChange = (increment: boolean) => {
    const currentMinute = selectedTime?.minute ?? (increment ? 0 : 45)
    let newMinute = currentMinute
    if (increment) {
      newMinute = (currentMinute + 5) % 60
    } else {
      newMinute = (currentMinute - 5 + 60) % 60
    }
    const updated = { ...selectedTime, minute: newMinute, hour: selectedTime?.hour ?? 12 }
    setValue(timeFieldName, updated)
  }

  const handlePeriodChange = (increment: boolean) => {
    const currentHour = selectedTime?.hour ?? 1
    const newHour = currentHour < 12 ? currentHour + 12 : currentHour - 12
    const updated = { ...selectedTime, hour: newHour, minute: selectedTime?.minute ?? 0 }
    setValue(timeFieldName, updated)
  }

  const handleMouseDown = (type: "hour" | "minute", event: React.MouseEvent) => {
    setIsDragging(type)
    setDragStartY(event.clientY)
    setDragStartValue(type === "hour" ? (selectedTime?.hour ?? 0) : (selectedTime?.minute ?? 0))
    event.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return

      const deltaY = dragStartY - event.clientY
      const sensitivity = 3
      const change = Math.floor(deltaY / sensitivity)

      if (isDragging === "hour") {
        const newHour = Math.max(0, Math.min(23, dragStartValue + change))
        const updated = { ...selectedTime, hour: newHour, minute: selectedTime?.minute ?? 0 }
        setValue(timeFieldName, updated)
      } else if (isDragging === "minute") {
        const newMinute = Math.max(0, Math.min(59, dragStartValue + change))
        const updated = { ...selectedTime, minute: newMinute, hour: selectedTime?.hour ?? 0 }
        setValue(timeFieldName, updated)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(null)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStartY, dragStartValue, selectedTime, setValue, timeFieldName])

  return {
    currentMonth,
    setCurrentMonth,
    isDate,
    setIsDate,
    daysOfWeek,
    formatTime12,
    getCalendarDays,
    handleDateSelect,
    getDisplayHour,
    getAmPm,
    handleHourChange,
    handleMinuteChange,
    handlePeriodChange,
    handleMouseDown,
  }
}

function TabNavigation({
  isDate,
  setIsDate,
  isMobile,
}: {
  isDate: boolean
  setIsDate: (value: boolean) => void
  isMobile: boolean
}) {
  return (
    <div className="relative p-1.5 bg-black">
      <div className="relative bg-gray-900 rounded-lg p-0.5 grid grid-cols-2 gap-0.5 shadow-inner">
        <div
          className={cn(
            "absolute top-0.5 bottom-0.5 w-[calc(50%-1px)] bg-[#F4910B] rounded-md transition-all duration-500 ease-out shadow-lg",
            isDate ? "left-0.5" : "left-[calc(50%+0.5px)]",
          )}
        />

        <button
        type="button"
          onClick={() => setIsDate(true)}
          className={cn(
            "relative z-10 rounded-md font-semibold transition-all duration-300 ease-out",
            "hover:scale-105 active:scale-95",
            isDate ? "text-white shadow-sm" : "text-gray-400 hover:text-white",
            isMobile ? "py-1 px-1.5 text-xs" : "py-1.5 px-2 text-xs",
          )}
        >
          <span className="flex items-center justify-center gap-1">
            📅<span>Date</span>
          </span>
        </button>

        <button
        type="button"
          onClick={() => setIsDate(false)}
          className={cn(
            "relative z-10 rounded-md font-semibold transition-all duration-300 ease-out",
            "hover:scale-105 active:scale-95",
            !isDate ? "text-white shadow-sm" : "text-gray-400 hover:text-white",
            isMobile ? "py-1 px-1.5 text-xs" : "py-1.5 px-2 text-xs",
          )}
        >
          <span className="flex items-center justify-center gap-1">
            🕐<span>Time</span>
          </span>
        </button>
      </div>
    </div>
  )
}

function CalendarView({
  currentMonth,
  setCurrentMonth,
  daysOfWeek,
  calendarDays,
  selectedDate,
  minSelectableDate,
  handleDateSelect,
}: {
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  daysOfWeek: string[]
  calendarDays: Array<{ day: number; date: Date; inactive: boolean }>
  selectedDate: Date | null
  minSelectableDate?: Date | null
  handleDateSelect: (date: Date) => void
}) {
  return (
    <>
      <div className="bg-[#F4910B] text-white font-bold text-base py-2 px-3 flex items-center justify-between">
        <button
        type="button"
          className="size-7 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-3 w-3 rotate-180" />
        </button>
        <span className="flex-grow text-center text-sm">{format(currentMonth, "MMMM yyyy")}</span>
        <button
        type="button"
          className="size-7 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-48 pb-2">
        <div className="px-2">
          <div className="grid grid-cols-7 text-center text-xs font-semibold gap-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-1 text-gray-300">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center text-xs">
            {calendarDays.map((dayObj, index) => (
              <div
                key={index}
                className={cn(
                  "py-1 px-1 m-0.5 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer",
                  dayObj.inactive || (minSelectableDate && isBefore(dayObj.date, startOfDay(minSelectableDate)))
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-gray-700 hover:scale-110",
                  isSameDay(dayObj.date, selectedDate || new Date()) && !dayObj.inactive
                    ? "bg-[#F4910B] text-white font-bold shadow-lg"
                    : isSameDay(dayObj.date, new Date()) && !dayObj.inactive
                      ? "border border-[#F4910B] text-[#F4910B]"
                      : "",
                )}
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
  )
}

function TimePickerView({
  selectedTime,
  getDisplayHour,
  getAmPm,
  handleHourChange,
  handleMinuteChange,
  handlePeriodChange,
  handleMouseDown,
  isMobile,
}: {
  selectedTime?: Time | null
  getDisplayHour: (hour: number) => number
  getAmPm: (hour: number) => string
  handleHourChange: (increment: boolean) => void
  handleMinuteChange: (increment: boolean) => void
  handlePeriodChange: (increment: boolean) => void
  handleMouseDown: (type: "hour" | "minute", event: React.MouseEvent) => void
  isMobile: boolean
}) {
  return (
    <div className="px-3 pb-4">
        <div className={cn("bg-gray-900 rounded-xl  shadow-inner border border-gray-700 flex items-center justify-center mb-4", isMobile ? "p-2" : "p-2")}>
          <div
            className={cn("font-bold text-white tracking-wider flex items-center", isMobile ? "text-2xl" : "text-2xl")}
          >
            {selectedTime ? (
              <>
                <span className="text-[#F4910B]">{getDisplayHour(selectedTime.hour).toString().padStart(2, "0")}</span>
                <span className="text-gray-400 mx-2 animate-pulse">:</span>
                <span className="text-[#F4910B]">{selectedTime.minute.toString().padStart(2, "0")}</span>
                <span
                  className={cn(
                    "ml-3 text-white bg-gray-800 rounded-lg",
                    isMobile ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1",
                  )}
                >
                  {getAmPm(selectedTime.hour)}
                </span>
              </>
            ) : (
              <span className="text-gray-500">00:00 --</span>
            )}
          </div>
        </div>

      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => handleHourChange(true)}
            className="w-8 h-8 bg-gray-700 hover:bg-[#F4910B] rounded-xl flex items-center justify-center transition-all duration-200 mb-2 shadow-lg hover:scale-110 active:scale-95"
          >
            <ChevronUp className="size-3 text-white" />
          </button>

          <div
            className="text-xl font-bold text-[#F4910B] mb-2 cursor-grab active:cursor-grabbing select-none bg-gray-800 px-2 py-1 rounded-lg border border-gray-600 hover:border-[#F4910B] transition-colors"
            onMouseDown={(e) => handleMouseDown("hour", e)}
          >
            {selectedTime ? getDisplayHour(selectedTime.hour).toString().padStart(2, "0") : "00"}
          </div>

          <button
          type="button"
            onClick={() => handleHourChange(false)}
            className="w-8 h-8 bg-gray-700 hover:bg-[#F4910B] rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
          >
            <ChevronDown className="size-3 text-white" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <button
          type="button"
            onClick={() => handleMinuteChange(true)}
            className="w-8 h-8 bg-gray-700 hover:bg-[#F4910B] rounded-xl flex items-center justify-center transition-all duration-200 mb-2 shadow-lg hover:scale-110 active:scale-95"
          >
            <ChevronUp className="size-3 text-white" />
          </button>

          <div
            className="text-xl font-bold text-[#F4910B] mb-2 cursor-grab active:cursor-grabbing select-none bg-gray-800 px-2 py-1 rounded-lg border border-gray-600 hover:border-[#F4910B] transition-colors"
            onMouseDown={(e) => handleMouseDown("minute", e)}
          >
            {selectedTime ? selectedTime.minute.toString().padStart(2, "0") : "00"}
          </div>

          <button
          type="button"
            onClick={() => handleMinuteChange(false)}
            className="w-8 h-8 bg-gray-700 hover:bg-[#F4910B] rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
          >
            <ChevronDown className="size-3 text-white" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <button
          type="button"
            onClick={() => handlePeriodChange(true)}
            className="w-8 h-8 bg-gray-700 hover:bg-[#F4910B] rounded-xl flex items-center justify-center transition-all duration-200 mb-2 shadow-lg hover:scale-110 active:scale-95"
          >
            <ChevronUp className="size-3 text-white" />
          </button>

          <div className="text-xl font-bold text-[#F4910B] mb-2 cursor-pointer select-none bg-gray-800 px-2 py-1 rounded-lg border border-gray-600 hover:border-[#F4910B] transition-colors">
            {selectedTime ? getAmPm(selectedTime.hour) : "--"}
          </div>

          <button
          type="button"
            onClick={() => handlePeriodChange(false)}
            className="w-8 h-8 bg-gray-700 hover:bg-[#F4910B] rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
          >
            <ChevronDown className="size-3 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

function MobileDateTimePicker({
  open,
  setOpen,
  selectedDate,
  selectedTime,
  minSelectableDate,
  ...sharedProps
}: {
  open: boolean
  setOpen: (open: boolean) => void
  selectedDate: Date | null
  selectedTime?: Time | null
  minSelectableDate?: Date | null
} & ReturnType<typeof useSharedDateTimeLogic>) {
  const {
    currentMonth,
    setCurrentMonth,
    isDate,
    setIsDate,
    daysOfWeek,
    getCalendarDays,
    handleDateSelect,
    getDisplayHour,
    getAmPm,
    handleHourChange,
    handleMinuteChange,
    handlePeriodChange,
    handleMouseDown,
  } = sharedProps

  const calendarDays = getCalendarDays()
  const bothSelected = selectedDate && selectedTime

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-20 " onClick={() => setOpen(false)} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  z-30 bg-black text-white rounded-xl shadow-2xl border border-gray-700 overflow-hidden h-auto max-h-[320px] w-60">
        

        <CalendarView
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            daysOfWeek={daysOfWeek}
            calendarDays={calendarDays}
            selectedDate={selectedDate}
            minSelectableDate={minSelectableDate}
            handleDateSelect={handleDateSelect}
          />
          <input className="w-full" type="time" />
        

        {bothSelected && (
          <div className="p-3 border-t border-gray-700">
            <button
            type="button"
              onClick={() => setOpen(false)}
              className="w-full bg-[#F4910B] hover:bg-[#e8840a] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              ✓ Done
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function DesktopDateTimePicker({
  selectedDate,
  selectedTime,
  minSelectableDate,
  setOpen,
  ...sharedProps
}: {
  selectedDate: Date | null
  selectedTime?: Time | null
  minSelectableDate?: Date | null
  setOpen: (open: boolean) => void
} & ReturnType<typeof useSharedDateTimeLogic>) {
  const {
    currentMonth,
    setCurrentMonth,
    isDate,
    setIsDate,
    daysOfWeek,
    getCalendarDays,
    handleDateSelect,
    getDisplayHour,
    getAmPm,
    handleHourChange,
    handleMinuteChange,
    handlePeriodChange,
    handleMouseDown,
  } = sharedProps

  const calendarDays = getCalendarDays()
  const bothSelected = selectedDate && selectedTime

  return (
    <div className="absolute left-0 top-full mt-2 z-30 bg-black text-white rounded-xl shadow-2xl border border-gray-700 overflow-hidden w-full max-w-xs">
      <TabNavigation isDate={isDate} setIsDate={setIsDate} isMobile={false} />

        <CalendarView
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            daysOfWeek={daysOfWeek}
            calendarDays={calendarDays}
            selectedDate={selectedDate}
            minSelectableDate={minSelectableDate}
            handleDateSelect={handleDateSelect}
          />
          <input className="w-full" type="time" />

      {bothSelected && (
        <div className="p-3 border-t border-gray-700">
          <button
          type="button"
            onClick={() => setOpen(false)}
            className="w-full bg-[#F4910B] hover:bg-[#e8840a] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            ✓ Done
          </button>
        </div>
      )}
    </div>
  )
}

export default function EnhancedDateTimePicker(props: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    form: {
      formState: { errors },
    },
  } = useCustomForm()

  const sharedLogic = useSharedDateTimeLogic(props)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

  return (
    <div ref={containerRef} className="relative max-w-5xl">
      <label className="block text-sm font-medium text-black mb-1">{props.label}</label>
      <input
        type="text"
        readOnly
        value={
          props.selectedDate || props.selectedTime
            ? `${props.selectedDate ? format(props.selectedDate, "EEEE do MMM yyyy") : "Select date"}, ${props.selectedTime ? sharedLogic.formatTime12(props.selectedTime?.hour, props.selectedTime?.minute) : "Select time"}`
            : ""
        }
        onClick={() => setOpen(true)}
        className={cn(
          "w-full px-3 py-2 rounded-lg text-sm shadow-sm bg-white cursor-pointer text-black border transition-all duration-200 hover:border-[#F4910B] focus:border-[#F4910B]",
          errors[props.dateFieldName as "pickup_date"] || errors[props.timeFieldName as "pickup_time"]
            ? "border-red-500"
            : " border-gray-500 ",
        )}
        placeholder="Select Date & Time"
      />
      {open && (
        <>
          {isMobile ? (
            <MobileDateTimePicker
              open={open}
              setOpen={setOpen}
              selectedDate={props.selectedDate}
              selectedTime={props.selectedTime}
              minSelectableDate={props.minSelectableDate}
              {...sharedLogic}
            />
          ) : (
            <DesktopDateTimePicker
              selectedDate={props.selectedDate}
              selectedTime={props.selectedTime}
              minSelectableDate={props.minSelectableDate}
              setOpen={setOpen}
              {...sharedLogic}
            />
          )}
        </>
      )}
    </div>
  )
}
