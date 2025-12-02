import axios from 'axios';

const idInstance = '7105285864';
const apiTokenInstance = '34ac1c7e270e41c58328992bb5c1d34920a72c5d330946398d';

const apiUrl = `https://7105.api.greenapi.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    const url = 'https://7105.api.greenapi.com/waInstance7105285864/sendMessage/34ac1c7e270e41c58328992bb5c1d34920a72c5d330946398d';

    const payload = {
      chatId: `${phoneNumber}@c.us`,
      message
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(' הודעה נשלחה:', response.data);
  } catch (error: any) {
    console.error(' שגיאה בשליחת הודעה:', error);
    throw error;
  }
}

