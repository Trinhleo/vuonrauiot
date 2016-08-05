(function () {
  'use strict';

  describe('Seasons Route Tests', function () {
    // Initialize global variables
    var $scope,
      SeasonsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SeasonsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SeasonsService = _SeasonsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('seasons');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/seasons');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SeasonsController,
          mockSeason;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('seasons.view');
          $templateCache.put('modules/seasons/client/views/view-season.client.view.html', '');

          // create mock Season
          mockSeason = new SeasonsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Season Name'
          });

          //Initialize Controller
          SeasonsController = $controller('SeasonsController as vm', {
            $scope: $scope,
            seasonResolve: mockSeason
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:seasonId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.seasonResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            seasonId: 1
          })).toEqual('/seasons/1');
        }));

        it('should attach an Season to the controller scope', function () {
          expect($scope.vm.season._id).toBe(mockSeason._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/seasons/client/views/view-season.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SeasonsController,
          mockSeason;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('seasons.create');
          $templateCache.put('modules/seasons/client/views/form-season.client.view.html', '');

          // create mock Season
          mockSeason = new SeasonsService();

          //Initialize Controller
          SeasonsController = $controller('SeasonsController as vm', {
            $scope: $scope,
            seasonResolve: mockSeason
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.seasonResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/seasons/create');
        }));

        it('should attach an Season to the controller scope', function () {
          expect($scope.vm.season._id).toBe(mockSeason._id);
          expect($scope.vm.season._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/seasons/client/views/form-season.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SeasonsController,
          mockSeason;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('seasons.edit');
          $templateCache.put('modules/seasons/client/views/form-season.client.view.html', '');

          // create mock Season
          mockSeason = new SeasonsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Season Name'
          });

          //Initialize Controller
          SeasonsController = $controller('SeasonsController as vm', {
            $scope: $scope,
            seasonResolve: mockSeason
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:seasonId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.seasonResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            seasonId: 1
          })).toEqual('/seasons/1/edit');
        }));

        it('should attach an Season to the controller scope', function () {
          expect($scope.vm.season._id).toBe(mockSeason._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/seasons/client/views/form-season.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
