angular.module( 'Morsel.common.modal.morsel', [] )

.directive('mrslModalMorsel', function($http){
  return {
    restrict: 'A',
    scope: {
      id: '=mrslModalMorsel',
      dataPromise: '=mrslModalDataPromise'
    },
    replace: true,
    link: function(scope, element, attrs) {
      var tempMorsel;
      
      $http.get('../../assets/cache/morsels/'+scope.id+'.json').success(function(resp){
        tempMorsel = resp.data;
        scope.morsel = tempMorsel;
        //scope.dataPromise.resolve();
      });

      scope.$on('modal.morsel.displayData', function() {
        scope.morsel = tempMorsel;
      });
    },
    templateUrl: 'modalItems/morsel/modalMorsel.tpl.html'
  };
});