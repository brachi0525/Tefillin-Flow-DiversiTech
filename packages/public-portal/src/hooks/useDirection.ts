import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useDirection = () => {
  const { i18n } = useTranslation();
  
  const isRTL = i18n.language === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';
  
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
    document.body.classList.toggle('rtl', isRTL);
    document.body.classList.toggle('ltr', !isRTL);
  }, [direction, isRTL, i18n.language]);

  return {
    isRTL,
    direction,
    textAlign: isRTL ? 'text-right' : 'text-left',
  };
};