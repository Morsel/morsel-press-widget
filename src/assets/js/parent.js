;(function(){
  'use strict';
  var siteDomain = window.morselConfig ? window.morselConfig.siteDomain : 'http://morsel-press-widget.herokuapp.com',
    mrslType,
    mrslId,
    chan;

  iFrameResize({
    heightCalculationMethod:'max',
    initCallback: openChannel
  });

  function openChannel() {
    chan = Channel.build({
      window: document.getElementById("morsel-iframe").contentWindow,
      origin: siteDomain,
      scope: "mrsl.pressKit",
      onReady: channelConnected
    });
  }

  function checkHash() {
    var hash = decodeURIComponent(window.location.hash),
        typeRegExp = /[#&]mrsltype=([^&#]*)/,
        typeMatches = hash.match(typeRegExp),
        idRegExp = /[&#]mrslid=([^&#]*)/,
        idMatches = hash.match(idRegExp);

    if(typeMatches && idMatches) {
      mrslType = typeMatches[1];
      mrslId = idMatches[1];

      fireOpenModal();
    }
  }

  function channelConnected() {
    //we want this available
    chan.bind("goToUrl", function(trans, params){
      if(params.url) {
        window.location = params.url;
      } else {
        throw 'pressWidget channel didn\'t provide a url';
      }
    });

    //check the hash to see if we should do anything right off the bat
    checkHash();
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