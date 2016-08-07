(function () {
  'use strict';

  angular
    .module('information')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Sản phẩm',
      state: 'information',
      type: 'dropdown',
      roles: ['*'],
      position:0
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'information', {
      title: 'Danh sách sản phẩm',
      state: 'information.list'
    });
    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'information', {
    //   title: 'Create Information',
    //   state: 'information.create',
    //   roles: ['user']
    // });
  }
})();
