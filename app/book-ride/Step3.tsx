"use client"

import { LuggageIcon, User, Users, Mail, Plane, ChevronDown, ChevronUp, ArrowLeft, MessageCircle } from 'lucide-react'
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
    const increment = () => {
        onChange(value + 1);
    };

    const decrement = () => {
        if (value > 0) {
            onChange(value - 1);
        }
    };

    const handleCheckboxChange = () => {
        if (value > 0) {
            onChange(0);
        } else {
            onChange(1);
        }
    };

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

// Price Breakdown Component
function PriceBreakdownSection({ priceBreakdown }: { priceBreakdown: any }) {
    const CURRENCY = '€';
    const format = (n: number) => n.toFixed(2);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col gap-5 w-full">
                <div className="font-bold text-lg text-gray-900">Price Breakdown</div>

                <div className="flex flex-col gap-3 w-full">
                    {/* Base Price */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-sm text-gray-600">{priceBreakdown.carLabel}</div>
                        <div className="text-sm text-gray-600">
                            {CURRENCY} {format(priceBreakdown.basePrice)}
                        </div>
                    </div>

                    {/* Child Seats */}
                    {priceBreakdown.childSeats > 0 && (
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-gray-600">
                                Child Seat{priceBreakdown.childSeats > 1 ? 's' : ''} (x{priceBreakdown.childSeats})
                            </div>
                            <div className="text-sm text-gray-600">
                                {CURRENCY} {format(priceBreakdown.childSeatTotal)}
                            </div>
                        </div>
                    )}

                    {/* Infant Seats */}
                    {priceBreakdown.infantSeats > 0 && (
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-gray-600">
                                Infant Seat{priceBreakdown.infantSeats > 1 ? 's' : ''} (x{priceBreakdown.infantSeats})
                            </div>
                            <div className="text-sm text-gray-600">
                                {CURRENCY} {format(priceBreakdown.infantSeatTotal)}
                            </div>
                        </div>
                    )}

                    {/* Booster Seats */}
                    {priceBreakdown.boosterSeats > 0 && (
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-gray-600">
                                Booster Seat{priceBreakdown.boosterSeats > 1 ? 's' : ''} (x{priceBreakdown.boosterSeats})
                            </div>
                            <div className="text-sm text-gray-600">
                                {CURRENCY} {format(priceBreakdown.boosterSeatTotal)}
                            </div>
                        </div>
                    )}

                    {/* Meet & Greet */}
                    {priceBreakdown.isMeetGreet && (
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-gray-600">Meet & Greet</div>
                            <div className="text-sm text-gray-600">
                                {CURRENCY} {format(priceBreakdown.meetGreetTotal)}
                            </div>
                        </div>
                    )}

                    {/* Flight Track */}
                    {priceBreakdown.isFlightTrack && (
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-gray-600">Flight Track</div>
                            <div className="text-sm text-gray-600">
                                {CURRENCY} {format(priceBreakdown.flightTrackTotal)}
                            </div>
                        </div>
                    )}

                    {/* Return Transfer */}
                    {priceBreakdown.isReturn && (
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-gray-600">Return Transfer</div>
                            <div className="text-sm text-gray-600">
                                {CURRENCY} {format(priceBreakdown.returnPrice)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t-2 border-black border-dashed text-xl font-bold text-black">
                <div>Total:</div>
                <div>
                    {CURRENCY} {format(priceBreakdown.totalPrice)}
                </div>
            </div>
        </div>
    );
}

function Step3() {
    const { formData, setFormData, changeStep } = useFormStore();

    // Local state for extras
    const [childSeat, setChildSeat] = useState(Number(formData.childSeat.value) || 0);
    const [infantSeat, setInfantSeat] = useState(Number(formData.infantSeat.value) || 0);
    const [boosterSeat, setBoosterSeat] = useState(Number(formData.boosterSeat.value) || 0);
    const [showPayment, setShowPayment] = useState(false);

    // State for toggles
    const [isAirportPickupOpen, setIsAirportPickupOpen] = useState(Boolean(formData.isAirportPickup.value));
    const [isEquipmentExtrasOpen, setIsEquipmentExtrasOpen] = useState(false);
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(Boolean(formData.description.value));

    const hasExtras = childSeat > 0 || infantSeat > 0 || boosterSeat > 0;
    const hasInstructions = Boolean(formData.description.value);

    // Find the selected fleet category
    const selectedFleet = fleets.find((item) => item.category === formData.car.value);

    const passengersArray = Array.from(
        { length: selectedFleet?.passengers ?? 0 },
        (_, i) => {
            const count = i + 1
            return {
                label: `${count} ${count === 1 ? "Passenger" : "Passengers"}`,
                value: count.toString(),
            }
        }
    )

    const bagsArray = Array.from(
        { length: selectedFleet?.luggage ?? 0 },
        (_, i) => {
            const count = i + 1
            return {
                label: `${count} ${count === 1 ? "Bag" : "Bags"}`,
                value: count.toString(),
            }
        }
    )

    // Check if all required fields are filled
    const isFormValid = () => {
        return (
            formData.name.value &&
            formData.email.value &&
            formData.phone.value &&
            formData.date.value &&
            formData.time.value &&
            formData.passengers.value
        )
    }

    // Calculate total price including extras AND return
    const calculateTotalPrice = () => {
        // Get base price from formData
        const basePrice = parseFloat(formData.price?.value || "0");
        const extrasPrice = (childSeat * 5) + (infantSeat * 5) + (boosterSeat * 5);

        // Calculate return price if return is selected
        const isReturn = Boolean(formData.isReturn.value);
        const returnPrice = isReturn ? basePrice - (basePrice / 10) : 0;

        // Calculate Meet & Greet and Flight Track if selected
        const meetGreetPrice = formData.isMeetGreet.value ? 15 : 0;
        const flightTrackPrice = formData.isFlightTrack.value ? 7 : 0;

        const total = basePrice + extrasPrice + returnPrice + meetGreetPrice + flightTrackPrice;
        return total.toFixed(2);
    }

    // Save extras to form store whenever they change
    React.useEffect(() => {
        setFormData('childSeat', childSeat.toString());
        setFormData('infantSeat', infantSeat.toString());
        setFormData('boosterSeat', boosterSeat.toString());
    }, [childSeat, infantSeat, boosterSeat, setFormData]);

    // Save airport pickup state to form store
    React.useEffect(() => {
        setFormData('isAirportPickup', isAirportPickupOpen.toString());
    }, [isAirportPickupOpen, setFormData]);

    // Handle instructions change
    const handleInstructionsChange = (value: string) => {
        setFormData('description', value);
    };

    // Prepare price breakdown data
    const getPriceBreakdown = () => {
        const basePriceNum = Number(formData.price.value ?? 0);
        const isReturn = Boolean(formData.isReturn.value);
        const isMeetGreet = Boolean(formData.isMeetGreet.value);
        const isFlightTrack = Boolean(formData.isFlightTrack.value);
        const childSeats = Number(formData.childSeat.value ?? 0);
        const infantSeats = Number(formData.infantSeat.value ?? 0);
        const boosterSeats = Number(formData.boosterSeat.value ?? 0);
        const carLabel = String(formData.car.value ?? 'Economy Sedan Transfer');

        // Fees
        const MEET_GREET_FEE = 15;
        const FLIGHT_TRACK_FEE = 7;
        const CHILD_SEAT_FEE = 5;
        const INFANT_SEAT_FEE = 5;
        const BOOSTER_SEAT_FEE = 5;

        // Return calculation: if return is selected, return price is base - 10%
        const returnPriceNum = isReturn ? basePriceNum - (basePriceNum / 10) : 0;

        // Calculate extras totals
        const childSeatTotal = childSeats * CHILD_SEAT_FEE;
        const infantSeatTotal = infantSeats * INFANT_SEAT_FEE;
        const boosterSeatTotal = boosterSeats * BOOSTER_SEAT_FEE;
        const meetGreetTotal = isMeetGreet ? MEET_GREET_FEE : 0;
        const flightTrackTotal = isFlightTrack ? FLIGHT_TRACK_FEE : 0;

        // Calculate TOTAL price including base + extras + return
        const totalPriceNum = basePriceNum +
            childSeatTotal +
            infantSeatTotal +
            boosterSeatTotal +
            meetGreetTotal +
            flightTrackTotal +
            returnPriceNum;

        return {
            basePrice: basePriceNum,
            isReturn,
            returnPrice: returnPriceNum,
            childSeats,
            childSeatTotal,
            infantSeats,
            infantSeatTotal,
            boosterSeats,
            boosterSeatTotal,
            isMeetGreet,
            meetGreetTotal,
            isFlightTrack,
            flightTrackTotal,
            carLabel,
            totalPrice: totalPriceNum
        };
    };

    const handleContinueToPayment = () => {
        if (isFormValid()) {
            setShowPayment(true);

            // Automatically initiate Revolut payment when showing payment section
            setTimeout(() => {
                const paymentForm = document.querySelector('form') as HTMLFormElement;
                if (paymentForm) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    paymentForm.dispatchEvent(submitEvent);
                }
            }, 100);
        } else {
            alert("Please fill all required fields before proceeding to payment.");
        }
    }

    const priceBreakdown = getPriceBreakdown();

    return (
        <div className='flex flex-col gap-5 w-full'>
            <div className='text-2xl font-semibold text-primary'>Passenger Details</div>

            <div className='flex flex-col gap-4 w-full'>
                {/* Passenger Name and Email - Side by side on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailsInput field='name' placeholder='Passenger full name' Icon={User} type='text' />
                    <DetailsInput field='email' placeholder='Your email' Icon={Mail} type='email' />
                </div>

                {/* Phone and Date/Time - Side by side on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhoneInput />
                    <NewDateTimePicker
                        selectedDate={formData.date.value}
                        selectedTime={formData.time.value}
                        setFormData={setFormData}
                        dateFieldName="date"
                        timeFieldName="time"
                        placeholder='Select Date & Time'
                        isDisable={false}
                    />
                </div>

                {/* Passengers and Bags - Always side by side */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <NewDropdownInput Icon={Users} fieldName='passengers' placeholder='No. of Passengers' options={passengersArray} />
                    <NewDropdownInput Icon={LuggageIcon} fieldName='bags' placeholder='No. of Bags' options={bagsArray} />
                </div>

                {/* Toggle Buttons Side by Side */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
                    {/* Airport Pickup Toggle Button */}
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

                    {/* Equipment Extras Toggle Button */}
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
                        {hasExtras && (
                            <div className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                                Added
                            </div>
                        )}
                    </div>

                    {/* Add Instructions Toggle Button */}
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
                        {hasInstructions && (
                            <div className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                                Added
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Sections - Stacked Uper Neechay */}
                <div className='flex flex-col gap-4 w-full'>
                    {/* Airport Pickup Content */}
                    {isAirportPickupOpen && (
                        <div className="p-4 border border-primary/60 rounded-lg w-full">
                            {/* Airport Pickup Title */}
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Add your flight information for airport pickup</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <DetailsInput field='flightName' placeholder='Airline Name' Icon={Plane} type='text' />
                                <DetailsInput field='flightNumber' placeholder='Flight Number' Icon={Plane} type='text' />
                            </div>
                        </div>
                    )}

                    {/* Equipment Extras Content */}
                    {isEquipmentExtrasOpen && (
                        <div className="p-4 border border-primary/60 rounded-lg w-full">
                            {/* Equipment and Extras Title */}
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Select additional equipment for your journey</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                                <div className="px-4">
                                    <ExtraCounter
                                        label="Child Seat"
                                        price={5.00}
                                        value={childSeat}
                                        onChange={setChildSeat}
                                    />
                                </div>
                                <div className="px-4">
                                    <ExtraCounter
                                        label="Infant Seat"
                                        price={5.00}
                                        value={infantSeat}
                                        onChange={setInfantSeat}
                                    />
                                </div>
                                <div className="px-4">
                                    <ExtraCounter
                                        label="Booster Seat"
                                        price={5.00}
                                        value={boosterSeat}
                                        onChange={setBoosterSeat}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Instructions Content */}
                    {isInstructionsOpen && (
                        <div className="p-4 border border-primary/60 rounded-lg w-full">
                            {/* Add Instructions Title */}
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Add any special instructions for your journey</p>
                            </div>
                            <textarea
                                value={formData.description.value}
                                onChange={(e) => handleInstructionsChange(e.target.value)}
                                placeholder="Enter any special instructions, pickup details, or requirements..."
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                            />
                        </div>
                    )}
                </div>

                <AddReturn />
                {formData.isReturn.value && (
                    <NewDateTimePicker
                        selectedDate={formData.returnDate.value}
                        selectedTime={formData.returnTime.value}
                        setFormData={setFormData}
                        dateFieldName="returnDate"
                        minSelectableDate={new Date(formData.date.value)}
                        isDisable={formData.date.value === '' ? true : false}
                        timeFieldName="returnTime"
                        placeholder='Select Return Date & Time'
                    />
                )}

                {/* Continue to Payment Button - Only show when payment section is hidden */}
                {!showPayment && (
                    <div className="w-full border-t-2 border-gray-300 pt-5 mt-5">
                        <div className='text-2xl font-semibold mb-5 text-primary'>Payment Summary</div>

                        {/* Price Breakdown - Now shown in Step3 */}
                        <PriceBreakdownSection priceBreakdown={priceBreakdown} />

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleContinueToPayment}
                                disabled={!isFormValid()}
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${isFormValid()
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {isFormValid()
                                    ? `Proceed to Payment - € ${calculateTotalPrice()}`
                                    : "Please Fill All Required Fields"
                                }
                            </button>
                        </div>
                    </div>
                )}

                {/* Payment Section - Only show after Continue to Payment is clicked */}
                {showPayment && (
                    <div className="w-full border-t-2 border-gray-300 pt-5 mt-5">
                        <div className='text-2xl font-semibold mb-5 text-primary'>Payment</div>
                        <MyPaymentForm
                            price={calculateTotalPrice()}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Step3