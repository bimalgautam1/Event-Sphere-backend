import { NextFunction, Request, Response } from "express";
import { error } from "winston";

const errorHandeling = (fn:(req:Request,res:Response,next:NextFunction)=>Promise<any>|void)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        try {
            const result = fn(req,res,next)
            if(result instanceof Promise){
                
                result.catch((err) => next(err));
            }
        } catch (err) {
            next(err)
        }
    }
}
export default errorHandeling
