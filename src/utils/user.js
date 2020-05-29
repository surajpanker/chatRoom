const users =[] ;
const addUser =({ id,username,room})=>
{
 
  //clean data
  username =username.trim().toLowerCase()//
  room = room.trim().toLowerCase();

  //for user exist
  if(!username ||!room){
      return{
          error:"Username and Room are required"
          }
             }
  //for useralready exist return true
  const existUser = users.find((user)=>{
          return user.username ===username&& user.room===room ;
  })

 if(existUser){
     return {
         error:"User name and Room are already exist"
     }
 }

//const make object
const user= {
    id,username,room
}
//push into array
users.push(user);

//return when thing goes well
return{
    user
 }

}
//remove USer
const removeUser =(id)=>{
   //return index
    const  index =users.findIndex((user)=>{
     return user.id===id;
    })

    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
   //if match find so it return 
    const user =users.find((user)=>{
    return user.id===id
    })
    if(!user)
     return 

    return user
}

const getUserInroom=(room)=>{
room=room.trim().toLowerCase();
const usersNumber =users.filter((user)=>{
return user.room ===room
})


if(usersNumber.length<0){
    return []
}
return usersNumber;
}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInroom

}