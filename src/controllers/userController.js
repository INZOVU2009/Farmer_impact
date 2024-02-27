import { Op } from "sequelize";
import Users from "../models/rtc_users";
import userValidationSchema from "../validations/userValidations";
import loginValidationSchema from "../validations/loginValidation";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { generateRandomString } from "../helpers/randomStringGenerator";
import * as dotenv from "dotenv";
import generateToken from "../helpers/generateToken";
dotenv.config();

class UserController {
  //user creation/signup/adding or registering a user
  static async createUser(req, res) {
    try {
      console.log(req.body);
      const { error } = userValidationSchema.validate(req.body);

      if (error)
        return res.status(400).json({
          status: "fail",
          validationError: error.details[0].message,
        });

      const checkduplicatedEmail = await Users.findOne({
        where: {
          [Op.or]: [{ Email: req.body.Email }, { Phone: req.body.Phone }],
        },
      });
      console.log(checkduplicatedEmail);
      if (checkduplicatedEmail) {
        return res.status(400).json({
          status: "fail",
          message: `User with ${req.body.Email} already exist`,
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const __kp_User = generateRandomString(32);
      const _kf_Location = generateRandomString(32);
      console.log("__kp_User:", __kp_User);
      console.log("_kf_Location:", _kf_Location);

      const user = new Users({
        status: 0,
        __kp_User: __kp_User,
        _kf_Location: _kf_Location,
        Name_Full: req.body.Name_Full,
        Name_User: req.body.Name_User,
        Role: req.body.Role,
        z_recCreateAccountName: req.body.z_recCreateAccountName,
        z_recCreateTimestamp: req.body.z_recCreateTimestamp,
        z_recModifyAccountName: req.body.z_recModifyAccountName,
        z_recModifyTimestamp: req.body.z_recModifyTimestamp,
        Phone: req.body.Phone,
        Phone_Airtime: req.body.Phone_Airtime,
        Email: req.body.Email,
        devicename: req.body.devicename,
        last_update_at: req.body.last_update_at,
        password: hashedPassword,
      });
      await user.save();

      res.status(200).json({
        status: "success",
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "Fail",
        message: error.message,
      });
      console.log(error);
    }
  }

  // update user

  static async updateUser (req,res){
    try{
const userId = req.params.userId
console.log("user is", userId)

const user = await Users.findOne({
  where: { id: userId },
});
if(!user)
{
  return res.status(404).json({
    status:"fail",
    message:`User with ID ${userId} not found`
  })
}


const hashedPassword = await bcrypt.hash(req.body.password, 10);
const __kp_User = generateRandomString(32);
const _kf_Location = generateRandomString(32);
await user.update({
  status: 0,
  __kp_User: __kp_User,
  _kf_Location: _kf_Location,
  Name_Full: req.body.Name_Full,
  Name_User: req.body.Name_User,
  Role: req.body.Role,
  z_recCreateAccountName: req.body.z_recCreateAccountName,
  z_recCreateTimestamp: req.body.z_recCreateTimestamp,
  z_recModifyAccountName: req.body.z_recModifyAccountName,
  z_recModifyTimestamp: req.body.z_recModifyTimestamp,
  Phone: req.body.Phone,
  Phone_Airtime: req.body.Phone_Airtime,
  Email: req.body.Email,
  devicename: req.body.devicename,
  last_update_at: req.body.last_update_at,
  password: hashedPassword,

})
res.status(200).json({
  status: "success",
  message: "User updated successfully",
  data: user,
});

    }catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
      console.log(error);
    }
  }
  //get all users from users table
  static async getAllUsers(req, res) {
    try {
      const users = await Users.findAll();
      console.log("users", users.length);
      if (!users || users.length === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "No users found" });
      }
      return res.status(200).json({ status: "success", data: users });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }

  // get a single user by if

  static async getSingleUser (req,res){
    try{
      const userId = req.params.userId
      console.log("user is", userId)
      
      const user = await Users.findOne({
        where: { id: userId },
      });
      if(!user)
      {
        return res.status(404).json({
          status:"fail",
          message:`User with ID ${userId} not found`
        })
      }
      return res.status(200).json({
        status:"Success",
        message:"User retrieved successfully",
        data:user
      })
    }catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
      console.log(error);
    }    

  }
  //logging in with username and password
  static async login(req, res) {
    try {
      const { error } = loginValidationSchema.validate(req.body);

      if (error)
        return res.status(400).json({
          status: "fail",
          message: error.details[0].message,
        });
      const appLogin = req.query.appLogin || 0; //appLogin = 1 if user logs in from the app

      const user = await Users.findOne({
        where: { Name_User: req.body.Name_User },
      });
      console.log("user name", req.body.Name_User);
      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid username",
        });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log("password", req.body.password);
      console.log("user password", user.password);
      console.log("valid", validPassword);

      if (!validPassword) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid  password",
        });
      }

      // create token

      // const token = Jwt.sign(
      //   {
      //     user: {
      //       Name_User: user.Name_User,
      //       Name_Full: user.Name_Full,
      //       Role: user.Role,
      //       id: user.id,
      //       Email: user.Email,
      //     },
      //   },
      //   process.env.JWT_SECRET,
      //   {
      //     /* if app users logs in token expires in 6 months[180d], else 2 days[2d] */
      //     expiresIn:
      //       appLogin === 0
      //         ? process.env.TKN_EXPIRY_WEB
      //         : process.env.TKN_EXPIRY_APP,
      //   }
      // );
const token = generateToken(user,appLogin)
console.log("token",token)
      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        token: token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "fail",
        message: err.message,
      });
    }
  }
}

export default UserController;
