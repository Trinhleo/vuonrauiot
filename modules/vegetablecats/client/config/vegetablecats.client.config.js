(function () {
  'use strict';

  angular
    .module('vegetablecats')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'Vegetablecats',
    //   state: 'vegetablecats',
    //   type: 'dropdown',
    //   roles: ['*']
    // });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Danh sách đối tượng',
      state: 'vegetablecats.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Tạo đối tượng mới',
      state: 'vegetablecats.create',
      roles: ['admin']
    });
  }
})();
