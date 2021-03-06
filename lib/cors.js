'use strict';

module.exports = function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
      'Access-Control-Max-Age': 86400
    });
    return res.send(204);
  }
  next();
};
