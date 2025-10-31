"use client"

import { LuggageIcon, User, Users, Mail, Plane } from 'lucide-react'
import React, { useState } from 'react'
import { DetailsInput, PhoneInput } from './UserDetailInput'
import NewDateTimePicker from './NewDateTimePicker'
import useFormStore from '@/stores/FormStore'
import NewDropdownInput from './DropDownInput'
import { fleets } from './CarList'
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

    // Local state
    const [childSeat, setChildSeat] = useState(Number(formData.childSeat.value) || 0);
    const [infantSeat, setInfantSeat] = useState(Number(formData.infantSeat.value) || 0);
    const [boosterSeat, setBoosterSeat] = useState(Number(formData.boosterSeat.value) || 0);
    const [showPayment, setShowPayment] = useState(false);

    const [isAirportPickupOpen, setIsAirportPickupOpen] = useState(Boolean(formData.isAirportPickup.value));
    const [isEquipmentExtrasOpen, setIsEquipmentExtrasOpen] = useState(false);
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(Boolean(formData.description.value));

    // ✅ Error tracking state
    const [errors, setErrors] = useState<Record<string, string>>({});

    const hasExtras = childSeat > 0 || infantSeat > 0 || boosterSeat > 0;
    const hasInstructions = Boolean(formData.description.value);
    const selectedFleet = fleets.find((item) => item.category === formData.car.value);

    const passengersArray = Array.from(
        { length: selectedFleet?.passengers ?? 0 },
        (_, i) => ({
            label: `${i + 1} ${i === 0 ? "Passenger" : "Passengers"}`,
            value: (i + 1).toString(),
        })
    );

    const bagsArray = Array.from(
        { length: selectedFleet?.luggage ?? 0 },
        (_, i) => ({
            label: `${i + 1} ${i === 0 ? "Bag" : "Bags"}`,
            value: (i + 1).toString(),
        })
    );

    // ✅ Validation function
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.value) newErrors.name = "Full name is required.";
        if (!formData.email.value) newErrors.email = "Email is required.";
        if (!formData.phone.value) newErrors.phone = "Phone number is required.";
        if (!formData.date.value) newErrors.date = "Pickup date is required.";
        if (!formData.time.value) newErrors.time = "Pickup time is required.";
        if (!formData.passengers.value) newErrors.passengers = "Number of passengers is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotalPrice = () => {
        const basePrice = parseFloat(formData.price?.value || "0");
        const extrasPrice = (childSeat * 5) + (infantSeat * 5) + (boosterSeat * 5);
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
    }, [childSeat, infantSeat, boosterSeat, setFormData]);

    React.useEffect(() => {
        setFormData('isAirportPickup', isAirportPickupOpen.toString());
    }, [isAirportPickupOpen, setFormData]);

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

                {/* Phone + DateTime */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div data-error={!!errors.phone}>
                        <PhoneInput />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div data-error={!!errors.date || !!errors.time}>
                        <NewDateTimePicker
                            selectedDate={formData.date.value}
                            selectedTime={formData.time.value}
                            setFormData={setFormData}
                            dateFieldName="date"
                            timeFieldName="time"
                            placeholder='Select Date & Time'
                            isDisable={false}
                        />
                        {(errors.date || errors.time) && <p className="text-red-500 text-sm mt-1">{errors.date || errors.time}</p>}
                    </div>
                </div>

                {/* Passengers + Bags */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div data-error={!!errors.passengers}>
                        <NewDropdownInput Icon={Users} fieldName='passengers' placeholder='No. of Passengers' options={passengersArray} />
                        {errors.passengers && <p className="text-red-500 text-sm mt-1">{errors.passengers}</p>}
                    </div>
                    <NewDropdownInput Icon={LuggageIcon} fieldName='bags' placeholder='No. of Bags' options={bagsArray} />
                </div>
                <AddReturn />
                {/* ✅ Your toggle buttons remain intact */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
                    <div className="flex items-center justify-start gap-2 w-full">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setIsAirportPickupOpen(!isAirportPickupOpen)}
                        >
                            <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isAirportPickupOpen ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isAirportPickupOpen ? 'left-7' : 'left-1'}`} />
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-gray-900">Airport Pickup</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-start gap-2 w-full">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setIsEquipmentExtrasOpen(!isEquipmentExtrasOpen)}
                        >
                            <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isEquipmentExtrasOpen ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isEquipmentExtrasOpen ? 'left-7' : 'left-1'}`} />
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-gray-900 text-sm">Equipment & Extras</div>
                        </div>
                        {/* {hasExtras && <div className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">Added</div>} */}
                    </div>

                    <div className="flex items-center justify-start gap-2 w-full">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                        >
                            <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isInstructionsOpen ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isInstructionsOpen ? 'left-7' : 'left-1'}`} />
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-gray-900">Add Instructions</div>
                        </div>
                        {/* {hasInstructions && <div className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">Added</div>} */}
                    </div>
                </div>

                {/* Toggle content sections */}
                <div className='flex flex-col gap-4 w-full'>
                    {isAirportPickupOpen && (
                        <div className="p-4 border border-primary/60 rounded-lg w-full">
                            <p className="text-sm text-gray-600 mb-2">Add your flight information for airport pickup</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <DetailsInput field='flightName' placeholder='Airline Name' Icon={Plane} type='text' />
                                <DetailsInput field='flightNumber' placeholder='Flight Number' Icon={Plane} type='text' />
                            </div>
                        </div>
                    )}

                    {isEquipmentExtrasOpen && (
                        <div className="p-4 border border-primary/60 rounded-lg w-full">
                            <p className="text-sm text-gray-600 mb-2">Select additional equipment for your journey</p>
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
                            </div>
                        </div>
                    )}

                    {isInstructionsOpen && (
                        <div className="p-4 border border-primary/60 rounded-lg w-full">
                            <p className="text-sm text-gray-600 mb-2">Add any special instructions for your journey</p>
                            <textarea
                                value={formData.description.value}
                                onChange={(e) => handleInstructionsChange(e.target.value)}
                                placeholder="Enter any special instructions, pickup details, or requirements..."
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-primary"
                            />
                        </div>
                    )}
                </div>



                {formData.isReturn.value && (
                    <NewDateTimePicker
                        selectedDate={formData.returnDate.value}
                        selectedTime={formData.returnTime.value}
                        setFormData={setFormData}
                        dateFieldName="returnDate"
                        minSelectableDate={new Date(formData.date.value)}
                        isDisable={formData.date.value === ''}
                        timeFieldName="returnTime"
                        placeholder='Select Return Date & Time'
                    />
                )}

                {!showPayment && (
                    <div className="w-full border-t-2 border-gray-300 pt-5 mt-5">
                        <button
                            type="button"
                            onClick={handleContinueToPayment}
                            className="w-full py-3 px-6 rounded-lg font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
                        >
                            Proceed to Payment - € {calculateTotalPrice()}
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
