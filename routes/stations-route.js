const express = require('express');
const {Stations, Companies, StationType} = require('../model');
const router = express.Router();
const _ = require('lodash');
const { onDbError, withId, dataResponse, getChildCompanies, } = require('../util');

const fields = req => _.pick(req.body, 'name', 'stationTypeId')

router.get('/stations', function(req, res, next) {
  console.log('get stations');
  Stations.findAll()
    .then(records => res.json(records))
    .catch(err => onDbError(res, err));
});

router.get('/companies/:company/stations', function(req, res, next) {
  console.log('retrieve all company stations (with child companies)');

  getChildCompanies(req.params.company)
    .then(list => [req.params.company, ...list.map(c => c.id)])
    .then(companies => Stations.findAll({
      where: {companyId: companies}, 
      include:[{model: StationType}]
    }))
    .then(_ => res.json(_))
});

router.post('/companies/:company/stations', function(req, res, next) {
  console.log('create station', req.body);
  Stations.create({companyId: req.params.company, ...fields(req)})
    .then(rec => res.json(rec))
    .catch(err => onDbError(res, err));
});

router.get('/stations/:id', function(req, res, next) {
  console.log('get station', req.params.id);
  Stations.findOne(withId(req.params.id))
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

router.put('/stations/:id', function(req, res, next) {
  console.log('update station', req.params.id);
  Stations.update(fields(req), withId(req.params.id))
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

router.delete('/stations/:id', function(req, res, next) {
  console.log('delete station', req.params.id);
  Stations.destroy(withId(req.params.id))
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

module.exports = router;


