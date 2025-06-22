import express from 'express';
import sequelize from './database/connection'; // Adjust the path as needed
import userRoute from './routes/userRoute'; // Adjust the path as needed
import eventRoute from './routes/eventRoute';
import userEventRoute from './routes/userEventRoute'
import cors from 'cors'
import categoryRoute from './routes/categoryRoute'

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"], // Corrected format
    methods: ["POST", "GET","PUT","DELETE"],
    credentials: true
}));
app.use(express.json());

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully.");

        await sequelize.sync({  force:false,alter: false }); // ✅ Ensures models sync to DB

        console.log("✅ Database synchronized.");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
})();

app.use('/api/auth', userRoute) 
app.use('/api/create-event', eventRoute)  
app.use('/api/register-event', userEventRoute) 
app.use('/api/categories',categoryRoute) 
// app.use("*", (req, res) => {
//     res.status(404).json({ message: "Route not found" });
//   });


export default app


