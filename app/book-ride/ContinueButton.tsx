import useFormStore from '@/stores/FormStore';
import { Loader } from 'lucide-react';
import React from 'react'

function ContinueButton({
  title,
  loading,
  type,
  step,
  disabled = false // New optional disabled prop
}: {
  title: string,
  loading?: boolean,
  type: 'submit' | 'button',
  step: number,
  disabled?: boolean // Optional prop
}) {
  const { changeStep, formLoading } = useFormStore()

  const handleClick = () => {
    if (!disabled && !formLoading && !loading) {
      changeStep(true, step);
    }
  }

  const isLoading = formLoading || loading;
  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={`flex items-center justify-center gap-2 w-full p-2 rounded-lg cursor-pointer font-semibold ${isButtonDisabled
        ? 'bg-gray-400 text-white cursor-not-allowed'
        : 'bg-primary text-white hover:bg-primary-dark'
        } transition-colors duration-200`}
    >
      <Loader className={`animate-spin ${isLoading ? '' : 'hidden'}`} size={20} />
      {isLoading ? 'Loading' : title}
    </button>
  )
}

export default ContinueButton