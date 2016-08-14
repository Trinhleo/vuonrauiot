(function () {
  'use strict';

  angular
    .module('dbmanages')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown manage item
    // Menus.addMenuItem('topbar',{
    //   title: 'Quản lý mùa vụ',
    //   type: 'dropdown',
    //   state: 'dbmanages',
    //   roles: ['admin'],
    //   position:3
    // });
    Menus.addSubMenuItem('topbar','admin',{
      title: 'Danh sách mùa vụ',
      state: 'dbmanages',
      roles: ['admin']
    });
    Menus.addSubMenuItem('topbar','admin',{
      title: 'Tạo mùa vụ',
      state: 'dbmanages.create',
      roles: ['admin']
    });
  }
})();
