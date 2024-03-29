angular.module('Morsel.common.userImage', [])

.directive('mrslUserImage', [function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      userPhotos: '=mrslUserPhotos',
      userImageSize: '@mrslUserImageSize'
    },
    link: function(scope) {
      var placeholderAvatarUrl = '/assets/images/util/avatars/avatar';

      scope.returnPhoto = function(){
        var photoSize;

        switch(scope.userImageSize) {
          case 'profile-pic-xs':
            photoSize = '_40x40';
            break;

          case 'profile-pic-s':
            photoSize = '_72x72';
            break;

          case 'profile-pic-m':
            photoSize = '_80x80';
            break;

          default:
          case 'profile-pic-l':
            photoSize = '_144x144';
            break;
        }

        if(scope.userPhotos && scope.userPhotos[photoSize]) {
          return scope.userPhotos[photoSize];
        } else {
          //placeholder avatar
          return placeholderAvatarUrl+photoSize+'.jpg';
        }
        
      };
    },
    template: '<span class="profile-pic-link {{userImageSize}}">' +
                '<img ng-src="{{returnPhoto()}}" class="img-circle" />' +
              '</span>'
  };
}]);