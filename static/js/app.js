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

var content = {
    renderTemplate:function(templ,vm){
        ko.cleanNode(document.getElementById("content"));
        ko.renderTemplate(templ, 
         vm, {  }, document.getElementById("content"), "replaceChildren");
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
window.addEventListener("load",function(){
    var menuModel = {
        search: function(){ searchConductor.view("Enter something"); },
        hello: helloConductor.view
    };
    ko.applyBindings(menuModel,document.getElementById("menu"));
},false);

/* ------------------------------------------------------------------------*
* Setup routing:
** ------------------------------------------------------------------------*/

//setup crossroads
crossHash.addRoute('search/{query}', searchConductor.handle);
crossHash.addRoute('hello', helloConductor.handle);
//setup hasher
crossHash.defaults('hello');
//only required if you want to set a default value

//setup 
crossHash.init();

})();
