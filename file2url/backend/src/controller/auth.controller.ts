import { Request, Response, NextFunction } from "express";
import { mailSender } from "../utils/mailSender";
import User from "../model/user.model";
import { createToken, verifyToken } from "../utils/jwt.util";
import bcrypt from "bcrypt";
import { generateOtp } from "../utils/otp.util";
export class AuthController {
//   private static otpStore: { [key: string]: string } = {};
static otpStore = {};
static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      username,
      email,
      password,
      // otp
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists, please try another username." });
      return;
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ message: "Email already in use, please try another email." });
      return;
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server error!" });
    }
  }
  

  static async verifyOption(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = req.body.email;
      const otp = req.body.otp;
      if (!email || !otp) {
        res.status(400).json({ success: false, message: "Email and OTP are required." });
        return;
      }

      const storedData = (AuthController.otpStore as any)[email];
      if (!storedData) {
        res.status(404).json({ success: false, message: "No OTP found for this email." });
        return;
      }
      if (storedData.otp !== otp) {
        res.status(400).json({ success: false, message: "Invalid OTP." });
        return;
      }
      if (Date.now() > storedData.expires) {
        delete (AuthController.otpStore as any)[email];
        res.status(400).json({ success: false, message: "OTP has expired." });
        return;
      }
      delete (AuthController.otpStore as any)[email];
    //   const isOtpValid = await this.otpVerification(email, otp);
    // if (this.otpStore[email] && this.otpStore[email] === otp) {
    //     delete this.otpStore[email];
    //   }
    //   delete this.otpStore[email];
    //   if (!isOtpValid) {
    //     res.status(400).json({ message: "Invalid OTP" });
    //     return;
    //   }

      res
        .status(200)
        .json({ message: "OTP verified. Proceeding with registration" });
    } catch (e) {
        res.status(500).json({Success:'false'});
      console.error("error occurred:", e);
      
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, password, rememberMe } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }
  
      const expiry = rememberMe ? "30d" : "1d";
      const token = createToken(user._id.toString(), username, expiry);
      res.status(200).json({
        message: "Login Successful",
        token,
        user: { id: user._id, username: user.username,email:user.email },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  

//   static async otpVerification(email: string, otp: string): Promise<boolean> {
//     // console.log("Received in otpVerification:", email, otp);
//     // console.log("Current otpStore:", this.otpStore);

//     if (this.otpStore[email] && this.otpStore[email] === otp) {
//       delete this.otpStore[email];
//       return true;
//     }
//     delete this.otpStore[email];
//     return false;
//   }

  static async sendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = req.body.email;
      if (!email) {
        res
          .status(400)
          .json({ success: false, message: "Invalid email address." });
        return;
      }
      const otp = generateOtp();
      const subject = "Email-Verification";
      const message = `Your OTP for Email-Verification is ${otp}`;
      await mailSender(email, subject, message);
      (AuthController.otpStore as any)[email] =  {
        otp,
        expiry: Date.now() + 10 * 60 * 1000,
      };
      res.status(200).json({ success: true, message: "Otp send successfully" });
    } catch (error) {
      console.log("error sending otp ", error);
      res.status(500).json({
        success: false,
        message: "An Error Occured",
      });
    }
  }

  static async checkLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
      }
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token:token
      });
    } catch (error) {
      console.log("An error occured", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
