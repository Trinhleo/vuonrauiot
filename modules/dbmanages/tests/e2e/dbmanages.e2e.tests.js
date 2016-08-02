'use strict';

describe('Dbmanages E2E Tests:', function () {
  describe('Test Dbmanages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/dbmanages');
      expect(element.all(by.repeater('dbmanage in dbmanages')).count()).toEqual(0);
    });
  });
});
