angular.module( 'Morsel.common.modal.morsel', [] )

.directive('mrslModalMorsel', function($http, $q, $timeout, EXPANDED_MODAL_HEIGHT){
  return {
    restrict: 'A',
    scope: {
      id: '=mrslModalMorsel',
      dataPromise: '=mrslModalDataPromise'
    },
    replace: true,
    link: function(scope, element, attrs) {
      var tempMorsel,
          morselPlaceholderUrl = '/assets/images/util/morsel-placeholder_480x480.jpg',
          transformProperty,
          dataPromise = $q.defer(),
          halfSecondPromise = $q.defer(),
          promises = [dataPromise.promise, halfSecondPromise.promise];
      
      $q.all(promises).then(function(){
        scope.showMorsel = true;
      });

      $http.get('../../assets/cache/morsels/'+scope.id+'.json').success(function(resp){
        scope.morsel = resp;
        dataPromise.resolve();
      });

      $timeout(function(){
        halfSecondPromise.resolve();
      }, 500);

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
          return morselPlaceholderUrl;
        }
      };

      scope.getUserPhoto = function(user) {
        if(user.photos) {
          return user.photos._40x40;
        } else {
          return userPlaceholderUrl;
        }
      };

      scope.next = function(itemNum) {
        element.children(1).css(transformProperty, 'translate(0, -' + ((itemNum + 1) * EXPANDED_MODAL_HEIGHT) + 'px)');
      };

      scope.prev = function(itemNum) {
        element.children(1).css(transformProperty, 'translate(0, -' + ((itemNum - 1) * EXPANDED_MODAL_HEIGHT) + 'px)');
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
    templateUrl: 'modalItems/morsel/modalMorsel.tpl.html'
  };
});