const express = require('express');
const {Companies} = require('../model/station');
const router = express.Router();
const _ = require('lodash');
const { onDbError, withId, dataResponse } = require('../util');

const fields = req => _.pick(req.body, 'name')

router.get('/companies', function(req, res, next) {
  console.log('get companies', Companies);
  Companies.findAll()
    .then(records => res.json(records))
    .catch(err => onDbError(res, err));
});

router.post('/companies', function(req, res, next) {
  console.log('create company', req.body);
  Companies.create(fields(req))
    .then(rec => res.json(rec))
    .catch(err => onDbError(res, err));
});

router.post('/companies/:parent', function(req, res, next) {
  console.log('create child company', req.body);
  Companies.create({parentId: req.params.parent, ...fields(req)})
    .then(rec => res.json(rec))
    .catch(err => onDbError(res, err));
});

router.get('/companies/:id', function(req, res, next) {
  console.log('get company', req.params.id);
  Companies.findOne(withId(req.params.id))
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

router.put('/companies/:id', function(req, res, next) {
  console.log('update company', req.params.id);
  Companies.update(fields(req), withId(req.params.id))
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

router.delete('/companies/:id', function(req, res, next) {
  console.log('delete company', req.params.id);
  Companies.destroy(withId(req.params.id))
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

module.exports = router;


