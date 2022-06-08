const express = require('express');
const {StationType} = require('../model');
const router = express.Router();
const _ = require('lodash');
const { onDbError, withId, dataResponse } = require('../util');

const fields = req => _.pick(req.body, ['name', 'maxPower'])

router.get('/station-types', function(req, res, next) {
  console.log('get station typez');
  StationType.findAll()
    .then(records => res.json(records))
    .catch(err => onDbError(res, err));
});

router.post('/station-types', function(req, res, next) {
  console.log('create-station type', req.body);
  StationType.create(fields(req))
    .then(rec => res.json(rec))
    .catch(err => onDbError(res, err));
});

router.get('/station-types/:id', function(req, res, next) {
  console.log('get station type', req.params.id);
  StationType.findOne({ where: { id: req.params.id } })
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

router.put('/station-types/:id', function(req, res, next) {
  console.log('update station type', req.params.id);
  StationType.update(fields(req), withId(req.params.id))
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

router.delete('/station-types/:id', function(req, res, next) {
  console.log('delete station type', req.params.id);
  StationType.destroy(withId(req.params.id))
    .then(rec => dataResponse(res, rec))
    .catch(err => onDbError(res, err));
});

module.exports = router;
