const supertest = require('supertest');
const app = require('../app');
const db = require('../config/sequelize')

const request = supertest(app);

const testGetStatus = (url, status) => async () => {
  const response = await request.get(url);
  expect(response.status).toBe(status);
}

const testPostStatus = (url, status) => async () => {
  const response = await request.post(url);
  expect(response.status).toBe(status);
}

const testPutStatus = (url, status) => async () => {
  const response = await request.put(url);
  expect(response.status).toBe(status);
}

const testDelStatus = (url, status) => async () => {
  const response = await request.delete(url);
  expect(response.status).toBe(status);
}

describe('Test API routes', () => {
  beforeAll(async () => {
    await db.sequelize.sync();
  });

  describe('basic route', () => {
    test('200 for empty GET /station-types', testGetStatus('/api/v1/station-types', 200));
    test('200 for empty GET /companies', testGetStatus('/api/v1/companies', 200));
    test('200 for empty GET /stations', testGetStatus('/api/v1/stations', 200));
    
    test('404 for incorrect GET /station-types/:id', testGetStatus('/api/v1/station-types/1', 404));
    test('404 for incorrect GET /companies', testGetStatus('/api/v1/companies/1', 404));
    test('404 for incorrect GET /stations', testGetStatus('/api/v1/stations/1', 404));

    test('404 for incorrect DELETE /station-types/:id', testGetStatus('/api/v1/station-types/1', 404));
    test('404 for incorrect DELETE /companies', testDelStatus('/api/v1/companies/1', 404));
    test('404 for incorrect DELETE /stations', testDelStatus('/api/v1/stations/1', 404));

    test('404 for incorrect route', testGetStatus('/hdhdjdjjsnsh', 404));
  });

  describe('empty post', () => {
    test('500 for empty POST /station-types', testPostStatus('/api/v1/station-types', 500));
    test('500 for empty POST /companies', testPostStatus('/api/v1/companies', 500));
    test('500 for empty POST child /companies/:id', testPostStatus('/api/v1/companies/1', 500));
    test('500 for empty POST station /companies/:id/stations', testPostStatus('/api/v1/companies/1/stations', 500));
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
