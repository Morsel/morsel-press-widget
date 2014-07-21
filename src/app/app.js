angular.module( 'Morsel.pressWidget', [
  'templates-app',
  'templates-common',
  'Morsel.pressWidget.grid',
  'Morsel.pressWidget.modal',
  'ui.router',

  //common
  'Morsel.common.grid.morsel',
  'Morsel.common.offset',
  'Morsel.common.modal.morsel'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $stateProvider.state( 'main', {
    views: {
      "grid": {
        controller: 'GridCtrl',
        templateUrl: 'grid/grid.tpl.html'
      }
    },
    data:{ pageTitle: 'Main' }
  });
})

.run( function run () {
})

.controller( 'PressWidgetCtrl', function PressWidgetCtrl ( $scope, $location, $state ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Morsel' ;
    }
  });

  $state.go('main');
});

