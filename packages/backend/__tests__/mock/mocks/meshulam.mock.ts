export class MockMeshulamPayments {
  static mockPayment = {
    transactionId: 'mock-trans-123',
    amount: 100,
    currency: 'ILS',
    status: 'success'
  };

  static processPayment(paymentData: any) {
    if (paymentData.amount > 0) {
      return Promise.resolve({
        ...this.mockPayment,
        amount: paymentData.amount,
        status: 'success'
      });
    }
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
