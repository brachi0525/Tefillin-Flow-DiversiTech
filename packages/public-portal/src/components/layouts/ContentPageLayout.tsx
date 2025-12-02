// 'use client'

// import { ReactNode } from 'react'

// type Props = {
//   title?: string
//   children: ReactNode
// }

// export default function ContentPageLayout({ title, children }: Props) {
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {title && (
//         <h1 className="text-3xl font-bold mb-6 text-gray-900">{title}</h1>
//       )}
//       <div className="prose prose-lg prose-gray max-w-none text-right">
//         {children}
//       </div>
//     </div>
//   )
// }

'use client'

import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function ContentPageLayout({ children }: Props) {
  return (
    <div className="bg-[#fdf6f3] text-[#2c1b13] font-sans leading-relaxed">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-16">
        {children}
      </div>
    </div>
  )
}

