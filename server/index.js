import { Server } from "socket.io";

const PORT = 9000;

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`connection successfull with socket id : ${socket.id}`);

    socket.on("get-document" ,(id) =>{
        const data = "" ;
        socket.join(id) ;

        socket.emit('load-document',data) ;

        socket.on("send-changes" ,(delta) =>{
            // console.log(delta);
            socket.broadcast.to(id).emit('receive-changes' ,delta) ;
        })

    })

    




});
