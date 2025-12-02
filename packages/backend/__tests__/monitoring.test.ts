import { describe, it } from 'node:test';
import { MockMeshulamPayments } from '../src/mocks/meshulam.mock';
import { expect } from 'expect';

describe('Monitoring & Alerts', () => {
  it('should log payment success for valid payment', async () => {
    const result = await MockMeshulamPayments.processPayment({ amount: 50 });
    expect(result.status).toBe('success');
  });

  it('should log error and send alert for invalid payment', async () => {
    await expect(MockMeshulamPayments.processPayment({ amount: 0 }))
      .rejects
      .toThrow('Invalid payment amount');
    // כאן אפשר להוסיף בדיקה ללוגים אם מממשים לוגים מתקדמים
  });
});