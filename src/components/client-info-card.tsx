"use client";
import type { DataCustomer } from "@/types/types";
import {
  User,
  Phone,
  Store,
  // BanknoteArrowDown,
} from "lucide-react";
import { motion } from "motion/react";

interface ClientInfoCardProps {
  data: DataCustomer;
}

export function ClientInfoCard({ data }: ClientInfoCardProps) {
  // Animaciones para los elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
                <motion.div
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              className="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                <User className="h-5 w-5 text-[#1761ac]" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#1761ac] uppercase tracking-wider">
                  Cliente
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {data.name}
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              className="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                <Phone className="h-5 w-5 text-[#1761ac]" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#1761ac] uppercase tracking-wider">
                  Teléfono
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {data.phoneNumber.replace(/(\d{4})(\d{4})/, "$1-$2")}
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              className="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                <Store className="h-5 w-5 text-[#1761ac]" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#1761ac] uppercase tracking-wider">
                  Comercio
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {data.businessName}
                </div>
              </div>
            </motion.div>

            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              className="flex items-center p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            >
              <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                <BanknoteArrowDown className="h-5 w-5 text-[#f51055]" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#f51055] uppercase tracking-wider">
                  Monto Vencido
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  L. 10,000
                </div>
              </div>
            </motion.div> */}
          </motion.div>
    </motion.div>
  );
}
