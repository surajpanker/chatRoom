const http =require('http'); // 1.for creating new server
const express =require('express');
const path =require('path'); //serving public directory
const socketio =require('socket.io')
const Filter = require('bad-words')//for stop profane
const app =express();

//for generatime stamp
const {generaetMessage,getlocation}= require('./utils/object')
//load user
const {
  addUser,
  removeUser,
  getUser,
  getUserInroom

} =require('./utils/user')
const server = http.createServer(app)  // 2.for creating new server
const io = socketio(server) // for creating io server it uses expres behind the scene
const port =process.env.PORT||3000
//configure public folder
const publicdirectory = path.join(__dirname,'../public')
//what is into it we have to server we use middle ware

app.use(express.static(publicdirectory))
io.on('connection',(socket)=>{
    

    socket.on('join',({username,room},callback)=>
       {
         const {error ,user} =addUser({id:socket.id ,username,room})
       if(error)
       return callback(error)
          
       socket.join(user.room)   // it join the room
      // server to client socket.emit socket.broadcast.emit io.emit 
      socket.emit('Message',generaetMessage('Admin','Welcome@coding')); // mesaage change as object
      socket.broadcast.to(user.room).emit('Message',generaetMessage('Admin',`${user.username} joined`)); //when user joined  mesaage change as object
      //room and user name

      //when someone join so new emit 
      io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUserInroom(user.room)
      })
      callback()
        })
    

    
    
    //for submitting message
    socket.on('SendMessage',(message,callback)=>{
        
      const user =getUser(socket.id);
       const filter =new Filter();
        if(filter.isProfane(message))
          return  callback('Profane is not allowed')
        io.to(user.room).emit('Message',generaetMessage(user.username,message)); // mesaage change as object
        callback()
    })
   //for accessing location to all user
   socket.on('SendLocation',(location,callback)=>{
    const user =getUser(socket.id);
    console.log(user)
     io.to(user.room).emit('SendLocationEvent',getlocation(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
     callback();
   })



    socket.on('disconnect',()=>{
      const user=removeUser(socket.id)
        if(user)
        {
      io.to(user.room).emit('Message',generaetMessage('Admin',`${user.username} has left`)) // mesaage change as object
       // when client leave 

       io.to(user.room).emit('roomData',{
         room:user.room,
         users:getUserInroom(user.room)
       })
      }
    })
})




server.listen(port,()=>{
    console.log('server is running '+port)
})