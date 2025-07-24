"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { validateCardNumber, getCardType, validateCvv } from "@/lib/card-utils";
import type { CardData, CardDataErrors } from "@/types/types";

/**
 * Hook personalizado para manejar el formulario de pago
 * @param initialData - Datos iniciales del formulario
 * @returns - Estado del formulario, funciones de manejo y validación
 */
export function usePaymentForm(initialData: CardData) {
  const [formData, setFormData] = useState<CardData>(initialData);
  const [errors, setErrors] = useState<CardDataErrors>({
    name: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentAmount: "",
    branch: "",
  });
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [cardType, setCardType] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Detectar tipo de tarjeta cuando cambia el número
  useEffect(() => {
    if (formData.cardNumber.length > 0) {
      const type = getCardType(formData.cardNumber);
      setCardType(type);
    } else {
      setCardType("");
    }
  }, [formData.cardNumber]);
  // Validar formulario según el paso actual
  useEffect(() => {
    let isValid = false;

    if (currentStep === 1) {
      // Validar paso 1: información del cliente (siempre válido)
      isValid = true;
    } else if (currentStep === 2) {
      // Validar paso 2: información personal
      isValid =
        formData.name.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.paymentAmount > 0 &&
        !errors.name &&
        !errors.phone &&
        !errors.paymentAmount;
    } else {
      // Validar paso 3: datos de tarjeta
      isValid =
        validateCardNumber(formData.cardNumber) &&
        formData.expiryDate.trim() !== "" &&
        formData.cvv.trim() !== "" &&
        !errors.cardNumber &&
        !errors.expiryDate &&
        !errors.cvv;
    }

    setIsFormValid(isValid);
  }, [formData, errors, currentStep]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Formatear número de tarjeta con espacios cada 4 dígitos
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
      const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
      setFormData({
        ...formData,
        [name]: formatted,
      });

      // Validar número de tarjeta
      if (cleaned.length > 0) {
        if (!validateCardNumber(cleaned)) {
          setErrors({
            ...errors,
            cardNumber: "Número de tarjeta inválido",
          });
        } else {
          setErrors({
            ...errors,
            cardNumber: "",
          });
        }
      } else {
        setErrors({
          ...errors,
          cardNumber: "",
        });
      }
      return;
    }    if (name === "paymentAmount") {
      // Limpiar el valor para que solo contenga números y puntos
      const cleaned = value.replace(/[^0-9.]/g, "");
      
      // Validar que solo haya un punto decimal
      const dotCount = (cleaned.match(/\./g) || []).length;
      if (dotCount > 1) {
        return; // No actualizar si hay más de un punto
      }
      
      // Limitar a 2 decimales
      const parts = cleaned.split('.');
      if (parts[1] && parts[1].length > 2) {
        return; // No actualizar si hay más de 2 decimales
      }
      
      const amount = parseFloat(cleaned);
      setFormData({
        ...formData,
        [name]: amount,
      });
      
      if (isNaN(amount) || amount <= 0) {
        setErrors({
          ...errors,
          paymentAmount: "El monto debe ser mayor a 0",
        });
      } else if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) {
        setErrors({
          ...errors,
          paymentAmount: "El monto debe tener hasta 2 decimales",
        });
      } else {
        setErrors({
          ...errors,
          paymentAmount: "",
        });
      }
      return;
    }

    // Formatear fecha de expiración (MM/YY)
    if (name === "expiryDate") {
      const cleaned = value.replace(/[^0-9]/g, "");
      let formatted = cleaned;

      if (cleaned.length > 2) {
        formatted = cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
      }

      setFormData({
        ...formData,
        [name]: formatted,
      });

      // Validar fecha de expiración
      if (cleaned.length > 0) {
        const month = Number.parseInt(cleaned.substring(0, 2), 10);
        if (month < 1 || month > 12) {
          setErrors({
            ...errors,
            expiryDate: "Mes inválido",
          });
        } else if (cleaned.length >= 4) {
          const year = Number.parseInt("20" + cleaned.substring(2, 4), 10);
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;

          if (
            year < currentYear ||
            (year === currentYear && month < currentMonth)
          ) {
            setErrors({
              ...errors,
              expiryDate: "Tarjeta vencida",
            });
          } else {
            setErrors({
              ...errors,
              expiryDate: "",
            });
          }
        } else {
          setErrors({
            ...errors,
            expiryDate: "",
          });
        }
      } else {
        setErrors({
          ...errors,
          expiryDate: "",
        });
      }
      return;
    }

    // Validar CVV (3 o 4 dígitos con reglas de seguridad)
    if (name === "cvv") {
      const cleaned = value.replace(/[^0-9]/g, "");
      setFormData({
        ...formData,
        [name]: cleaned,
      });

      if (cleaned.length > 0) {
        const expectedLength = cardType === "amex" ? 4 : 3;

        // Verificar longitud adecuada
        if (cleaned.length !== expectedLength) {
          setErrors({
            ...errors,
            cvv: `CVV debe tener ${expectedLength} dígitos`,
          });
        }
        // Usar las reglas completas de validación
        else if (!validateCvv(cleaned, cardType)) {
          setErrors({
            ...errors,
            cvv: `CVV inválido o inseguro (no use secuencias como 123 o valores repetidos)`,
          });
        } else {
          setErrors({
            ...errors,
            cvv: "",
          });
        }
      } else {
        setErrors({
          ...errors,
          cvv: "",
        });
      }
      return;
    }    // Validar y formatear teléfono
    if (name === "phone") {
      // Limpiar el input para tener solo dígitos
      const cleaned = value.replace(/[^0-9]/g, "");

      // Aplicar formato xxxx-xxxx
      let formatted = cleaned;
      if (cleaned.length > 4) {
        formatted = cleaned.substring(0, 4) + "-" + cleaned.substring(4, 8);
      }

      // Actualizar el valor con formato
      setFormData({
        ...formData,
        [name]: formatted,
      });

      // Validar que tenga 8 dígitos
      const phoneRegex = /^\d{8}$/;
      if (!phoneRegex.test(cleaned)) {
        setErrors({
          ...errors,
          phone: "Teléfono debe tener 8 dígitos",
        });
      } else {
        setErrors({
          ...errors,
          phone: "",
        });
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const nextStep = (e?: MouseEvent) => {
    // Prevenir el comportamiento predeterminado si hay un evento
    e?.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isFormValid) {
      setCurrentStep(3);
    }
  };

  const prevStep = (e?: MouseEvent) => {
    // Prevenir el comportamiento predeterminado si hay un evento
    e?.preventDefault();
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    currentStep,
    cardType,
    isFormValid,
    handleChange,
    nextStep,
    prevStep,
  };
}
