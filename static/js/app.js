/*
app.js

Created by Oskar Gewalli on 2011-12-02.
License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
(function(){ // In order not to pollute the global namespace
    
var searchViewModel = {
    value:ko.observable("0"),
    query:ko.observable("")
};
var crossHash = {// a simple wrapper to get the method setHashUnrouted
    skip:false,
    parse:function(val){
        // if skip is set to true, then the updated hash should not be routed
        if (this.skip){ this.skip = false; return; }
        crossroads.parse(val);
    },
    setHash:hasher.setHash,
    setHashUnrouted:function(hash){
        this.skip = true;
        hasher.setHash(hash);
    }
};

var content = {
    renderTemplate:function(templ,vm){
        ko.cleanNode($("#content")[0]);
        ko.renderTemplate(templ, 
         vm, {  }, $("#content")[0], "replaceChildren");
    }
};

/* ------------------------------------------------------------------------*
* conductors:
** ------------------------------------------------------------------------*/

var helloConductor= new (function(){
    var self = this;
     this.handle=function(vals){
          self.render(vals);
      };
      this.view= function(vals){
          crossHash.setHash("hello"); // will cause router to route to helloConductor.handle
      };
      this.render=function(vals){
           // should dispose the previously bound view
           var viewModel={};
           content.renderTemplate("helloTmpl", viewModel);           
      };
})();

var searchConductor=new (function(){
    var self = this;
    // in a more complicated scenario we would want to dispose the subscription
    var subscription = searchViewModel.query.subscribe(function(val){
        //this wont cause the route to be executed again. 
        crossHash.setHashUnrouted("search/"+val);
    });
    this.handle=function(vals){
        //can access captured values as object properties
        searchViewModel.query(vals);
        self.render(vals);
    };
    this.view= function(vals){
        crossHash.setHash("search/"+vals); // will cause router to route to searchConductor.handle
    };
    this.render= function(vals){
        // should dispose the previously bound view
        content.renderTemplate("searchTmpl", searchViewModel);
    };
})();

/* ------------------------------------------------------------------------*
* Setup the menu:
** ------------------------------------------------------------------------*/

$(function(){
    var menuModel = {
        search: function(){ searchConductor.view("Enter something"); },
        hello: helloConductor.view
    };
    ko.applyBindings(menuModel,$("#menu")[0]);
});

/* ------------------------------------------------------------------------*
* Setup routing:
** ------------------------------------------------------------------------*/

//setup crossroads
crossroads.addRoute('search/{query}', searchConductor.handle);
crossroads.addRoute('hello', helloConductor.handle);
//setup hasher
var DEFAULT_HASH = 'hello';
//only required if you want to set a default value
if(! hasher.getHash()){
    hasher.setHash(DEFAULT_HASH);
}

//setup hasher
hasher.initialized.add(crossHash.parse, crossHash); //parse initial hash
hasher.changed.add(crossHash.parse, crossHash); //parse hash changes
hasher.init(); //start listening for history change

})();
