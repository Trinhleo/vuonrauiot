(function () {
  'use strict';

  angular
    .module('information')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Thông tin vườn rau',
      state: 'information',
      type: 'dropdown',
      roles: ['*'],
      position:0
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'information', {
      title: 'Liệt kê thông tin vườn rau',
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
