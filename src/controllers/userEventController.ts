
import { Request,Response } from "express";
import sendResponse from "../services/sendResponse";
import Event from "../database/models/eventModel";
import User from "../database/models/userModel";
import UserEventRegister from '../database/models/userEventRegister'
import {IExtendedRequest} from '../middleware/userMiddleware';
import { paymentMethod } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from "axios"
import envConfig from "../config/config";
// interface IRequest extends Request{
//     user:{
//         id:string,
//     }
// }

class UserEventController{

    //user register for a event
    async eventRegister(req:IExtendedRequest, res:Response):Promise<void>{
        const userId = req.user?.id
        const {eventId, PaymentMethod } = req.body

        if(!userId || !eventId||!PaymentMethod){
            sendResponse(res,400,"Provide with UserId , EventId and Payment Method")
            return
        }
        // console.log(userId,eventId)
        const userdata = await User.findOne({
            where:{
                id:userId
            },
            include:[{
                model:Event,
                where : {id:eventId}
            }]
        })

        if(userdata){
            sendResponse(res,400,"User may not be registered or event is not created")
            return
        }
        //toget data to check if user is already registered or not 
        const userEventdata = await UserEventRegister.findOne({
            where:{
                userId,eventId
            }
        })
        //if user have already registered the event
        if(userEventdata){
            sendResponse(res,200,"User already registered")
        }
        //find the price of event
        const event = await Event.findOne({
            where:{id : eventId}
        })
        if(event==null){
            sendResponse(res,400,"Event not found")
        }
        
        // const eventData = event as Event;
        // if(eventData.price!==0){
        //     const price = eventData.price *100

        //     if(PaymentMethod=="khalti"){
        //         const data = {
        //             return_url : "http://localhost/3000",
        //             website_url:"http://localhost/3000",
        //             amount : price,
        //             purchase_order_id: eventId,
        //             purchase_order_name : 'order_'+eventData.title   
        //         }
                // const response = await axios("https://dev.khalti.com/api/v2/epayment/initiate/",data,{
                //     headers:{Authorization: envConfig.}
                // })
                sendResponse(res,403,"User have already registered that event")   
        }
        
    
    //user cancel the event
    async cancelRegister(req: IExtendedRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        const { eventId } = req.body;
    
        if (!userId || !eventId) {
            sendResponse(res, 400, "Provide both UserId and EventId");
            return;
        }
    
        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            sendResponse(res, 400, "User may not be registered");
            return;
        }
    
        // Check if the user is registered for the event
        const userEventData = await UserEventRegister.findOne({
            where: { userId, eventId }
        });
    
        if (!userEventData) {
            sendResponse(res, 400, "User may not have registered for this event");
            return;
        }
    
        // Get event details
        const eventData = await Event.findOne({
            where: { id: eventId } // Ensure correct column name
        });
    
        if (!eventData || !eventData.date) {
            sendResponse(res, 404, "Event not found or event date is missing");
            return;
        }
    
        // Ensure event.date is a valid Date
        const eventDate = new Date(eventData.date);
        const currentTime = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
        // Check if the event is more than 1 day away
        if (eventDate.getTime() - currentTime.getTime() <= oneDayInMs) {
            sendResponse(res, 400, "You can only cancel an event at least 24 hours before it starts");
            return;
        }
    
        // Proceed with cancellation
        await UserEventRegister.destroy({
            where: { userId, eventId }
        });
    
        sendResponse(res, 200, "Event has been cancelled successfully");
    }
    
    //user can see all the events
    async getAllEvents(req:IExtendedRequest,res:Response):Promise<void>{
        const datas = await Event.findAll({attributes:['title','description','price','date','image_url'], raw:true})
        if(datas.length===0){
            res.status(404).json({
                message:"Event not found"
            })
            return
        }
        res.status(200).json({
            message:"Event Found",
            datas
        })
    }
    //user send request to see one event
    async getOneEvent(req:IExtendedRequest,res:Response):Promise<void>{
        const {eventId} = req.body
        const datas = await Event.findOne({
            where:{
                id:eventId
            }
        })
        if(!datas){
            sendResponse(res,400,"Event not found")
            return
        }
        res.status(200).json({
            message:`Data retrived`,
            datas
        })
    }
}
export default new UserEventController

