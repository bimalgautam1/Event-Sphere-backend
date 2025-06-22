import { Response, text } from "express";
import { IExtendedRequest } from '../middleware/userMiddleware';
import sendResponse from "../services/sendResponse";
import Event from "../database/models/eventModel";
import User from "../database/models/userModel";
import UserEventRegister from '../database/models/userEventRegister'
import { Op } from "sequelize"

// interface IEventRequest extends Request{
//     user:{
//         id:string,
//         title:string,
//         description : string
//     }
// }
class EventController{
    async createNewEvent(req:IExtendedRequest, res:Response):Promise<void>{
        const userId = req.user?.id
        const{title,description,price,date,categoryId} = req.body


        const filename = req.file?.filename
        if(!filename){
            sendResponse(res,400,"Image not found")
            return
        }

        if(!title||!description||!date || !categoryId){
            sendResponse(res,400,"Please provide title,description,price,date,organizer_id,categoryId")
        }

        // const checkOrganizer = await User.findOne({
        //     where: {
        //         id:userId,
        //     }
        // })

        await Event.create({
            title,
            description,
            price : price,
            date,
            image_url : filename,
            organizerId :userId,
            categoryId:categoryId

        })
        sendResponse(res,200,"Data Successfully inserted")

    }
    async getRegisteredUsers(req: IExtendedRequest, res: Response): Promise<void>{
        const { id:eventId } = req.params; // for POST request
    
        // If you want to use GET request and access params:
        // const { eventId } = req.params;
        // console.log(eventId);
        
        if (!eventId) {
            sendResponse(res, 400, "Provide eventId");
            return;
        }

        const checkEvent = await Event.findOne({
            where:{id:eventId}
        })
        if(!checkEvent){
            sendResponse(res,404,"Event not found");
            return
        }
        const userData = await UserEventRegister.findAll({
            where:{eventId},
            attributes:['userId']
        })
        if(!userData){
            sendResponse(res,404,"User not found");
            return
        }

        const userIds = userData.map(user => user.userId);

        const users = await User.findAll({
            where: { id: { [Op.in]: userIds } },
            attributes:['id','username']
        })

        const userlists = users.map(user=>({
            username:user.username
        }))
        if(userlists.length === 0){
            sendResponse(res,404,"Userid not found")
            return
        }
        res.status(200).json({
            message:"User found",
            userlists
        })
    }
    async getRegisteredCount(req:IExtendedRequest,res:Response):Promise<void>{
        const {id:eventId} = req.params
        // const userId = req.user?.id

        if(!eventId){
            sendResponse(res,400,"Provide Event id")
            return
        }
        const userCount = await UserEventRegister.count({
            where:{eventId}
        })
        if(userCount===0){
            sendResponse(res,200,"Users not found");
            return
        }
        res.status(200).json({
            message:"UserCount is ",
            userCount
        })

    }
    async getTotalAttendees(req:IExtendedRequest,res:Response):Promise<void>{
        const userId = req.user?.id

        //check for id
        if(!userId){
            sendResponse(res,400,"Please, Provide user id")
            return
        }

        //check for user in database
        const checkUser = await User.findOne({
            where:{id:userId}
        })
        //if not found
        if(!checkUser){
            sendResponse(res,404,"User not found")
            return
        }
        // console.log(`Userid ${userId}`);
        
        //check for events that this user created
        const userEvents = await Event.findAll({
            where:{organizerId:userId},
            attributes:['id']
        })
        // console.log(`userEvents: ${userEvents}`);
        
        //if not found
        if(userEvents.length==0){
            sendResponse(res,200,"Events not found")
            return
        }

        const eventIds = userEvents.map(event =>event.id)
      
        // console.log(`eventIds:${eventIds}`);
        
        const totalusers = await UserEventRegister.count({
            where:{ eventId: { [Op.in]: eventIds  } }
        })
       
        if(totalusers==0){
            sendResponse(res,200,"No user have registered")
            return
        }
        res.status(200).json({
            message:"Total Count of users",
            totalusers
        })



    }
    async updateEvent(req: IExtendedRequest, res: Response):Promise<void>{
            const { eventId } = req.params;
            const userId = req.user?.id
            const updates = req.body; // Expecting { field: value }
    
            // Ensure only one field is being updated
            if (Object.keys(updates).length !== 1) {
                res.status(400).json({ message: 'Only one field can be updated at a time.' });
                return
            }
    
            // const event = await Event.findByPk(eventId) as Event;
            // if (!event) {
            //     res.status(404).json({ message: 'Event not found' });
            //     return 
            // }

            // Ensure the organizer owns the event
           const event = await Event.findByPk(eventId, {
                    attributes: ["id", "organizerId"], // ✅ Explicitly fetch this field
                }) as Event | null;
    
            // Update the event with the single field
            await event?.update(updates);
    
            res.status(200).json({ message: 'Event updated successfully', event });
    };
}
export default new EventController  