import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useDirection } from '../../hooks/useDirection'

export default function DonateButton() {
  const { t } = useTranslation()
  const { textAlign } = useDirection()
  
  return (
    <div className={`text-center ${textAlign}`}>
      <Link
        href="/donate"
        className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold text-lg py-3 px-6 rounded-full shadow-md transition duration-300"
      >
        {t('donateButton.text')}
      </Link>
    </div>
  )
}
