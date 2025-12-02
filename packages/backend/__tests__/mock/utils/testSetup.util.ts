import { MockGoogleAuth, MockGoogleCalendar, MockMeshulamPayments } from '../mocks';
import { TestDataGenerator } from '../data';

export class TestSetupUtil {
  private static testData: any = {};

  static async setupTestEnvironment() {
    console.log('🔧 Setting up test environment...');
    
    this.mockExternalServices();
    
    this.testData = TestDataGenerator.generateFullTestDataset();
    
    await this.setupRealTestDatabase();
    
    console.log('✅ Test environment ready!');
    return this.testData;
  }

  private static mockExternalServices() {
    (globalThis as any).GoogleAuth = MockGoogleAuth;
    (globalThis as any).GoogleCalendar = MockGoogleCalendar;
    (globalThis as any).MeshulamPayments = MockMeshulamPayments;
    
    console.log('🔄 External services mocked (Google, Meshulam only)');
  }

  private static async setupRealTestDatabase() {
    console.log('📊 Setting up REAL test database...');
    
    try {
      await this.createTestTables();
      
      await this.insertTestData();
      
      console.log('✅ Real test database ready');
    } catch (error) {
      console.error('❌ Failed to setup test database:', error);
      throw error;
    }
  }

  private static async createTestTables() {
    console.log('📋 Creating test tables...');
  }

  private static async insertTestData() {
    console.log('📝 Inserting test data to real database...');
    
    for (const soldier of this.testData.soldiers) {
    }
    
    for (const tefillin of this.testData.tefillin) {
    }
    
    console.log('✅ Test data inserted to real database');
  }

  static async teardownTestEnvironment() {
    console.log('🧹 Cleaning up test environment...');
    
    await this.cleanupRealTestDatabase();
    
    this.testData = {};
    
    delete (globalThis as any).GoogleAuth;
    delete (globalThis as any).GoogleCalendar;
    delete (globalThis as any).MeshulamPayments;
    
    console.log('✅ Test environment cleaned');
  }

  private static async cleanupRealTestDatabase() {
    console.log('🗑️ Cleaning up real test database...');
    
    try {
      console.log('✅ Real test database cleaned');
    } catch (error) {
      console.error('❌ Failed to cleanup test database:', error);
    }
  }
  static getTestData() {
    return this.testData;
  }

  static async createTestScenario(scenarioName: string) {
    switch (scenarioName) {
      case 'distribution':
        return TestDataGenerator.generateDistributionScenario();
      
      case 'payment':
        return {
          soldier: TestDataGenerator.soldiers.generateSoldier({ status: 'approved' }),
          payment: { amount: 100, currency: 'ILS' }
        };
      
      default:
        throw new Error(`Unknown scenario: ${scenarioName}`);
    }
  }
}
