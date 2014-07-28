angular.module( 'Morsel.common.grid.morsel', [] )

.directive('mrslGridMorsel', function($timeout, morselUtils){
  return {
    restrict: 'A',
    scope: {
      morsel: '=mrslGridMorsel'
    },
    replace: true,
    link: function(scope, element, attrs) {
      var coverPhotoBig = morselUtils.getCoverPhoto(scope.morsel, '_50x50'),
          imagePreload;

      scope.clickedItem = element.parent();
      
      scope.coverPhotoStyle = {'background-image':'url('+morselUtils.getCoverPhoto(scope.morsel, '_320x320')+')'};

      /*_.defer(function() {
        imagePreload = angular.element('<div><img src="'+coverPhotoBig+'" /></div>');
        imagesLoaded(imagePreload, _.defer(function(){
          scope.coverPhotoStyle = {'background-image':'url('+coverPhotoBig+')'};
          scope.$apply();
          imagePreload.remove();
        }));
      });*/

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