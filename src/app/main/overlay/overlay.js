angular.module( 'Morsel.pressWidget.overlay', [])

.controller( 'OverlayCtrl', function OverlayCtrl( $scope, $timeout ) {
  $scope.$on('expandDown', function(e, data) {
    console.log(data);
  });
});