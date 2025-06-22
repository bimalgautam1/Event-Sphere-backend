import jwt from "jsonwebtoken";
import envConfig from "../config/config";

const generateToken = (userId : string)=>{
    if(!envConfig.secret_key){
        throw new Error("Secret key may be missing")
    }
    try {
        const token = jwt.sign({userId:userId}, envConfig.secret_key as string, {
            expiresIn : "10d"
        })
        return token
    } catch (error) {
        console.error(`Token Generation Failes ${error}`)
        throw new Error("Token Generation Failed")
    }
}

export default generateToken
