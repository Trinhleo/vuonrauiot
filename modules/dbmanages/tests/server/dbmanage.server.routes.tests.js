'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dbmanage = mongoose.model('Dbmanage'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, dbmanage;

/**
 * Dbmanage routes tests
 */
describe('Dbmanage CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Dbmanage
    user.save(function () {
      dbmanage = {
        name: 'Dbmanage name'
      };

      done();
    });
  });

  it('should be able to save a Dbmanage if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Dbmanage
        agent.post('/api/dbmanages')
          .send(dbmanage)
          .expect(200)
          .end(function (dbmanageSaveErr, dbmanageSaveRes) {
            // Handle Dbmanage save error
            if (dbmanageSaveErr) {
              return done(dbmanageSaveErr);
            }

            // Get a list of Dbmanages
            agent.get('/api/dbmanages')
              .end(function (dbmanagesGetErr, dbmanagesGetRes) {
                // Handle Dbmanage save error
                if (dbmanagesGetErr) {
                  return done(dbmanagesGetErr);
                }

                // Get Dbmanages list
                var dbmanages = dbmanagesGetRes.body;

                // Set assertions
                (dbmanages[0].user._id).should.equal(userId);
                (dbmanages[0].name).should.match('Dbmanage name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Dbmanage if not logged in', function (done) {
    agent.post('/api/dbmanages')
      .send(dbmanage)
      .expect(403)
      .end(function (dbmanageSaveErr, dbmanageSaveRes) {
        // Call the assertion callback
        done(dbmanageSaveErr);
      });
  });

  it('should not be able to save an Dbmanage if no name is provided', function (done) {
    // Invalidate name field
    dbmanage.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Dbmanage
        agent.post('/api/dbmanages')
          .send(dbmanage)
          .expect(400)
          .end(function (dbmanageSaveErr, dbmanageSaveRes) {
            // Set message assertion
            (dbmanageSaveRes.body.message).should.match('Please fill Dbmanage name');

            // Handle Dbmanage save error
            done(dbmanageSaveErr);
          });
      });
  });

  it('should be able to update an Dbmanage if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Dbmanage
        agent.post('/api/dbmanages')
          .send(dbmanage)
          .expect(200)
          .end(function (dbmanageSaveErr, dbmanageSaveRes) {
            // Handle Dbmanage save error
            if (dbmanageSaveErr) {
              return done(dbmanageSaveErr);
            }

            // Update Dbmanage name
            dbmanage.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Dbmanage
            agent.put('/api/dbmanages/' + dbmanageSaveRes.body._id)
              .send(dbmanage)
              .expect(200)
              .end(function (dbmanageUpdateErr, dbmanageUpdateRes) {
                // Handle Dbmanage update error
                if (dbmanageUpdateErr) {
                  return done(dbmanageUpdateErr);
                }

                // Set assertions
                (dbmanageUpdateRes.body._id).should.equal(dbmanageSaveRes.body._id);
                (dbmanageUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Dbmanages if not signed in', function (done) {
    // Create new Dbmanage model instance
    var dbmanageObj = new Dbmanage(dbmanage);

    // Save the dbmanage
    dbmanageObj.save(function () {
      // Request Dbmanages
      request(app).get('/api/dbmanages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Dbmanage if not signed in', function (done) {
    // Create new Dbmanage model instance
    var dbmanageObj = new Dbmanage(dbmanage);

    // Save the Dbmanage
    dbmanageObj.save(function () {
      request(app).get('/api/dbmanages/' + dbmanageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', dbmanage.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Dbmanage with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/dbmanages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Dbmanage is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Dbmanage which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Dbmanage
    request(app).get('/api/dbmanages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Dbmanage with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Dbmanage if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Dbmanage
        agent.post('/api/dbmanages')
          .send(dbmanage)
          .expect(200)
          .end(function (dbmanageSaveErr, dbmanageSaveRes) {
            // Handle Dbmanage save error
            if (dbmanageSaveErr) {
              return done(dbmanageSaveErr);
            }

            // Delete an existing Dbmanage
            agent.delete('/api/dbmanages/' + dbmanageSaveRes.body._id)
              .send(dbmanage)
              .expect(200)
              .end(function (dbmanageDeleteErr, dbmanageDeleteRes) {
                // Handle dbmanage error error
                if (dbmanageDeleteErr) {
                  return done(dbmanageDeleteErr);
                }

                // Set assertions
                (dbmanageDeleteRes.body._id).should.equal(dbmanageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Dbmanage if not signed in', function (done) {
    // Set Dbmanage user
    dbmanage.user = user;

    // Create new Dbmanage model instance
    var dbmanageObj = new Dbmanage(dbmanage);

    // Save the Dbmanage
    dbmanageObj.save(function () {
      // Try deleting Dbmanage
      request(app).delete('/api/dbmanages/' + dbmanageObj._id)
        .expect(403)
        .end(function (dbmanageDeleteErr, dbmanageDeleteRes) {
          // Set message assertion
          (dbmanageDeleteRes.body.message).should.match('User is not authorized');

          // Handle Dbmanage error error
          done(dbmanageDeleteErr);
        });

    });
  });

  it('should be able to get a single Dbmanage that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Dbmanage
          agent.post('/api/dbmanages')
            .send(dbmanage)
            .expect(200)
            .end(function (dbmanageSaveErr, dbmanageSaveRes) {
              // Handle Dbmanage save error
              if (dbmanageSaveErr) {
                return done(dbmanageSaveErr);
              }

              // Set assertions on new Dbmanage
              (dbmanageSaveRes.body.name).should.equal(dbmanage.name);
              should.exist(dbmanageSaveRes.body.user);
              should.equal(dbmanageSaveRes.body.user._id, orphanId);

              // force the Dbmanage to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Dbmanage
                    agent.get('/api/dbmanages/' + dbmanageSaveRes.body._id)
                      .expect(200)
                      .end(function (dbmanageInfoErr, dbmanageInfoRes) {
                        // Handle Dbmanage error
                        if (dbmanageInfoErr) {
                          return done(dbmanageInfoErr);
                        }

                        // Set assertions
                        (dbmanageInfoRes.body._id).should.equal(dbmanageSaveRes.body._id);
                        (dbmanageInfoRes.body.name).should.equal(dbmanage.name);
                        should.equal(dbmanageInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Dbmanage.remove().exec(done);
    });
  });
});
