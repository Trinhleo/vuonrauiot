'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Season = mongoose.model('Season'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, season;

/**
 * Season routes tests
 */
describe('Season CRUD tests', function () {

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

    // Save a user to the test db and create new Season
    user.save(function () {
      season = {
        name: 'Season name'
      };

      done();
    });
  });

  it('should be able to save a Season if logged in', function (done) {
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

        // Save a new Season
        agent.post('/api/seasons')
          .send(season)
          .expect(200)
          .end(function (seasonSaveErr, seasonSaveRes) {
            // Handle Season save error
            if (seasonSaveErr) {
              return done(seasonSaveErr);
            }

            // Get a list of Seasons
            agent.get('/api/seasons')
              .end(function (seasonsGetErr, seasonsGetRes) {
                // Handle Season save error
                if (seasonsGetErr) {
                  return done(seasonsGetErr);
                }

                // Get Seasons list
                var seasons = seasonsGetRes.body;

                // Set assertions
                (seasons[0].user._id).should.equal(userId);
                (seasons[0].name).should.match('Season name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Season if not logged in', function (done) {
    agent.post('/api/seasons')
      .send(season)
      .expect(403)
      .end(function (seasonSaveErr, seasonSaveRes) {
        // Call the assertion callback
        done(seasonSaveErr);
      });
  });

  it('should not be able to save an Season if no name is provided', function (done) {
    // Invalidate name field
    season.name = '';

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

        // Save a new Season
        agent.post('/api/seasons')
          .send(season)
          .expect(400)
          .end(function (seasonSaveErr, seasonSaveRes) {
            // Set message assertion
            (seasonSaveRes.body.message).should.match('Please fill Season name');

            // Handle Season save error
            done(seasonSaveErr);
          });
      });
  });

  it('should be able to update an Season if signed in', function (done) {
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

        // Save a new Season
        agent.post('/api/seasons')
          .send(season)
          .expect(200)
          .end(function (seasonSaveErr, seasonSaveRes) {
            // Handle Season save error
            if (seasonSaveErr) {
              return done(seasonSaveErr);
            }

            // Update Season name
            season.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Season
            agent.put('/api/seasons/' + seasonSaveRes.body._id)
              .send(season)
              .expect(200)
              .end(function (seasonUpdateErr, seasonUpdateRes) {
                // Handle Season update error
                if (seasonUpdateErr) {
                  return done(seasonUpdateErr);
                }

                // Set assertions
                (seasonUpdateRes.body._id).should.equal(seasonSaveRes.body._id);
                (seasonUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Seasons if not signed in', function (done) {
    // Create new Season model instance
    var seasonObj = new Season(season);

    // Save the season
    seasonObj.save(function () {
      // Request Seasons
      request(app).get('/api/seasons')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Season if not signed in', function (done) {
    // Create new Season model instance
    var seasonObj = new Season(season);

    // Save the Season
    seasonObj.save(function () {
      request(app).get('/api/seasons/' + seasonObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', season.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Season with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/seasons/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Season is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Season which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Season
    request(app).get('/api/seasons/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Season with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Season if signed in', function (done) {
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

        // Save a new Season
        agent.post('/api/seasons')
          .send(season)
          .expect(200)
          .end(function (seasonSaveErr, seasonSaveRes) {
            // Handle Season save error
            if (seasonSaveErr) {
              return done(seasonSaveErr);
            }

            // Delete an existing Season
            agent.delete('/api/seasons/' + seasonSaveRes.body._id)
              .send(season)
              .expect(200)
              .end(function (seasonDeleteErr, seasonDeleteRes) {
                // Handle season error error
                if (seasonDeleteErr) {
                  return done(seasonDeleteErr);
                }

                // Set assertions
                (seasonDeleteRes.body._id).should.equal(seasonSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Season if not signed in', function (done) {
    // Set Season user
    season.user = user;

    // Create new Season model instance
    var seasonObj = new Season(season);

    // Save the Season
    seasonObj.save(function () {
      // Try deleting Season
      request(app).delete('/api/seasons/' + seasonObj._id)
        .expect(403)
        .end(function (seasonDeleteErr, seasonDeleteRes) {
          // Set message assertion
          (seasonDeleteRes.body.message).should.match('User is not authorized');

          // Handle Season error error
          done(seasonDeleteErr);
        });

    });
  });

  it('should be able to get a single Season that has an orphaned user reference', function (done) {
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

          // Save a new Season
          agent.post('/api/seasons')
            .send(season)
            .expect(200)
            .end(function (seasonSaveErr, seasonSaveRes) {
              // Handle Season save error
              if (seasonSaveErr) {
                return done(seasonSaveErr);
              }

              // Set assertions on new Season
              (seasonSaveRes.body.name).should.equal(season.name);
              should.exist(seasonSaveRes.body.user);
              should.equal(seasonSaveRes.body.user._id, orphanId);

              // force the Season to have an orphaned user reference
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

                    // Get the Season
                    agent.get('/api/seasons/' + seasonSaveRes.body._id)
                      .expect(200)
                      .end(function (seasonInfoErr, seasonInfoRes) {
                        // Handle Season error
                        if (seasonInfoErr) {
                          return done(seasonInfoErr);
                        }

                        // Set assertions
                        (seasonInfoRes.body._id).should.equal(seasonSaveRes.body._id);
                        (seasonInfoRes.body.name).should.equal(season.name);
                        should.equal(seasonInfoRes.body.user, undefined);

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
      Season.remove().exec(done);
    });
  });
});
