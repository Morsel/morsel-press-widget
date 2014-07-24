angular.module( 'Morsel.common.grid.morsel', [] )

.directive('mrslGridMorsel', function($timeout){
  return {
    restrict: 'A',
    scope: {
      morsel: '=mrslGridMorsel'
    },
    replace: true,
    link: function(scope, element, attrs) {
      var coverPhotoBig = getCoverPhoto(true),
          imagePreload;

      scope.clickedItem = element.parent();
      
      scope.coverPhotoStyle = {'background-image':'url('+getCoverPhoto(true)+')'};

      /*_.defer(function() {
        imagePreload = angular.element('<div><img src="'+coverPhotoBig+'" /></div>');
        imagesLoaded(imagePreload, _.defer(function(){
          scope.coverPhotoStyle = {'background-image':'url('+coverPhotoBig+')'};
          scope.$apply();
          imagePreload.remove();
        }));
      });*/

      function getCoverPhoto(big) {
        var primaryItemPhotos;

        primaryItemPhotos = findPrimaryItemPhotos();

        if(big) {
          return primaryItemPhotos ? primaryItemPhotos._320x320 : null;
        } else {
          return primaryItemPhotos ? primaryItemPhotos._50x50 : null;
        }
      }

      function findPrimaryItemPhotos() {
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

      scope.expandMorsel = function(e) {
        scope.$emit('expand', {
          type: 'morsel',
          id: scope.morsel.id,
          clickedItem: scope.clickedItem
        });
      };
    },
    templateUrl: 'gridItems/morsel/gridMorsel.tpl.html'
  };
});