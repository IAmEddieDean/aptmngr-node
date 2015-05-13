/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('POST /properties', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should create a new property', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'aedbc0000000000000000001'}, payload: {name: 'Oakmont Estates', address: '123 Main St.'}}, function(response){
      console.log(typeof response.result.__v);
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Oakmont Estates');
      expect(response.result.address).to.equal('123 Main St.');
      expect(response.result.createdAt).to.be.instanceof(Date);
      expect(response.result.__v).to.be.a('number');
      expect(response.result.managerId.toString()).to.have.length(24);
      expect(response.result.managerId.toString()).to.equal('aedbc0000000000000000001');
      done();
    });
  });
  it('should throw an error 400 for not passing Joi validation', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'aedbc0000000000000000001'}, payload: {name: 'Oakmont Estates', address: '1'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
