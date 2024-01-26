import getPrismaInstance from "../Utils/PrismaClient.js";
import { renameSync } from "fs";

// This function is to add the message in DB acc. to user who sent & who recieved
export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    // here "to" = means where are sending the message, from = User who is sending
    const { message, from, to } = req.body;
    // Here getUser will take if "to" is online
    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          // It's just a text we are sending
          message,

          // from = It's holding the id of the logged in user because he will be the one who is sending the message,
          // to = It's holding the id of user whom with the logged in user chatting in this case is "currentChatUser" from global state in frontend
          sender: { connect: { id: from } }, // sender will hold the object of user who's id matches with this "from" here we are sending the (userInfo.id) from global state

          reciever: { connect: { id: to } }, // reciever will hold the object of user who's id matches with this "to" here we are sending the (currentChatUser.id) from global state

          //   If the user who is receiving the msg is online then show delivered to user who is sending else show sent
          messageStatus: getUser ? "Delivered" : "Sent",
        },
        // It means we want both object
        include: { sender: true, reciever: true },
      });
      return res.status(201).json({ success: true, newMessage });
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "from, to & message is required" });
    }
  } catch (error) {
    next(error);
    console.error(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();

    const { from, to } = req.params;

    const messages = await prisma.messages.findMany({
      /*
 from = userInfo.id means sender's id,   to = currentChatuser.id means reciever's id
 
 when "from" send the message to "to" then we are getting all messages from Messages model field senderId which matches with "from" & "to" with recieverId. Because when we are saving the messages in above function we are also saving the id of user wh is sending in senderId & who is recieving in recieverId.

 So, if those id match with the "from"/"to" then we will get their all messages which they had saved in DB with their id


 */

      where: {
        // Because we want to get the messages from both user like (sender to reciever || reciever to sender) and we are using OR here because it's not compulsary that reciever always reply what if he is not replying so, he will not have any messages
        OR: [
          // Here we are getting all messages from sender to reciever
          {
            senderId: from,
            receiverId: to,
          },
          // Here we are getting all messages from reciever to sender means when he replies
          {
            senderId: to,
            receiverId: from,
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });

    const unReadMessagesId = [];

    messages.forEach((message, i) => {
      /*  means if messageStatus is "send" or "delivered" but not read & the reciever whom we send the msg
      Means agr reciever msg bhej rha hai & uske pass agr koi msg hai jiska status "read" nhi hai uska status "read" krdo & un sbhi msg ki id ek array mai push krdo because we will use that array in query to update the messageStatus to read of those messages who's id match with the id in this array because this array only have id of those messages who's status is not read
      */

      if (message.senderId === to && message.messageStatus !== "read") {
        message.messageStatus = "read";
        unReadMessagesId.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: {
        id: { in: unReadMessagesId }, // Here we are filter those message which we need to update
      },
      data: {
        messageStatus: "read", // here we are updating the status of those messages to read
      },
    });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    if (req.file) {
      const date = Date.now();
      // We are only going to store image file path So, we will save this "filename" as a message in DB
      let filename = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, filename); // It will change the path of file to filename path So, we wre technically storing the images in server side folder
      const { from, to } = req.query;
      if (from && to) {
        const newMessage = await prisma.messages.create({
          data: {
            message: filename, // We are saving image filePath as a message
            sender: { connect: { id: from } },
            reciever: { connect: { id: to } },
            type: "image",
          },
        });
        return res.status(201).json({ success: true, newMessage });
      }
      return res
        .status(400)
        .json({ success: false, msg: "From & to required" });
    }
    return res
      .status(404)
      .json({ success: false, msg: "Image file is required" });
  } catch (error) {
    next(error);
    console.error(error);
  }
};

//
export const addVoiceRecordMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    if (req.file) {
      const date = Date.now();
      // We are only going to store image file path So, we will save this "filename" as a message in DB
      let filename = "uploads/recordings/" + date + req.file.originalname;
      renameSync(req.file.path, filename); // It will change the path of file to filename path So, we wre technically storing the images in server side folder
      const { from, to } = req.query;
      if (from && to) {
        const newMessage = await prisma.messages.create({
          data: {
            message: filename, // We are saving image filePath as a message
            sender: { connect: { id: from } },
            reciever: { connect: { id: to } },
            type: "audio",
          },
        });
        return res.status(201).json({ success: true, newMessage });
      }
      return res
        .status(400)
        .json({ success: false, msg: "From & to required" });
    }
    return res
      .status(404)
      .json({ success: false, msg: "Audio file is required" });
  } catch (error) {
    next(error);
    console.error(error);
  }
};

export const getInitialContactsWithMessages = async (req, res, next) => {
  try {
    const userId = req.params.from;
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sentMessages: {
          include: {
            reciever: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        recievedMessages: {
          include: {
            reciever: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    const messages = [...user.sentMessages, ...user.recievedMessages];
    // console.log(messages);
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const users = new Map();
    const messagesStatusChange = [];
    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.receiverId : msg.senderId;
      if (msg.messageStatus === "Sent") {
        messagesStatusChange.push(msg.id);
      }

      const {
        id,
        type,
        message,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
        sender,
        reciever,
      } = msg;

      if (!users.get(calculatedId)) {
        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
          sender,
          reciever,
        };
        if (isSender) {
          user = {
            ...user,
            ...msg.receiver,
            totalUnreadMessage: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessage: messageStatus !== "read" ? 1 : 0,
          };
        }
        users.set(calculatedId, { ...user });
      } else if (messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessage: user.totalUnreadMessage + 1,
        });
      }
    });

    if (messagesStatusChange.length) {
      await prisma.messages.updateMany({
        where: {
          id: { in: messagesStatusChange }, // Here we are filter those message which we need to update
        },
        data: {
          messageStatus: "Delivered", // here we are updating the status of those messages to read
        },
      });
    }

    return res.status(200).json({
      success: true,
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()), // Here inside onlineUsers is a global variable from index.js which holds the user id
    });
  } catch (error) {
    next(error);
  }
};
