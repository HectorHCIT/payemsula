import React, { useEffect, useState } from "react";
import { getCenterList, getCustomerInfo } from "@/server/getData";
import { CenterList, DataCustomer } from "@/types/types";
import { Phone, MapPin, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useAlert } from "@/hooks/useAlert";
import { useRecaptchaVerification, RECAPTCHA_ACTIONS } from "@/hooks/useRecaptcha";

interface DataProps {
  updateData: (data: DataCustomer) => void;
}

export function PhoneInput({ updateData }: DataProps) {
  const [centerList, setCenterList] = useState<CenterList[]>([]);
  const [formData, setFormData] = useState({ tel: "", centerId: 0 });
  const [loading, setLoading] = useState(false);
  const { showError } = useAlert();
  const { verifyRecaptcha, isRecaptchaLoaded } = useRecaptchaVerification();  useEffect(() => {
    (async () => {
      const data = await getCenterList();
      // Check if the response is an error
      if ('title' in data && 'message' in data) {
        console.error("Error al obtener la lista de centros:", data);
        showError(data.title, data.message);
      } else {
        setCenterList(data);
      }
    })();
  }, [showError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "centerId" ? parseInt(value, 10) : value,
    }));
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🛡️ Verificar reCAPTCHA antes de buscar la cuenta
      console.log('🚀 Starting reCAPTCHA verification for account search...');
      
      const recaptchaResult = await verifyRecaptcha(RECAPTCHA_ACTIONS.SELECT_CD, {
        phoneNumber: formData.tel,
        centerId: formData.centerId
      });

      if (!recaptchaResult.success) {
        console.error('❌ reCAPTCHA verification failed:', recaptchaResult.reason);
        showError('Verificación de seguridad', 'No se pudo verificar la seguridad. Inténtalo de nuevo.');
        return;
      }

      console.log('✅ reCAPTCHA verification successful, score:', recaptchaResult.score);

      // Proceder con la búsqueda de información del cliente
      const data = await getCustomerInfo(parseInt(formData.tel), formData.centerId);
      
      // Check if the response is an error
      if ('title' in data && 'message' in data) {
        console.error("Error al obtener información del cliente:", data);
        showError(data.title, data.message);
      } else {
        updateData(data);
      }
    } catch (error) {
      console.error('Error during account search:', error);
      showError('Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto mt-12 bg-white shadow-2xl rounded-2xl p-8"
    >      <h2 className="text-2xl font-semibold text-[#1761ac] mb-6 text-center">
        <Phone className="inline-block mr-2" size={24} />
        Ingresa tu teléfono
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="tel" className="block text-sm font-medium text-[#1761ac]">
            Teléfono
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              type="tel"
              placeholder="Ej: 99887744"
              className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="centerId" className="block text-sm font-medium text-[#1761ac]">
            Centro de distribución
          </label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              id="centerId"
              name="centerId"
              value={formData.centerId || ""}
              onChange={handleChange}
              className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-none "
            >
              <option value="" disabled>
                Seleccione un centro...
              </option>
              {centerList.map(center => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>
        </div>        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || !isRecaptchaLoaded}
          className={`w-full py-2 rounded-lg text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-none flex items-center justify-center space-x-2
            ${loading || !isRecaptchaLoaded ? "bg-blue-300" : "bg-[#1761ac] hover:bg-[#1762accd]"}`}
        >
          {loading ? (
            <>
              <Shield className="w-5 h-5 animate-spin" />
              <span>Verificando...</span>
            </>
          ) : !isRecaptchaLoaded ? (
            <>
              <Shield className="w-5 h-5" />
              <span>Cargando seguridad...</span>
            </>
          ) : (
            <span>Buscar Cuenta</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
