import { User } from "../models/user.model.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { generateTokenAndCookie } from "../utils/generateTokenAndCookie.js"
import { sendVerificationEmail,sendWelcomeEmail } from "../mailtrap/emails.js"
export const signup = async (req,res)=>{
    const {email,password,name} = req.body
    try {
        if (!email || !password || !name) throw new Error("Touts les champs sont obligatoires")
        const userAlreadyExists = await User.findOne({email})
        
        if (userAlreadyExists) return res.status(400).json({success:false, message:"User already exists"})
        const hashedPassword = await bcrypt.hash(password,10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 *60 * 60 *1000
        })
        await user.save()
        generateTokenAndCookie(res,user._id)
        await sendVerificationEmail(user.email,verificationToken)
        res.status(201).json({
            success:true,
            message : "user est crée",
            user : {
                ...user._doc,
                password:undefined,
            },
        })
        

    } catch (error) {
        
    }
}

export const verifyEmail = async (req,res) =>{
    const {code} = req.body

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })
        if (!user) return res.status(400).json({success:false,message:"Invalid code"})
        
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()

        await sendWelcomeEmail(user.email , user.name)
        res.status(200).json({
            sucess:true,
            message:"Email verified successfully",
            uder:{
                ...user._doc,
                password:undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body

    try {
        const user = await user.findOne({email})
        if (!user) return res.status(400).json({success:false,message:"Invalid informations"})
        const isPwdValid = await bcrypt.compare(password,isPwdValid)
        if (!isPwdValid) return res.status(400).json({
            success:false,
            message:"Invalid informations"
        })
        generateTokenAndCookie(res,user._id)
        user.lastLogin = new Date()
        await user.save()

        res.status(200).json({
            success:true,
            message: "Logged in successfully",
            user:{
                ...user._doc,
                password:undefined,
            },
        })

    } catch (error) {
        console.log("Error", error);
        res.status(400).json({success:false,message:error.message})
    }
}

export const logout = async (req,res)=>{
    res.clearCookie("token")
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
}

export const forgotPassword = async (req,res) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email})
    } catch (error) {
        if (!user) return res.status(400).json({success : false,
          message:"user not found"  
        })

        //reset token
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() +1*60*60*1000

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save()

        await sendPasswordResetEmail(user.email,`http://localhost:5173/reset-password/${resetToken}`)
    }

}