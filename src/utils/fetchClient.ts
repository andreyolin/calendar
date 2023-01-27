import { dayEvent } from '../types/dayEvent';

export const client = {
  get: () => JSON.parse((localStorage.getItem('events') || '[]')),
  post: (data: dayEvent) => {
    const dayEvents = client.get();

    localStorage.setItem('events', JSON.stringify([...dayEvents, data]));
  },
  delete: (eventid: string) => {
    const dayEvents:dayEvent[] = client.get();

    const newArrayOfDayEvents = dayEvents.filter(event => event.id !== eventid);

    localStorage.setItem('events', JSON.stringify([newArrayOfDayEvents]));
  },
  patch: (newData: dayEvent) => {
    const dayEvents:dayEvent[] = client.get();

    const currentEvent = dayEvents.find(event => newData.id === event.id);

    const newDayEvents = dayEvents.filter(event => event.id !== currentEvent?.id);

    localStorage.setItem('events', JSON.stringify([...newDayEvents, newData]));
  },
};
