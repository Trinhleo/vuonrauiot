'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Vui lòng nhập mật khẩu có đọ dài ít nhất 10 ký tự bao gồm số, in thường, in hoa, và ký tự đặc biệt special';
        return popoverMsg;
      }
    };
  }
]);
