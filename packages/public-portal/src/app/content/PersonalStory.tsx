import { ReactNode } from 'react'

type Props = {
  quote: string
  name: string
  children?: ReactNode
}

export default function PersonalStory({ quote, name, children }: Props) {
  return (
    <div className="bg-white shadow-inner rounded-xl px-6 py-8 text-center max-w-3xl mx-auto">
      <p className="text-xl italic text-[#7a5230] mb-4">"{quote}"</p>
      <p className="text-sm text-gray-600 mb-2">– {name}</p>
      {children}
    </div>
  )
}
