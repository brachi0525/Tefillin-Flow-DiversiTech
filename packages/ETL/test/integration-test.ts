class IntegrationTest{

    runTest() {
        const result = this.testIntegration();
        if (result) {
            console.log(`${this.constructor.name}: integration successful.`);
        } else {
            console.log(`${this.constructor.name}: integration failed.`);
        }
    }
   

    testIntegration(): boolean {
        throw new Error("testIntegration method must be implemented in subclass!!");
    }
}
export default IntegrationTest; 