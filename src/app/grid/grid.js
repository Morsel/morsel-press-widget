angular.module( 'Morsel.pressWidget.grid', [])

.controller( 'GridCtrl', function GridCtrl( $scope, $timeout, $http, $modal ) {
  var ModalInstanceCtrl;

  //set some vars for our layout
  $scope.grid = {
    gridItems: null,
    loadingThumbs: true,
    loadingData: true
  };

  //get some fake data for now
  $http.get('../../assets/cache/morsels.json').success(function(resp){
    var tempMorsels = resp,
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

  //listen to any events from grid items
  $scope.$on('expand', function(e, data) {
    //pop modal
    var modalInstance = $modal.open({
      templateUrl: 'modal/modalContent.tpl.html',
      controller: ModalInstanceCtrl,
      resolve: {
        //pass along gridItem data to modal
        gridItemData: function () {
          return data;
        }
      }
    });
  });

  ModalInstanceCtrl = function ($scope, $modalInstance, gridItemData) {
    $scope.id = gridItemData.id;
    $scope.type = gridItemData.type;
    $scope.positionEl = gridItemData.positionEl;
  };
});