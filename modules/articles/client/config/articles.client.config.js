'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Blog chia sẻ',
      state: 'articles',
      type: 'dropdown',
      roles: ['*'],
      position:1
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Liệt kê bài viết',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Viết bài',
      state: 'articles.create',
      roles: ['user','admin']
    });
  }
]);
