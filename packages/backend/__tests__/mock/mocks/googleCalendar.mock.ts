export class MockGoogleCalendar {
  static mockEvent = {
    id: 'mock-event-123',
    summary: 'Tefillin Distribution',
    start: { dateTime: '2024-01-15T10:00:00Z' },
    end: { dateTime: '2024-01-15T11:00:00Z' },
    location: 'IDF Base'
  };

  static createEvent(eventData: any) {
    return Promise.resolve({
      ...this.mockEvent,
      summary: eventData.summary,
      start: eventData.start,
      end: eventData.end
    });
  }

  static updateEvent(eventId: string, eventData: any) {
    return Promise.resolve({
      ...this.mockEvent,
      id: eventId,
      ...eventData
    });
  }

  static deleteEvent(eventId: string) {
    return Promise.resolve({ 
      deleted: true,
      eventId
    });
  }
}
