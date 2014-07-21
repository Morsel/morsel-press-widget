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
      var tempMorsel,
          morselPlaceholderUrl = '/assets/images/util/morsel-placeholder_480x480.jpg',
          transformProperty,
          morselHeight = 390;
      
      $http.get('../../assets/cache/morsels/'+scope.id+'.json').success(function(resp){
        tempMorsel = resp.data;
        scope.morsel = tempMorsel;
        //scope.dataPromise.resolve();
      });

      scope.$on('modal.morsel.displayData', function() {
        scope.morsel = tempMorsel;
      });

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
        element.children(1).css(transformProperty, 'translate(0, -' + ((itemNum + 1) * morselHeight) + 'px)');
      };

      scope.prev = function(itemNum) {
        element.children(1).css(transformProperty, 'translate(0, -' + ((itemNum - 1) * morselHeight) + 'px)');
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