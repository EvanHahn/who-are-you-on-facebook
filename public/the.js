$("html").removeClass("noscript");

var ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomString() {
  var result = "";
  for (var i = 0; i < 30; i ++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

$(function() {

  var $input = $("input[name=users]");
  var $submit = $("input[type=submit]");
  var $userlist = $("#userlist");
  var $iframeland = $("#iframeland");

  $("form").on("submit", function(event) {

    event.preventDefault();

    var id = randomString();

    $iframeland.children().remove();

    var usernames = $input.val().split(/\s|,/g);
    var leftToLoad = usernames.length;

    var iframeLoaded = function() {
      leftToLoad --;
      if (leftToLoad === 0) {

        var ajax = $.get("/results", { id: id }, function(data) {

          $userlist.children().remove();

          var positives = 0;

          $.each(data, function(username, isLoggedIn) {
            var li = document.createElement("li");
            if (isLoggedIn) {
              var body = document.createElement("strong");
              body.innerHTML = username + " is logged in";
              li.appendChild(body);
              positives ++;
            } else {
              li.innerHTML = username + " is not logged in";
            }
            $userlist.append(li);
          });

        });

        ajax.always(function() {
          $submit.attr("disabled", false);
        });

      }
    };

    usernames.forEach(function(username) {

      var iframe = document.createElement("iframe");
      iframe.src = "/test?id=" + id + "&user=" + username;
      iframe.onload = iframeLoaded;
      iframe.style.display = "none";
      $iframeland.append(iframe);

    });

    $submit.attr("disabled", true);

  });

});
