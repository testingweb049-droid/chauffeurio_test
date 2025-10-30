import { LuggageIcon, User, Users, Mail, Plane, ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'
import { DetailsInput, PhoneInput } from './UserDetailInput'
import NewDateTimePicker from './NewDateTimePicker'
import useFormStore from '@/stores/FormStore'
import NewDropdownInput from './DropDownInput'
import { fleets } from './CarList'
import SelectableCheckbox from './SelectableCheckbox'
import AddReturn from './AddReturn'
import LoadingButton from './LoadingButton'
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

// Accordion Component for Equipment and Extras
function EquipmentExtrasAccordion({
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

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Accordion Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <LuggageIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg text-primary">Equipment and Extras</div>
                        <div className="text-sm text-gray-600">Add child seats, booster seats, and more</div>
                    </div>
                </div>
                <div className="text-gray-500">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>

            {/* Accordion Content */}
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

function Step3() {
    const { formData, setFormData, changeStep, formLoading } = useFormStore();

    // Local state for extras
    const [childSeat, setChildSeat] = useState(0);
    const [infantSeat, setInfantSeat] = useState(0);
    const [boosterSeat, setBoosterSeat] = useState(0);
    const [extraStop, setExtraStop] = useState(0);
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

    // Calculate total price including extras
    const calculateTotalPrice = () => {
        // Get base price from formData
        const basePrice = parseFloat(formData.price?.value || "0");
        const extrasPrice = (childSeat * 5) + (infantSeat * 5) + (boosterSeat * 5);
        return (basePrice + extrasPrice).toFixed(2);
    }

    // Save extras to form store whenever they change
    React.useEffect(() => {
        setFormData('childSeat', childSeat.toString());
        setFormData('infantSeat', infantSeat.toString());
        setFormData('boosterSeat', boosterSeat.toString());
    }, [childSeat, infantSeat, boosterSeat]);

    const handleContinueToPayment = () => {
        if (isFormValid()) {
            setShowPayment(true)
        } else {
            // Show error or highlight missing fields
            console.log("Please fill all required fields")
        }
    }

    return (
        <div className='flex flex-col gap-5 w-full'>
            <div className='text-2xl font-semibold text-primary'>Details</div>

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

                {formData.isReturn.value && <NewDateTimePicker
                    selectedDate={formData.returnDate.value}
                    selectedTime={formData.returnTime.value}
                    setFormData={setFormData}
                    dateFieldName="returnDate"
                    minSelectableDate={new Date(formData.date.value)}
                    isDisable={formData.date.value === '' ? true : false}
                    timeFieldName="returnTime"
                    placeholder='Select Return Date & Time'
                />}

                <div className="w-full">
                    <SelectableCheckbox fieldName='isAirportPickup' label='Airport Pickup Details' />

                    <div className="w-full overflow-hidden transition-all duration-500"
                        style={{ maxHeight: formData.isAirportPickup.value ? '200px' : '0' }}>
                        <div className={`flex flex-col gap-3 pt-3 opacity-${formData.isAirportPickup.value ? '100' : '0'} transition-opacity duration-500`}>
                            <DetailsInput field='flightName' placeholder='Airline Name' Icon={Plane} type='text' />
                            <DetailsInput field='flightNumber' placeholder='Flight Number' Icon={Plane} type='text' />
                        </div>
                    </div>
                </div>

                {/* Equipment and Extras Accordion */}
                <EquipmentExtrasAccordion
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
                        <div className='text-2xl font-semibold mb-5 text-primary'>Payment</div>
                        <button
                            type="button"
                            onClick={handleContinueToPayment}
                            disabled={!isFormValid()}
                            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${isFormValid()
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            Continue to Payment - € {calculateTotalPrice()}
                        </button>
                    </div>
                )}

                {/* Payment Section - Only show after Continue to Payment is clicked */}
                {showPayment && (
                    <div className="w-full border-t-2 border-gray-300 pt-5 mt-5">
                        <div className='text-2xl font-semibold mb-5 text-primary'>Payment</div>
                        <MyPaymentForm price={calculateTotalPrice()} />
                    </div>
                )}
            </div>
            <div
                onClick={() => { changeStep(false, 3); }}
                className='p-2 rounded-lg border border-gray-500 w-full text-center text-gray-700 font-semibold cursor-pointer'
            >
                Back
            </div>
        </div>
    )
}

export default Step3