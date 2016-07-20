'use strict';

describe('Information E2E Tests:', function () {
  describe('Test Information page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/information');
      expect(element.all(by.repeater('information in information')).count()).toEqual(0);
    });
  });
});
