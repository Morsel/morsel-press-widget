angular.module('Morsel.common.morselUtils', [])

.factory('morselUtils', function(){
  var Utils,
      morselPlaceholderUrl = '/assets/images/util/morsel-placeholder_480x480.jpg';

  Utils = {
    getCoverPhoto: function(morsel, size) {
      var primaryItemPhotos;

      primaryItemPhotos = Utils.findPrimaryItemPhotos(morsel);

      if(size) {
        return primaryItemPhotos && primaryItemPhotos[size] ? primaryItemPhotos[size] : morselPlaceholderUrl;
      } else {
        //default size
        return primaryItemPhotos ? primaryItemPhotos._50x50 : morselPlaceholderUrl;
      }
    },

    findPrimaryItemPhotos: function(morsel) {
      var pMorsel;

      pMorsel = _.find(morsel.items, function(i) {
        return i.id === morsel.primary_item_id;
      });

      if(pMorsel && pMorsel.photos) {
        return pMorsel.photos;
      } else {
        return null;
      }
    }
  };

  return Utils;
});