const express = require('express');
const router = express.Router();

const { onDbError } = require('../util');
const runScript = require('../script');

router.post('/script', express.text(), function(req, res, next) {
  console.log('run script');
  
  runScript(req.body)
    .then(rec => res.json(rec))
    .catch(err => onDbError(res, err));
});

module.exports = router;
