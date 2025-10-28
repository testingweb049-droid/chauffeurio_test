import { LuggageIcon, User, Users, Mail, Plane } from 'lucide-react'
import React from 'react'
import { DetailsInput, PhoneInput } from './UserDetailInput'
import NewDateTimePicker from './NewDateTimePicker'
import useFormStore from '@/stores/FormStore'
import NewDropdownInput from './DropDownInput'
import { fleets } from './CarList'
import SelectableCheckbox from './SelectableCheckbox'
import AddReturn from './AddReturn'
import LoadingButton from './LoadingButton'
import MyPaymentForm from './PaymentForm'
import BackButton from './BackButton'

// Counter component for extras
function ExtraCounter({
    label,
    price,
    extraType
}: {
    label: string;
    price: number;
        extraType: 'childSeat' | 'infantSeat' | 'boosterSeat';
}) {
    const { formData, updateExtra } = useFormStore();

    const value = formData[extraType]?.value || 0;

    const increment = () => {
        updateExtra(extraType, value + 1);
    };

    const decrement = () => {
        if (value > 0) {
            updateExtra(extraType, value - 1);
        }
    };

    const handleCheckboxChange = () => {
        if (value > 0) {
            updateExtra(extraType, 0);
        } else {
            updateExtra(extraType, 1);
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

function Step3() {
    const { formData, setFormData, changeStep, formLoading } = useFormStore();

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

    // Calculate total price (moved from Step4)
    const basePrice = Number(formData.price.value ?? 0)
    const returnPrice = formData.isReturn ? basePrice - (basePrice / 10) : 0

    // Calculate extras total from form store
    const childSeatTotal = (formData.childSeat?.value || 0) * 5;
    const infantSeatTotal = (formData.infantSeat?.value || 0) * 5;
    const boosterSeatTotal = (formData.boosterSeat?.value || 0) * 5;
    const extrasTotal = childSeatTotal + infantSeatTotal + boosterSeatTotal;

    const totalPrice = (
        Number(formData.price.value) +
        (formData.isMeetGreet.value ? 15 : 0) +
        (formData.isFlightTrack.value ? 7 : 0) +
        returnPrice +
        extrasTotal
    ).toFixed(1)

    return (
        <div className='flex flex-col gap-5 w-full'>
            <div className='text-2xl font-semibold'>Details</div>

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

                <div className='font-bold text-lg mt-2'>Equipment and Extras</div>

                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                    <div className="px-4">
                        <ExtraCounter
                            label="Child Seat"
                            price={5.00}
                            extraType="childSeat"
                        />
                    </div>
                    <div className="px-4">
                        <ExtraCounter
                            label="Infant Seat"
                            price={5.00}
                            extraType="infantSeat"
                        />
                    </div>
                    <div className="px-4">
                        <ExtraCounter
                            label="Booster Seat"
                            price={5.00}
                            extraType="boosterSeat"
                        />
                    </div>
                </div>

                {/* Price Breakdown Section (moved from Step4) */}
                <div className='flex flex-col gap-6 w-full mt-6'>
                    <div className='flex flex-col gap-5 w-full'>
                        <div className='font-bold text-lg'>Price Breakdown</div>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center justify-between gap-2'>
                                <div className='text-sm text-gray-500'>Economy Sedan Transfer</div>
                                <div className='text-sm text-gray-500'>£ {Number(formData.price.value).toFixed(1)} </div>
                            </div>
                            {formData.isMeetGreet.value && <div className='flex items-center justify-between gap-2'>
                                <div className='text-sm text-gray-500'>Meet & Greet</div>
                                <div className='text-sm text-gray-500'>£ 15.0</div>
                            </div>}
                            {formData.isFlightTrack.value && <div className='flex items-center justify-between gap-2'>
                                <div className='text-sm text-gray-500'>Flight Track</div>
                                <div className='text-sm text-gray-500'>£ 7.0</div>
                            </div>}
                            {returnPrice > 0 && <div className='flex items-center justify-between gap-2'>
                                <div className='text-sm text-gray-500'>Return Transfer</div>
                                <div className='text-sm text-gray-500'>£ {returnPrice.toFixed(1)}</div>
                            </div>}

                            {/* Add extras to price breakdown */}
                            {(formData.childSeat?.value || 0) > 0 && (
                                <div className='flex items-center justify-between gap-2'>
                                    <div className='text-sm text-gray-500'>Child Seat × {formData.childSeat.value}</div>
                                    <div className='text-sm text-gray-500'>£ {childSeatTotal.toFixed(1)}</div>
                                </div>
                            )}
                            {(formData.infantSeat?.value || 0) > 0 && (
                                <div className='flex items-center justify-between gap-2'>
                                    <div className='text-sm text-gray-500'>Infant Seat × {formData.infantSeat.value}</div>
                                    <div className='text-sm text-gray-500'>£ {infantSeatTotal.toFixed(1)}</div>
                                </div>
                            )}
                            {(formData.boosterSeat?.value || 0) > 0 && (
                                <div className='flex items-center justify-between gap-2'>
                                    <div className='text-sm text-gray-500'>Booster Seat × {formData.boosterSeat.value}</div>
                                    <div className='text-sm text-gray-500'>£ {boosterSeatTotal.toFixed(1)}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-2 pt-2 border-t-2 border-black border-dashed text-2xl font-bold text-black'>
                        <div>Total:</div>
                        <div>£ {totalPrice}</div>
                    </div>
                </div>

                {/* Payment Form Section (moved from Step4) */}
                <MyPaymentForm price={totalPrice} />
            </div>

            {/* Back Button */}
            <BackButton step={3} />
        </div>
    )
}

export default Step3