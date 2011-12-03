(function (define) {
define('crossHash', function (require) {
    var hasher = require('hasher');
    var crossroads = require('crossroads');
    var crossHash;
    
    function CrossHash(){
        this.skip =false;
    }
    
    CrossHash.prototype = {// a simple wrapper to get the method setHashUnrouted
        parse:function(val){
            // if skip is set to true, then the updated hash should not be routed
            if (this.skip){ this.skip = false; return; }
            crossroads.parse(val);
        },
        setHash:function(val){hasher.setHash(val);},
        setHashUnrouted:function(hash){
            crossHash.skip = true;
            hasher.setHash(hash);
        },
        addRoute:function(route,handler){crossroads.addRoute(route,handler);},
        defaults:function(hash){
            if(! hasher.getHash()){
                hasher.setHash(hash);
            }
        },
        init:function(){
            hasher.initialized.add(crossHash.parse, crossHash); //parse initial hash
            hasher.changed.add(crossHash.parse, crossHash); //parse hash changes
            hasher.init(); //start listening for history change
        }
    };
    crossHash=new CrossHash();
    return crossHash;
    
});
}(typeof define === 'function' && define.amd ? define : function (id, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require);
    } else {
        window[id] = factory(function (value) {
            return window[value];
        });
    }
}));
