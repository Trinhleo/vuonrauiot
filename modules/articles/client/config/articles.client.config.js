(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Bài viết nông nghiệp',
      state: 'articles',
      type: 'dropdown',
      position:1,
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Danh sách bài viết',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Tạo bài viết',
      state: 'articles.create',
      roles: ['user','admin']
    });
  }
})();
