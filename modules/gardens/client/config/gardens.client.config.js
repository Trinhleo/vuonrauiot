(function () {
  'use strict';

  angular
    .module('gardens')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Add the dropdown list item
    Menus.addMenuItem('topbar', {
      title: 'Quản lý sản xuất',
      state: 'gardens',
      type: 'dropdown',
      roles:  ['user','admin'],
      position:1
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'Danh sách vườn',
      state: 'gardens.list',
      roles: ['user','admin']
    });
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'Đăng ký vườn',
      state: 'gardens.create',
      roles: ['user','admin']
    });
  }
})();
