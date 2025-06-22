import { Request, Response } from "express"
import Category from "../database/models/categoryModel"
import sendResponse from "../services/sendResponse"
import { IExtendedRequest } from "../middleware/userMiddleware"
import Event from '../database/models/eventModel'


class CategoryController{
    // categoryData = [
    //     {categoryName : "Electronics"},
    //     {categoryName : "Groceries"},
    //     {categoryName : "Foods"},
    // ]

    // async seedCategory():Promise<void>{
    //     const datas = await Category.findAll()
    //     if(datas.length===0){
    //         await Category.bulkCreate(this.categoryData)
    //         console.log("Categories seeded Successfully")
    //     }
    // }
    
//organizer can add new category if not found
    async addCategory(req:Request,res:Response):Promise<void>{
        const {categoryName} = req.body
        if(!categoryName){
            sendResponse(res,400,"PRovide categoryName")
            return
        }

        const findCategory = await Category.findAll({
            where:{categoryName}
        })
        let categoryId;
        if(findCategory.length==0){
            const newcategoryId = await Category.create({
                categoryName
            })
            categoryId = newcategoryId.id
            res.status(200).json({
                message:"New Category added",
                newcategoryId
            })
            return
        }
        sendResponse(res,403,"Data already found");
    }
//user can get all the category
    async getAllCategory(req:IExtendedRequest,res:Response):Promise<void>{
        // const userId = req.user?.id  
        //find categorories
        const categoryData = await Category.findAll({raw:true})
        if(categoryData.length==0){
            sendResponse(res,204,"Categories not found")
            return
        }

        const plainCategoryData = categoryData.map(category=>category.get({plain:true}))

        if(plainCategoryData){
            res.status(200).json({
                message:"Categories retrieved",
                plainCategoryData
            })
            return
        }
        
    }
//frontend can get category id 
    async getCategoryData(req:Request,res:Response):Promise<void>{

        //find category name
        const {categoryName} = req.body

        if(!categoryName){
            sendResponse(res,400,"Provide Category id")
            return
        }
        //find category name
        const findCategory = await Category.findAll({
            where:{categoryName}
        })
        if(findCategory.length==0){
            sendResponse(res,500,"server error")
        }
        res.status(200).json({
            message:"Category Found",
            findCategory
        })

    }
//user can see data based on category
    async getDataByCategory(req:Request,res:Response):Promise<void>{

        //get events details based on category but not for all category data here
        const categoryId=req.params.id

        // console.log(categoryId)

        if(!categoryId){
            sendResponse(res,400,"Provide category id")
            return
        }
        //check if there is a category
        const checkCategory = await Category.findOne({
            where:{id:categoryId}
        })
        if(!checkCategory){
            sendResponse(res,204,"Category Not Found")
            return
        }
        //find event related to that category
        const eventData = await Event.findAll({
            where:{categoryId:categoryId}
        })
        //if event not found
        if(eventData.length==0){
            sendResponse(res,204,"Data not found")
            return
        }
        //if event found
        res.status(200).json({
            message:"Data found successfully",
            eventData
        })
    }
}
export default new CategoryController