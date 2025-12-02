import { SoldiersDataGenerator } from './soldiers.generator';
import { TefillinDataGenerator } from './tefillin.generator';
import { EventsDataGenerator } from './events.generator';

export { SoldiersDataGenerator, TefillinDataGenerator, EventsDataGenerator };

export class TestDataGenerator {
  static soldiers = SoldiersDataGenerator;
  static tefillin = TefillinDataGenerator;
  static events = EventsDataGenerator;

  static generateFullTestDataset() {
    return {
      soldiers: this.soldiers.generateMultipleSoldiers(10),
      tefillin: this.tefillin.generateAvailableTefillin(15),
      distributionEvents: this.events.generateDistributionEvents(5),
      completedEvents: this.events.generateCompletedEvents(3)
    };
  }

  static generateDistributionScenario() {
    return {
      pendingSoldier: this.soldiers.generateSoldier({ status: 'pending' }),
      approvedSoldier: this.soldiers.generateSoldier({ status: 'approved' }),
      availableTefillin: this.tefillin.generateTefillin({ 
        status: 'available', 
        location: 'warehouse' 
      }),
      distributionEvent: this.events.generateEvent({ 
        type: 'distribution', 
        status: 'scheduled' 
      })
    };
  }

  static clearTestData() {
    return {
      message: 'Test data cleared',
      timestamp: new Date().toISOString()
    };
  }
}
