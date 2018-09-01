var tag = "";
$(document).ready(function() {
  $('.tabs').tabs();
  showView(0);
  $('.sidenav').sidenav();

  steem.api.getTrendingTags("", 100, function(err, result) {
    for (let i = 0; i < result.length; i++) {
      if (result[i].name == "") {
        $('.sidenav').append("<li><a class='waves-effect' href='#!' onclick=tagSet(\"" + result[i].name + "\")>All Tags</a></li>");
      } else {
        $('.sidenav').append("<li><a class='waves-effect' href='#!' onclick=tagSet(\"" + result[i].name + "\")>" + result[i].name + "</a></li>");
      }
    }
  });
});

function tagSet(ct) {
  tag = ct;
  $('.collection').empty();
  console.log("Deldsdsdeted");
  console.log(tag);
  window.location = $('#tab11').attr('class'); //To refocus tabs over first tab
  showView(0);
}
//Running steem method on document ready when script tag initialized.
//There is not a need for document.ready funcion but you can use them for practice.
function showView(val) {
  switch (val) {
    case 0:
      steem.api.getDiscussionsByTrending({
        "tag": tag,
        "limit": 10
      }, function(err, result) {
        console.log("trending");
        setValues(err, result, 0);
      });
      $("#btn-a").unbind();
      $("#btn-a").bind("click", function() { // Otherwise there will be if/else statement...
        //If we have to optimize it a little more.
        console.log("trending clicked");
        steem.api.getDiscussionsByTrending({
            "tag": tag,
            "limit": 10,
            "start_permlink": window.permlink,
            "start_author": window.author
          },
          function(err, result) {
            setValues(err, result, 1);
          });
      });
      break;

    case 1:
      steem.api.getDiscussionsByCreated({
        "tag": tag,
        "limit": 10
      }, function(err, result) {
        console.log("c");
        setValues(err, result, 0);
      });
      $("#btn-a").unbind();
      $("#btn-a").bind("click", function() {
        console.log("c clicked");
        steem.api.getDiscussionsByCreated({
            "tag": tag,
            "limit": 10,
            "start_permlink": window.permlink,
            "start_author": window.author
          },
          function(err, result) {
            setValues(err, result, 1);
          });
      });
      break;

    case 2:
      steem.api.getDiscussionsByHot({
        "tag": tag,
        "limit": 10
      }, function(err, result) {
        setValues(err, result, 0);
      });
      $("#btn-a").unbind();
      $("#btn-a").bind("click", function() {
        console.log("h clicked");
        steem.api.getDiscussionsByHot({
            "tag": tag,
            "limit": 10,
            "start_permlink": window.permlink,
            "start_author": window.author
          },
          function(err, result) {
            setValues(err, result, 1);
          });
      });
      break;

    case 3:
      steem.api.getDiscussionsByPromoted({
        "tag": tag,
        "limit": 10
      }, function(err, result) {
        setValues(err, result, 0);
      });
      $("#btn-a").unbind();
      $("#btn-a").bind("click", function() {
        console.log("p clicked");
        steem.api.getDiscussionsByPromoted({
            "tag": tag,
            "limit": 10,
            "start_permlink": window.permlink,
            "start_author": window.author
          },
          function(err, result) {
            setValues(err, result, 1);
          });
      });
      break;
  }
}

function setValues(err, result, post) {
  // vm is used to get either the function is called from showing first posts or next...
  if (post == 0) {
    $('.collection').empty();
  }
  for (i = 0; i < result.length - 1; i++) {
    //Looking for image, if existed then use the first of the post and if not then the use defined image.
    let imageUrl = JSON.parse(result[i].json_metadata);
    let image = "https://48tools.com/wp-content/uploads/2015/09/shortlink.png";
    if (imageUrl.hasOwnProperty('image')) {
      console.log("Has property image");
      if (imageUrl.image[0] !== "") {
        image = imageUrl.image[0];
      } else {
        image = "https://48tools.com/wp-content/uploads/2015/09/shortlink.png";
      }
    }
    // Replace if any html tag occur in post
    let bodyContent = result[i].body;
    let prefined = bodyContent.replace(/(<([^>]+)>)/g, "");
    //Append <ul> tag body with proper steem post image, title and description.
    $(".collection").append("<li class='collection-item avatar'> \
    <a href='http://steemit.com" + result[i].url + "' style='color: inherit;'> \
    <img src='" + image + "' alt='' class='circle'> \
    <span class='title' style='font-weight:bold;'>" + result[i].root_title + "</span> \
    <p class='truncate'>" + prefined + "</p> \
    </a> \
    </br>\
  </li>");
  }
  window.permlink = result[i].permlink;
  window.author = result[i].author;
}
