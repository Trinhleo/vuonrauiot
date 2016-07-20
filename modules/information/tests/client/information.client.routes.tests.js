(function () {
  'use strict';

  describe('Information Route Tests', function () {
    // Initialize global variables
    var $scope,
      InformationService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InformationService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InformationService = _InformationService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('information');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/information');
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
          InformationController,
          mockInformation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('information.view');
          $templateCache.put('modules/information/client/views/view-information.client.view.html', '');

          // create mock Information
          mockInformation = new InformationService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Information Name'
          });

          //Initialize Controller
          InformationController = $controller('InformationController as vm', {
            $scope: $scope,
            informationResolve: mockInformation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:informationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.informationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            informationId: 1
          })).toEqual('/information/1');
        }));

        it('should attach an Information to the controller scope', function () {
          expect($scope.vm.information._id).toBe(mockInformation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/information/client/views/view-information.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InformationController,
          mockInformation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('information.create');
          $templateCache.put('modules/information/client/views/form-information.client.view.html', '');

          // create mock Information
          mockInformation = new InformationService();

          //Initialize Controller
          InformationController = $controller('InformationController as vm', {
            $scope: $scope,
            informationResolve: mockInformation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.informationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/information/create');
        }));

        it('should attach an Information to the controller scope', function () {
          expect($scope.vm.information._id).toBe(mockInformation._id);
          expect($scope.vm.information._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/information/client/views/form-information.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InformationController,
          mockInformation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('information.edit');
          $templateCache.put('modules/information/client/views/form-information.client.view.html', '');

          // create mock Information
          mockInformation = new InformationService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Information Name'
          });

          //Initialize Controller
          InformationController = $controller('InformationController as vm', {
            $scope: $scope,
            informationResolve: mockInformation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:informationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.informationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            informationId: 1
          })).toEqual('/information/1/edit');
        }));

        it('should attach an Information to the controller scope', function () {
          expect($scope.vm.information._id).toBe(mockInformation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/information/client/views/form-information.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
