angular.module( 'Morsel.pressWidget', [
  'templates-app',
  'templates-common',
  'Morsel.pressWidget.grid',
  'Morsel.pressWidget.main',
  'Morsel.pressWidget.overlay',
  'ui.router',

  //common
  'Morsel.common.grid.morsel'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
})

.run( function run () {
})

.controller( 'PressWidgetCtrl', function PressWidgetCtrl ( $scope, $location, $state ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Morsel' ;
    }
  });

  $scope.$on('expandUp', function(data) {
    $scope.$broadcast('expandDown', data);
  });

  $state.go('main');
});

