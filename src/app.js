import express from 'express';
import cors from 'cors';
import cokkieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


// Configurations/middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public")) //Configuration to store files and folder
app.use(cokkieParser()); //to access and send cokkies to browser with help of server

export { app };
