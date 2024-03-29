var socket = io();
// listen for server connection
// get query params from url
var name = getQueryVariable("name") || "Anonymous";
var room = getQueryVariable("room") || "No Room Selected";

$(".room-title").text(room);
// fires when client successfully conencts to the server
socket.on("connect", function () {
  console.log("Connected to Socket I/O Server!");
  console.log(name + " wants to join  " + room);
  // to join a specific room
  socket.emit("joinRoom", {
    name: name,
    room: room,
  });
});

// below code is to know when typing is there
var timeout;

function timeoutFunction() {
  typing = false;
  socket.emit("typing", {
    text: "",
  });
}

//If key is pressed typing message is seen. If nothing is pressed after 2 seconds the message disapears
$("#messagebox").keyup(function () {
  console.log("happening");
  typing = true;
  $("#icon-type").removeClass();
  socket.emit("typing", {
    text: name + " is typing ...",
  });
  clearTimeout(timeout);
  timeout = setTimeout(timeoutFunction, 1000);
});

//Checking for page visibility api
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
  hidden = "mozHidden";
  visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

//Listening for the typing event
socket.on("typing", function (message) {
  $(".typing").text(message.text);
});

socket.on("userSeen", function (msg) {
  var icon = $("#icon-type");
  icon.removeClass();
  icon.addClass("fa fa-check-circle");
  if (msg.read) {
    //user read the message
    icon.addClass("msg-read");
  } else {
    // message deleiverd but not read yet
    icon.addClass("msg-delieverd");
  }
  console.log(msg);
  //}
});

//setup for custom events
socket.on("message", function (message) {
  console.log("New Message !");
  console.log(message.text);
  // insert messages in container
  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>');

  var momentTimestamp = moment.utc(message.timestamp).local().format("h:mm A");
  $message.append(
    "<strong>" + momentTimestamp + " - " + message.name + "</strong>"
  );
  $message.append("<p>" + message.text + "</p>");
  $messages.append($message);
  // handle autoscroll
  // manage autoscroll
  var obj = $("ul.messages.list-group");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength - offset.top,
  });

  // Tries to notify the user, only when they have not opened the  chat view
  if (document[hidden]) {
    notifyMe(message);
    // also notify server that user has not seen messgae
    var umsg = {
      text: name + " has not seen message",
      read: false,
    };
    socket.emit("userSeen", umsg);
  } else {
    //Notify the server that the user has seen message
    var umsg = {
      text: name + " has seen message",
      read: true,
      user: name,
    };
    socket.emit("userSeen", umsg);
  }
});

// handles submitting of new message
var $form = $("#messageForm");
var $message1 = $form.find("input[name=message]");
$form.on("submit", function (event) {
  event.preventDefault();
  var msg = $message1.val();
  //prevent js injection attack
  msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
  if (msg === "") return -1; //empty messages cannot be sent

  socket.emit("message", {
    text: msg,
    name: name,
  });
  // show user messageForm
  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>');

  var momentTimestamp = moment().format("h:mm A");
  $message.append("<strong>" + momentTimestamp + " - " + name + "</strong>");
  $message.append(
    $("<p>", {
      class: "mymessages",
      text: $message1.val(),
    })
  );
  $messages.append($message);
  $message1.val("");
  // manage autoscroll
  var obj = $("ul.messages.list-group");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength - offset.top,
  });
});

// notification message
function notifyMe(msg) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification, try Chromium!");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Chat App", {
      body: msg.name + ": " + msg.text,
      icon: "/images/apple-icon.png",
    });
    notification.onclick = function (event) {
      event.preventDefault();
      this.close();
      // assume user would see message so broadcast userSeen event
      var umsg = {
        text: name + " has seen message",
        read: true,
        user: name,
      };
      socket.emit("userSeen", umsg);
    };
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Chat App", {
          body: msg.name + ": " + msg.text,
          icon: "/images/apple-icon.png",
        });
        notification.onclick = function (event) {
          event.preventDefault();
          this.close();
          var umsg = {
            text: name + " has seen message",
            read: true,
            user: name,
          };
          socket.emit("userSeen", umsg);
        };
      }
    });
  }
}
