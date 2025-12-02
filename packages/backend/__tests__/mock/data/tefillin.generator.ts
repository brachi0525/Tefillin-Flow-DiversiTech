export class TefillinDataGenerator {
  private static types = ['regular', 'mehudar', 'special'];
  
  private static statuses = ['available', 'distributed', 'maintenance', 'reserved'];
  
  private static locations = ['warehouse', 'base_storage', 'in_transit', 'with_soldier'];

  static generateTefillin(overrides: Partial<any> = {}) {
    const randomType = this.types[Math.floor(Math.random() * this.types.length)];
    
    const randomStatus = this.statuses[Math.floor(Math.random() * this.statuses.length)];
    
    const randomLocation = this.locations[Math.floor(Math.random() * this.locations.length)];
    
    return {
      id: Math.floor(Math.random() * 10000),
      type: randomType,
      status: randomStatus,
      location: randomLocation,
      serialNumber: `TF${Math.floor(Math.random() * 100000)}`,
      purchaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      condition: 'good',
      ...overrides
    };
  }

  static generateMultipleTefillin(count: number) {
    return Array.from({ length: count }, () => this.generateTefillin());
  }

  static generateAvailableTefillin(count: number) {
    return Array.from({ length: count }, () => 
      this.generateTefillin({ status: 'available', location: 'warehouse' })
    );
  }
}
