export class SoldiersDataGenerator {
  private static names = ['דוד כהן', 'יוסי לוי', 'אבי שמואל', 'רון ישראל', 'עמית גולד'];
  
  private static units = ['גולני', 'צנחנים', 'שריון', 'חיל האוויר', 'נחל'];
  
  private static bases = ['בסיס צריפין', 'בסיס שיזפון', 'בסיס חצרים', 'בסיס פלמחים'];

  static generateSoldier(overrides: Partial<any> = {}) {
    const randomName = this.names[Math.floor(Math.random() * this.names.length)];
    
    const randomUnit = this.units[Math.floor(Math.random() * this.units.length)];
    
    const randomBase = this.bases[Math.floor(Math.random() * this.bases.length)];
    
    return {
      id: Math.floor(Math.random() * 10000),
      name: randomName,
      phone: `050${Math.floor(Math.random() * 9000000) + 1000000}`,
      unit: randomUnit,
      base: randomBase,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      ...overrides
    };
  }

  static generateMultipleSoldiers(count: number) {
    return Array.from({ length: count }, () => this.generateSoldier());
  }
}
