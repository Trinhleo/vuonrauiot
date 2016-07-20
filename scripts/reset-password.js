'use strict';

var nodemailer = require('nodemailer'),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  config = require('../config/config'),
  mg = require('../config/lib/mongoose');

var transporter = nodemailer.createTransport(config.mailer.options);
var link = 'reset link here'; // PUT reset link here
var email = {
  from: config.mailer.from,
  subject: 'Security update'
};
var text = [
  'Chào {{name}},',
  '\n',
  'Chúng tối đã thay đổi cơ chế cấp mật khẩu để đảm bảo tính an toàn, vui lòng truy cập đường link bên dưới để tạo lại mật khẩu.',
  link,
  '\n',
  'Cám ơn,',
  'The Team'
].join('\n');

mg.loadModels();

mg.connect(function (db) {
  var User = mongoose.model('User');

  User.find().exec(function (err, users) {
    if (err) {
      throw err;
    }

    var processedCount = 0,
      errorCount = 0;

    // report and exit if no users were found
    if (users.length === 0) {
      return reportAndExit(processedCount, errorCount);
    }

    for (var i = 0; i < users.length; i++) {
      sendEmail(users[i]);
    }

    function sendEmail(user) {
      email.to = user.email;
      email.text = email.html = text.replace('{{name}}', user.displayName);

      transporter.sendMail(email, emailCallback(user));
    }

    function emailCallback(user) {
      return function (err, info) {
        processedCount++;

        if (err) {
          errorCount++;

          if (config.mailer.options.debug) {
            console.log('Error: ', err);
          }
          console.error('[' + processedCount + '/' + users.length + '] ' + chalk.red('Could not send email for ' + user.displayName));
        } else {
          console.log('[' + processedCount + '/' + users.length + '] Sent reset password email for ' + user.displayName);
        }

        if (processedCount === users.length) {
          return reportAndExit(processedCount, errorCount);
        }
      };
    }

    // report the processing results and exit
    function reportAndExit(processedCount, errorCount) {
      var successCount = processedCount - errorCount;

      console.log();

      if (processedCount === 0) {
        console.log(chalk.yellow('Không tìm thấy người dùng'));
      } else {
        var alert = (!errorCount) ? chalk.green : ((successCount / processedCount) < 0.8) ? chalk.red : chalk.yellow;

        console.log(alert('Sent ' + successCount + ' of ' + processedCount + ' emails successfully.'));
      }

      process.exit(0);
    }
  });
});
