angular.module( 'Morsel.pressWidget.grid', [
  'ui.router'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'grid', {
    url: '/grid',
    views: {
      "main": {
        controller: 'GridCtrl',
        templateUrl: 'grid/grid.tpl.html'
      }
    },
    data:{ pageTitle: 'Grid' }
  });
})

.controller( 'GridCtrl', function GridCtrl( $scope ) {
});

