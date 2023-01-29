import { dayEvent } from '../types/dayEvent';
import { client } from '../utils/fetchClient';

export function getAll() {
  return client.get();
}

export function addOne(data: dayEvent) {
  return client.post(data);
}

export function deleteOne(eventId:number) {
  return client.delete(eventId);
}

export function updateOne(newData: dayEvent) {
  return client.patch(newData);
}
