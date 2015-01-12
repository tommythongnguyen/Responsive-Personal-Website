
var aboutObj ={};

aboutObj.bookJsonFile="../json_files/books.json";

//------template----
aboutObj.bookTemplateUrl="../templates/booksTemplate.html";

aboutObj.bookTmpl="";

//------getJsonFile: make ajax calling to get json files------
aboutObj.renderTab = function(target){
	//get book template
    $.ajax({url:aboutObj.bookTemplateUrl}).done(function(templ){
                                    aboutObj.bookTmpl=templ;

								    //-----get Json file--------
								    $.ajax({url:aboutObj.bookJsonFile}).done(function(data){
								        //convert json string data to json object
								        var template = Mustache.render(aboutObj.bookTmpl,{"list":$.parseJSON(data)});
								       target.empty().append(template);
								       
								    });
                               })
    
};

$(function(){
		aboutObj.renderTab($("div.books"));
})