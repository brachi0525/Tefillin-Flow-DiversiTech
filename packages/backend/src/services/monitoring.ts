import express from 'express';

export const monitoringRouter = express.Router();

let errorCount = 0;
let paymentSuccessCount = 0;

monitoringRouter.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    errors: errorCount,
    payments: paymentSuccessCount
  });
});

export function logError() {
  errorCount++;
}

export function logPaymentSuccess() {
  paymentSuccessCount++;
}

export function sendAlert(message: string) {
  // אפשר להרחיב למייל/Slack
  console.log('ALERT:', message);
}