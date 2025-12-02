export class MockGoogleAuth {
  static mockUser = {
    id: 'mock-user-123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg'
  };

  static verifyToken(token: string) {
    if (token === 'valid-token') {
      return Promise.resolve(this.mockUser);
    }
    return Promise.reject(new Error('Invalid token'));
  }

  static generateToken() {
    return 'mock-jwt-token-12345';
  }
}
