import React from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'


export default function Loader({ progress = 0 }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8"
      >
        <FaWhatsapp className="w-16 h-16 text-green-500" />
      </motion.div>
      <div className="w-64 bg-white bg-opacity-30 rounded-full h-2 mb-4">
        <motion.div
          className="bg-white h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-white text-lg font-semibold">Loading... {progress}%</p>
    </div>
  )
}