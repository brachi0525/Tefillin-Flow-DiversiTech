export class MockSupabase {
  static mockSoldier = {
    id: 1,
    name: 'חיים כהן',
    phone: '0501234567',
    unit: 'גולני',
    status: 'pending'
  };

  static mockTefillin = {
    id: 1,
    type: 'regular',
    status: 'available',
    location: 'warehouse'
  };

  static from(table: string) {
    return {
      select: () => ({
        eq: () => Promise.resolve({ 
          data: [this.mockSoldier],
          error: null
        })
      }),
      
      insert: (data: any) => Promise.resolve({ 
        data,
        error: null
      }),
      
      update: (data: any) => ({
        eq: () => Promise.resolve({ 
          data,
          error: null
        })
      }),
      
      delete: () => ({
        eq: () => Promise.resolve({ 
          data: null,
          error: null
        })
      })
    };
  }
}
