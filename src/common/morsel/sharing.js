angular.module( 'Morsel.common.morselSharing', [] )

//like/unlike a morsel
.directive('mrslSharing', function($location, $window){
  return {
    restrict: 'A',
    scope: {
      morsel : '=mrslSharing'
    },
    replace: true,
    link: function(scope, element, attrs) {

      function getMediaImage() {
        var primaryItem,
            lastItemWithPhotos;

        primaryItem = _.find(scope.morsel.items, function(i) {
          return i.id === scope.morsel.primary_item_id;
        });

        //use their cover photo if there is one
        if(primaryItem && primaryItem.photos) {
          return primaryItem.photos._992x992;
        } else {
          //if not, use last item with a photo
          lastItemWithPhotos = findLastItemWithPhotos(scope.morsel.items);
          return lastItemWithPhotos ? lastItemWithPhotos.photos._992x992 : MORSELPLACEHOLDER;
        }
      }

      function findLastItemWithPhotos(items) {
        var reverseItems = items.slice(0);

        return _.find(reverseItems, function(i) {
          return i.photos;
        });
      }

      scope.shareSocial = function(socialType) {
        var url,
            shareText,
            s = scope.morsel,
            //use their handle if they have one - otherwise use their name
            twitterUsername = s.creator.twitter_username ? '@'+s.creator.twitter_username : s.creator.first_name+' '+s.creator.last_name,
            //backup
            mediaUrl = 'http://media.eatmorsel.com/morsels/'+s.id,
            facebookUrl = s.mrsl && s.mrsl.facebook_media_mrsl ? s.mrsl.facebook_media_mrsl : mediaUrl,
            twitterUrl = s.mrsl && s.mrsl.twitter_media_mrsl ? s.mrsl.twitter_media_mrsl : mediaUrl,
            linkedinUrl = s.mrsl && s.mrsl.linkedin_media_mrsl ? s.mrsl.linkedin_media_mrsl : mediaUrl,
            pinterestUrl = s.mrsl && s.mrsl.pinterest_media_mrsl ? s.mrsl.pinterest_media_mrsl : mediaUrl,
            googleplusUrl = s.mrsl && s.mrsl.googleplus_media_mrsl ? s.mrsl.googleplus_media_mrsl : mediaUrl,
            clipboardUrl = s.mrsl && s.mrsl.clipboard_media_mrsl ? s.mrsl.clipboard_media_mrsl : mediaUrl;

        //come back to updating share links properly

        if(socialType === 'facebook') {
          url = 'https://www.facebook.com/sharer/sharer.php?u='+facebookUrl;
        } else if(socialType === 'twitter') {
          shareText = encodeURIComponent('"'+s.title+'" from '+twitterUsername+' on @eatmorsel '+twitterUrl);
          url = 'https://twitter.com/home?status='+shareText;
        } else if(socialType === 'linkedin') {
          url = 'https://www.linkedin.com/shareArticle?mini=true&url='+linkedinUrl;
        } else if(socialType === 'pinterest') {
          shareText = encodeURIComponent('"'+s.title+'" from '+s.creator.first_name+' '+s.creator.last_name+' on Morsel');
          url = 'https://pinterest.com/pin/create/button/?url='+pinterestUrl+'&media='+encodeURIComponent(getMediaImage())+'&description='+shareText;
        } else if(socialType === 'googleplus') {
          url = 'https://plus.google.com/share?url='+googleplusUrl;
        } else if(socialType === 'clipboard') {
          window.prompt("Copy the following link to share:", clipboardUrl);
          return;
        }

        $window.open(url);
      };
    },
    templateUrl: 'morsel/sharing.tpl.html'
  };
});