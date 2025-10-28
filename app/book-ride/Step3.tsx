import { LuggageIcon, User, Users, Mail, Plane } from 'lucide-react'
import React from 'react'
import {DetailsInput, PhoneInput} from './UserDetailInput'
import NewDateTimePicker from './NewDateTimePicker'
import useFormStore from '@/stores/FormStore'
import NewDropdownInput from './DropDownInput'
import { fleets } from './CarList'
import SelectableCheckbox from './SelectableCheckbox'
import AddReturn from './AddReturn'
import LoadingButton from './LoadingButton'

// Updated Counter component for extras using form store
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
    
    const value = formData[extraType].value;

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
    const {formData, setFormData, changeStep, formLoading} = useFormStore();
    
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

    return (
        <div className='flex flex-col gap-5 w-full'>
            <div className='text-2xl font-semibold'>Details</div>
            
            <div className='flex flex-col gap-3 w-full'>
                <DetailsInput field='name' placeholder='Passenger full name' Icon={User} type='text' />
                <PhoneInput/>
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
                
                <AddReturn/>
                
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

                {/* Description Field */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Instructions (Optional)
                    </label>
                    <textarea
                        value={formData.description.value}
                        onChange={(e) => setFormData('description', e.target.value)}
                        placeholder="Any special requirements or instructions for your ride..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                </div>
            </div>
            
            {
                formLoading ? <LoadingButton/> :
                <div onClick={()=>{changeStep(true,3);}} className='p-2 rounded-lg border border-gray-200 w-full text-center text-white font-bold cursor-pointer bg-primary'>
                    Continue 
                </div>
            }
            
            <div onClick={()=>{changeStep(false,3);}} className='p-2 rounded-lg border border-gray-500 w-full text-center text-gray-700 font-semibold cursor-pointer'>
                Back 
            </div>
        </div>
    )
}

export default Step3