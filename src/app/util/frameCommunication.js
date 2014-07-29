angular.module('Morsel.presskit.frameCommunication', [])

.factory('frameCommunication', function($window) {
  var chan = Channel.build({
        window: $window.parent,
        origin: $window.morselConfig.siteDomain,
        scope: "mrsl.pressKit"
      });

  return {
    setupOpenModal: function(openModalFunc){
      chan.bind("openModal", function(trans, params){
        //make sure we have type and id
        if(!params.type) {
          throw 'pressWidget channel didn\'t provide a type';
        }
        if(!params.id) {
          throw 'pressWidget channel didn\'t provide an id';
        }

        //callback
        return openModalFunc(params);
      });
    },

    goToUrl: function(url) {
      chan.call({
        method: "goToUrl",
        params: {
          url: url
        },
        success: function(r){
          console.log(r);
        },
        error: function(error) {
          //throw mixpanel event here
          console.log(error);
        }
      });
    }
  };
});