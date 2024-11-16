import express from "express"
import { Server } from "socket.io";
import { createServer } from "http"
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const secretKeyJWT = 'lgalkdjlakfdjlkfaj'

const port = 8000;
const app = express();
// const server = new createServer(app)
const server =  createServer(app)

app.use(cookieParser());


const io = new Server(server, {
    cors: {
        // origin: "http://localhost:5173",
        origin: "*",

        methods: ['GET', 'POST'],
        credentials: true

    }
})

const corsOptions = {
    // origin: 'http://localhost:5173',
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));



app.get('/', (req, res) => {
    res.send("Heelo world")
})


app.get('/login', (req, res) => {
    const token = jwt.sign({ _id: "lskdfladjkl" }, secretKeyJWT)

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" }).json({
        message: "Login Success"
    })
})


// io.use((socket, next) => {
//     try {
//         cookieParser()(socket.request, socket.request.res, (err) => {
//             if (err) return next(err)
    
//             const token = socket.request.cookies.token;
    
//             if (!token) return next(new Error("Authentication Error"))
    
//             const decoded = jwt.verify(token, secretKeyJWT)
//             next();
    
//         })
//     } catch (error) {
//         console.log("error is ",error)
//     }
// })


io.on("connection", (socket) => {
    console.log("running")
    console.log("User connected", socket.id)

    // socket.on("message", (data) => {
    socket.on("message", ({ room, message }) => {

        // console.log(data)
        console.log({ room, message })
        // io.emit("receive-message", data)
        io.emit("receive-message", message)//go to all 

        // socket.broadcast.emit("receive-message", data)
        // socket.broadcast.emit("receive-message", message)// not show to sender but receiver

        // io.to(room).emit("receive-message", message)// not show to sender but receiver



    })
    // socket.emit("welcome",`welcome to the server ${socket.id}`)
    // socket.broadcast.emit("welcome",`welcome ${socket.id} joined the server `)

    socket.on('join-room', (room) => {

        socket.join(room)

        console.log(`user joined room ${room}`)

    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})

// app.listen(port, () => {
//     console.log(`server is running on port ${port}`)
// })


server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})