"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DataCustomer } from "@/types/types";
import ModalWait from "./modalWait";
import ConfirmationPage from "./confirmations";
import SimpleThreeDSModal from "./simple-three-ds-modal";
import { motion, AnimatePresence } from "motion/react";
import { usePaymentForm } from "@/hooks/usePaymentForm";
import { usePaymentProcess } from "@/hooks/usePaymentProcess";
import { useRecaptchaVerification, RECAPTCHA_ACTIONS } from "@/hooks/useRecaptcha";
import { slideVariants } from "@/lib/animation-variants";
import { PersonalInfoStep } from "./payment-form/personal-info-step";
import { CardDetailsStep } from "./payment-form/card-details-step";
import { FormProgress } from "./payment-form/form-progress";
import { FormActions } from "./payment-form/form-actions";
import { ClientInfoCard } from "./client-info-card";
import { GlobalAlert } from "./global-alert";


interface PaymentFormProps {
  clientData: DataCustomer;
}

/**
 * Formulario de pago con validación y procesamiento 3DS
 */
export default function PaymentForm({ clientData }: PaymentFormProps) {
  // Inicializar formulario con hooks personalizados
  const {
    formData,
    errors,
    currentStep,
    cardType,
    isFormValid,
    handleChange,
    nextStep,
    prevStep,  } = usePaymentForm({
    name: clientData.name,
    phone: clientData.phoneNumber,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentAmount: 0,
    customerId: clientData.id,
    // Nuevos campos requeridos para NewPayment
    customerCode: clientData.customerCode,
    email: clientData.email,
    distributionCenter: clientData.distributionCenter,
  });
  
  // Inicializar proceso de pago
  const {
    isWaiting,
    showThreeDS,
    paying,
    paySuccess,
    htmlResponse,
    requestId,
    startPayment,
    closeModal,
    handleComplete,
  } = usePaymentProcess();
  
  // Inicializar reCAPTCHA
  const { verifyRecaptcha } = useRecaptchaVerification();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3 || !isFormValid) return;

    try {
      // 🛡️ Verificar reCAPTCHA antes de procesar el pago
      console.log('🚀 Starting reCAPTCHA verification for payment...');
      
      const recaptchaResult = await verifyRecaptcha(RECAPTCHA_ACTIONS.SUBMIT_CARD, {
        name: formData.name,
        phone: formData.phone,
        paymentAmount: formData.paymentAmount,
        lastFourDigits: formData.cardNumber.slice(-4)
      });

      if (!recaptchaResult.success) {
        console.error('❌ reCAPTCHA verification failed:', recaptchaResult.reason);
        // Aquí podrías mostrar una alerta específica al usuario
        return;
      }

      console.log('✅ reCAPTCHA verification successful, score:', recaptchaResult.score);

      // save in sessionStorage
      sessionStorage.setItem(
        "formData",
        JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          lastFourDigits: formData.cardNumber.slice(-4),
        })
      );
      
      // Proceder con el pago
      await startPayment(formData);
    } catch (error) {
      console.error('Error during payment processing:', error);
      // Manejar error de reCAPTCHA o pago
    }
  };

  return paying ? (
    <ConfirmationPage isSuccess={paySuccess} />
  ) : (
    <>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full  lg:w-[40%]"
      >
        <Card className="shadow-lg overflow-hidden border-2 border-blue-100">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-[#1761ac]">
                Información de Pago
              </CardTitle>
              <FormProgress currentStep={currentStep} />
            </div>{" "}
            <div className="text-sm text-[#1761ac] mt-2">
              {currentStep === 1
                ? "Paso 1: Información del Cliente"
                : currentStep === 2
                ? "Paso 2: Información Personal"
                : "Paso 3: Datos de Tarjeta"}
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="py-6 min-h-[300px] relative overflow-hidden">
              {" "}
              <AnimatePresence mode="wait" custom={currentStep}>
                {currentStep === 1 && (
                  <motion.div
                    key="step0"
                    custom={0}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <ClientInfoCard data={clientData} />
                  </motion.div>
                )}
                {currentStep === 2 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="space-y-6"
                  >
                    <PersonalInfoStep
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step2"
                    custom={2}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="space-y-6"
                  >
                    <CardDetailsStep
                      formData={formData}
                      errors={errors}
                      cardType={cardType}
                      handleChange={handleChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t">
              <FormActions
                currentStep={currentStep}
                isFormValid={isFormValid}
                prevStep={prevStep}
                nextStep={nextStep}
                paymentAmount={formData.paymentAmount}
              />
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      {showThreeDS && htmlResponse !== "" && (
        <SimpleThreeDSModal
          isOpen={true}
          onClose={closeModal}
          htmlContent={htmlResponse}
          onSuccess={() => handleComplete(true)}
          onFailure={() => handleComplete(false)}
          requestId={requestId || ""}
        />
      )}      {isWaiting && <ModalWait />}

      {/* Sistema de alertas integrado */}
      <GlobalAlert />
    </>
  );
}
