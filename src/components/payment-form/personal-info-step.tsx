"use client"

import { motion } from "motion/react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User, Phone, DollarSign } from "lucide-react"
import { containerVariants, itemVariants } from "@/lib/animation-variants"
import type { CardData, CardDataErrors } from "@/types/types"

interface PersonalInfoStepProps {
  formData: CardData
  errors: CardDataErrors
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Componente para el primer paso del formulario (información personal)
 */
export function PersonalInfoStep({ formData, errors, handleChange }: PersonalInfoStepProps) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="name" className="flex items-center text-gray-700">
          <User className="h-4 w-4 mr-2 text-[#1761ac]" />
          Nombre Completo
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Ingrese su nombre completo"
          value={formData.name}
          onChange={handleChange}
          className="h-12 border-2 focus:border-blue-500"
          required
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="phone" className="flex items-center text-gray-700">
          <Phone className="h-4 w-4 mr-2 text-[#1761ac]" />
          Número de Teléfono
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          placeholder="0000-0000"
          value={formData.phone}
          onChange={handleChange}
          maxLength={9}
          className="h-12 border-2 focus:border-blue-500"
          required
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="paymentAmount" className="flex items-center text-gray-700">
          <DollarSign className="h-4 w-4 mr-2 text-[#1761ac]" />
          Monto a Pagar
          <span className="text-red-500 ml-1">*</span>
        </Label>        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">L.</span>
          <Input
            id="paymentAmount"
            name="paymentAmount"
            type="number"
            min="1"
            step="0.01"
            max="9999999.99"
            className="pl-8 h-12 border-2 focus:border-blue-500"
            placeholder="0.00"
            value={formData.paymentAmount || ""}
            onChange={handleChange}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              const value = target.value;
              // Limitar a 2 decimales
              if (value.includes('.')) {
                const parts = value.split('.');
                if (parts[1] && parts[1].length > 2) {
                  target.value = parts[0] + '.' + parts[1].substring(0, 2);
                }
              }
            }}
            required
          />
        </div>
        {errors.paymentAmount && <p className="text-sm text-red-500">{errors.paymentAmount}</p>}
      </motion.div>
    </motion.div>
  )
}
