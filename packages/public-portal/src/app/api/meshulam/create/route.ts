import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('=== Meshulam API called ===');
  
  try {
    const body = await req.json();
    console.log('Received body:', body);

    const { amount, fullName, email, phone } = body;
    
    // בדיקת ולידציה
    if (!amount || !fullName || !email) {
      console.error('Missing required fields:', { amount, fullName, email });
      return NextResponse.json(
        { success: false, error: 'חסרים שדות חובה' }, 
        { status: 400 }
      );
    }

    // בדיקת משתני סביבה
    if (!process.env.MESHULAM_TERMINAL || !process.env.MESHULAM_API_KEY) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { success: false, error: 'חסרים משתני סביבה' }, 
        { status: 500 }
      );
    }

    const data = {
      terminalNumber: process.env.MESHULAM_TERMINAL,
      apiKey: process.env.MESHULAM_API_KEY,
      sum: amount,
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone || '',
      language: 'heb',
      cancel_url: 'https://your-site.com/cancel',
      success_url: 'https://your-site.com/success',
      payments: 1,
    };

    console.log('Sending to Meshulam:', { ...data, apiKey: '[HIDDEN]' });

    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value.toString());
    });

    const res = await fetch('https://secure.meshulam.co.il/api/light/server/1.0/createPayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await res.json();
    console.log('Meshulam response:', result);

    if (result.status === 1) {
      return NextResponse.json({ success: true, url: result.data?.url });
    } else {
      console.error('Meshulam error:', result);
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'שגיאה במשולם' 
      }, { status: 400 });
    }
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ 
      success: false, 
      error: 'שגיאה כללית: ' + err.message 
    }, { status: 500 });
  }
}