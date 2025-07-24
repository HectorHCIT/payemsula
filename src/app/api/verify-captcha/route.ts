import { NextRequest, NextResponse } from 'next/server';
import { client, recaptchaConfig } from '@/lib/recaptcha-config';

export async function POST(request: NextRequest) {
  try {
    const { recaptchaToken, action, ...formData } = await request.json();

    console.log('🔍 Received verification request:', { 
      hasToken: !!recaptchaToken, 
      action, 
      tokenStart: recaptchaToken?.substring(0, 20) 
    });

    if (!recaptchaToken) {
      console.error('❌ No reCAPTCHA token provided');
      return NextResponse.json(
        { success: false, reason: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    // Verificar si estamos usando la clave de prueba de Google
    const isTestKey = recaptchaConfig.siteKey === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' || 
                     process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    
    if (isTestKey) {
      console.log('🧪 Using test key - simulating successful verification');
      return NextResponse.json({
        success: true,
        score: 0.9,
        message: 'Test reCAPTCHA verification (simulated)',
        formData
      });
    }

    // Crear assessment de reCAPTCHA Enterprise
    const assessmentRequest = {
      assessment: {
        event: {
          token: recaptchaToken,
          siteKey: recaptchaConfig.siteKey,
          expectedAction: action,
        },
      },
      parent: `projects/${recaptchaConfig.projectId}`,
    };

    const [response] = await client.createAssessment(assessmentRequest);

    const { riskAnalysis, tokenProperties } = response;

    // Validar token
    if (!tokenProperties?.valid) {
      return NextResponse.json(
        { success: false, reason: 'Invalid reCAPTCHA token' },
        { status: 403 }
      );
    }

    // Validar acción
    if (tokenProperties?.action !== action) {
      return NextResponse.json(
        { 
          success: false, 
          reason: `Action mismatch. Expected: ${action}, Got: ${tokenProperties?.action}` 
        },
        { status: 403 }
      );
    }

    // Validar score
    const score = riskAnalysis?.score || 0;
    if (score < recaptchaConfig.scoreThreshold) {
      return NextResponse.json(
        { 
          success: false, 
          reason: `Score too low. Got: ${score}, Required: ${recaptchaConfig.scoreThreshold}`,
          score 
        },
        { status: 403 }
      );
    }

    // Si todo está bien, devolver éxito
    return NextResponse.json({
      success: true,
      score,
      message: 'reCAPTCHA verification successful',
      formData // Devolver los datos del formulario para procesamiento adicional
    });

  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false, 
        reason: 'reCAPTCHA verification failed',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
