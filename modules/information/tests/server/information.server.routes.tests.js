'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Information = mongoose.model('Information'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, information;

/**
 * Information routes tests
 */
describe('Information CRUD tests', function () {

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

    // Save a user to the test db and create new Information
    user.save(function () {
      information = {
        name: 'Information name'
      };

      done();
    });
  });

  it('should be able to save a Information if logged in', function (done) {
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

        // Save a new Information
        agent.post('/api/information')
          .send(information)
          .expect(200)
          .end(function (informationSaveErr, informationSaveRes) {
            // Handle Information save error
            if (informationSaveErr) {
              return done(informationSaveErr);
            }

            // Get a list of Information
            agent.get('/api/information')
              .end(function (informationsGetErr, informationsGetRes) {
                // Handle Information save error
                if (informationsGetErr) {
                  return done(informationsGetErr);
                }

                // Get Information list
                var information = informationGetRes.body;

                // Set assertions
                (information[0].user._id).should.equal(userId);
                (information[0].name).should.match('Information name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Information if not logged in', function (done) {
    agent.post('/api/information')
      .send(information)
      .expect(403)
      .end(function (informationSaveErr, informationSaveRes) {
        // Call the assertion callback
        done(informationSaveErr);
      });
  });

  it('should not be able to save an Information if no name is provided', function (done) {
    // Invalidate name field
    information.name = '';

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

        // Save a new Information
        agent.post('/api/information')
          .send(information)
          .expect(400)
          .end(function (informationSaveErr, informationSaveRes) {
            // Set message assertion
            (informationSaveRes.body.message).should.match('Please fill Information name');

            // Handle Information save error
            done(informationSaveErr);
          });
      });
  });

  it('should be able to update an Information if signed in', function (done) {
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

        // Save a new Information
        agent.post('/api/information')
          .send(information)
          .expect(200)
          .end(function (informationSaveErr, informationSaveRes) {
            // Handle Information save error
            if (informationSaveErr) {
              return done(informationSaveErr);
            }

            // Update Information name
            information.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Information
            agent.put('/api/information/' + informationSaveRes.body._id)
              .send(information)
              .expect(200)
              .end(function (informationUpdateErr, informationUpdateRes) {
                // Handle Information update error
                if (informationUpdateErr) {
                  return done(informationUpdateErr);
                }

                // Set assertions
                (informationUpdateRes.body._id).should.equal(informationSaveRes.body._id);
                (informationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Information if not signed in', function (done) {
    // Create new Information model instance
    var informationObj = new Information(information);

    // Save the information
    informationObj.save(function () {
      // Request Information
      request(app).get('/api/information')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Information if not signed in', function (done) {
    // Create new Information model instance
    var informationObj = new Information(information);

    // Save the Information
    informationObj.save(function () {
      request(app).get('/api/information/' + informationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', information.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Information with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/information/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Information is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Information which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Information
    request(app).get('/api/information/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Information with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Information if signed in', function (done) {
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

        // Save a new Information
        agent.post('/api/information')
          .send(information)
          .expect(200)
          .end(function (informationSaveErr, informationSaveRes) {
            // Handle Information save error
            if (informationSaveErr) {
              return done(informationSaveErr);
            }

            // Delete an existing Information
            agent.delete('/api/information/' + informationSaveRes.body._id)
              .send(information)
              .expect(200)
              .end(function (informationDeleteErr, informationDeleteRes) {
                // Handle information error error
                if (informationDeleteErr) {
                  return done(informationDeleteErr);
                }

                // Set assertions
                (informationDeleteRes.body._id).should.equal(informationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Information if not signed in', function (done) {
    // Set Information user
    information.user = user;

    // Create new Information model instance
    var informationObj = new Information(information);

    // Save the Information
    informationObj.save(function () {
      // Try deleting Information
      request(app).delete('/api/information/' + informationObj._id)
        .expect(403)
        .end(function (informationDeleteErr, informationDeleteRes) {
          // Set message assertion
          (informationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Information error error
          done(informationDeleteErr);
        });

    });
  });

  it('should be able to get a single Information that has an orphaned user reference', function (done) {
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

          // Save a new Information
          agent.post('/api/information')
            .send(information)
            .expect(200)
            .end(function (informationSaveErr, informationSaveRes) {
              // Handle Information save error
              if (informationSaveErr) {
                return done(informationSaveErr);
              }

              // Set assertions on new Information
              (informationSaveRes.body.name).should.equal(information.name);
              should.exist(informationSaveRes.body.user);
              should.equal(informationSaveRes.body.user._id, orphanId);

              // force the Information to have an orphaned user reference
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

                    // Get the Information
                    agent.get('/api/information/' + informationSaveRes.body._id)
                      .expect(200)
                      .end(function (informationInfoErr, informationInfoRes) {
                        // Handle Information error
                        if (informationInfoErr) {
                          return done(informationInfoErr);
                        }

                        // Set assertions
                        (informationInfoRes.body._id).should.equal(informationSaveRes.body._id);
                        (informationInfoRes.body.name).should.equal(information.name);
                        should.equal(informationInfoRes.body.user, undefined);

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
      Information.remove().exec(done);
    });
  });
});
