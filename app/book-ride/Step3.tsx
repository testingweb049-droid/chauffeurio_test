"use client"

import { LuggageIcon, User, Users, Mail, Plane, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
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

// Toggle Component for Equipment and Extras
function EquipmentExtrasToggle({
    childSeat,
    setChildSeat,
    infantSeat,
    setInfantSeat,
    boosterSeat,
    setBoosterSeat
}: {
    childSeat: number;
    setChildSeat: (value: number) => void;
    infantSeat: number;
    setInfantSeat: (value: number) => void;
    boosterSeat: number;
    setBoosterSeat: (value: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const hasExtras = childSeat > 0 || infantSeat > 0 || boosterSeat > 0;

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Toggle Header */}
            <div
                className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={handleToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <LuggageIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg text-primary">Equipment and Extras</div>
                        <div className="text-sm text-gray-600">
                            {hasExtras ? 'Additional equipment added' : 'Add child seats, booster seats, and more'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {hasExtras && (
                        <div className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                            Added
                        </div>
                    )}
                    <div className="text-gray-500">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>
            </div>

            {/* Toggle Content */}
            {isOpen && (
                <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-4">
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
                </div>
            )}
        </div>
    );
}

// Toggle Component for Airport Pickup
function AirportPickupToggle() {
    const { formData, setFormData } = useFormStore();
    const [isOpen, setIsOpen] = useState(Boolean(formData.isAirportPickup.value));

    const handleToggle = () => {
        const newValue = !isOpen;
        setIsOpen(newValue);
        setFormData('isAirportPickup', newValue.toString());
    };

    return (
        <div className="w-full">
            {/* Airport Pickup Toggle */}
            <div
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Plane className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg text-primary">Airport Pickup Details</div>
                        <div className="text-sm text-gray-600">
                            {isOpen ? 'Flight details added' : 'Add airline and flight information'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${isOpen ? 'bg-primary' : 'bg-gray-300'
                        }`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isOpen ? 'left-5' : 'left-1'
                            }`} />
                    </div>
                </div>
            </div>

            {/* Airport Details when Active */}
            {isOpen && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex flex-col gap-3">
                        <DetailsInput field='flightName' placeholder='Airline Name' Icon={Plane} type='text' />
                        <DetailsInput field='flightNumber' placeholder='Flight Number' Icon={Plane} type='text' />
                    </div>
                </div>
            )}
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
            formData.passengers.value &&
            formData.bags.value
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

    const handleContinueToPayment = () => {
        if (isFormValid()) {
            setShowPayment(true)
        } else {
            // Show error or highlight missing fields
            alert("Please fill all required fields before proceeding to payment.")
        }
    }

    // Prepare price breakdown data for PaymentForm
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

    return (
        <div className='flex flex-col gap-5 w-full'>
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md py-2 flex justify-start border-b border-gray-200">
                <button
                    onClick={() => changeStep(false, 3)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg border border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-[0.98] md:w-auto justify-center w-fit"
                    aria-label="Go back"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
            </div>

            <div className='text-2xl font-semibold text-primary'>Passenger Details</div>

            <div className='flex flex-col gap-3 w-full'>
                <DetailsInput field='name' placeholder='Passenger full name' Icon={User} type='text' />
                <PhoneInput />
                <DetailsInput field='email' placeholder='Your email' Icon={Mail} type='email' />

                <NewDateTimePicker
                    selectedDate={formData.date.value}
                    selectedTime={formData.time.value}
                    setFormData={setFormData}
                    dateFieldName="date"
                    timeFieldName="time"
                    placeholder='Select Date & Time'
                    isDisable={false}
                />

                <div className='grid grid-cols-2 gap-3'>
                    <NewDropdownInput Icon={Users} fieldName='passengers' placeholder='No. of Passengers' options={passengersArray} />
                    <NewDropdownInput Icon={LuggageIcon} fieldName='bags' placeholder='No. of Bags' options={bagsArray} />
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

                {/* Airport Pickup Toggle */}
                <AirportPickupToggle />

                {/* Equipment and Extras Toggle */}
                <EquipmentExtrasToggle
                    childSeat={childSeat}
                    setChildSeat={setChildSeat}
                    infantSeat={infantSeat}
                    setInfantSeat={setInfantSeat}
                    boosterSeat={boosterSeat}
                    setBoosterSeat={setBoosterSeat}
                />

                {/* Continue to Payment Button - Only show when payment section is hidden */}
                {!showPayment && (
                    <div className="w-full border-t-2 border-gray-300 pt-5 mt-5">
                        <div className='text-2xl font-semibold mb-5 text-primary'>Payment Summary</div>

                        {/* Quick Price Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg text-primary">Total Amount:</span>
                                <span className="font-bold text-xl text-primary">€ {calculateTotalPrice()}</span>
                            </div>
                        </div>

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
                )}

                {/* Payment Section - Only show after Continue to Payment is clicked */}
                {showPayment && (
                    <div className="w-full border-t-2 border-gray-300 pt-5 mt-5">
                        <div className='text-2xl font-semibold mb-5 text-primary'>Payment</div>
                        <MyPaymentForm
                            price={calculateTotalPrice()}
                            priceBreakdown={getPriceBreakdown()}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Step3