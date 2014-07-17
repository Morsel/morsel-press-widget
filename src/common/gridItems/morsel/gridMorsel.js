angular.module( 'Morsel.common.grid.morsel', [] )

.directive('mrslGridMorsel', function($timeout){
  return {
    restrict: 'A',
    scope: {
      morsel: '=mrslGridMorsel'
    },
    replace: true,
    link: function(scope, element, attrs) {
      scope.morsel.coverPhoto = getCoverPhoto();

      function getCoverPhoto() {
        var primaryItemPhotos;

        primaryItemPhotos = findPrimaryItemPhotos(scope.morsel);
        return primaryItemPhotos ? primaryItemPhotos._320x320 : null;
      }

      function findPrimaryItemPhotos(morsel) {
        var pMorsel;

        pMorsel = _.find(scope.morsel.items, function(i) {
          return i.id === scope.morsel.primary_item_id;
        });

        if(pMorsel && pMorsel.photos) {
          return pMorsel.photos;
        } else {
          return null;
        }
      }
    },
    templateUrl: 'gridItems/morsel/gridMorsel.tpl.html'
  };
});