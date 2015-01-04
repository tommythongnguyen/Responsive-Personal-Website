var intervalId="";
var mySite={};
mySite.familyThumbs=[];
mySite.lasVegasThumbs=[];
//-----template----
mySite.thumbTempl="../templates/photoTemplate.html";
//------json file------
mySite.familyThumbJsonFile="../json_files/family_thumb.json";  
mySite.lagVegasThumbJsonFile="../json_files/lasVegas_thumb.json";  
//-------ajaxCalling method----
mySite.ajaxCallings={
                      getTemplate:function(templUrl){
                                    return $.get(templUrl);
                                  },

                      getJsonData: function(file){
                              return $.ajax({
                                              url:file       
                                            });
                                }
                     };

mySite.buildFamilyPhotosSection= function(tempUrl,file,targetElem){ 
 //get Template via by ajax callings
  mySite.ajaxCallings.getTemplate(tempUrl)
       .done(function(tmp){
            var tpl= tmp;
            //get Json File via by Ajax Callings
             mySite.ajaxCallings.getJsonData(file).done(function(data){
                 data= $.parseJSON(data);

                 if(file.indexOf("family")>-1){
                    mySite.familyThumbs=data;
                 }else{
                    mySite.lasVegasThumbs=data;
                 }

                var album={"photos":data}; 
                var html = Mustache.to_html(tpl,album);
              
                targetElem.html(html); 
            }) 

       });
};
//---------playImages will show images automatically---------
mySite.playImages = function(){
   
    var currentImage=  $("#btnPlay").closest("div.modal-content").find(".modal-body").children().first().attr("src");
   
    intervalId= window.setInterval(function(){  
        var nexImagePartial="";
        var currentImageName = currentImage.substring(currentImage.lastIndexOf("/"));

             //var imgNumber = parseInt(currentImage.substring((currentImage.lastIndexOf("pic")+3), currentImage.length));
        var imgNumber = parseInt(currentImageName.match(/\d+/)[0]);
      
        if(currentImage.indexOf("family")>-1){
           
            if(imgNumber < mySite.familyThumbs.length)
            {
               nexImagePartial = (imgNumber+1)+".jpg";
            }else{
                nexImagePartial = "1.jpg"; //go back to the first one
            }
        }else{ //lasvegas
            console.log("lagvegas length: "+mySite.lasVegasThumbs.length)
            if(imgNumber < mySite.lasVegasThumbs.length)
            {
               nexImagePartial = (imgNumber+1)+".jpg";
            }else{
                nexImagePartial = "1.jpg"; //go back to the first one
            }
        }
      
        //display back 
        currentImage = currentImage.replace(imgNumber+".jpg",nexImagePartial)
         
        $("#photoModal").find("#modalBigImage").fadeTo(1000,0.1,function(){
           $("#photoModal").find("#modalBigImage").attr("src",currentImage);
        }).fadeTo(1000,1);

    },3000);
    event.stopImmediatePropagation();
        
};

//==========getPrevNextImage=================
mySite.getPrevNextImage = function(currentImage,isNext){
     
      var nexImagePartial="";
      var currentImageName = currentImage.substring(currentImage.lastIndexOf("/"));

           //var imgNumber = parseInt(currentImage.substring((currentImage.lastIndexOf("pic")+3), currentImage.length));
      var imgNumber = parseInt(currentImageName.match(/\d+/)[0]);

      if(currentImage.indexOf("family")>-1){
          if(isNext){ //next button is click
              if(imgNumber < mySite.familyThumbs.length)
              {
                 nexImagePartial = (imgNumber+1)+".jpg";
              }else{
                  nexImagePartial = "1.jpg"; //go back to the first one
              }
          }else{
              if(imgNumber >1)
              {
                 nexImagePartial = (imgNumber-1)+".jpg";
              }else{
                  nexImagePartial = mySite.familyThumbs.length+".jpg"; //go back to the first one
              }
          }
          
      }else{ //lasvegas
         if(isNext){ //next button is click
              if(imgNumber < mySite.lasVegasThumbs.length)
              {
                 nexImagePartial = (imgNumber+1)+".jpg";
              }else{
                  nexImagePartial = "1.jpg"; //go back to the first one
              }
          }else{
              if(imgNumber >1)
              {
                 nexImagePartial = (imgNumber-1)+".jpg";
              }else{
                  nexImagePartial = mySite.lasVegasThumbs.length+".jpg"; //go back to the first one
              }
          }
      }
    
      //display back 
      currentImage = currentImage.replace(imgNumber+".jpg",nexImagePartial)
       
      $("#photoModal").find("#modalBigImage").fadeTo(1000,0.1,function(){
         $("#photoModal").find("#modalBigImage").attr("src",currentImage);
      }).fadeTo(1000,1);
};

//---------Close Even Handler---------
mySite.closingHandler = function(){
        window.clearInterval(intervalId);
        $("#btnPlay").attr("src","../graphics/icons/start.png");
         mySite.photoModal.modal("hide");
}

//=========photo Modal EventListener handler----------
mySite.showPhotoModal=function(event){
    if (event.target.tagName ==="A" || event.target.tagName ==="IMG"){
          var imgsrc="";
          if(event.target.tagName ==="A"){
                 imgsrc= event.target.firstChild.src.replace("thumbs","images");
          }else{
               imgsrc=event.target.src.replace("thumbs","images");
          }
         
          //get photoModal object
          mySite.photoModal=$("#photoModal");
          //show bootstrap modal
          mySite.photoModal.modal({
                              show: true
                              // backdrop:"static"
                          });
         
          //---add show image on bootstrap modal
           mySite.photoModal.find(".modal-body >img").attr({"src":imgsrc, "width":"200px", "height":"200px"});

          //---Play and Stop click event
           mySite.photoModal.find("#btnPlay").on("click",function(event){
             if (this.src.indexOf("start.png")>-1){
                  $(this).attr("src","../graphics/icons/pause.png");
                  mySite.playImages();
             }else{
                $(this).attr("src","../graphics/icons/start.png");
                window.clearInterval(intervalId);
             }     
          });

          //--close button event ----------------
           mySite.photoModal.find("#btnStop").on("click",mySite.closingHandler);
          //---------Close Event when user click on the screen----
           mySite.photoModal.on("hidden.bs.modal",mySite.closingHandler);

            //-----Event Delegation-------------
          mySite.photoModal.on("click",function(event){
              event.stopImmediatePropagation();
              if(event.target.id ==="btnPrev" ||event.target.id === "btnNext"){
                  var direction = event.target.id === "btnNext" ? true:false;
                  console.log("this: ",$(this));

                  var currentImage=  $(this).find("#modalBigImage").attr("src");
                  mySite.getPrevNextImage(currentImage,direction);
                }
          })
    }
    
};


//---------jquery ready functions-------------------
$(function(){
    //display all the family thumbnails
     var targetFamily = $("#family");
     mySite.buildFamilyPhotosSection(mySite.thumbTempl, mySite.familyThumbJsonFile,targetFamily);
     
     //display all the las Vegas thumbnails
     var targetLasVegas = $("#lasVegas");
     mySite.buildFamilyPhotosSection(mySite.thumbTempl, mySite.lagVegasThumbJsonFile,targetLasVegas);
         
}); 

$(function(){
  //photo thumbs nail event listenter
  $("article#quoteArticle").on("click",mySite.showPhotoModal);
});
