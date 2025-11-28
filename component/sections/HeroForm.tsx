'use client'
import React, { useEffect, useState } from 'react'
import useFormStore from '@/stores/FormStore'
import { Loader, TimerIcon, Users, LuggageIcon, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LocationInput from './LocationPicker'
import NewDropdownInput from './DropDownInput'
import NewDateTimePicker from '@/app/book-ride/NewDateTimePicker'

function Counter({
  label,
  field
}: {
  label: string
  field: 'bags' | 'passengers'
}) {
  const {setFormData , formData } = useFormStore()
  const increment = () => setFormData(field, Number(formData[field].value) + 1)
  const decrement = () => setFormData(field, Number(formData[field].value) - 1)

  return (
    <div className="flex flex-col w-full bg-gray-100 rounded-xl px-4 py-3">
      {/* Label inside field */}
      <label className="text-[13px] font-medium text-gray-600 mb-1">
        {label}
      </label>

      {/* Counter field */}
      <div className="flex items-center justify-between">
        {/* Value */}
        <span className="text-[15px] font-semibold text-gray-800">{formData[field].value}</span>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={decrement}
            disabled={Number(formData[field].value) === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/80 text-white hover:bg-primary/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <button
            onClick={increment}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/80 text-white hover:bg-primary/70 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}


function HeroForm() {
  const {
    category,
    changeCategory,
    formError,
    formLoading,
    changeStep,
    formData,
    isOrderDone,
    step,
    resetForm,
    setFormData,
  } = useFormStore()

  const router = useRouter()

  const durationArray = Array.from({ length: 48 }, (_, i) => {
    const hours = (i + 1) / 2
    const label =
      hours === 0.5 ? '0.5 Hour' : `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`
    return { label, value: hours.toString() }
  })


  useEffect(() => {
    if (isOrderDone) resetForm()
  }, [step, isOrderDone])

  async function ChangeStep(){
    console.log("working ")
    const res = await changeStep(true,1)
    if(res){
      router.push('/book-ride/select-vehicle')
    }
  }



  return (
    <div className="flex flex-col gap-2">
      {/* Category Selector */}
      <div className="grid grid-cols-3 lg:grid-cols-2 gap-5 max-lg:px-3">
        <div
          onClick={() => changeCategory('trip')}
          className={`p-2 w-full text-center font-semibold rounded-lg cursor-pointer ${category === 'trip'
            ? 'bg-primary text-white'
            : 'bg-white text-primary'
            }`}
        >
          Trip
        </div>
        <div
          onClick={() => changeCategory('hourly')}
          className={`p-2 w-full text-center font-semibold rounded-lg cursor-pointer ${category === 'hourly'
            ? 'bg-primary text-white'
            : 'bg-white text-primary'
            }`}
        >
          Hourly
        </div>
      </div>

      <div className="max-lg:px-3 max-lg:py-5 sm:p-5 rounded-lg bg-white flex flex-col gap-5 border border-gray-300 mx-3 lg:mx-0">
        {/* Main Fields */}
        <div className="flex flex-col gap-4 lg:gap-5 w-full">
          <LocationInput
            field="fromLocation"
            placeholder="Pickup Location"
            label="Start"
          />

          {category !== 'hourly' && (
            <LocationInput
              field="toLocation"
              placeholder="Drop Off Location"
              label="End"
            />
          )}

          {category === 'hourly' && (
            <NewDropdownInput
              Icon={TimerIcon}
              fieldName="duration"
              placeholder="Duration in Hours"
              options={durationArray}
            />
          )}

          <NewDateTimePicker
            selectedDate={formData.date.value}
            selectedTime={formData.time.value}
            setFormData={setFormData}
            dateFieldName="date"
            timeFieldName="time"
            placeholder="Select Date & Time"
            isDisable={false}
          />

          {/* Passengers & Bags — Side by Side */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Counter label="Passengers" field='passengers' />
            <Counter label="Bags" field='bags' />
          </div>

        </div>

        {formError && <div className="text-sm text-red-500">{formError}</div>}

        <div
           onClick={ChangeStep}
          className={`flex items-center justify-center gap-2 w-full p-3 rounded-lg cursor-pointer font-semibold transition-colors ${formLoading ? 'bg-primary/70 text-white' : 'bg-primary text-white hover:bg-primary/90'
            }`}
        >
          {formLoading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Loading...
            </>
          ) : (
            <>
              <Search size={20} className="text-white" />
              See Prices
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default HeroForm
