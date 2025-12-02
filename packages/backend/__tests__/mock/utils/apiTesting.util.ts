export class ApiTestingUtil {
  private static baseUrl = 'http://localhost:3000/api';
  
  private static defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  static async testGetEndpoint(endpoint: string, expectedStatus: number = 200) {
    try {
      console.log(`🔍 Testing GET ${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.defaultHeaders
      });
      
      if (response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
      }
      
      console.log(`✅ GET ${endpoint} - Status: ${response.status}`);
      
      const data = await response.json();
      return data;
      
    } catch (error: any) {
      console.error(`❌ GET ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  static async testPostEndpoint(endpoint: string, data: any, expectedStatus: number = 201) {
    try {
      console.log(`📤 Testing POST ${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(data)
      });
      
      if (response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
      }
      
      console.log(`✅ POST ${endpoint} - Status: ${response.status}`);
      
      const responseData = await response.json();
      return responseData;
      
    } catch (error: any) {
      console.error(`❌ POST ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  static async testPutEndpoint(endpoint: string, data: any, expectedStatus: number = 200) {
    try {
      console.log(`📝 Testing PUT ${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.defaultHeaders,
        body: JSON.stringify(data)
      });
      
      if (response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
      }
      
      console.log(`✅ PUT ${endpoint} - Status: ${response.status}`);
      
      const responseData = await response.json();
      return responseData;
      
    } catch (error: any) {
      console.error(`❌ PUT ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  static async testDeleteEndpoint(endpoint: string, expectedStatus: number = 200) {
    try {
      console.log(`🗑️ Testing DELETE ${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.defaultHeaders
      });
      
      if (response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
      }
      
      console.log(`✅ DELETE ${endpoint} - Status: ${response.status}`);
      
      const responseData = await response.json();
      return responseData;
      
    } catch (error: any) {
      console.error(`❌ DELETE ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  static setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`
    } as any;
    console.log('🔐 Auth token set for API requests');
  }

  static clearAuthToken() {
    const { Authorization, ...headersWithoutAuth } = this.defaultHeaders as any;
    this.defaultHeaders = headersWithoutAuth;
    console.log('🔓 Auth token cleared');
  }

  static setBaseUrl(url: string) {
    this.baseUrl = url;
    console.log(`🌐 API base URL set to: ${url}`);
  }

  static async checkApiHealth() {
    try {
      console.log('🏥 Checking API health...');
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET'
      });
      
      if (response.ok) {
        console.log('✅ API is healthy');
        return true;
      } else {
        console.error('❌ API health check failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ API health check failed');
      return false;
    }
  }
}
