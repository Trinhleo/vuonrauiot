'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Quản lý hệ thống',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin'],
      position: 4
    });
  }
]);
