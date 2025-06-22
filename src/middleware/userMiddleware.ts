import { Request,Response,NextFunction } from "express";
import sendResponse from "../services/sendResponse";
import jwt  from "jsonwebtoken";
import envConfig from "../config/config";
import User from "../database/models/userModel";


export enum Role{
    Organizer = "organizer",
    Attendee = "attendee"
}
export interface IExtendedRequest extends Request{
    user?:User
    // {
    //     username:string,
    //     email : string,
    //     password:string,
    //     id : string,
    //     role: string
    // }
}
class UserMiddleware{
    async isUserLoggedIn(req:IExtendedRequest,res:Response,next:NextFunction):Promise<void>{

        const token = req.headers.authorization

        if(!token){
            sendResponse(res,403,"Token must me provided")
            return;
        }
        jwt.verify(token,envConfig.secret_key, async(err,result:any)=>{
            if(err){
                sendResponse(res,403,"Invalid Token")
            }
            else{
                // console.log(result.userId);
                
                const userData = await User.findByPk(result.userId)
                if(!userData){
                    sendResponse(res,404,"Data not found")
                    return
                }
                req.user = userData
                // console.log(req.user);
                
                next()
            }
        })
    }
    restrictTo(...roles:Role[]){
        return(req:IExtendedRequest,res:Response,next:NextFunction)=>{
            // const extendedReq = req as IExtendedRequest;

            if(!req.user){
                sendResponse(res,403,"You are not logged in!")
                return
            }
            if (!roles.includes(req.user.role as Role)) {
                sendResponse(res, 403, "You do not have permission to perform this action");
                return;
            }
         next()   
        }
    }

}

export default new UserMiddleware