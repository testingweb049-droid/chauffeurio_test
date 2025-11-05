"use client"

import { User, Mail, Plane } from 'lucide-react'
import React, { useState } from 'react'
import { DetailsInput, PhoneInput } from './UserDetailInput'
import useFormStore from '@/stores/FormStore'
import AddReturn from './AddReturn'
import MyPaymentForm from './PaymentForm'

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
                    <div className="text-sm text-gray-600">EUR {price.toFixed(2)}</div>
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
    const { formData, setFormData } = useFormStore();

    const [childSeat, setChildSeat] = useState(Number(formData.childSeat.value) || 0);
    const [infantSeat, setInfantSeat] = useState(Number(formData.infantSeat.value) || 0);
    const [boosterSeat, setBoosterSeat] = useState(Number(formData.boosterSeat.value) || 0);
    const [extraStops, setExtraStops] = useState(Number(formData.extraStops?.value || 0))
    const [showPayment, setShowPayment] = useState(false);
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(Boolean(formData.description.value));
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.value) newErrors.name = "Full name is required.";
        if (!formData.email.value) newErrors.email = "Email is required.";
        if (!formData.phone.value) newErrors.phone = "Phone number is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotalPrice = () => {
        const basePrice = parseFloat(formData.price?.value || "0");
        const extrasPrice =
            (childSeat * 5) +
            (infantSeat * 5) +
            (boosterSeat * 5) +
            (extraStops * 5);
        const isReturn = Boolean(formData.isReturn.value);
        const returnPrice = isReturn ? basePrice - (basePrice / 10) : 0;
        const meetGreetPrice = formData.isMeetGreet.value ? 15 : 0;
        const flightTrackPrice = formData.isFlightTrack.value ? 7 : 0;

        const total = basePrice + extrasPrice + returnPrice + meetGreetPrice + flightTrackPrice;
        return total.toFixed(2);
    };

    React.useEffect(() => {
        setFormData('childSeat', childSeat.toString());
        setFormData('infantSeat', infantSeat.toString());
        setFormData('boosterSeat', boosterSeat.toString());
        setFormData('extraStops', extraStops.toString());
    }, [childSeat, infantSeat, boosterSeat, extraStops, setFormData]);

    const handleInstructionsChange = (value: string) => {
        setFormData('description', value);
    };

    const handleContinueToPayment = () => {
        if (validateForm()) {
            setShowPayment(true);
            setTimeout(() => {
                const paymentForm = document.querySelector('form') as HTMLFormElement;
                if (paymentForm) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    paymentForm.dispatchEvent(submitEvent);
                }
            }, 100);
        } else {
            const firstError = document.querySelector('[data-error="true"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className='flex flex-col gap-5 w-full'>
            <div className='text-2xl font-semibold text-primary'>Passenger Details</div>

            <div className='flex flex-col gap-4 w-full'>

                {/* Passenger Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div data-error={!!errors.name}>
                        <DetailsInput field='name' placeholder='Passenger full name' Icon={User} type='text' />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div data-error={!!errors.email}>
                        <DetailsInput field='email' placeholder='Your email' Icon={Mail} type='email' />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                </div>

                {/* Phone */}
                <div className="w-full" data-error={!!errors.phone}>
                    <PhoneInput />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <AddReturn />
                {
                    formData.isReturn.value && (
                        <div className="p-4 border border-primary/60 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3">Return Trip Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                                    <input
                                        type="date"
                                        value={formData.returnDate.value}
                                        onChange={(e) => setFormData('returnDate', e.target.value)}
                                        min={formData.date.value}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
                                    <input
                                        type="time"
                                        value={formData.returnTime.value}
                                        onChange={(e) => setFormData('returnTime', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="">
                    <h4 className="font-semibold text-gray-900 mb-3">Airport Pickup</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <DetailsInput field='flightName' placeholder='Airline Name' Icon={Plane} type='text' />
                        <DetailsInput field='flightNumber' placeholder='Flight Number' Icon={Plane} type='text' />
                    </div>
                </div>
                {/* Equipment & Extras */}
                <div className="w-full">
                    <div className="font-semibold text-gray-900 mb-4">Equipment & Extras</div>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                        <div className="px-4">
                            <ExtraCounter label="Child Seat" price={5.00} value={childSeat} onChange={setChildSeat} />
                        </div>
                        <div className="px-4">
                            <ExtraCounter label="Infant Seat" price={5.00} value={infantSeat} onChange={setInfantSeat} />
                        </div>
                        <div className="px-4">
                            <ExtraCounter label="Booster Seat" price={5.00} value={boosterSeat} onChange={setBoosterSeat} />
                        </div>
                        <div className="px-4">
                            <ExtraCounter label="Extra Stops" price={5.00} value={extraStops} onChange={setExtraStops} />
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

                {!showPayment && (
                    <div className="w-full border-t-2 border-gray-300 pt-5 mt-5">
                        <button
                            type="button"
                            onClick={handleContinueToPayment}
                            className="w-full py-3 px-6 rounded-lg font-semibold text-lg bg-primary text-white hover:bg-primary/80 shadow-md transition-all"
                        >
                            Pay - € {calculateTotalPrice()}
                        </button>
                    </div>
                )}

                {showPayment && (
                    <div className="w-full border-t-2 border-gray-300">
                        <MyPaymentForm price={calculateTotalPrice()} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Step3
