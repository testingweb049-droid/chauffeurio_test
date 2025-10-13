'use client';
import useLang from '../hooks/useLang';
import { translations } from './translations';

export function ClientSideStrings() {
  const { lang } = useLang();
  return translations[lang];
}
