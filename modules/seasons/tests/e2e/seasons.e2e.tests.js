'use strict';

describe('Seasons E2E Tests:', function () {
  describe('Test Seasons page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/seasons');
      expect(element.all(by.repeater('season in seasons')).count()).toEqual(0);
    });
  });
});
