"use client"

import { User, Mail, Plane, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DetailsInput, PhoneInput } from './UserDetailInput'
import useFormStore from '@/stores/FormStore'
import AddReturn from './AddReturn'
import MyPaymentForm from './PaymentForm'
import NewDateTimePicker from './NewDateTimePicker'
import { generateSecret } from '@/lib/generateSecret'

// Counter component for extras
function ExtraCounter({
    label,
    price,
    value,
    onChange
}: {
    label: string;
    price: number;
    value: number;
    onChange: (newValue: number) => void;
}) {
    const increment = () => onChange(value + 1);
    const decrement = () => value > 0 && onChange(value - 1);
    const handleCheckboxChange = () => onChange(value > 0 ? 0 : 1);

    return (
        <div className="flex items-center justify-between w-full py-3">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={value > 0}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer accent-brand"
                />
                <div>
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-sm text-gray-600">EUR {price.toFixed(0)}</div>
                </div>
            </div>

            <div className="flex items-center gap-0 border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={decrement}
                    disabled={value === 0}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                    type="button"
                >
                    -
                </button>
                <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300 font-medium text-gray-900">
                    {value}
                </div>
                <button
                    onClick={increment}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors font-medium text-lg"
                    type="button"
                >
                    +
                </button>
            </div>
        </div>
    );
}

function Step3() {
    const { formData, setFormData, changeStep, getTotalPrice, formLoading, formError, setFieldOptions } = useFormStore();

    // Extras
    const childSeat = Number(formData.childSeat.value) || 0;
    const infantSeat = Number(formData.infantSeat.value) || 0;
    const boosterSeat = Number(formData.boosterSeat.value) || 0;
    const extraStops = Number(formData.extraStops?.value || 0);

    // State for collapsibles
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(Boolean(formData.description.value));
    const [isAirportDetailsOpen, setIsAirportDetailsOpen] = useState(
        Boolean(formData.flightName.value || formData.flightNumber.value)
    );

    const handleInstructionsChange = (value: string) => setFormData('description', value);

    const payment_secret = generateSecret();

    const handleContinueToPayment = () => {
        if (formLoading) return;
        changeStep(true, 3, payment_secret);
    };

    return (
        <div className='flex flex-col gap-5 w-full'>
            <div className='text-2xl font-semibold text-primary'>Passenger Details</div>

            <div className='flex flex-col gap-4 w-full'>
                {/* Passenger Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <DetailsInput field='name' placeholder='Passenger full name' Icon={User} type='text' />
                        {formData.name.error && <p className="text-red-500 text-sm mt-1">{formData.name.error}</p>}
                    </div>
                    <div>
                        <DetailsInput field='email' placeholder='Your email' Icon={Mail} type='email' />
                        {formData.email.error && <p className="text-red-500 text-sm mt-1">{formData.email.error}</p>}
                    </div>
                </div>

                {/* Phone */}
                <div className="w-full">
                    <PhoneInput />
                </div>

                {/* Airport Details */}
                <div className="w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <input
                            type="checkbox"
                            checked={isAirportDetailsOpen}
                            onChange={(e) => {setIsAirportDetailsOpen(e.target.checked); setFieldOptions('flightName',e.target.checked ); setFieldOptions('flightNumber',e.target.checked );  }}
                            className="w-5 h-5 rounded border-gray-300 cursor-pointer accent-brand"
                        />
                        <div className="font-semibold text-gray-900">Add Airport Details</div>
                    </div>

                    {isAirportDetailsOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <DetailsInput
                                    field="flightName"
                                    placeholder="Airline Name"
                                    Icon={Plane}
                                    type="text"
                                />
                                {formData.flightName.error && (
                                    <p className="text-red-500 text-sm mt-1">{formData.flightName.error}</p>
                                )}
                            </div>
                            <div>
                                <DetailsInput
                                    field="flightNumber"
                                    placeholder="Flight Number"
                                    Icon={Plane}
                                    type="text"
                                />
                                {formData.flightNumber.error && (
                                    <p className="text-red-500 text-sm mt-1">{formData.flightNumber.error}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <AddReturn />
                {formData.isReturn.value && (
                    <div className="p-4 border border-primary/60 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Return Trip Details</h4>
                        <NewDateTimePicker
                            selectedDate={formData.returnDate.value}
                            selectedTime={formData.returnTime.value}
                            setFormData={setFormData}
                            dateFieldName="returnDate"
                            timeFieldName="returnTime"
                            placeholder="Select return date & time"
                            minSelectableDate={formData.date.value ? new Date(formData.date.value) : null}
                        />
                    </div>
                )}

                {/* Equipment & Extras */}
                <div className="w-full">
                    <div className="font-semibold text-gray-900 mb-4">Equipment & Extras</div>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                        <div className="px-4">
                            <ExtraCounter label="Child Seat" price={5.00} value={childSeat} onChange={(v) => setFormData("childSeat", v)} />
                        </div>
                        <div className="px-4">
                            <ExtraCounter label="Infant Seat" price={5.00} value={infantSeat} onChange={(v) => setFormData("infantSeat", v)} />
                        </div>
                        <div className="px-4">
                            <ExtraCounter label="Booster Seat" price={5.00} value={boosterSeat} onChange={(v) => setFormData("boosterSeat", v)} />
                        </div>
                        <div className="px-4">
                            <ExtraCounter label="Extra Stops" price={15.00} value={extraStops} onChange={(v) => setFormData("extraStops", v)} />
                        </div>
                    </div>
                </div>

                {/* Add Instructions */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={isInstructionsOpen}
                        onChange={(e) => setIsInstructionsOpen(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer accent-brand"
                    />
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900">Add Instructions</div>
                    </div>
                </div>

                {isInstructionsOpen && (
                    <textarea
                        value={formData.description.value}
                        onChange={(e) => handleInstructionsChange(e.target.value)}
                        placeholder="Enter any special instructions, pickup details, or requirements..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-primary"
                    />
                )}
            </div>

            {formError && <p className='text-center text-red-500 text-sm'>{formError}</p>}

            <div
                onClick={handleContinueToPayment}
                className={`w-full cursor-pointer flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-lg transition-all ${formLoading
                    ? "bg-primary text-white opacity-80 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/80 shadow-md"
                    }`}
            >
                {formLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {"Redirecting to Payment..."}
                    </>
                ) : (
                    <>Pay Securely - € {getTotalPrice()}</>
                )}
            </div>
        </div>
    );
}

export default Step3
