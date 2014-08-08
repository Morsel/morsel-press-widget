angular.module( 'Morsel.common.modal.morsel', [] )

.directive('mrslModalMorsel', function($http, $q, $timeout, EXPANDED_MODAL_HEIGHT, morselUtils, frameCommunication, CACHE_URL, MORSEL_PLACEHOLDER, USER_PLACEHOLDER){
  return {
    restrict: 'A',
    scope: {
      id: '=mrslModalMorsel',
      dataPromise: '=mrslModalDataPromise'
    },
    replace: true,
    link: function(scope, element, attrs) {
      var tempMorsel,
          transformProperty,
          cssDelay = 200,
          dataPromise = $q.defer(),
          cssDelayPromise = $q.defer(),
          promises = [dataPromise.promise, cssDelayPromise.promise];
      
      scope.showMorsel = false;

      $q.all(promises).then(function(){
        scope.showMorsel = true;
      });

      $http.get(CACHE_URL+'/items/morsels/'+scope.id+'.json').success(function(resp){
        scope.morsel = resp.data;
        dataPromise.resolve();

        var firstImage = angular.element('<img src="'+scope.getItemPhoto(scope.morsel.items[0])+'"/>');
        imagesLoaded(firstImage, function() {
          scope.firstImageLoaded = true;
          scope.$apply();
          firstImage.remove();
        });

        //expose this for our share page
        scope.coverPhotoStyle = {'background-image':'url('+morselUtils.getCoverPhoto(scope.morsel, '_480x480')+')'};
      });

      $timeout(function(){
        cssDelayPromise.resolve();
      }, cssDelay);

      scope.formatDescription = function(description) {
        if(description) {
          return description.replace(/(\r\n|\n|\r)/g,"<br />");
        } else {
          return '';
        }
      };

      scope.getItemPhoto = function(item) {
        if(item.photos) {
          return item.photos._480x480;
        } else {
          return MORSEL_PLACEHOLDER;
        }
      };

      scope.getUserPhoto = function(user) {
        if(user.photos) {
          return user.photos._40x40;
        } else {
          return USER_PLACEHOLDER;
        }
      };

      scope.next = function(itemNum) {
        element.children(1).css(transformProperty, 'translate(0, -' + ((itemNum + 1) * EXPANDED_MODAL_HEIGHT) + 'px)');
      };

      scope.prev = function(itemNum) {
        element.children(1).css(transformProperty, 'translate(0, -' + ((itemNum - 1) * EXPANDED_MODAL_HEIGHT) + 'px)');
      };

      scope.viewOnMorsel = function(e) {
        e.preventDefault();
        frameCommunication.goToUrl(scope.morsel.url);
      };

      ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
        var e = prefix + 'Transform';
        if (typeof document.body.style[e] !== 'undefined') {
          transformProperty = e;
          return false;
        }
        return true;
      });
    },
    templateUrl: 'modal/items/morsel/modalMorsel.tpl.html'
  };
});