import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./Routes/Authroutes.js";
import MessageRoutes from "./Routes/MessageRoutes.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
// To enable cors
app.use(cors());
// To read the recieved data in JSON
app.use(express.json());

// for direction from browser to this folder
app.use("/uploads/recordings", express.static("uploads/recordings"));

app.use("/uploads/images", express.static("uploads/images"));

// Now we registered our router in URL with this api/auth so,  we can use all our "router" routes and same for messgaeRoutes
app.use("/api/auth", router);
app.use("/api/messages", MessageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server us running on http://localhost:${process.env.PORT}`);
});

// Creating the server for socket.io to interact with frontEnd by using URL of clientSide
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// This is state that each entry only one time no repeated things we will be storing here userId
global.onlineUsers = new Map(); // Data Srtucture MAP

io.on("connection", (socket) => {
  console.log("Connection Successfull");
  global.chatSocket = socket;

  // here userId will be coming from frontend when this "add-user" event calls
  socket.on("add-user", (userId) => {
    // Now we are storing the userId & socket.id which both is unique & because onlineUsers have a Map() so, same id of either user or socket.id will not be here
    onlineUsers.set(userId, socket.id);
    // console.log(onlineUsers);
  });

  // This event will send msg & emit the recieve too when user send msg
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      // If reciever user is online because onlineUsers has id of receiver user
      socket.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
    }
  });

  // This will pick the event of outgoing-voice-call data is coming from VoiceCall.jsx & then in response to this event we are emitting an event with the data of from, roomId, callType to the user who's id in 'data.to' to frontEnd
  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  // This is same as a voiceCall event but it is for videoCall
  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  // This is for accepting the call of both types voice as well as videocall
  socket.on("accept-incoming-call", ({ id }) => {
    const sendUserSocket = onlineUsers.get(id);
    socket.to(sendUserSocket).emit("call-accepted");
  });

  // This event is for reject the voice call
  socket.on("reject-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.from); // We have given here data.from means logged in user so, whenever this event is called it will be notify the user who made the call that call is rejected by user you were talking to.
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  });

  // Rejection for video Call
  socket.on("reject-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.from); // We have given here data.from means logged in user so, whenever this event is called it will be notify the user who made the call that call is rejected by user you were talking to.
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected"); // On rejection emit this event to the sendUserSocket
    }
  });
});
