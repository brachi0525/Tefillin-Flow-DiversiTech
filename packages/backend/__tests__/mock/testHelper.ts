import request from 'supertest';
import app from '../src/app';

export const apiGet = (url: string) => {
  return request(app).get(url);
};

export const apiPost = (url: string, body: any) => {
  return request(app).post(url).send(body);
};

export const apiPut = (url: string, body: any) => {
  return request(app).put(url).send(body);
};

export const apiDelete = (url: string) => {
  return request(app).delete(url);
};
