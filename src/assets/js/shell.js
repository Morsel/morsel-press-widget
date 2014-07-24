;(function(){
  'use strict';
  var siteDomain = window.morselConfig ? window.morselConfig.siteDomain : 'http://morsel-media.herokuapp.com',
    mrslType,
    mrslId,
    chan;

  iFrameResize({
    heightCalculationMethod:'max',
    initCallback: checkHash
  });

  function checkHash() {
    var hash = decodeURIComponent(window.location.hash),
        typeRegExp = /[#&]mrsltype=([^&#]*)/,
        typeMatches = hash.match(typeRegExp),
        idRegExp = /[&#]mrslid=([^&#]*)/,
        idMatches = hash.match(idRegExp);

    if(typeMatches && idMatches) {
      mrslType = typeMatches[1];
      mrslId = idMatches[1];

      openChannel();
    }
  }

  function openChannel() {
    chan = Channel.build({
      window: document.getElementById("morsel-iframe").contentWindow,
      origin: siteDomain,
      scope: "mrsl.pressKit",
      onReady: fireOpenModal
    });
  }

  function fireOpenModal() {
    chan.call({
      method: "openModal",
      params: {
        type: mrslType,
        id: mrslId
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