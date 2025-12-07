"use client";

import React, { useMemo, useRef, useState, type JSX } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { motion, type Variants } from "framer-motion";
import Button from "../button/Button";
import { MapPin, Calendar, Users, Briefcase, Clock, X } from "lucide-react";

type BookingBarProps = {
  variants?: Variants;
  onSubmit?: (data: {
    mode: "trip" | "hourly";
    from: string;
    to: string;
    datetime: string;
    persons: number;
    luggage: number;
    hours?: number;
  }) => void;
};

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function BookingBar({ variants, onSubmit }: BookingBarProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU",
    libraries,
    id: "gmaps-script",
  });

  if (loadError) {
    console.warn("Google Maps failed to load:", loadError);
  }

  return (
    <BookingBarInner
      variants={variants}
      onSubmit={onSubmit}
      isPlacesReady={!!isLoaded && !loadError}
    />
  );
}

function BookingBarInner({
  variants,
  onSubmit,
  isPlacesReady,
}: BookingBarProps & { isPlacesReady: boolean }) {
  const [mode, setMode] = useState<"trip" | "hourly">("trip");
  const [hours, setHours] = useState<number>(2);

  // Places
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Helper function to clean and format address
  const formatAddress = (place: google.maps.places.PlaceResult | undefined): string => {
    if (!place) return "";
    
    // Build address in format: Place Name, Street Address, City, Country (no postal code, no neighborhood)
    let address = "";
    
    if (place.address_components && place.name) {
      // Get place name
      const placeName = place.name;
      
      // Get street address components
      const streetNumber = place.address_components.find(
        (comp) => comp.types.includes("street_number")
      )?.long_name;
      const route = place.address_components.find(
        (comp) => comp.types.includes("route")
      )?.long_name;
      
      // Get city (locality)
      const locality = place.address_components.find(
        (comp) => comp.types.includes("locality")
      )?.long_name;
      
      // Get country
      const country = place.address_components.find(
        (comp) => comp.types.includes("country")
      )?.long_name;
      
      // Build street address (number + route)
      const streetAddress = [streetNumber, route].filter(Boolean).join(" ");
      
      // Build final address: Place Name, Street Address, City, Country
      const addressParts: string[] = [];
      
      if (placeName) addressParts.push(placeName);
      if (streetAddress) addressParts.push(streetAddress);
      if (locality) addressParts.push(locality);
      if (country) addressParts.push(country);
      
      address = addressParts.join(", ");
    } else {
      // Fallback: clean formatted_address to remove postal codes and neighborhoods
      address = place.formatted_address || place.name || "";
      // Remove postal codes (5 digits)
      address = address.replace(/,\s*\d{5}\s*/g, ", ");
      address = address.replace(/\s+\d{5}\s*/g, " ");
      // Remove neighborhood names like "Extramurs"
      address = address.replace(/,\s*Extramurs,?/gi, ",");
      address = address.replace(/,\s*$/, "").trim();
    }
    
    return address;
  };

  const onFromPlaceChanged = () => {
    const place = fromAutocompleteRef.current?.getPlace();
    setFrom(formatAddress(place));
  };
  const onToPlaceChanged = () => {
    const place = toAutocompleteRef.current?.getPlace();
    setTo(formatAddress(place));
  };

  // Date + Time
  const [openDateTime, setOpenDateTime] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("09");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedSecond, setSelectedSecond] = useState<string>("00");

  const hourTimeOptions = useMemo(
    () => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
    []
  );
  const minuteOptions = useMemo(
    () => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")),
    []
  );
  const secondOptions = minuteOptions;
  const hoursRideOptions = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i + 1),
    []
  );

  const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d: Date) => {
    const first = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    return first === 0 ? 6 : first - 1;
  };
  const isPast = (d: Date) => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const navigateMonth = (dir: number) =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1));

  const buildDisplayDateTime = () => {
    if (!selectedDate) return "";
    const h24 = parseInt(selectedHour, 10);
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
    return `${selectedDate} ${String(h12).padStart(2, "0")}:${selectedMinute}:${selectedSecond} ${ampm}`;
  };

  // Persons & Luggage
  const [openPL, setOpenPL] = useState(false);
  const [persons, setPersons] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const inc = (setter: React.Dispatch<React.SetStateAction<number>>, max = 99) =>
    setter((n) => Math.min(max, n + 1));
  const dec = (setter: React.Dispatch<React.SetStateAction<number>>, min = 0) =>
    setter((n) => Math.max(min, n - 1));

  const motionProps =
    variants ? { variants, initial: "hidden" as const, animate: "show" as const } : {};

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault?.();
    onSubmit?.({
      mode,
      from,
      to,
      datetime: buildDisplayDateTime(),
      persons,
      luggage,
      hours: mode === "hourly" ? hours : undefined,
    });
  };

  return (
    <motion.div {...motionProps} className="relative z-10 md:bg-transparent bg-white rounded-md">
      {/* Tabs */}
      <div className="flex md:px-0 px-3 items-center md:justify-start justify-center pt-4 md:gap-0 gap-2 w-full">
        <button
          type="button"
          onClick={() => setMode("trip")}
          className={`flex-1 md:flex-none md:rounded-t-sm rounded-l-sm px-4 py-2 text-lg ${
            mode === "trip" ? "bg-primary text-white font-semibold" : "bg-[#EDEDED] text-primary"
          }`}
        >
          Trip Rate
        </button>
        <button
          type="button"
          onClick={() => setMode("hourly")}
          className={`flex-1 md:flex-none md:rounded-t-sm rounded-r-sm px-4 py-2 text-lg ${
            mode === "hourly" ? "bg-[#0A2D3A] text-white font-semibold" : "bg-[#EDEDED] text-primary"
          }`}
        >
          Hourly Rate
        </button>
      </div>

      {/* Bar */}
      <div className="relative w-full max-w-6xl rounded-md bg-white shadow-md ring-1 ring-black/5 p-3 md:p-4 overflow-visible mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 items-center">
          {/* FROM */}
          <div className="relative z-50">
            <label className="relative flex w-full items-center gap-2 rounded-md border border-gray-200 px-3 py-3 bg-white focus-within:border-gray-400 transition-colors">
              <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
              {isPlacesReady ? (
                <Autocomplete
                  onLoad={(ac) => {
                    fromAutocompleteRef.current = ac;
                  }}
                  onPlaceChanged={onFromPlaceChanged}
                  options={{
                    fields: ["geometry", "formatted_address", "name", "place_id", "address_components"],
                    types: ["geocode", "establishment"],
                    componentRestrictions: { country: [] },
                  }}
                >
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Pickup location"
                    className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
                    autoComplete="off"
                    id="pickup-location-input"
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Pickup location"
                  className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
                  autoComplete="off"
                />
              )}
            </label>
          </div>

          {/* TO (Trip mode only) OR Hours (Hourly mode) */}
          {mode === "trip" ? (
            <div className="relative z-40">
              <label className="relative flex items-center gap-2 rounded-md border border-gray-200 px-3 py-3 bg-white focus-within:border-gray-400 transition-colors">
                <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                {isPlacesReady ? (
                  <Autocomplete
                    onLoad={(ac) => {
                      toAutocompleteRef.current = ac;
                    }}
                    onPlaceChanged={onToPlaceChanged}
                    options={{
                      fields: ["geometry", "formatted_address", "name", "place_id", "address_components"],
                      types: ["geocode", "establishment"],
                      componentRestrictions: { country: [] },
                    }}
                  >
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Drop-off location"
                      className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
                      autoComplete="off"
                      id="dropoff-location-input"
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Drop-off location"
                    className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
                    autoComplete="off"
                  />
                )}
              </label>
            </div>
          ) : (
            <label className="relative flex items-center gap-2 rounded-md border border-gray-200 px-3 py-3 bg-white">
              <Clock className="h-4 w-4 text-gray-500 shrink-0" />
              <select
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full outline-none text-sm text-gray-900 bg-transparent cursor-pointer"
              >
                {hoursRideOptions.map((h) => (
                  <option key={h} value={h}>
                    {h} {h === 1 ? "Hour" : "Hours"}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Date & Time */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenPL(false);
                setOpenDateTime((s) => !s);
              }}
              aria-expanded={openDateTime}
              className="w-full flex items-center gap-2 rounded-md border border-gray-200 px-3 py-3 hover:border-gray-300 transition-colors"
            >
              <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
              <span className={`text-sm truncate ${selectedDate ? "text-gray-900" : "text-gray-400"}`}>
                {buildDisplayDateTime() || "Pick date & time"}
              </span>
            </button>

            {openDateTime && (
              <>
                {/* Backdrop for mobile bottom sheet */}
                <div
                  className="md:hidden fixed inset-0 bg-black/30 z-[100000]"
                  onClick={() => setOpenDateTime(false)}
                />

                {/* Drawer (mobile) / Popover (desktop) */}
                <div
                  className="
                    fixed md:absolute
                    md:top-full md:mt-2
                    left-0 right-0 md:left-auto md:right-0
                    bottom-0 md:bottom-auto
                    z-[100001]
                    bg-white border border-gray-200 shadow-2xl
                    rounded-t-2xl md:rounded-xl
                    h-[75vh] md:h-auto
                    max-h-[80vh]
                    w-full md:w-auto
                    overflow-hidden
                  "
                >
                  {/* Header for mobile */}
                  <div className="md:hidden flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-200">
                    <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
                    <button
                      type="button"
                      onClick={() => setOpenDateTime(false)}
                      className="absolute right-2 top-2 p-2 rounded-full hover:bg-gray-100"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Content area: scrolls; footer is sticky at bottom */}
                  <div className="flex flex-col h-full">
                    {/* Calendar + month controls (scrollable area) */}
                    <div className="flex-1 overflow-auto p-4">
                      <div className="flex justify-between items-center mb-3">
                        <button
                          type="button"
                          onClick={() => navigateMonth(-1)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Previous month"
                        >
                          {"<"}
                        </button>
                        <div className="font-semibold text-gray-800">
                          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateMonth(1)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Next month"
                        >
                          {">"}
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2 sticky top-0 bg-white pt-1 pb-2">
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                          <div key={d} className="font-medium p-2 text-gray-600">
                            {d}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
                    </div>

                    {/* Sticky footer: time selectors + Done (ALWAYS visible on mobile) */}
                    <div className="border-t border-gray-200 bg-white p-3 md:p-4 sticky bottom-0">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Hour</div>
                          <select
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
                          >
                            {hourTimeOptions.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Minute</div>
                          <select
                            value={selectedMinute}
                            onChange={(e) => setSelectedMinute(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
                          >
                            {minuteOptions.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Second</div>
                          <select
                            value={selectedSecond}
                            onChange={(e) => setSelectedSecond(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
                          >
                            {secondOptions.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenDateTime(false)}
                        className="w-full py-2 mt-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Persons & Luggage - Hidden on mobile */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => {
                setOpenDateTime(false);
                setOpenPL((s) => !s);
              }}
              aria-expanded={openPL}
              className="w-full flex items-center gap-2 rounded-md border border-gray-200 px-3 py-3 hover:border-gray-300 transition-colors"
            >
              <Users className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-sm text-gray-900 whitespace-nowrap">
                {persons} {persons === 1 ? "Person" : "Persons"} • {luggage} Luggage
              </span>
            </button>

            {openPL && (
              <div className="absolute top-full mt-2 z-[100000] w-full md:min-w-[280px] md:w-auto left-0 md:left-auto md:right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-h-[60vh] overflow-auto">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">Persons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dec(setPersons, 1)}
                      className="h-8 w-8 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Decrease persons"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{persons}</span>
                    <button
                      type="button"
                      onClick={() => inc(setPersons, 99)}
                      className="h-8 w-8 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Increase persons"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">Luggage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dec(setLuggage, 0)}
                      className="h-8 w-8 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Decrease luggage"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{luggage}</span>
                    <button
                      type="button"
                      onClick={() => inc(setLuggage, 99)}
                      className="h-8 w-8 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Increase luggage"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenPL(false)}
                  className="w-full mt-3 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* CTA */}
          <div onClick={handleSubmit} className="cursor-pointer">
            <Button label="BOOK NOW" className="w-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  function renderCalendarDays(): JSX.Element[] {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const blocks: JSX.Element[] = [];

    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const prevDays = getDaysInMonth(prev);
    for (let i = firstDay - 1; i >= 0; i--) {
      blocks.push(
        <div key={`prev-${i}`} className="text-gray-400 p-2 text-center text-sm">
          {prevDays - i}
        </div>
      );
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const disabled = isPast(d);
      const isToday = d.toDateString() === today.toDateString();
      const isSelected = selectedDate === formatDate(d);

      blocks.push(
        <div
          key={`cur-${i}`}
          onClick={() => !disabled && setSelectedDate(formatDate(d))}
          className={`p-2 text-center rounded-full w-8 h-8 flex items-center justify-center mx-auto text-sm cursor-pointer transition-colors ${
            isSelected
              ? "bg-primary text-white"
              : disabled
              ? "text-gray-400 cursor-not-allowed"
              : isToday
              ? "bg-blue-100 text-primary font-semibold"
              : "hover:bg-gray-200 text-gray-800"
          }`}
        >
          {i}
        </div>
      );
    }

    const totalCells = 42;
    const remain = totalCells - blocks.length;
    for (let i = 1; i <= remain; i++) {
      blocks.push(
        <div key={`next-${i}`} className="text-gray-400 p-2 text-center text-sm">
          {i}
        </div>
      );
    }
    return blocks;
  }
}
