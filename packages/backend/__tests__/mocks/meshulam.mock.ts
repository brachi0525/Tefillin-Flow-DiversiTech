import { logError, logPaymentSuccess, sendAlert } from '../../src/services/monitoring';

export class MockMeshulamPayments {
  static mockPayment = {
    transactionId: 'mock-trans-123',
    amount: 100,
    currency: 'ILS',
    status: 'success'
  };

  static processPayment(paymentData: any) {
    if (paymentData.amount > 0) {
      logPaymentSuccess();
      return Promise.resolve({
        ...this.mockPayment,
        amount: paymentData.amount,
        status: 'success'
      });
    }
    logError();
    sendAlert('Attempted payment with invalid amount: ' + paymentData.amount);
    return Promise.reject(new Error('Invalid payment amount'));
  }

  static refundPayment(transactionId: string) {
    return Promise.resolve({
      transactionId,
      status: 'refunded',
      refundAmount: this.mockPayment.amount
    });
  }
}