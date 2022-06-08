const supertest = require('supertest');
const app = require('../app');
const db = require('../config/sequelize');
const { StationType, Companies, Stations } = require('../model');

const request = supertest(app);

const testPostScript = async (data) => request.post('/api/v1/script')
    .send(data)
    .set('Content-Type', 'text/plain')

describe('Test script API', () => {
  beforeAll(async () => {
    await db.sequelize.sync();

    await StationType.bulkCreate([
      {
        name: 'Type 1',
        maxPower: 10,
      },
      {
        name: 'Type 2',
        maxPower: 10,
      },
    ]);

    await Companies.bulkCreate([
      {
        name: 'Company 1',
      },
      {
        name: 'Company 2',
      },
    ]);

    await Stations.bulkCreate([
      {
        name: 'Station 1',
        stationTypeId: 1,
        companyId: 1,
      },
      {
        name: 'Station 2',
        stationTypeId: 1,
        companyId: 1,
      },
      {
        name: 'Station 3',
        stationTypeId: 2,
        companyId: 2,
      },
    ])


    

  });

  describe('commands', () => {
    test('Invalid command', async () => {
      const resp = await testPostScript(`Begin
      Wait 5
      Start station 1
      Wait 10
      Start station 2
      Wait 5
      Start station 3
      Wait 10
      Stop station 2
      Stop station 1
      Wait 5 
      End`);

      expect(resp.status).toBe(200);
    });

  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
