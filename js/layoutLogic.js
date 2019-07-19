//============URLS===========================
const HOME='content/home.html';
const PROJECTS='content/projects.html';
const LIVE_PROJECTS='content/liveProjects.html';
const RESUME='content/resume.html';
//============================================
switch(document.location.hash){
    case "#home":$( "#content" ).load(HOME); break;
    case "#projects":$( "#content" ).load(PROJECTS); break;
    case "#live_projects":$( "#content" ).load(LIVE_PROJECTS); break;
    case "#resume":$( "#content" ).load(RESUME); break;
}


function fixActice(object,newContentURL,newTitle){
    $(".active").removeAttr("class");
    $(object).addClass("active");
    document.title = "Omar Nasr - "+newTitle;
    $('#content').animate({ opacity: '0.0'}, { duration: 300, queue: false, complete: function() {
        $("#content").load(newContentURL);
        $('#content').animate({ opacity: '1.0'}, { duration: 300, queue: false});
    }}
    );
}
$("#menu #HOME").click(function(event){
    if($(".active").attr("id")=="HOME")return;
    fixActice(this,HOME,"Home");
})
$("#menu #PROJECTS").click(function(event){
    if($(".active").attr("id")=="PROJECTS")return;
    fixActice(this,PROJECTS,"Projects");
})
$("#menu #LIVE_PROJECTS").click(function(event){
    if($(".active").attr("id")=="LIVE_PROJECTS")return;
    fixActice(this,LIVE_PROJECTS,"Live Projects");
})
$("#menu #RESUME").click(function(event){
    if($(".active").attr("id")=="RESUME")return;
    fixActice(this,RESUME,"Resume");
})
