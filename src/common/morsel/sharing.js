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
      //var cURL = encodeURIComponent($location.absUrl());//for testing

      scope.socialExpanded = true;

      function shareMixpanel(socialType) {
        /*Mixpanel.send('Tapped Share Morsel', {
          social_type : socialType,
          morsel_id : scope.morsel.id,
          creator_id : scope.morsel.creator.id
        });*/
      }

      function getMediaImage() {
        var primaryItem,
            m = scope.morsel;

        //if they have a collage, use it
        if(m.photos) {
          return m.photos._800x600;
        } else {
          //use their cover photo as backup
          primaryItem = _.find(m.items, function(i) {
            return i.id === m.primary_item_id;
          });

          if(primaryItem && primaryItem.photos) {
            return primaryItem.photos._992x992;
          } else {
            return m[0].photos._992x992;
          }
        }
      }

      scope.shareSocial = function(socialType) {
        var url,
            shareText,
            s = scope.morsel,
            //use their handle if they have one - otherwise use their name
            twitterUsername = s.creator.twitter_username ? '@'+s.creator.twitter_username : s.creator.first_name+' '+s.creator.last_name;

        shareMixpanel(socialType);

        //come back to updating share links properly

        if(socialType === 'facebook') {
          url = 'https://www.facebook.com/sharer/sharer.php?u='+s.facebook_mrsl;
        } else if(socialType === 'twitter') {
          shareText = encodeURIComponent('"'+s.title+'" from '+(twitterUsername || (s.creator.first_name+' '+s.creator.last_name))+' on @eatmorsel ');
          url = 'https://twitter.com/home?status='+shareText+s.twitter_mrsl;
        } else if(socialType === 'linkedin') {
          url = 'https://www.linkedin.com/shareArticle?mini=true&url='+s.url;
        } else if(socialType === 'pinterest') {
          shareText = encodeURIComponent('"'+s.title+'" from '+s.creator.first_name+' '+s.creator.last_name+' on Morsel');
          url = 'https://pinterest.com/pin/create/button/?url='+s.url+'&media='+encodeURIComponent(getMediaImage())+'&description='+shareText;
        } else if(socialType === 'google_plus') {
          url = 'https://plus.google.com/share?url='+s.url;
        }

        $window.open(url);
      };
    },
    templateUrl: 'morsel/sharing.tpl.html'
  };
});