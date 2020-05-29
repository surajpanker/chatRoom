const generaetMessage = (username,text)=>{

 return {
  username,
   text,
   createdAt:new Date().getTime()

 }
}

const getlocation=(username,text)=>{

return {
  username,
    text,
   createdAt:new Date().getTime()

}
}
module.exports={
    generaetMessage,
    getlocation
}