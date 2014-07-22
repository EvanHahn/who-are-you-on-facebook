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
  var $loading = $("#loading");
  var $userlist = $("#userlist");
  var $iframeland = $("#iframeland");

  $loading.hide();

  $("form").on("submit", function(event) {

    event.preventDefault();

    var id = randomString();

    $iframeland.children().remove();

    var usernames = $input.val().split(/\s|,/g);

    var currentIndex = 0;
    var next = function() {
      var iframe = document.createElement("iframe");
      iframe.src = "/test?id=" + id + "&user=" + usernames[currentIndex];
      iframe.style.display = "none";
      iframe.onload = function() {
        $(iframe).remove();
        currentIndex ++;
        if (currentIndex < usernames.length) {
          next();
        } else {
          done();
        }
      };
      $iframeland.append(iframe);
    };
    next();

    var done = function() {
      var ajax = $.get("/results", { id: id }, function(data) {

        $userlist.children().remove();

        $.each(data, function(username, isLoggedIn) {
          var li = document.createElement("li");
          if (isLoggedIn) {
            var body = document.createElement("strong");
            body.innerHTML = username + " is logged in";
            li.appendChild(body);
          } else {
            li.innerHTML = username + " is not logged in";
          }
          $userlist.append(li);
        });

      });

      ajax.always(function() {
        $submit.attr("disabled", false);
        $loading.hide();
      });
    };

    $submit.attr("disabled", true);
    $loading.show();

  });

});
