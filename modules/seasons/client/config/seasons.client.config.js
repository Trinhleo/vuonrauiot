(function () {
  'use strict';

  angular
    .module('seasons')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar','gardens' {
    //   title: 'Quản lý mùa vụ',
    //   state: 'seasons',
    //   type: 'dropdown',
    //   roles: ['admin'],
    // });
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'Quản lý mùa vụ',
      state: 'seasons.list'
    });

    // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'gardens', {
    //   title: 'Tạo mùa vụ',
    //   state: 'seasons.create',
    //   roles: ['admin']
    // });
  }
})();
