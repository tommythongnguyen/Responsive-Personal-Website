
var videoObj ={};
videoObj.activeTab="Videos";
// videoObj.audioPlayer=null;
//-----json file------
videoObj.videoJsonFile="../json_files/music_video.json";
videoObj.albumJsonFile="../json_files/albums.json";
videoObj.collectionJsonFile="../json_files/collection.json";
videoObj.comedyJsonFile="../json_files/comedy.json";

//------template----
videoObj.navTabTemplateUrl="../templates/navTabTemplate.html";
videoObj.musicTabTemplateUrl="../templates/musicTabTemplate.html";
videoObj.audioPlayerTemplateUrl="../templates/audioPlayerTemplate.html";
videoObj.navTabTmpl="";
videoObj.musicTabTmpl="";
videoObj.audioPlayerTmpl="";

//------data object------
videoObj.videoData={"list":""};
videoObj.albumData={"list":""};
videoObj.comedyData={"list":""};
videoObj.collectionData={"list":""};

//------getJsonFile: make ajax calling to get json files------
videoObj.renderTab = function(srcFile,objData,tab){
    console.log("tab:",tab);
    var template="";
    //-----get Json file--------
    $.ajax({url:srcFile}).done(function(data){
        //convert json string data to json object
       objData.list = $.parseJSON(data);

       if(videoObj.activeTab ==="Albums"){
         template = Mustache.render(videoObj.musicTabTmpl,objData);
          
       }else{
          template = Mustache.render(videoObj.navTabTmpl,objData);
       }
       tab.empty().append(template);
       
    });
};
//--------getNavTabtemplate: make ajax calling to get template file-----
videoObj.getNavTabTemplate= function(tempUrl){
    $.ajax({url:tempUrl}).done(function(templ){
                                    videoObj.navTabTmpl=templ;
                               })
};
//--------getMusicTabtemplate: make ajax calling to get template file-----
videoObj.getMusicTabTemplate= function(tempUrl){
    $.ajax({url:tempUrl}).done(function(templ){
                                    videoObj.musicTabTmpl=templ;
                               })
};

//--------getMusicTabtemplate: make ajax calling to get template file-----
videoObj.getAudioPlayerTemplate= function(tempUrl){
    $.ajax({url:tempUrl}).done(function(templ){
                                    videoObj.audioPlayerTmpl=templ;
                               })
};

//---------videoObj.closingHandler---------------
videoObj.closingHandler = function(){
     $('#mediaModal').hide();
     $('#mediaModal iframe').attr("src", $("#mediaModal iframe").attr("src"));
     $("#videoPlayer")[0].paused ? "": $("#videoPlayer")[0].pause();
}

//========================Execute as soon as DOM are ready======================
$(function(){
    var mediaModal = $("#mediaModal");
    var videoPlayer =mediaModal.find("#videoPlayer");
    var listSong=null;
    var currentAlbum=null;
    //---get navTabTemplate.html-----
   videoObj.getNavTabTemplate(videoObj.navTabTemplateUrl);

   videoObj.getMusicTabTemplate(videoObj.musicTabTemplateUrl);

   videoObj.getAudioPlayerTemplate(videoObj.audioPlayerTemplateUrl);
   //setup the first video tab of navTav
   videoObj.renderTab(videoObj.videoJsonFile,videoObj.videoData,$("#videosTab"))
   
   //---get Navtab object
   var navTabs=$("#myNavTabs");

   //----add Tab Switch listener----
   navTabs.find("a").on("click",function(event){
        //save current activeTab
        videoObj.activeTab=$(this).html();

        if($(this).attr("href")==="#videosTab"){               
            videoObj.renderTab(videoObj.videoJsonFile,videoObj.videoData,$("#videosTab"));
        }else if ($(this).attr("href")==="#moviesTab"){
             videoObj.renderTab(videoObj.collectionJsonFile,videoObj.collectionData,$("#moviesTab"));
        }else if ($(this).attr("href")==="#comediesTab"){
             videoObj.renderTab(videoObj.comedyJsonFile,videoObj.comedyData,$("#comediesTab"));
        }else if ($(this).attr("href")==="#albumsTab"){
             videoObj.renderTab(videoObj.albumJsonFile,videoObj.albumData,$("#albumsTab"));
        }
   });

   //------------Medial Modal Event------
   $("#myTabContent").on("click",function(event){
        //check click event tagName
        if(event.target.tagName ==="IMG"){
            //get name of clicked Image
            var imgSrc = event.target.src;
            imgSrc = imgSrc.substring(imgSrc.lastIndexOf("/"),imgSrc.length);
            var obj=[];

            //--check if current tap is "Video Tab"
            if(videoObj.activeTab ==="Videos"){
                obj = getObj(videoObj.videoData.list,imgSrc);
                if(obj.length>0){
                    mediaModal.find("#modalTitle").html(obj[0].title);
                    mediaModal.find("iframe").attr("src",obj[0].src);
                   $("#description").hasClass("hidden") ? "":$("#description").addClass("hidden");
                }
                //process the video controller
                mediaModal .modal("show");

            //--check if current tap is "Collection Tab"
            }else if(videoObj.activeTab ==="Movies"){
                   $("#description").hasClass("hidden") ?   $("#description").removeClass("hidden"):""
                 obj = getObj(videoObj.collectionData.list,imgSrc);
                 if(obj.length>0){
                    mediaModal.find("#modalTitle").html(obj[0].title);
                    mediaModal.find("iframe").attr("src",obj[0].src);
                    mediaModal.find("#description").html(obj[0].description);
                }
                //process the video controller
                mediaModal .modal("show");

             //check if current tap is "Comedy Tab"
            }else if(videoObj.activeTab ==="Comedies"){
                  $("#description").hasClass("hidden") ? "":$("#description").addClass("hidden");
                 obj = getObj(videoObj.comedyData.list,imgSrc,"Comedies");
                 
                 if(obj.length>0){
                    mediaModal.find("#modalTitle").html(obj[0].title);
                    videoPlayer.attr("poster",obj[0].img);
                   
                   //detect web browser supporting by using Modernizr
                   var video = videoPlayer.get(0);
                   if(Modernizr.video && Modernizr.video.ogg){
                      videoPlayer.attr("src",obj[0].src[0]);
                   }else if(Modernizr.video && Modernizr.video.webm){
                      videoPlayer.attr("src",obj[0].src[1]);
                    }
                  video.load();
                }
                //process the video controller
                mediaModal .modal("show");

             //check if active tab is Albums   
            }else if(videoObj.activeTab ==="Albums"){
              //get the obj
              currentAlbum= getObj(videoObj.albumData.list,imgSrc,"Albums");
             
              if(currentAlbum.length >0){
                //check if user browser support audio element

                if(Modernizr.audio && Modernizr.audio.mp3){
                  console.log("inside Modernizr: ",currentAlbum[0])
                   var audioTemplate = Mustache.render(videoObj.audioPlayerTmpl,{"songs":currentAlbum[0].songs});
                    var albumsTab =$("#albumsTab");
                    //check if the audio is alreay exist
                    if(albumsTab.find("#audioPlayer").length >0){
                        //remove audio player
                        albumsTab.find("#audioPlayer").closest(".row").remove();
                    }
                   $("#albumsTab").prepend(audioTemplate);
                   $("#audioPlayer").attr("src",currentAlbum[0].songs[0].src);

                   //add active class to first song in the list
                   listSong = $("#albumsTab").find("#list-group-style a li");
                   
                  listSong.first().addClass("active");
                }
              }
            }
          
        };//end of most outer if     

    });//end of envent

 
  //============close button event ----------------
   mediaModal.find("#closeBtn").on("click",videoObj.closingHandler);
  //---------Close Event when user click on the screen----
   mediaModal.on("hidden.bs.modal",videoObj.closingHandler);
  

    //------TotalTime: fires when browser has loaded meta data for the audio/video--------
    videoPlayer.on("loadedmetadata",function(event){
      mediaModal.find(".duration").html(Math.round(videoPlayer[0].duration));
      videoPlayer.attr({
                          "width":this.videoWidth,
                          "height":this.videoHeight
                        })
                 .css({

                        "margin-left":"auto",
                        "margin-right":"auto"
                 });

      mediaModal.find(".modal-dialog").css({
                                              "width": this.videoWidth+ 40+"px",
                                            });
      console.log("this.videoWidth:",this.videoWidth);
       console.log("this.videoHeight:",this.videoHeight);
    });

//----------Change Song for Audio Player----------
 $("div#albumsTab").on("click",function(event){
    if(event.target.tagName ==="LI"){
      event.stopImmediatePropagation();  
      var li = $(event.target);
      var obj = getSong(currentAlbum[0].songs, li.text());
      //update  audioPlayer
      var audioPlayer = $("#audioPlayer");
      
      audioPlayer.attr("src",obj[0].src);
      audioPlayer[0].load();
      audioPlayer[0].play();
     
      listSong.removeClass("active");
      li.addClass("active");
    }
 })


//-----------getObj-----------------------------
  function getObj(list,imgSrc,tab){
    if(tab ==="Comedies"){
        videoPlayer.hasClass("hidden") ? videoPlayer.removeClass("hidden"): ""; 
        //add hidden class to iframe
        mediaModal.find("#player").addClass("hidden");
    }else if(tab==="Albums"){
        // audioPlayer =$("#audioPlayer");
        
        // audioPlayer.closest(".row").hasClass("hidden") ?  audioPlayer.closest(".row").removeClass("hidden"):"";
    }else{
         //check hidden class for iframe
         mediaModal.find("#player").hasClass("hidden")?  mediaModal.find("#player").removeClass("hidden"):"";
         
         //add hidden class to video
         videoPlayer.addClass("hidden");
    }
    //filter the video object with the current src
    return list.filter(function(el){
                return el.img.indexOf(imgSrc) > -1;
          });
  };


//---------getSong------------
function getSong(list,songName){
  return list.filter(function(song){
    return song.name ===songName;
  })
}

});



