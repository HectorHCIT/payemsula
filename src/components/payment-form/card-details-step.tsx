"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CreditCard, Calendar, KeyRound, Eye, EyeOff } from "lucide-react"
import { containerVariants, itemVariants } from "@/lib/animation-variants"
import type { CardData, CardDataErrors } from "@/types/types"
import Image from "next/image"

interface CardDetailsStepProps {
  formData: CardData
  errors: CardDataErrors
  cardType: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Componente para el segundo paso del formulario (detalles de tarjeta)
 */
export function CardDetailsStep({ formData, errors, cardType, handleChange }: CardDetailsStepProps) {
  const [showCvv, setShowCvv] = useState(false);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="cardNumber" className="flex items-center text-gray-700">
          <CreditCard className="h-4 w-4 mr-2 text-[#1761ac]" />
          Número de Tarjeta
          {cardType && (
            <span className="ml-2 text-sm font-medium text-[#1761ac] bg-blue-100 px-2 py-1 rounded">
              {cardType.toUpperCase()}
            </span>
          )}
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="0000 0000 0000 0000"
          value={formData.cardNumber}
          onChange={handleChange}
          maxLength={19}
          className="h-12 border-2 focus:border-blue-500 font-mono"
          required
        />
        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="expiryDate" className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-[#1761ac]" />
            Vencimiento
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            placeholder="MM/AA"
            value={formData.expiryDate}
            onChange={handleChange}
            maxLength={5}
            className="h-12 border-2 focus:border-blue-500 font-mono"
            required
          />
          {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">          <Label htmlFor="cvv" className="flex items-center text-gray-700">
            <KeyRound className="h-4 w-4 mr-2 text-[#1761ac]" />
            CVV
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="cvv"
              type={showCvv ? "text" : "password"}
              name="cvv"
              placeholder={cardType === "amex" ? "0000" : "000"}
              value={formData.cvv}
              onChange={handleChange}
              maxLength={cardType === "amex" ? 4 : 3}
              className="h-12 border-2 focus:border-blue-500 font-mono pr-10"
              required
            />
            <button 
              type="button"
              onClick={() => setShowCvv(!showCvv)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1761ac] focus:outline-none"
              aria-label={showCvv ? "Ocultar CVV" : "Mostrar CVV"}
            >
              {showCvv ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className=" mt-10">
        <div className="flex items-center justify-center">
          <Image width={250} height={100} src={'/fac.jpg'} alt="Facilita" className="mr-2 rounded-lg" />
        </div>
        
      </motion.div>
    </motion.div>
  )
}
