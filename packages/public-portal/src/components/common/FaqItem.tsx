'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  question: string
  answer: string
}

export default function FaqItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="px-4 py-3 hover:bg-yellow-100 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-right font-medium text-amber-800 flex justify-between items-center text-lg"
      >
        {question}
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-brown-800 text-base leading-snug"
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
