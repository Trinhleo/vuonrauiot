(function () {
  'use strict';

  angular
    .module('gardens')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Quản lý vườn rau',
      state: 'gardens.list',
      roles: ['admin']
    });
  }
})();
