import bcrypt from 'bcrypt'
import { Request,Response } from 'express'
import User from '../database/models/userModel'
import generateOpt from '../services/generateOtp'
import generateToken from '../services/generateToken'
import { IsEmail } from 'sequelize-typescript'
import sendmail from '../services/sendMail'
import sendResponse from '../services/sendResponse'
import findData from '../services/findData'
import checkOtpExpire from '../services/chechOtpExpire'

class userController{
    static async register(req:Request,res:Response){
        const {username, email, password,role} = req.body

        try {
            if(!username || !email || !password){
                res.status(404).json({
                    message : "Some Fields are empty"
                })
            };
            const user = await User.findOne({  
                where:{
                    email : email,
                    username : username
                }
            });
            if(user){
                res.status(409).json({
                    message : "User already registered"
                });
                return
            };

            const newuser = await User.create({
                username,
                email,
                password : bcrypt.hashSync(password,14),
                isFirstLogin : true,
                role
            });
            res.status(201).json("User Registered")
            

        } catch (error) {
            res.status(400).json({
                message : "Something went wrong",
                error : error
            });
        }
    }
    static async login(req:Request,res:Response){
        const {email,password} = req.body;
        if(!email || !password){
            res.status(400).json({
                message : "Please provide a valid email address and password. ",
            })
            return
        }

        const user =  await User.findOne({
                where :{
                    email : email
                }
            })
       if(!user){
        res.status(400).json({message : "Email not found"})
       }
       else{
            const isEqual = bcrypt.compareSync(password,user.password)
            if(!isEqual) {
                res.status(400).json({message : "Check your email and password"})
                return
            }
            else{
                try {
                    const token = generateToken(user.id)
                    res.status(200).json({
                    message : "Login successfully",
                    token : token
                })
                }
                catch (error) {
                    res.status(400).json({message : "Error while login", error})
                }    
                }
            }
       }
    static async forgetPassword(req:Request, res:Response){
        const {email} = req.body;
        if(!email) res.status(400).json({message : "Email not Found"})

        const user = await User.findOne({
            where :{
                email : email
            }
        })
        if(!user) res.status(200).json({message : "User maynot be registered, try registering first"});

        else{
            try {
                const otp = generateOpt();
                await sendmail({
                to : email,
                subject : "This is test otp",
                text : `This is your otp ${otp}. Thank you.`
            })
            res.status(200).json({message : "Otp sent to user"})
            } catch (error) {
                console.log(`Error while Forgetpassword ${error}`);
                res.status(500).json({message : "Something went wrong. Please, Try again later"})
                return
            }
        }
    }
    static async verifyOtp(req:Request, res:Response){
        const {otp,email} = req.body

        if(!otp || !email){
            sendResponse(res,400,"Please provide email and otp")
            return
        }
        
        const user = await User.findAll({
            where :
            {
                email : email
            }
        })
        if(!user){
            sendResponse(res,404,"No user with that email")
            return
        }
        //otp verification\
        const [data] = await findData(User,email )
        if(!data){
            sendResponse(res,400,"Invalid OTP")
            return
        }
        const curerntTime = Date.now()
        const otpGeneratedTime = data.otpGeneratedTime
        checkOtpExpire(res,otpGeneratedTime,120000)
    }
    static async resetPassword(req : Request, res:Response){
        const {newPassword,confirmPassword,email,otp} = req.body

        if(!newPassword || !confirmPassword || !email || !otp){
            sendResponse(res,400, "Please provide newPassword,confirmPassword, email, otp")
            return
        }
        if(newPassword!==confirmPassword){
            sendResponse(res,400,"Password didnot match")
            return
        }
        const user = await findData(User,email)
        if(!user){
            sendResponse(res,400,"No email with that user")
            return
        }
        user.password = bcrypt.hashSync(newPassword,12)
        await user.save()
        sendResponse(res,200,"Password Updated successfully")

    }
    }
    


export default userController