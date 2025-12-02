import request from 'supertest';
import app from '../src/app';
import { describe, it } from 'node:test';

type EntityTestConfig = {
  name: string;
  endpoint: string;
  sample: Record<string, any>;
  update?: Record<string, any>;
  requiredFields?: string[];
  uniqueFields?: string[];
};

export function testEntityApi(config: EntityTestConfig) {
  const {
    name,
    endpoint,
    sample,
    update = {},
    requiredFields = [],
    uniqueFields = [],
  } = config;

  let id: string | undefined;

  describe(`${name} API`, () => {
    it(`should create ${name}`, async () => {
      const res = await request(app).post(endpoint).send(sample);
      console.log('🟢 Create:', res.status, res.body);

      expect([200, 201]).toContain(res.status);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();

      id = res.body.id;
      expect(id).toBeDefined();
    });

    if (uniqueFields.length > 0) {
      it(`should fail to create duplicate ${name}`, async () => {
        const res1 = await request(app).post(endpoint).send(sample);
        console.log('🟡 First create (duplicate test):', res1.status, res1.body);

        const res2 = await request(app).post(endpoint).send(sample);
        console.log('❌ Duplicate create:', res2.status, res2.body);

        expect([400, 409]).toContain(res2.status);
        expect(res2.body).toBeDefined();
        expect(res2.body.error).toBeDefined();
      });
    }

    if (requiredFields.length > 0) {
      for (const field of requiredFields) {
        it(`should fail to create ${name} without required field: ${field}`, async () => {
          const invalid = { ...sample };
          delete invalid[field];

          const res = await request(app).post(endpoint).send(invalid);
          console.log(`⚠️ Missing ${field}:`, res.status, res.body);

          expect(res.status).toBe(400);
          expect(res.body).toBeDefined();
          expect(res.body.errors ?? res.body.error).toBeDefined();
        });
      }
    }

    if (Object.keys(update).length > 0) {
      it(`should update ${name}`, async () => {
        expect(id).toBeDefined();
        if (!id) return;

        const res = await request(app).put(`${endpoint}/${id}`).send(update);
        console.log('✏️ Update:', res.status, res.body);

        expect([200, 204]).toContain(res.status);
        expect(res.body).toBeDefined();

        Object.entries(update).forEach(([key, value]) => {
          expect(res.body[key]).toEqual(value);
        });
      });
    }

    it(`should get single ${name} by id`, async () => {
      expect(id).toBeDefined();
      if (!id) return;

      const res = await request(app).get(`${endpoint}/${id}`);
      console.log('🔎 Get by ID:', res.status, res.body);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
    });

    it(`should delete ${name}`, async () => {
      expect(id).toBeDefined();
      if (!id) return;

      const res = await request(app).delete(`${endpoint}/${id}`);
      console.log('🗑 Delete:', res.status);

      expect([200, 204]).toContain(res.status);
    });

    it(`should return 404 for missing ${name}`, async () => {
      expect(id).toBeDefined();
      if (!id) return;

      const res = await request(app).get(`${endpoint}/${id}`);
      console.log('🚫 Get after delete (should 404):', res.status);

      expect(res.status).toBe(404);
    });
  });
}

function expect(arg0: number[]) {
  throw new Error('Function not implemented.');
}

