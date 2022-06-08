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

const testPutData = async (url, data) => {
  const response = await request.put(url)
    .send(data)
    .set('Content-Type', 'application/json');
  expect(response.status).toBe(200);
  return response.body;
}

const testDeleteData = async (url) => {
  const response = await request.delete(url);
  expect(response.status).toBe(200);
  return response.body;
}

describe('Test CRUD operations', () => {
  beforeAll(async () => {
    await db.sequelize.sync();
  });

  const type1 = {name: 'Type1', maxPower: 10};
  const type2 = {name: 'Type2', maxPower: 30};
  
  const fieldsType = ['id', 'name', 'maxPower'];
  var type1resp, type2resp;

  describe('test create types', () => {
    test('POST type1', async () => {
      type1resp = await testPostData('/api/v1/station-types', type1);
      expect(_.pick(type1resp, 'name', 'maxPower')).toEqual(type1);
    });

    test('GET type1', async () => {
      const resp = await testGetData('/api/v1/station-types/' + type1resp.id);
      expect(_.pick(resp, fieldsType)).toEqual(_.pick(type1resp, fieldsType));
    });

    test('POST type2', async () => {
      type2resp = await testPostData('/api/v1/station-types', type2);
      expect(_.pick(type2resp,'name', 'maxPower')).toEqual(type2);
    });

    test('GET type2', async () => {
      const resp = await testGetData('/api/v1/station-types/' + type2resp.id);
      expect(_.pick(resp, fieldsType)).toEqual(_.pick(type2resp, fieldsType));
    });
  
    test('GET types list', async () => {
      const resp = await testGetData('/api/v1/station-types');
      expect(resp.length).toBe(2);
    });

    test('PUT type1', async () => {
      const resp = await testPutData('/api/v1/station-types/' + type1resp.id, {name: 'Type-1'});
      expect(resp).toEqual([1]);
    });

    test('GET type1 after PUT', async () => {
      const resp = await testGetData('/api/v1/station-types/' + type1resp.id);
      expect(resp.name).toEqual('Type-1');
    });
  });

  const compA = {name: 'Company A'};
  const compA1 = {name: 'Company A-1'};
  const compA2 = {name: 'Company A-2'};
  const compA11 = {name: 'Company A-1-1'};
  const compB = {name: 'Company B'};
  
  var compAresp, compA1resp, compA2resp, compA11resp, compBresp;

  describe('test create companies', () => {
    test('POST company A', async () => {
      compAresp = await testPostData('/api/v1/companies', compA);
      expect(compAresp.name).toEqual(compA.name);
    });
    
    test('POST company B', async () => {
      compBresp = await testPostData('/api/v1/companies', compB);
      expect(compBresp.name).toEqual(compB.name);
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

    test('GET companies list', async () => {
      const resp = await testGetData('/api/v1/companies');
      expect(resp.length).toBe(5);
    });

    test('GET company A', async () => {
      const resp = await testGetData('/api/v1/companies/' + compAresp.id);
      expect(resp.name).toEqual(compA.name);
    });

    test('GET company A-1', async () => {
      const resp = await testGetData('/api/v1/companies/' + compA1resp.id);
      expect(resp.name).toEqual(compA1.name);
      expect(resp.parentId).toEqual(compAresp.id);
    });

    test('GET company A-1-1', async () => {
      const resp = await testGetData('/api/v1/companies/' + compA11resp.id);
      expect(resp.name).toEqual(compA11.name);
      expect(resp.parentId).toEqual(compA1resp.id);
    });

    test('PUT company A-1', async () => {
      const resp = await testPutData('/api/v1/companies/' + compA1resp.id, {name: 'AA-1'});
      expect(resp).toEqual([1]);
    });

    test('GET company A-1 after PUT', async () => {
      const resp = await testGetData('/api/v1/companies/' + compA1resp.id);
      expect(resp.name).toEqual('AA-1');
    });
  });


  const station1 = {name: 'Station 1'};
  const station2 = {name: 'Station 2'};
  const station3 = {name: 'Station 3'};
  const station4 = {name: 'Station 4'};
  
  var station1resp, station2resp, station3resp, station4resp;

  describe('test stations', () => {

    test('POST station 1', async () => {
      station1resp = await testPostData('/api/v1/companies/' + compAresp.id + '/stations', {...station1, stationTypeId: type1resp.id});
      expect(station1resp.name).toEqual(station1.name);
      expect(station1resp.stationTypeId).toEqual(type1resp.id);
    });
    
    test('POST station 2', async () => {
      station2resp = await testPostData('/api/v1/companies/' + compAresp.id + '/stations', {...station2, stationTypeId: type2resp.id});
      expect(station2resp.name).toEqual(station2.name);
      expect(station2resp.stationTypeId).toEqual(type2resp.id);
    });

    test('POST station 3', async () => {
      station3resp = await testPostData('/api/v1/companies/' + compA11resp.id + '/stations', {...station3, stationTypeId: type2resp.id});
      expect(station3resp.name).toEqual(station3.name);
      expect(station3resp.stationTypeId).toEqual(type2resp.id);
    });

    test('GET stations list', async () => {
      const resp = await testGetData('/api/v1/stations');
      expect(resp.length).toBe(3);
    });

    test('GET station 1', async () => {
      const resp = await testGetData('/api/v1/stations/' + station1resp.id);
      expect(resp.name).toEqual(station1.name);
    });

    test('GET station 2', async () => {
      const resp = await testGetData('/api/v1/stations/' + station2resp.id);
      expect(resp.name).toEqual(station2.name);
    });

    test('GET all stations for company', async () => {
      const resp = await testGetData('/api/v1/companies/' + compAresp.id + '/stations');
      expect(resp.length).toBe(3);
    });

    test('PUT station 1', async () => {
      const resp = await testPutData('/api/v1/stations/' + compA1resp.id, {name: 'Station-1'});
      expect(resp).toEqual([1]);
    });

    test('GET station 1 after PUT', async () => {
      const resp = await testGetData('/api/v1/stations/' + compA1resp.id);
      expect(resp.name).toEqual('Station-1');
    });
  });

  describe('test delete stations', () => {
    test('Cannot delete company with stations', async () => {
      const resp = await request.delete('/api/v1/companies/' + compAresp.id);
      expect(resp.status).toBe(500);
    });

    test('Cannot delete type used by stations', async () => {
      const resp = await request.delete('/api/v1/station-types/' + type1resp.id);
      expect(resp.status).toBe(500);
    });

    test('Delete station 1', async () => {
      const resp = await testDeleteData('/api/v1/stations/' + station1resp.id);
      expect(resp).toBe(1);
    });

    test('Delete station 2', async () => {
      const resp = await testDeleteData('/api/v1/stations/' + station2resp.id);
      expect(resp).toBe(1);
    });

    test('Delete station 3', async () => {
      const resp = await testDeleteData('/api/v1/stations/' + station3resp.id);
      expect(resp).toBe(1);
    });
  });

  describe('test delete companies', () => {

    test('Delete company B', async () => {
      const resp = await testDeleteData('/api/v1/companies/' + compBresp.id);
      expect(resp).toBe(1);
    });

    test('Cannot delete company with children', async () => {
      const resp = await request.delete('/api/v1/companies/' + compAresp.id);
      expect(resp.status).toBe(500);
    });

    test('Delete company A-2', async () => {
      const resp = await testDeleteData('/api/v1/companies/' + compA2resp.id);
      expect(resp).toBe(1);
    });

    test('Delete company A-1-1', async () => {
      const resp = await testDeleteData('/api/v1/companies/' + compA11resp.id);
      expect(resp).toBe(1);
    });

    test('Delete company A-1', async () => {
      const resp = await testDeleteData('/api/v1/companies/' + compA1resp.id);
      expect(resp).toBe(1);
    });

    test('Delete company A', async () => {
      const resp = await testDeleteData('/api/v1/companies/' + compAresp.id);
      expect(resp).toBe(1);
    });
  });
  
  describe('test delete types', () => {
    test('Delete type 1', async () => {
      const resp = await testDeleteData('/api/v1/station-types/' + type1resp.id );
      expect(resp).toBe(1);
    });

    test('Delete type 2', async () => {
      const resp = await testDeleteData('/api/v1/station-types/' + type2resp.id );
      expect(resp).toBe(1);
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
