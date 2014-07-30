angular.module( 'Morsel.pressWidget.grid', [])

.controller( 'GridCtrl', function GridCtrl( $scope, $timeout, $http, $modal, frameCommunication, CACHE_URL ) {
  var ModalInstanceCtrl;

  //set some vars for our layout
  $scope.grid = {
    gridItems: null,
    loadingThumbs: true,
    loadingData: true
  };

  //get some fake data for now
  $http.get(CACHE_URL+'/grid/'+morselConfig.placeId+'.json').success(function(resp){
    var tempItems = resp.data,
        items = [];

    for(var i = 0;i<tempItems.length;i++) {
      items.push({
        type: 'morsel',
        subject: tempItems[i]
      });
    }
    $scope.grid.gridItems = items;

    $scope.grid.loadingThumbs = false;
    $scope.grid.loadingData = false;
  });

  //listen to any events from grid items
  $scope.$on('expand', function(e, data) {
    openModal(data);
  });

  function openModal(data) {
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
  }

  ModalInstanceCtrl = function ($scope, $modalInstance, gridItemData) {
    $scope.id = gridItemData.id;
    $scope.type = gridItemData.type;
    //used to start the position of the modal
    $scope.clickedItem = gridItemData.clickedItem;
  };

  frameCommunication.setupOpenModal(function(params){
    openModal({
      id: params.id,
      type: params.type
    });

    //return success for shell callback
    return true;
  });
});