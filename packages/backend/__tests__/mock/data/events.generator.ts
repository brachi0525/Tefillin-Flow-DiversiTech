
export class EventsDataGenerator {
  private static eventTypes = ['distribution', 'ceremony', 'meeting', 'training'];
  
  private static locations = ['בסיס צריפין', 'בסיס שיזפון', 'בסיס חצרים', 'מרכז חב"ד'];
  
  private static statuses = ['scheduled', 'completed', 'cancelled', 'in_progress'];

  static generateEvent(overrides: Partial<any> = {}) {
    const randomType = this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];
    
    const randomLocation = this.locations[Math.floor(Math.random() * this.locations.length)];
    
    const randomStatus = this.statuses[Math.floor(Math.random() * this.statuses.length)];
    
    const futureDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    return {
      id: Math.floor(Math.random() * 10000), 
      title: `${randomType} Event`, 
      type: randomType,
      location: randomLocation,
      status: randomStatus, 
      startTime: futureDate.toISOString(), 
      endTime: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), 
      description: `Generated event for ${randomType}`,
      maxParticipants: Math.floor(Math.random() * 50) + 10, 
      currentParticipants: 0, 
      createdAt: new Date().toISOString(), 
      ...overrides 
    };
  }

  static generateMultipleEvents(count: number) {
    return Array.from({ length: count }, () => this.generateEvent());
  }

  static generateDistributionEvents(count: number) {
    return Array.from({ length: count }, () => 
      this.generateEvent({ 
        type: 'distribution',
        title: 'Tefillin Distribution Event', 
        status: 'scheduled' 
      })
    );
  }

  static generateCompletedEvents(count: number) {
    return Array.from({ length: count }, () => {
      const pastDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      return this.generateEvent({ 
        status: 'completed', 
        startTime: pastDate.toISOString(), 
        endTime: new Date(pastDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), 
        currentParticipants: Math.floor(Math.random() * 30) + 5 
      });
    });
  }
}
