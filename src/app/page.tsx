"use client"
import Image from "next/image"
import { motion } from "motion/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Truck,
  Zap,
  Clock,
  PhoneCall,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// Nuevos colores - variantes de azul
// const colors = {
//   primary: "#0075b8",
//   secondary: "#3498db",
//   dark: "#1a5f94",
//   light: "#e1f0fa",
// }

const brands = [
  { name: "Pepsi", logo: "/pepsi.png" },
  { name: "7up", logo: "/7up.jpg" },
  { name: "Adrenalina", logo: "/adre.png" },
  { name: "Gatorade", logo: "/gato.png" },
  { name: "Agua Azul", logo: "/aguaAzul.png" },
  { name: "Zen", logo: "/zen.png" },
  { name: "Lipton", logo: "/lipton.png" },
  { name: "Amp", logo: "/amp.jpg" },
]

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#0075b8]" />,
    title: "Seguridad garantizada",
    desc: "Protegemos tus datos con encriptación RSA-OAEP de alto nivel",
  },
  {
    icon: <Zap className="w-6 h-6 text-[#3498db]" />,
    title: "Proceso rápido",
    desc: "Pagos en menos de 2 minutos con confirmación instantánea",
  },
  {
    icon: <CreditCard className="w-6 h-6 text-[#0075b8]" />,
    title: "Múltiples métodos",
    desc: "Aceptamos todas las tarjetas Visa, Mastercard y American Express",
  },
  {
    icon: <Truck className="w-6 h-6 text-[#3498db]" />,
    title: "Actualización inmediata",
    desc: "Tu pago se refleja al instante en tu cuenta",
  },
]

const steps = [
  { step: "1", title: "Ingresa tus datos", desc: "Número de cliente y centro de distribución" },
  { step: "2", title: "Verifica tu deuda", desc: "Revisa los montos pendientes de pago" },
  { step: "3", title: "Formulario de pago", desc: "Ingresa los datos de tu tarjeta de forma segura" },
  { step: "4", title: "Confirma y descarga", desc: "Recibe tu comprobante de pago en PDF" },
]

const faqs = [
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos todas las tarjetas de crédito y débito Visa, Mastercard y American Express con procesamiento 3D Secure para mayor seguridad.",
  },
  {
    question: "¿Cuánto tiempo tarda en reflejarse mi pago?",
    answer:
      "Los pagos se reflejan de manera inmediata en nuestro sistema. Recibirás un comprobante por correo electrónico y podrás descargar el PDF al instante.",
  },
  {
    question: "¿Es seguro pagar en línea?",
    answer:
      "Sí, nuestro sistema utiliza encriptación RSA-OAEP para datos sensibles y cumplimos con los estándares de seguridad PCI DSS.",
  },
  {
    question: "¿Puedo pagar facturas atrasadas?",
    answer:
      "Sí, puedes pagar facturas vencidas a través de nuestro sistema, aunque pueden aplicar recargos por mora según nuestras políticas.",
  },
]

export default function HomePage() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((prevIndex) => (prevIndex + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section con animación de fondo */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-animation">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Sistema de Pagos en Línea <br />
                  <span className="text-white gradient-text">Embotelladora de Sula</span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-700 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  La solución más rápida y segura para gestionar los pagos de tus facturas con total tranquilidad.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pago">
                    <Button
                      size="lg"
                      className="bg-[#0075b8] hover:bg-[#1a5f94] text-white font-bold py-6 px-8 text-lg flex items-center gap-2 w-full sm:w-auto"
                    >
                      Realizar un pago ahora
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>

                  <Link href="#beneficios">
                    <Button
                      size="lg"
                      className="bg-white border border-[#0075b8] text-[#0075b8] hover:bg-blue-50 font-bold py-6 px-8 text-lg w-full sm:w-auto"
                      variant="outline"
                    >
                      Conocer más
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-800"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Más de <span className="font-bold">10,000 clientes</span> ya utilizan nuestro sistema
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden z-10">
                <div className="relative h-56 sm:h-64 md:h-72 w-full">
                  <Image
                    src="/logo.svg" // Reemplazar con imagen real de producción
                    alt="Producción de bebidas EMSULA"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-6 bg-gradient-animation-card text-white">
                  <p className="font-semibold text-xl">Más de 50 años de experiencia</p>
                  <p className="text-sm mt-1">Líderes en la industria de bebidas en Honduras</p>

                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <div>
                      <p className="text-xs opacity-80">Clientes satisfechos</p>
                      <p className="font-bold text-2xl">12,580+</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">Pagos procesados</p>
                      <p className="font-bold text-2xl">98%</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">Seguridad</p>
                      <p className="font-bold text-2xl">100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-12"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.91,118.92,150.2,82.84,210.45,74.11Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-[#0075b8] mb-4">¿Por qué pagar con nuestro sistema?</h2>
            <p className="text-gray-600 text-lg">
              PayEmsula ofrece la mejor experiencia de pago con tecnología avanzada y seguridad de primer nivel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "bg-white rounded-xl shadow-md p-6 border transition-all duration-300",
                  activeFeatureIndex === index ? "border-[#0075b8] shadow-lg transform scale-105" : "border-blue-100",
                )}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-50 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pasos del proceso */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-animation-steps rounded-3xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="max-w-3xl mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Realizar un pago es muy sencillo</h2>
                <p className="text-white/90 text-lg">
                  Sigue estos simples pasos para completar tu transacción en menos de 2 minutos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-white text-[#0075b8] w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                        {step.step}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block w-full h-0.5 bg-white/30 ml-4"></div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/80">{step.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href="/pago">
                  <Button size="lg" className="bg-white text-[#0075b8] hover:bg-blue-50 font-bold py-6 px-8 text-lg">
                    Comenzar ahora
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marcas y productos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold text-[#0075b8] mb-4">Nuestras Marcas</h2>
            <p className="text-gray-600">Embotelladora de Sula representa las mejores marcas de bebidas en Honduras</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-6 md:gap-8">
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl shadow-sm p-4 w-full aspect-square flex items-center justify-center">
                  <Image
                    src={brand.logo || "/placeholder.svg"}
                    alt={brand.name}
                    width={80}
                    height={80}
                    className="object-contain max-h-14"
                  />
                </div>
                <p className="mt-3 font-medium text-gray-700 text-center">{brand.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-[#0075b8] mb-4">Preguntas Frecuentes</h2>
            <p className="text-gray-600">Resolvemos tus dudas sobre nuestro sistema de pagos</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border border-blue-100 hover:border-[#0075b8] transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-[#0075b8] mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-animation-contact rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white mb-6">¿Necesitas ayuda?</h2>
                <p className="text-white/90 text-lg mb-8">
                  Nuestro equipo de soporte está listo para ayudarte con cualquier duda sobre tus pagos o cuentas.
                </p>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white/20 p-3 rounded-full mt-1">
                      <PhoneCall className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Teléfono</h3>
                      <p className="text-white/90">(504) 2553-1000</p>
                      <p className="text-sm text-white/70 mt-1">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white/20 p-3 rounded-full mt-1">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Email</h3>
                      <p className="text-white/90">pagos@emsula.hn</p>
                      <p className="text-sm text-white/70 mt-1">Respondemos en un plazo de 24 horas</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white/20 p-3 rounded-full mt-1">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Dirección</h3>
                      <p className="text-white/90">Boulevard del Norte, San Pedro Sula, Honduras</p>
                      <p className="text-sm text-white/70 mt-1">Oficina principal de atención al cliente</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white mb-6">Horario de Atención</h3>

                <div className="space-y-4">
                  <motion.div
                    className="flex justify-between border-b border-white/20 pb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-white/80" />
                      <span className="text-white">Lunes a Viernes</span>
                    </div>
                    <span className="text-white font-medium">8:00 AM - 5:00 PM</span>
                  </motion.div>

                  <motion.div
                    className="flex justify-between border-b border-white/20 pb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-white/80" />
                      <span className="text-white">Sábados</span>
                    </div>
                    <span className="text-white font-medium">8:00 AM - 12:00 PM</span>
                  </motion.div>

                  <motion.div
                    className="flex justify-between pb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-white/80" />
                      <span className="text-white">Domingos</span>
                    </div>
                    <span className="text-white font-medium">Cerrado</span>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-12 pt-8 border-t border-white/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-white font-semibold text-lg mb-4">Soporte 24/7 para emergencias</h4>
                  <div className="bg-white/20 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-white rounded-full p-3">
                      <PhoneCall className="h-6 w-6 text-[#0075b8]" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">Línea de emergencia</p>
                      <p className="text-xl font-bold text-white">(504) 9000-0000</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="mb-6">
                <Image src="/logo.svg" alt="Emsula Logo" width={150} height={60} className="mb-4" />
                <p className="text-gray-600">
                  Líderes en la producción y distribución de bebidas en Honduras desde 1965.
                </p>
              </div>

              <div className="flex space-x-4">
                <a href="#" className="bg-[#0075b8] text-white p-2 rounded-full hover:bg-[#1a5f94] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="bg-[#0075b8] text-white p-2 rounded-full hover:bg-[#1a5f94] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="bg-[#0075b8] text-white p-2 rounded-full hover:bg-[#1a5f94] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* <div>
              <h3 className="font-bold text-lg text-[#0075b8] mb-6">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Productos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Sostenibilidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Trabaja con Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Centro de Distribución
                  </a>
                </li>
              </ul>
            </div> */}

            {/* <div>
              <h3 className="font-bold text-lg text-[#0075b8] mb-6">Sistema de Pagos</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/pago" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Pagar Factura
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Consultar Estado
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0075b8] transition-colors">
                    Términos y Condiciones
                  </a>
                </li>
              </ul>
            </div> */}

            <div>
              <h3 className="font-bold text-lg text-[#0075b8] mb-6">Contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0075b8] mt-1 flex-shrink-0" />
                  <span className="text-gray-600">Boulevard del Norte, San Pedro Sula, Honduras</span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-[#0075b8] flex-shrink-0" />
                  <span className="text-gray-600">(504) 2553-1000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#0075b8] flex-shrink-0" />
                  <span className="text-gray-600">pagos@emsula.hn</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#0075b8] flex-shrink-0" />
                  <span className="text-gray-600">Lun-Vie: 8:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Embotelladora de Sula. Todos los derechos reservados.
            </p>
            {/* <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="text-gray-600 hover:text-[#0075b8] text-sm transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-600 hover:text-[#0075b8] text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-600 hover:text-[#0075b8] text-sm transition-colors">
                Mapa del Sitio
              </a>
              <a href="#" className="text-gray-600 hover:text-[#0075b8] text-sm transition-colors">
                Seguridad
              </a>
            </div> */}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Sistema de pagos PayEmsula v2.4.1 - Desarrollado con ❤️ por el equipo de Tecnología de Emsula
            </p>

            {/* <div className="mt-4 flex justify-center space-x-4">
              {["Visa", "Mastercard", "American Express"].map((card, index) => (
                <div
                  key={index}
                  className="bg-white px-3 py-1.5 rounded border border-gray-200 text-xs font-medium text-gray-600"
                >
                  {card}
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </footer>

      {/* Estilos para las animaciones */}
      <style jsx global>{`
        /* Animación de gradiente para el fondo del hero */
        .bg-gradient-animation {
          background: linear-gradient(-45deg, #0075b8, #3498db, #1a5f94, #e1f0fa);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        /* Animación de gradiente para la tarjeta */
        .bg-gradient-animation-card {
          background: linear-gradient(-45deg, #0075b8, #3498db, #1a5f94, #0075b8);
          background-size: 400% 400%;
          animation: gradient 8s ease infinite;
        }

        /* Animación de gradiente para la sección de pasos */
        .bg-gradient-animation-steps {
          background: linear-gradient(-45deg, #0075b8, #3498db, #1a5f94, #0075b8);
          background-size: 400% 400%;
          animation: gradient 12s ease infinite;
        }

        /* Animación de gradiente para la sección de contacto */
        .bg-gradient-animation-contact {
          background: linear-gradient(-45deg, #0075b8, #3498db, #1a5f94, #0075b8);
          background-size: 400% 400%;
          animation: gradient 10s ease infinite;
        }

        /* Texto con gradiente animado */
        .gradient-text {
          background: linear-gradient(-45deg, #0075b8, #3498db, #1a5f94, #0075b8);
          background-size: 400% 400%;
          animation: gradient 8s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          display: inline-block;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </main>
  )
}
