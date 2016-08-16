'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Vegetablecat = mongoose.model('Vegetablecat'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, vegetablecat;

/**
 * Vegetablecat routes tests
 */
describe('Vegetablecat CRUD tests', function () {

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

    // Save a user to the test db and create new Vegetablecat
    user.save(function () {
      vegetablecat = {
        name: 'Vegetablecat name'
      };

      done();
    });
  });

  it('should be able to save a Vegetablecat if logged in', function (done) {
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

        // Save a new Vegetablecat
        agent.post('/api/vegetablecats')
          .send(vegetablecat)
          .expect(200)
          .end(function (vegetablecatSaveErr, vegetablecatSaveRes) {
            // Handle Vegetablecat save error
            if (vegetablecatSaveErr) {
              return done(vegetablecatSaveErr);
            }

            // Get a list of Vegetablecats
            agent.get('/api/vegetablecats')
              .end(function (vegetablecatsGetErr, vegetablecatsGetRes) {
                // Handle Vegetablecat save error
                if (vegetablecatsGetErr) {
                  return done(vegetablecatsGetErr);
                }

                // Get Vegetablecats list
                var vegetablecats = vegetablecatsGetRes.body;

                // Set assertions
                (vegetablecats[0].user._id).should.equal(userId);
                (vegetablecats[0].name).should.match('Vegetablecat name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Vegetablecat if not logged in', function (done) {
    agent.post('/api/vegetablecats')
      .send(vegetablecat)
      .expect(403)
      .end(function (vegetablecatSaveErr, vegetablecatSaveRes) {
        // Call the assertion callback
        done(vegetablecatSaveErr);
      });
  });

  it('should not be able to save an Vegetablecat if no name is provided', function (done) {
    // Invalidate name field
    vegetablecat.name = '';

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

        // Save a new Vegetablecat
        agent.post('/api/vegetablecats')
          .send(vegetablecat)
          .expect(400)
          .end(function (vegetablecatSaveErr, vegetablecatSaveRes) {
            // Set message assertion
            (vegetablecatSaveRes.body.message).should.match('Please fill Vegetablecat name');

            // Handle Vegetablecat save error
            done(vegetablecatSaveErr);
          });
      });
  });

  it('should be able to update an Vegetablecat if signed in', function (done) {
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

        // Save a new Vegetablecat
        agent.post('/api/vegetablecats')
          .send(vegetablecat)
          .expect(200)
          .end(function (vegetablecatSaveErr, vegetablecatSaveRes) {
            // Handle Vegetablecat save error
            if (vegetablecatSaveErr) {
              return done(vegetablecatSaveErr);
            }

            // Update Vegetablecat name
            vegetablecat.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Vegetablecat
            agent.put('/api/vegetablecats/' + vegetablecatSaveRes.body._id)
              .send(vegetablecat)
              .expect(200)
              .end(function (vegetablecatUpdateErr, vegetablecatUpdateRes) {
                // Handle Vegetablecat update error
                if (vegetablecatUpdateErr) {
                  return done(vegetablecatUpdateErr);
                }

                // Set assertions
                (vegetablecatUpdateRes.body._id).should.equal(vegetablecatSaveRes.body._id);
                (vegetablecatUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Vegetablecats if not signed in', function (done) {
    // Create new Vegetablecat model instance
    var vegetablecatObj = new Vegetablecat(vegetablecat);

    // Save the vegetablecat
    vegetablecatObj.save(function () {
      // Request Vegetablecats
      request(app).get('/api/vegetablecats')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Vegetablecat if not signed in', function (done) {
    // Create new Vegetablecat model instance
    var vegetablecatObj = new Vegetablecat(vegetablecat);

    // Save the Vegetablecat
    vegetablecatObj.save(function () {
      request(app).get('/api/vegetablecats/' + vegetablecatObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', vegetablecat.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Vegetablecat with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/vegetablecats/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Vegetablecat is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Vegetablecat which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Vegetablecat
    request(app).get('/api/vegetablecats/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Vegetablecat with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Vegetablecat if signed in', function (done) {
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

        // Save a new Vegetablecat
        agent.post('/api/vegetablecats')
          .send(vegetablecat)
          .expect(200)
          .end(function (vegetablecatSaveErr, vegetablecatSaveRes) {
            // Handle Vegetablecat save error
            if (vegetablecatSaveErr) {
              return done(vegetablecatSaveErr);
            }

            // Delete an existing Vegetablecat
            agent.delete('/api/vegetablecats/' + vegetablecatSaveRes.body._id)
              .send(vegetablecat)
              .expect(200)
              .end(function (vegetablecatDeleteErr, vegetablecatDeleteRes) {
                // Handle vegetablecat error error
                if (vegetablecatDeleteErr) {
                  return done(vegetablecatDeleteErr);
                }

                // Set assertions
                (vegetablecatDeleteRes.body._id).should.equal(vegetablecatSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Vegetablecat if not signed in', function (done) {
    // Set Vegetablecat user
    vegetablecat.user = user;

    // Create new Vegetablecat model instance
    var vegetablecatObj = new Vegetablecat(vegetablecat);

    // Save the Vegetablecat
    vegetablecatObj.save(function () {
      // Try deleting Vegetablecat
      request(app).delete('/api/vegetablecats/' + vegetablecatObj._id)
        .expect(403)
        .end(function (vegetablecatDeleteErr, vegetablecatDeleteRes) {
          // Set message assertion
          (vegetablecatDeleteRes.body.message).should.match('User is not authorized');

          // Handle Vegetablecat error error
          done(vegetablecatDeleteErr);
        });

    });
  });

  it('should be able to get a single Vegetablecat that has an orphaned user reference', function (done) {
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

          // Save a new Vegetablecat
          agent.post('/api/vegetablecats')
            .send(vegetablecat)
            .expect(200)
            .end(function (vegetablecatSaveErr, vegetablecatSaveRes) {
              // Handle Vegetablecat save error
              if (vegetablecatSaveErr) {
                return done(vegetablecatSaveErr);
              }

              // Set assertions on new Vegetablecat
              (vegetablecatSaveRes.body.name).should.equal(vegetablecat.name);
              should.exist(vegetablecatSaveRes.body.user);
              should.equal(vegetablecatSaveRes.body.user._id, orphanId);

              // force the Vegetablecat to have an orphaned user reference
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

                    // Get the Vegetablecat
                    agent.get('/api/vegetablecats/' + vegetablecatSaveRes.body._id)
                      .expect(200)
                      .end(function (vegetablecatInfoErr, vegetablecatInfoRes) {
                        // Handle Vegetablecat error
                        if (vegetablecatInfoErr) {
                          return done(vegetablecatInfoErr);
                        }

                        // Set assertions
                        (vegetablecatInfoRes.body._id).should.equal(vegetablecatSaveRes.body._id);
                        (vegetablecatInfoRes.body.name).should.equal(vegetablecat.name);
                        should.equal(vegetablecatInfoRes.body.user, undefined);

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
      Vegetablecat.remove().exec(done);
    });
  });
});
