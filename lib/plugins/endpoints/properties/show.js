'use strict';

var Property = require('../../../models/property');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/properties/{propId}',
    config: {
      validate: {
        params: {
          propId: Joi.string().regex(/^[a-f0-9]{24}$/).required()
        }
      },
      description: 'Get a property',
      handler: function(request, reply){
        Property.findOne({_id: request.params.propId, managerId: request.auth.credentials._id}, function(err, property){
          return reply(property).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'properties.show'
};
