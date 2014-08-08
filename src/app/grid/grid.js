angular.module( 'Morsel.pressWidget.grid', [])

.controller( 'GridCtrl', function GridCtrl( $scope, $timeout, $modal, $http, frameCommunication, CACHE_URL ) {
  var ModalInstanceCtrl;

  $http.get(CACHE_URL+'/grid/'+morselConfig.placeId+'.json').success(function(resp){
    var gridItems = [];
    
    _.each(resp.data, function(m) {
      gridItems.push({
        type: 'morsel',
        subject: m
      });
    });

    //got all the data now
    $scope.gridItems = gridItems;
    $scope.layout.loadingData = false;
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