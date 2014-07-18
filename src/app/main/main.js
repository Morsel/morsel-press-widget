angular.module( 'Morsel.pressWidget.main', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'main', {
    views: {
      "grid": {
        controller: 'GridCtrl',
        templateUrl: 'main/grid/grid.tpl.html'
      },
      "overlay": {
        controller: 'OverlayCtrl',
        templateUrl: 'main/overlay/overlay.tpl.html'
      }
    },
    data:{ pageTitle: 'Main' }
  });
});