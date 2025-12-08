import { FormContext } from '@/context/FormContext'
import { useContext } from 'react'

function useCustomForm() {
  const context = useContext(FormContext)
  if(!context) throw new Error('form context is not inside the scope')
  return context
}

export default useCustomForm