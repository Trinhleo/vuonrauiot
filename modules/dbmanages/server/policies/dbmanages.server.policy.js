'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Dbmanages Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/dbmanages',
      permissions: '*'
    }, {
      resources: '/api/dbmanages/:dbmanageId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/dbmanages',
      permissions: ['get']
    }, {
      resources: '/api/dbmanages/:dbmanageId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/dbmanages',
      permissions: ['get']
    }, {
      resources: '/api/dbmanages/:dbmanageId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Dbmanages Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Dbmanage is being processed and the current user created it then allow any manipulation
  if (req.dbmanage && req.user && req.dbmanage.user && req.dbmanage.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
