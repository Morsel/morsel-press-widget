;(function(){
  'use strict';
  var siteDomain = window.morselConfig ? window.morselConfig.siteDomain : 'http://morsel-media.herokuapp.com';

  iFrameResize({heightCalculationMethod:'max'});

  var chan = Channel.build({
    window: document.getElementById("morsel-iframe").contentWindow,
    origin: siteDomain,
    scope: "mrsl.pressKit",
    onReady: fireOpenModal
  });

  function fireOpenModal() {
    chan.call({
      method: "openModal",
      params: {
        type: 'morsel',
        id: 421
      },
      success: function(v) {
        console.log(v);
      },
      error: function(error) {
        //throw mixpanel event here
        console.log(error);
      }
    });
  }
})();