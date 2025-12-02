import { TestSetupUtil } from './testSetup.util';
import { ApiTestingUtil } from './apiTesting.util';

export { TestSetupUtil, ApiTestingUtil };

export class TestUtils {
  static setup = TestSetupUtil;
  static api = ApiTestingUtil;

  static async initializeFullTestEnvironment() {
    console.log('🚀 Initializing full test environment...');
    
    const isApiHealthy = await ApiTestingUtil.checkApiHealth();
    if (!isApiHealthy) {
      console.warn('⚠️ API is not healthy, continuing with mocks only');
    }
    
    const testData = await TestSetupUtil.setupTestEnvironment();
    
    console.log('✅ Full test environment initialized');
    return {
      testData,
      isApiHealthy
    };
  }

  static async cleanupFullTestEnvironment() {
    console.log('🧹 Cleaning up full test environment...');
    
    await TestSetupUtil.teardownTestEnvironment();
    ApiTestingUtil.clearAuthToken();
    
    console.log('✅ Full test environment cleaned');
  }

  static async runFullEndpointTest(endpoint: string, testData: any) {
    console.log(`🔬 Running full test for endpoint: ${endpoint}`);
    
    try {
      const getData = await ApiTestingUtil.testGetEndpoint(endpoint);
      
      if (testData) {
        const postData = await ApiTestingUtil.testPostEndpoint(endpoint, testData);
        
        if (postData && postData.id) {
          const updatedData = { ...testData, name: 'Updated Name' };
          await ApiTestingUtil.testPutEndpoint(`${endpoint}/${postData.id}`, updatedData);
          
          await ApiTestingUtil.testDeleteEndpoint(`${endpoint}/${postData.id}`);
        }
      }
      
      console.log(`✅ Full endpoint test completed for: ${endpoint}`);
      return true;
      
    } catch (error: any) {
      console.error(`❌ Full endpoint test failed for ${endpoint}:`, error.message);
      return false;
    }
  }
}
