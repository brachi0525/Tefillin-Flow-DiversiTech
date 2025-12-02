               import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// הלוגו מ-Google Drive
const LOGO_URL = "https://drive.google.com/uc?export=view&id=1ONW8DDSiei2TnSCol-vSX9HI5rXe_DTk";
const WEBSITE_URL = "https://tefilin.diversitech.co.il"; // עדכן לכתובת האתר הסופית

export async function POST(req: Request) {
  console.log('=== Receipt API called ===');
  
  const body = await req.json();
  const { fullName, email, amount } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Tefilin Project <onboarding@resend.dev>',
      to: ['tefilindiversitech@gmail.com'],
      subject: `תודה על התרומה שלך - ${fullName}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>תודה על התרומה</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap');
            * { box-sizing: border-box; }
            body { font-family: 'Heebo', Arial, sans-serif; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); direction: rtl;">
          
          <!-- Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #15803d 0%, #22c55e 100%); padding: 50px 30px; text-align: center; position: relative;">
              
              <!-- Logo Container - תיקון -->
              <center>
                <div style="background-color: white; width: 120px; height: 120px; border-radius: 50%; margin-bottom: 25px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); border: 3px solid rgba(255,255,255,0.8); line-height: 120px;">
                  <img src="${LOGO_URL}" alt="לוגו פרויקט התפילין" style="width: 90px; height: 90px; object-fit: contain; vertical-align: middle;">
                </div>
              </center>
              
              <!-- Title -->
              <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">תפילין לחייל</h1>
              <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 300;">
                מחברים חיילים למסורת היהודית
              </p>
              
              <!-- Decorative elements -->
              <div style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: 20px; left: 20px; width: 30px; height: 30px; border: 2px solid rgba(255,255,255,0.2); border-radius: 50%;"></div>
            </div>

            <!-- Main Content -->
            <div style="padding: 50px 40px;">
              
              <!-- Thank You Message -->
              <div style="text-align: center; margin-bottom: 40px;">
                <h2 style="color: #111827; font-size: 28px; font-weight: 700; margin-bottom: 15px; line-height: 1.3;">
                  תודה רבה על התרומה הנדיבה!
                </h2>
                <p style="color: #6b7280; font-size: 18px; line-height: 1.6; margin: 0;">
                  שלום <strong style="color: #15803d;">${fullName}</strong>,<br>
                  תרומתך תעזור לנו להמשיך ולחבר חיילי צה"ל למסורת היהודית
                </p>
              </div>

              <!-- Donation Card -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 16px; padding: 30px; margin: 40px 0; position: relative; overflow: hidden;">
                <!-- Background pattern -->
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(34, 197, 94, 0.1); border-radius: 50%;"></div>
                
                <h3 style="color: #15803d; margin: 0 0 25px 0; font-size: 22px; font-weight: 600; text-align: center;">
                  פרטי התרומה
                </h3>
                
                <div style="space-y: 15px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(34, 197, 94, 0.2);">
                    <span style="color: #6b7280; font-weight: 500; font-size: 16px;">שם התורם:</span>
                    <span style="color: #111827; font-weight: 600; font-size: 16px;">${fullName}</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(34, 197, 94, 0.2);">
                    <span style="color: #6b7280; font-weight: 500; font-size: 16px;">כתובת מייל:</span>
                    <span style="color: #111827; font-weight: 500; font-size: 16px;">${email}</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0;">
                    <span style="color: #6b7280; font-weight: 500; font-size: 16px;">סכום התרומה:</span>
                    <span style="color: #15803d; font-weight: 700; font-size: 24px;">${amount} ₪</span>
                  </div>
                </div>
              </div>

              <!-- Website Link Section -->
              <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; padding: 30px; margin: 40px 0; text-align: center;">
                <center>
                  <div style="background-color: white; width: 60px; height: 60px; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); line-height: 60px;">
                    <img src="${LOGO_URL}" alt="לוגו" style="width: 40px; height: 40px; object-fit: contain; vertical-align: middle;">
                  </div>
                </center>
                <h3 style="color: white; margin: 0 0 5px 0; font-size: 22px; font-weight: 600;">רוצה לעזור עוד? בקר באתר שלנו</h3>
                <p style="color: #cbd5e1; margin: 0 0 20px 0; font-size: 16px;">
                  גלה עוד על הפרויקט ותרום שוב
                </p>
                
                <a href="${WEBSITE_URL}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3); transition: all 0.3s ease;">
                  🌐 כנס לאתר חב"ד תפן
                </a>
              </div>

              <!-- Impact Message -->
              <div style="background: linear-gradient(135deg, #15803d 0%, #22c55e 100%); color: white; border-radius: 16px; padding: 30px; margin: 40px 0; text-align: center; position: relative;">
                <div style="position: absolute; top: 15px; left: 15px; width: 50px; height: 50px; border: 1px solid rgba(255,255,255,0.3); border-radius: 50%;"></div>
                
                <h4 style="color: white; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
                  ההשפעה שלך
                </h4>
                <p style="color: rgba(255,255,255,0.95); margin: 0; line-height: 1.7; font-size: 16px;">
                  בזכות תרומתך, עוד חיילי צה"ל יוכלו להתחבר למסורת היהודית במהלך השירות הצבאי.
                  <br><br>
                  <strong>אתה שותף במעשה קדוש!</strong>
                </p>
              </div>

              <!-- Chabad Message -->
              <div style="background-color: #f8fafc; border-right: 4px solid #15803d; padding: 25px; margin: 40px 0; border-radius: 8px;">
                <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6; font-style: italic;">
                  "כל יהודי הוא עולם מלא" - הרבי מליובאוויטש<br>
                  אנחנו גאים להיות חלק ממשימת חב"ד לחבר כל יהודי למסורת ולמצוות.
                </p>
              </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #111827; color: white; padding: 40px 30px; text-align: center;">
              <center>
                <div style="background-color: white; width: 50px; height: 50px; border-radius: 50%; margin-bottom: 20px; line-height: 50px;">
                  <img src="${LOGO_URL}" alt="לוגו" style="width: 35px; height: 35px; object-fit: contain; vertical-align: middle;">
                </div>
              </center>
              <h4 style="margin: 0 0 5px 0; font-size: 20px; font-weight: 600;">
                צוות מיזם תפילין לחייל
              </h4>
              <p style="margin: 0 0 25px 0; color: #9ca3af; font-size: 16px;">
                מחברים חיילי צה"ל למסורת היהודית
              </p>
              
              <!-- Website Link in Footer -->
              <div style="margin: 25px 0;">
                <a href="${WEBSITE_URL}" style="color: #22c55e; text-decoration: none; font-weight: 500; font-size: 16px;">
                  🌐 ${WEBSITE_URL}
                </a>
              </div>
              
              <!-- Contact Info -->
              <div style="border-top: 1px solid #374151; padding-top: 25px; margin-top: 25px;">
                <p style="margin: 0 0 8px 0; color: #d1d5db; font-size: 14px;">
                  לשאלות ופניות: tefilindiversitech@gmail.com
                </p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
 
                בית חב"ד • מחברים יהודים ברחבי העולם
                </p>
              </div>
            </div>

          </div>
        </body>
        </html>
      `,
      replyTo: 'tefilindiversitech@gmail.com'
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({
        success: false,
        error: 'שגיאה בשליחת המייל'
      }, { status: 500 });
    }

    const messageId = data?.id || 'unknown';
    console.log('Email sent successfully:', messageId);
    return NextResponse.json({ success: true, messageId });

  } catch (err) {
    console.error('Email sending error:', err);
    return NextResponse.json({
      success: false,
      error: 'שגיאה בשליחת המייל'
    }, { status: 500 });
  }
}