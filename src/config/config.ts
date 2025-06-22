import {config} from 'dotenv'
config()

const envConfig = {
    
    port : process.env.PORT,
    database_url : process.env.DATABASE_URL,
    secret_key : process.env.SECRET_KEY as string,
    expries_in : process.env.EXPRIES_IN,
    sentmail : process.env.send_mail,
    sendmail_password : process.env.mail_password,
    admin_email : process.env.admin_email,
    admin_password : process.env.admin_password as string
}

export default envConfig