angular.module( 'Morsel.pressWidget', [
  'templates-app',
  'templates-common',
  'Morsel.pressWidget.grid',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/grid' );
})

.run( function run () {
})

.controller( 'PressWidgetCtrl', function PressWidgetCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Morsel' ;
    }
  });
});

