import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext';
function useLang() {
 const context = useContext(LanguageContext)
 if(!context){
  throw new Error('Language Hook not used under Language Provider');
 }
 return context
}

export default useLang