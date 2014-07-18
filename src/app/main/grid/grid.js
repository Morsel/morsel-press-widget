angular.module( 'Morsel.pressWidget.grid', [])

.controller( 'GridCtrl', function GridCtrl( $scope, $timeout, $http ) {
  $scope.grid = {
    gridItems: null,
    loadingThumbs: true,
    loadingData: true
  };

  $http.get('../../assets/cache/morsel.json').success(function(resp){
    var tempMorsels = resp.data,
        morsels = [];
    for(var i = 0;i<tempMorsels.length;i++) {
      morsels.push({
        type: 'morsel',
        subject: tempMorsels[i]
      });
    }
    $scope.grid.gridItems = morsels;

    //$scope.grid.loadingThumbs = false;
    $scope.grid.loadingData = false;
  });
});