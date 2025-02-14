import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../index';

describe('App', () => {
  it('should return 200 OK for health check endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('should return correct response for root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Fortune Telling API Server');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });
}); 