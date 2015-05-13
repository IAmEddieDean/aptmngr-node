/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var Server = require('../../../../lib/server');
var Property = require('../../../../lib/models/property');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;

var server;

describe('GET /properties/{propertyId}', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should return a property with the specified propertyId', function(done){
    server.inject({method: 'GET', url: '/properties/b00000000000000000000003', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Oakmont Estate');
      done();
    });
  });
  it('should return no property with the specified propertyId but wrong managerId', function(done){
    server.inject({method: 'GET', url: '/properties/b00000000000000000000003', credentials: {_id: 'a00000000000000000000002'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.equal(null);
      done();
    });
  });
  it('should return nothing with a wrong property Id', function(done){
    server.inject({method: 'GET', url: '/properties/b00000000000000000000013', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.be.null;
      done();
    });
  });
  it('should return status code 404 with a bad route', function(done){
    server.inject({method: 'GET', url: '/properties//b00000000000000000000001', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(404);
      done();
    });
  });
  it('should return status code 404 with a bad route', function(done){
    var stub = Sinon.stub(Property, 'findOne').yields(new Error());
    server.inject({method: 'GET', url: '/properties/b00000000000000000000001', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
