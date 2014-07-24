angular.module('Morsel.presskit.frameCommunication', [])

.factory('frameCommunication', function($window) {
  return {
    setup: function(openModalFunc){
      var chan = Channel.build({
            window: $window.parent,
            origin: $window.morselConfig.siteDomain,
            scope: "mrsl.pressKit"
          });

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
    }
  };
});