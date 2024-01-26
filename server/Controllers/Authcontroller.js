import getPrismaInstance from "../Utils/PrismaClient.js";
import { generateToken04 } from "../Utils/TokenGenerator.js";

// This CheckEmail function is for to check the if user exists in our database & prior to that we check if email is sent through body or not
export const CheckEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {
      const prisma = getPrismaInstance();
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(200).json({ success: false, msg: "User not exist" });
      } else {
        return res.status(200).json({ success: true, user, msg: "User Found" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, msg: "Email not found & it is required" });
    }
  } catch (err) {
    next(err);
    console.error(err);
  }
};

// This function here will create a account for new user who redirected toward the Onboard page
export const OnBoardUser = async (req, res, next) => {
  try {
    const { email, name, profilePhoto, about } = req.body;
    if (!email || !name || !profilePhoto) {
      return res
        .status(200)
        .json({ success: false, msg: "Email, Name, Photo required" });
    }
    const prisma = getPrismaInstance();

    const usercreate = await prisma.user.create({
      data: {
        email,
        name,
        about,
        profilePhoto,
      },
    });
    return res.status(201).json({ success: true, msg: usercreate });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      // This will give the user by ascending order
      orderBy: { name: "asc" },
      // This is where we select which fields we want from DB
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
        about: true,
      },
    });

    // Now we are creating a object of users acc. to their name first letter

    // like: userGroupedByFirstLetter = {
    //        A:[{name:Ashu, etc. },{name: Ashiana, etc.}],
    //        B:[{name:Barbie, etc.}],
    //        H:[{name:Harsh, etc.}]
    //        }

    const userGroupedByFirstLetter = {};
    users.forEach((user) => {
      const FirstLetter = user.name.charAt(0).toUpperCase(); // First we are getting the capital First letter of user name from object & we will set this letter as a key of object
      if (!userGroupedByFirstLetter[FirstLetter]) {
        // Then if that key means that letter of user name is not present in object as a key
        userGroupedByFirstLetter[FirstLetter] = []; // then just create that key which is of name first letter & assign a array because we will be storing all user who's name first letter matches the key in this array
      }
      userGroupedByFirstLetter[FirstLetter].push(user); // and Once the key is formed then in that key pushes the user object
    });

    return res.status(200).json({ userGrouped: userGroupedByFirstLetter });
  } catch (error) {
    next(error);
    console.error(error);
  }
};

export const generateToken = async (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_ID;
    const userId = req.params.userId;
    const effectiveTime = 3600;
    const payload = "";
    if (appId && serverSecret && userId) {
      const token = await generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );
      return res.status(200).json({ success: true, token });
    }
    return res.status(400).json({
      success: false,
      msg: "userId && appId && serverSecret is required",
    });
    // generateToken04;
  } catch (error) {
    console.log(error);
    next(error);
  }
};
