angular.module('Morsel.common.morselUtils', [])

.factory('morselUtils', function(MORSEL_PLACEHOLDER){
  var Utils;

  Utils = {
    getCoverPhoto: function(morsel, size) {
      var primaryItemPhotos;

      primaryItemPhotos = morsel && morsel.primary_item_photos ? morsel.primary_item_photos : null;

      if(size) {
        return primaryItemPhotos && primaryItemPhotos[size] ? primaryItemPhotos[size] : MORSEL_PLACEHOLDER;
      } else {
        //default size
        return primaryItemPhotos ? primaryItemPhotos._50x50 : MORSEL_PLACEHOLDER;
      }
    }
  };

  return Utils;
});