'use strict';

var _ = require('lodash');
  var obj = [{
    "name": "Windask",
    "ID": "20767337",
    "lowercase": "windask",
    "wards": 62,
    "sightWardsBought": 0,
    "show": true,
    "_id": "5439c42aed82d02505a6e883",
    "__v": 0
    }]

// Get list of things
exports.index = function(req, res) {
    return res.json(200, obj);
};

function handleError(res, err) {
  return res.send(500, err);
}