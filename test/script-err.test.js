const supertest = require('supertest');
const app = require('../app');
const db = require('../config/sequelize')

const request = supertest(app);

const testPostScript = async (data) => request.post('/api/v1/script')
    .send(data)
    .set('Content-Type', 'text/plain')

describe('Test script API error reporting', () => {
  beforeAll(async () => {
    await db.sequelize.sync();
  });

  describe('syntax errors', () => {
    test('Invalid command', async () => {
      const resp = await testPostScript('Begin End');
      expect(resp.status).toBe(500);
    });

    test('Invalid Wait args', async () => {
      const resp = await testPostScript(`Begin
          Wait 110 120`);
      expect(resp.status).toBe(500);
    });

    test('Invalid Start args', async () => {
      const resp = await testPostScript(`Begin
          
        Start station 1 2 3`);
      expect(resp.status).toBe(500);
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
