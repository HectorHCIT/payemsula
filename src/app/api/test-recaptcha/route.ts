import { NextResponse } from 'next/server';

export async function GET() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  return NextResponse.json({
    siteKey: siteKey ? `${siteKey.substring(0, 10)}...` : 'Not defined',
    hasSiteKey: !!siteKey,
    nodeEnv: process.env.NODE_ENV,
    mode: process.env.NEXT_PUBLIC_RECAPTCHA_MODE,
    actions: {
      selectCD: process.env.NEXT_PUBLIC_RECAPTCHA_ACTION_SELECT_CD,
      submitCard: process.env.NEXT_PUBLIC_RECAPTCHA_ACTION_SUBMIT_CARD
    }
  });
}