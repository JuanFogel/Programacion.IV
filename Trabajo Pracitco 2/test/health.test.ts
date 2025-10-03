import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { makeApp } from '../src/app.js';

describe('health endpoint', () => {
  it('GET /health returns ok', async () => {
    const app = makeApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});


