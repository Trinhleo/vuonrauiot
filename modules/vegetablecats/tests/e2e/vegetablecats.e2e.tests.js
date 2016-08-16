'use strict';

describe('Vegetablecats E2E Tests:', function () {
  describe('Test Vegetablecats page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/vegetablecats');
      expect(element.all(by.repeater('vegetablecat in vegetablecats')).count()).toEqual(0);
    });
  });
});
