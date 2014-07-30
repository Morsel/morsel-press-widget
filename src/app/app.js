angular.module( 'Morsel.pressWidget', [
  'templates-app',
  'templates-common',
  'Morsel.presskit.frameCommunication',
  'Morsel.pressWidget.grid',
  'Morsel.pressWidget.modal',
  'ngSanitize',
  'pasvaz.bindonce',
  'ui.router',

  //app
  'Morsel.common.grid.morsel',
  'Morsel.common.modal.morsel',
  //common
  'Morsel.common.morselUtils',
  'Morsel.common.morselSharing',
  'Morsel.common.userImage'
])

.constant('EXPANDED_MODAL_HEIGHT', 390)
.constant('CACHE_URL', 'https://s3.amazonaws.com/morsel-press-kit/cache')

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

