const supertest = require('supertest');
const _ = require('lodash');
const app = require('../app');
const db = require('../config/sequelize');

const request = supertest(app);

const testGetData = async (url) => {
  const response = await request.get(url);
  expect(response.status).toBe(200);
  return response.body;
}

const testPostData = async (url, data) => {
  const response = await request.post(url)
    .send(data)
    .set('Content-Type', 'application/json');
  expect(response.status).toBe(200);
  return response.body;
}

const testPutStatus = (url, status) => async () => {
  const response = await request.put(url);
  expect(response.status).toBe(status);
}

const testDeleteData = async (url) => {
  const response = await request.delete(url);
  expect(response.status).toBe(200);
  return response.body;
}

const testDelStatus = (url, status) => async () => {
  const response = await request.delete(url);
  expect(response.status).toBe(status);
}

describe('Test CRUD operations', () => {
  beforeAll(async () => {
    await db.sequelize.sync();
  });

  const compA = {name: 'Company A'};
  const compA1 = {name: 'Company A-1'};
  const compA2 = {name: 'Company A-2'};
  const compA11 = {name: 'Company A-1-1'};
  
  var compAresp, compA1resp, compA2resp, compA11resp;

  describe('test create companies', () => {
    test('POST company A', async () => {
      compAresp = await testPostData('/api/v1/companies', compA);
      expect(compAresp.name).toEqual(compA.name);
    });
    
    test('POST company A-1', async () => {
      compA1resp = await testPostData('/api/v1/companies/' + compAresp.id, compA1);
      expect(compA1resp.name).toEqual(compA1.name);
    });
    
    test('POST company A-2', async () => {
      compA2resp = await testPostData('/api/v1/companies/' + compAresp.id, compA2);
      expect(compA2resp.name).toEqual(compA2.name);
    });

    test('POST company A-1-1', async () => {
      compA11resp = await testPostData('/api/v1/companies/' + compA1resp.id, compA11);
      expect(compA11resp.name).toEqual(compA11.name);
    });

    test('GET company A', async () => {
      const resp = await testGetData('/api/v1/companies/' + compAresp.id);
      expect(resp.children).toBeUndefined();
    });

    test('GET company A-1', async () => {
      const resp = await testGetData('/api/v1/companies/' + compA1resp.id + '?children=true');
      expect(resp.parentId).toBe(compAresp.id);
    });

    test('GET company A-1-1', async () => {
      const resp = await testGetData('/api/v1/companies/' + compA11resp.id + '?children=true');
      expect(resp.parentId).toBe(compA1resp.id);
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
