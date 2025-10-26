import { useContext } from 'react'
import { FormContext } from '@/context/FormContext'

function useCustomForm() {
  const context = useContext(FormContext)
  if(!context) throw new Error('form context is not inside the scope')
  return context
}

export default useCustomForm