var PORT = process.env.PORT || 3000; // take port from heroku or for loacalhost
var express = require("express");
var app = express(); // express app which is used boilerplate for HTTP
var http = require("http").Server(app);

//moment js
var moment = require("moment");

var clientInfo = {};

//socket io module
var io = require("socket.io")(http);

// expose the folder via express thought
app.use(express.static(__dirname + "/public"));

// send current users to provided socket
function sendCurrentUsers(socket) {
  // loading current users
  var info = clientInfo[socket.id];
  var users = [];
  if (typeof info === "undefined") {
    return;
  }
  // file name based on rooms
  Object.keys(clientInfo).forEach(function (socketId) {
    var userinfo = clientInfo[socketId];
    // check if user room and selcted room same or not
    // as user should see names in only his chat room
    if (info.room == userinfo.room) {
      users.push(userinfo.name);
    }
  });
  // emit message when all users list

  socket.emit("message", {
    name: "System",
    text: "Current Users : " + users.join(", "),
    timestamp: moment().valueOf(),
  });
}

// io.on listens for events
io.on("connection", function (socket) {
  // console.log("User is connected");

  //for disconnection
  socket.on("disconnect", function () {
    var userdata = clientInfo[socket.id];
    if (typeof (userdata !== undefined)) {
      socket.leave(userdata.room); // leave the room
      //broadcast leave room to only memebers of same room
      socket.broadcast.to(userdata.room).emit("message", {
        text: userdata.name + " has left",
        name: "System",
        timestamp: moment().valueOf(),
      });
      console.log(userdata.name + " has left the chat");

      // delete user data-
      delete clientInfo[socket.id];
    }
  });

  // for private chat
  socket.on("joinRoom", function (req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    //broadcast new user joined room
    socket.broadcast.to(req.room).emit("message", {
      name: "System",
      text: req.name + " has joined",
      timestamp: moment().valueOf(),
    });
    console.log(req.name + ' has connected to chat room "' + req.room + '"');
  });

  // to show who is typing Message

  socket.on("typing", function (message) {
    // broadcast this message to all users in that room
    socket.broadcast.to(clientInfo[socket.id].room).emit("typing", message);
  });

  // to check if user seen Message
  socket.on("userSeen", function (msg) {
    socket.broadcast.to(clientInfo[socket.id].room).emit("userSeen", msg);
    //socket.emit("message", msg);
  });

  socket.emit("message", {
    text: "Welcome to NuanceLite !",
    timestamp: moment().valueOf(),
    name: "System",
  });

  // listen for client message
  socket.on("message", function (message) {
    console.log(
      clientInfo[socket.id].room +
        " - " +
        clientInfo[socket.id].name +
        " : " +
        message.text
    );
    // to show all current users
    if (message.text === "@currentUsers") {
      sendCurrentUsers(socket);
    } else {
      //broadcast to all users except for sender
      message.timestamp = moment().valueOf();
      //socket.broadcast.emit("message",message);
      // now message should be only sent to users who are in same room
      socket.broadcast.to(clientInfo[socket.id].room).emit("message", message);
    }
  });
});
http.listen(PORT, function () {
  console.log("server started");
});
