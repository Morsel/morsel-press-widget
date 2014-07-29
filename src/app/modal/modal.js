//from https://github.com/angular-ui/bootstrap
angular.module('Morsel.pressWidget.modal', [])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
.factory('$$stackedMap', function () {
  return {
    createNew: function () {
      var stack = [];

      return {
        add: function (key, value) {
          stack.push({
            key: key,
            value: value
          });
        },
        get: function (key) {
          for (var i = 0; i < stack.length; i++) {
            if (key == stack[i].key) {
              return stack[i];
            }
          }
        },
        keys: function() {
          var keys = [];
          for (var i = 0; i < stack.length; i++) {
            keys.push(stack[i].key);
          }
          return keys;
        },
        top: function () {
          return stack[stack.length - 1];
        },
        remove: function (key) {
          var idx = -1;
          for (var i = 0; i < stack.length; i++) {
            if (key == stack[i].key) {
              idx = i;
              break;
            }
          }
          return stack.splice(idx, 1)[0];
        },
        removeTop: function () {
          return stack.splice(stack.length - 1, 1)[0];
        },
        length: function () {
          return stack.length;
        }
      };
    }
  };
})

/**
* A helper directive for the $modal service. It creates a backdrop element.
*/
.directive('modalBackdrop', ['$timeout', function ($timeout) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'modal/modalBackdrop.tpl.html',
    link: function (scope) {

      scope.animate = false;

      //trigger CSS transitions
      $timeout(function () {
        scope.animate = true;
      });
    }
  };
}])

.directive('modalWindow', ['$modalStack', '$timeout', 'EXPANDED_MODAL_HEIGHT', function ($modalStack, $timeout, EXPANDED_MODAL_HEIGHT) {
  return {
    restrict: 'EA',
    scope: {
      index: '@'
    },
    replace: true,
    transclude: true,
    templateUrl: function(tElement, tAttrs) {
      return tAttrs.templateUrl || 'modal/modalWindow.tpl.html';
    },
    link: function (scope, element, attrs) {
      var $clickedItem,
          $grid = $('#mrsl-grid-container'),
          gridHeight = $grid.height(),
          modalPosition = {};

      scope.animate = false;

      element.addClass(attrs.windowClass || '');

      //was there a clicked item or did this come from an event
      if(scope.$parent.clickedItem) {
        $clickedItem = $(scope.$parent.clickedItem);
        //this gets left and top
        modalPosition = $clickedItem.position();
        //get w and h
        modalPosition.width = $clickedItem.width();
        modalPosition.height = $clickedItem.height();

        //if it's too close to the bottom to fit
        if(modalPosition.top >= gridHeight - EXPANDED_MODAL_HEIGHT) {
          //align it at the bottom
          modalPosition.top = gridHeight - EXPANDED_MODAL_HEIGHT;
        }

        //set initial values
        scope.modalPosition = {
          top: modalPosition.top + 'px',
          left: modalPosition.left + 'px',
          width: modalPosition.width + 'px',
          height: modalPosition.height + 'px'
        };

        $timeout(function () {
          // trigger CSS transitions
          scope.animate = true;
          scope.modalPosition = {
            top: modalPosition.top + 'px',
            left: 0,
            width: '100%',
            height: EXPANDED_MODAL_HEIGHT + 'px'
          };
          // focus a freshly-opened modal
          element[0].focus();
        });
      } else {
        //we came from an event, so don't animate the expansion
        scope.modalPosition = {
          top: 0,
          left: 0,
          width: '100%',
          height: EXPANDED_MODAL_HEIGHT + 'px'
        };

        // trigger CSS transitions (spoiler alert: there are none, but we need the animation class so the loader shows)
        scope.animate = true;

        // focus a freshly-opened modal
        element[0].focus();
      }

      scope.close = function (evt) {
        var modal = $modalStack.getTop();
        if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
          evt.preventDefault();
          evt.stopPropagation();
          $modalStack.dismiss(modal.key, 'backdrop click');
        }
      };
    }
  };
}])

.factory('$modalStack', ['$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
  function ($timeout, $document, $compile, $rootScope, $$stackedMap) {

    var OPENED_MODAL_CLASS = 'modal-open';

    var backdropDomEl, backdropScope;
    var openedWindows = $$stackedMap.createNew();
    var $modalStack = {};

    function backdropIndex() {
      var topBackdropIndex = -1;
      var opened = openedWindows.keys();
      for (var i = 0; i < opened.length; i++) {
        if (openedWindows.get(opened[i]).value.backdrop) {
          topBackdropIndex = i;
        }
      }
      return topBackdropIndex;
    }

    $rootScope.$watch(backdropIndex, function(newBackdropIndex){
      if (backdropScope) {
        backdropScope.index = newBackdropIndex;
      }
    });

    function removeModalWindow(modalInstance) {

      var body = $document.find('modalBackdrop').eq(0);
      var modalWindow = openedWindows.get(modalInstance).value;

      //clean up the stack
      openedWindows.remove(modalInstance);

      //remove window DOM element
      removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
        modalWindow.modalScope.$destroy();
        body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
        checkRemoveBackdrop();
      });
    }

    function checkRemoveBackdrop() {
        //remove backdrop if no longer needed
        if (backdropDomEl && backdropIndex() == -1) {
          var backdropScopeRef = backdropScope;
          removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
            backdropScopeRef.$destroy();
            backdropScopeRef = null;
          });
          backdropDomEl = undefined;
          backdropScope = undefined;
        }
    }

    function removeAfterAnimate(domEl, scope, emulateTime, done) {
      // Ensure this call is async
      $timeout(afterAnimating, 0);

      function afterAnimating() {
        if (afterAnimating.done) {
          return;
        }
        afterAnimating.done = true;

        domEl.remove();
        if (done) {
          done();
        }
      }
    }

    $document.bind('keydown', function (evt) {
      var modal;

      if (evt.which === 27) {
        modal = openedWindows.top();
        if (modal && modal.value.keyboard) {
          evt.preventDefault();
          $rootScope.$apply(function () {
            $modalStack.dismiss(modal.key, 'escape key press');
          });
        }
      }
    });

    $modalStack.open = function (modalInstance, modal) {

      openedWindows.add(modalInstance, {
        deferred: modal.deferred,
        modalScope: modal.scope,
        backdrop: modal.backdrop,
        keyboard: modal.keyboard
      });

      var body = $document.find('modalBackdrop').eq(0),
          currBackdropIndex = backdropIndex();

      if (currBackdropIndex >= 0 && !backdropDomEl) {
        backdropScope = $rootScope.$new(true);
        backdropScope.index = currBackdropIndex;
        backdropDomEl = $compile('<div modal-backdrop></div>')(backdropScope);
        body.append(backdropDomEl);
      }

      var angularDomEl = angular.element('<div modal-window></div>');
      angularDomEl.attr({
        'template-url': modal.windowTemplateUrl,
        'window-class': modal.windowClass,
        'index': openedWindows.length() - 1
      }).html(modal.content);

      var modalDomEl = $compile(angularDomEl)(modal.scope);
      openedWindows.top().value.modalDomEl = modalDomEl;
      body.append(modalDomEl);
      body.addClass(OPENED_MODAL_CLASS);
    };

    $modalStack.close = function (modalInstance, result) {
      var modalWindow = openedWindows.get(modalInstance).value;
      if (modalWindow) {
        modalWindow.deferred.resolve(result);
        removeModalWindow(modalInstance);
      }
    };

    $modalStack.dismiss = function (modalInstance, reason) {
      var modalWindow = openedWindows.get(modalInstance).value;
      if (modalWindow) {
        modalWindow.deferred.reject(reason);
        removeModalWindow(modalInstance);
      }
    };

    $modalStack.dismissAll = function (reason) {
      var topModal = this.getTop();
      while (topModal) {
        this.dismiss(topModal.key, reason);
        topModal = this.getTop();
      }
    };

    $modalStack.getTop = function () {
      return openedWindows.top();
    };

    return $modalStack;
  }])

.provider('$modal', function () {

  var $modalProvider = {
    options: {
      backdrop: true, //can be also false or 'static'
      keyboard: true
    },
    $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
      function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

        var $modal = {};

        function getTemplatePromise(options) {
          return options.template ? $q.when(options.template) :
            $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
              return result.data;
            });
        }

        function getResolvePromises(resolves) {
          var promisesArr = [];
          angular.forEach(resolves, function (value, key) {
            if (angular.isFunction(value) || angular.isArray(value)) {
              promisesArr.push($q.when($injector.invoke(value)));
            }
          });
          return promisesArr;
        }

        $modal.open = function (modalOptions) {

          var modalResultDeferred = $q.defer();
          var modalOpenedDeferred = $q.defer();

          //prepare an instance of a modal to be injected into controllers and returned to a caller
          var modalInstance = {
            result: modalResultDeferred.promise,
            opened: modalOpenedDeferred.promise,
            close: function (result) {
              $modalStack.close(modalInstance, result);
            },
            dismiss: function (reason) {
              $modalStack.dismiss(modalInstance, reason);
            }
          };

          //merge and clean up options
          modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
          modalOptions.resolve = modalOptions.resolve || {};

          //verify options
          if (!modalOptions.template && !modalOptions.templateUrl) {
            throw new Error('One of template or templateUrl options is required.');
          }

          var templateAndResolvePromise =
            $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


          templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

            var modalScope = (modalOptions.scope || $rootScope).$new();
            modalScope.$close = modalInstance.close;
            modalScope.$dismiss = modalInstance.dismiss;

            var ctrlInstance, ctrlLocals = {};
            var resolveIter = 1;

            //controllers
            if (modalOptions.controller) {
              ctrlLocals.$scope = modalScope;
              ctrlLocals.$modalInstance = modalInstance;
              angular.forEach(modalOptions.resolve, function (value, key) {
                ctrlLocals[key] = tplAndVars[resolveIter++];
              });

              ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
            }

            $modalStack.open(modalInstance, {
              scope: modalScope,
              deferred: modalResultDeferred,
              content: tplAndVars[0],
              backdrop: modalOptions.backdrop,
              keyboard: modalOptions.keyboard,
              windowClass: modalOptions.windowClass,
              windowTemplateUrl: modalOptions.windowTemplateUrl
            });

          }, function resolveError(reason) {
            modalResultDeferred.reject(reason);
          });

          templateAndResolvePromise.then(function () {
            modalOpenedDeferred.resolve(true);
          }, function () {
            modalOpenedDeferred.reject(false);
          });

          return modalInstance;
        };

        return $modal;
      }]
  };

  return $modalProvider;
});