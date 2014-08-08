angular.module( 'Morsel.common.grid.morsel', [] )

.directive('mrslGridMorsel', function($timeout, morselUtils, MORSEL_PLACEHOLDER){
  return {
    restrict: 'A',
    scope: {
      morsel: '=mrslGridMorsel'
    },
    replace: true,
    link: function(scope, element, attrs) {
      var coverPhoto = morselUtils.getCoverPhoto(scope.morsel, '_320x320'),
          imagePreload;

      scope.clickedItem = element.parent();
      
      scope.coverPhotoStyle = {'background-image':'url('+MORSEL_PLACEHOLDER+')'};

      _.defer(function() {
        imagePreload = angular.element('<img src="'+coverPhoto+'" />');
        imagesLoaded(imagePreload, _.defer(function(){
          scope.coverPhotoStyle = {'background-image':'url('+coverPhoto+')'};
          scope.imgLoaded = true;
          scope.$apply();
          imagePreload.remove();
        }));
      });

      scope.expandMorsel = function(e) {
        scope.$emit('expand', {
          type: 'morsel',
          id: scope.morsel.id,
          clickedItem: scope.clickedItem
        });
      };
    },
    templateUrl: 'grid/items/morsel/gridMorsel.tpl.html'
  };
});