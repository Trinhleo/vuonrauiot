(function () {
  'use strict';

  describe('Dbmanages Route Tests', function () {
    // Initialize global variables
    var $scope,
      DbmanagesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DbmanagesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DbmanagesService = _DbmanagesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('dbmanages');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/dbmanages');
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
          DbmanagesController,
          mockDbmanage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('dbmanages.view');
          $templateCache.put('modules/dbmanages/client/views/view-dbmanage.client.view.html', '');

          // create mock Dbmanage
          mockDbmanage = new DbmanagesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Dbmanage Name'
          });

          //Initialize Controller
          DbmanagesController = $controller('DbmanagesController as vm', {
            $scope: $scope,
            dbmanageResolve: mockDbmanage
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:dbmanageId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.dbmanageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            dbmanageId: 1
          })).toEqual('/dbmanages/1');
        }));

        it('should attach an Dbmanage to the controller scope', function () {
          expect($scope.vm.dbmanage._id).toBe(mockDbmanage._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/dbmanages/client/views/view-dbmanage.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DbmanagesController,
          mockDbmanage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('dbmanages.create');
          $templateCache.put('modules/dbmanages/client/views/form-dbmanage.client.view.html', '');

          // create mock Dbmanage
          mockDbmanage = new DbmanagesService();

          //Initialize Controller
          DbmanagesController = $controller('DbmanagesController as vm', {
            $scope: $scope,
            dbmanageResolve: mockDbmanage
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.dbmanageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/dbmanages/create');
        }));

        it('should attach an Dbmanage to the controller scope', function () {
          expect($scope.vm.dbmanage._id).toBe(mockDbmanage._id);
          expect($scope.vm.dbmanage._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/dbmanages/client/views/form-dbmanage.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DbmanagesController,
          mockDbmanage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('dbmanages.edit');
          $templateCache.put('modules/dbmanages/client/views/form-dbmanage.client.view.html', '');

          // create mock Dbmanage
          mockDbmanage = new DbmanagesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Dbmanage Name'
          });

          //Initialize Controller
          DbmanagesController = $controller('DbmanagesController as vm', {
            $scope: $scope,
            dbmanageResolve: mockDbmanage
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:dbmanageId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.dbmanageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            dbmanageId: 1
          })).toEqual('/dbmanages/1/edit');
        }));

        it('should attach an Dbmanage to the controller scope', function () {
          expect($scope.vm.dbmanage._id).toBe(mockDbmanage._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/dbmanages/client/views/form-dbmanage.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
