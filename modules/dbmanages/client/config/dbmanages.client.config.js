(function () {
  'use strict';

  angular
    .module('dbmanages')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown manage item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Quản lý dữ liệu mùa vụ',
      state: 'dbmanages.list',
      roles: ['admin']
    });
  }
})();
