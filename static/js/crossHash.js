(function (define) {
define('statePusher', function (require) {
    var statePusher;

    function StatePusher(){
        this.parse = null;
    }

    StatePusher.prototype = {
          isEnabled:function(){ return 'pushState' in window.history; },
          setHash:function(val){
              window.history.pushState({}, "Hello", "/"+val);
              this.parse(val);
          },
          setHashUnrouted:function(val){
              window.history.pushState({}, "Hello", "/"+val);
          },
          onpopstate:function(){
              // see what is available in the event object
              statePusher.parse(decodeURI(window.location.pathname+window.location.hash).substr(1));
          },
          init:function(){
              window.onpopstate = this.onpopstate;
          }
      };
      statePusher=new StatePusher();

      return statePusher;
});
}(typeof define === 'function' && define.amd ? define : function (id, factory) {
    window[id] = factory(function (value) {
        return window[value];
    });
}));

(function (define) {
define('crossHash', function (require) {
    var hasher = require('hasher');
    var crossroads = require('crossroads');
    var statePusher = require('statePusher');
    var crossHash;

    function CrossHash(){
        this.skip =false;
    }
    
    CrossHash.prototype = {// a simple wrapper to get the method setHashUnrouted
        parse:function(hash){
            // if skip is set to true, then the updated hash should not be routed
            if (this.skip){ this.skip = false; return; }
            crossroads.parse(hash);
        },
        setHash:function(hash){
            //
            if (statePusher.isEnabled()){
                statePusher.setHash(hash);
            }else{
                hasher.setHash(hash);
            }
        },
        setHashUnrouted:function(hash){
            if (statePusher.isEnabled()){
                statePusher.setHashUnrouted(hash);
            }else{
                this.skip = true;
                this.setHash(hash);
            }
        },
        addRoute:function(route,handler){crossroads.addRoute(route,handler);},
        defaults:function(hash){
            if(! hasher.getHash()){
                hasher.setHash(hash);
            }
        },
        init:function(){
            if (statePusher.isEnabled()){
                statePusher.init();
            }else{
                hasher.initialized.add(crossHash.parse, crossHash); //parse initial hash
                hasher.changed.add(crossHash.parse, crossHash); //parse hash changes
                hasher.init(); //start listening for history change
            }
        }
    };
    crossHash=new CrossHash();
    statePusher.parse = function(val){ crossHash.parse(val); }; // should be bind this operation
    return crossHash;
    
});
}(typeof define === 'function' && define.amd ? define : function (id, factory) {
    window[id] = factory(function (value) {
        return window[value];
    });
}));
