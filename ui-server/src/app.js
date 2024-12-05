
import cors from "cors"
import express from "express";
import cookieParser from "cookie-parser";
import "./cronJobs.js"
const app=express();



app.use(cors({origin:["http://localhost:5173", "http://localhost:3000"],credentials:true}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes import

import userRouter from "./routes/user.routes.js";
import productCategoryRouter from "./routes/productCategory.routes.js";
import auctionRouter from "./routes/auction.routes.js";
import cityRouter from "./routes/city.routes.js";
import bidRouter from "./routes/bid.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import cartRouter from "./routes/cart.routes.js";
import commentRouter from "./routes/comment.routes.js";
import messageRouter from "./routes/message.routes.js";
import deliveryRouter from "./routes/delivery.routes.js";
import requestRouter from "./routes/request.routes.js";

//routes declaration

app.use("/api/v1/users",userRouter);
app.use("/api/v1/product-categories",productCategoryRouter);
app.use("/api/v1/auctions",auctionRouter);
app.use("/api/v1/cities",cityRouter);
app.use("/api/v1/bids",bidRouter);
app.use("/api/v1/notifications",notificationRouter);
app.use("/api/v1/payments",paymentRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/deliveries", deliveryRouter);
app.use("/api/v1/requests", requestRouter);

export {app}