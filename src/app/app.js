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
.constant('MORSEL_PLACEHOLDER', '/assets/images/util/morsel-placeholder_640x640.jpg')
.constant('USER_PLACEHOLDER', '/assets/images/util/avatars/avatar_40x40.jpg')

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

.controller( 'PressWidgetCtrl', function PressWidgetCtrl ( $scope, $location, $state, MORSEL_PLACEHOLDER ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Morsel' ;
    }
  });

  $state.go('main');

  $scope.layout = {
    loadingData : true
  };

  //immediately fetch placeholder image so it's cached
  var placeholderPreload = angular.element('<img src="'+MORSEL_PLACEHOLDER+'" />');
  imagesLoaded(placeholderPreload, _.defer(function(){
    placeholderPreload.remove();
  }));
});

