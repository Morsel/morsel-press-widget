angular.module('Morsel.common.morselUtils', [])

.factory('morselUtils', function(MORSEL_PLACEHOLDER){
  var Utils;

  Utils = {
    getCoverPhoto: function(morsel, size) {
      var primaryItemPhotos;

      primaryItemPhotos = Utils.findPrimaryItemPhotos(morsel);

      if(size) {
        return primaryItemPhotos && primaryItemPhotos[size] ? primaryItemPhotos[size] : MORSEL_PLACEHOLDER;
      } else {
        //default size
        return primaryItemPhotos ? primaryItemPhotos._50x50 : MORSEL_PLACEHOLDER;
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