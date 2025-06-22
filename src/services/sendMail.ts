import { transport } from "winston";
import envConfig from "../config/config";
import nodemailer from 'nodemailer'

interface Idata{
    to : string,
    subject : string,
    text : string
    // html : string
}

const sendmail = async(data : Idata) =>{
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth :{
        user : envConfig.sentmail,
        pass : envConfig.sendmail_password
    }
    })
    
 
const sendmailoptions = {
    from : 'Bimal Gautam <gbimal3210@gmail.com>',
    to : data.to,
    subject : data.subject,
    text : data.text,
    // html : data.html
}
try {
    await transporter.sendMail(sendmailoptions)
} catch (error) {
    console.log(`Error while sending message ${error}`)
}
}

export default sendmail