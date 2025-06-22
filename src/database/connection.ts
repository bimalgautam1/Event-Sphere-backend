import { BelongsTo, ForeignKey, Sequelize } from "sequelize-typescript";
import {config} from "dotenv"
import envConfig from "../config/config";
import User from './models/userModel'
import UserEventRegister from './models/userEventRegister'
import Event from "./models/eventModel";
import Category from "./models/categoryModel";
import Payment from "./models/paymentModel";


config()
const sequelize = new Sequelize(envConfig.database_url as string, {
    dialect: "postgres",
    // models : [__dirname + '/models'],  // ✅ Register models
    models: [User, Event,UserEventRegister, Category],
    logging: false,  // ✅ Disable logging unless debugging
});
Event.belongsTo(User, { foreignKey: "organizerId" });  // ✅ Correct
User.hasMany(Event, { foreignKey: "organizerId" });    // ✅ Correct


UserEventRegister.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserEventRegister, { foreignKey: 'userId' });

UserEventRegister.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(UserEventRegister, { foreignKey: 'eventId' });

UserEventRegister.belongsTo(Category, {foreignKey:'categoryId'});
Category.hasMany(UserEventRegister, {foreignKey:'categoryId'});

Event.belongsTo(Category,{foreignKey:"categoryId"});
Category.hasMany(Event,{foreignKey:"categoryId"});


//For payment and userregister 
// Payment.belongsTo(UserEventRegister,{
//     foreignKey:"userRegisterId",
//     onDelete:"CASCADE"
// })
// UserEventRegister.hasOne(Payment,{foreignKey:"userRegisterId"})


export default sequelize 