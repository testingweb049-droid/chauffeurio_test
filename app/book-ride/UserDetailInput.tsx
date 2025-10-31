import useFormStore, { FormDataType } from '@/stores/FormStore';
import { LucideProps } from 'lucide-react'
import React from 'react'
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

interface DetailInputType {
  field: keyof FormDataType;
  placeholder: string;
  Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  type: 'number' | 'email' | 'text'
}

export function DetailsInput({ field, placeholder, Icon, type }: DetailInputType) {
  const { formData, setFormData } = useFormStore()
  return (
    <div className={`p-3 rounded-lg w-full border text-sm flex items-center gap-3 bg-white text-primary ${!Array.isArray(formData[field]) && formData[field].error ? 'border-red-500' : 'border-gray-300'}`}>
      <Icon color='gray' size={20} />
      <input
        type={type}
        value={!Array.isArray(formData[field]) ? formData[field].value.toString() : ''}
        className='w-full focus:outline-none bg-transparent border-transparent placeholder-gray-500'
        placeholder={placeholder}
        onChange={(e) => setFormData(field, e.target.value)}
      />
    </div>
  )
}

export function PhoneInput() {
  const { formData, setFormData } = useFormStore()
  return (
    <div className="w-full">
      <ReactPhoneInput
        country={'es'}
        value={formData.phone.value}
        placeholder="Phone number"
        onChange={phone => setFormData('phone', phone)}
        inputStyle={{
          width: '100%',
          height: '40px',
          paddingLeft: '50px',
          paddingRight: '16px',
          fontSize: '16px',
          color: '#002C3F',
          backgroundColor: 'white',
          border: formData.phone.error
            ? '1px solid #f87171'
            : '1px solid #d1d5db',
          borderRadius: '8px',
          fontFamily: 'inherit'
        }}
        buttonStyle={{
          backgroundColor: 'white',
          border: formData.phone.error
            ? '1px solid #f87171'
            : '1px solid #d1d5db',
          borderRight: 'none',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
          padding: '4px'
        }}
        dropdownStyle={{
          borderRadius: '8px',
          fontFamily: 'inherit'
        }}
        containerStyle={{
          width: '100%',
          fontFamily: 'inherit'
        }}
      />
      {formData.phone.error && (
        <p className="text-red-500 text-xs mt-1">{formData.phone.error}</p>
      )}
    </div>
  )
}