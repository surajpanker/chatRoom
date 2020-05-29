const socket = io();


//Elements
const $MessageForm =document.querySelector('#frm');
const $MessageInput =$MessageForm.querySelector('input')
const $MessageButton=$MessageForm.querySelector('button')
const sendLocation =document.querySelector('#send-location');


const $messages = document.querySelector('#message-container') // where we show message #first
//option for QS
const { username , room}=Qs.parse(location.search,{ ignoreQueryPrefix:true})

//templates message
const messageTemplate =document.querySelector('#message-template').innerHTML;// where we show message #second innerhtml
//
//welcome message template
const locationtemplate =document.querySelector('#location-template').innerHTML;

//sidebar template
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML;



//autoscrolling 
const autoscroll = ()=>{

  //new message element
const $newmessage = $messages.lastElementChild
//height of new message
const newMessageStyle =  getComputedStyle($newmessage)
const newMessageMargin = parseInt(newMessageStyle.marginBottom);

const newMessageHeight = $newmessage.offsetHeight+newMessageMargin;
//visible heiht
const visibleheight  = $messages.offsetHeight;

//height of meeesage constainer
const containerHeight = $messages.scrollHeight

//how far we go from top
const Howfar =$messages.scrollTop+visibleheight;

if(containerHeight-newMessageHeight<=Howfar){
    $messages.scrollTop=$messages.scrollHeight;
}

}

socket.on('Message',(message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        renderMessage:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
      autoscroll()
})

//render location 

socket.on('SendLocationEvent',(message)=>{
 
    const html = Mustache.render(locationtemplate,{
        username:message.username,
        Currentlocation:message.text,
        timestamp:moment(message.createdAt).format('h:mm a')
    });

    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
  
})
//get user in room in client side
socket.on('roomData',({room,users})=>{

const html = Mustache.render(sidebartemplate,{
    room,
    users
})
document.querySelector('#sidebar').innerHTML=html
})


//send acknowledgement
$MessageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $MessageButton.setAttribute('disabled','disabled')
    //disable
    const message =$MessageInput.value;
    socket.emit("SendMessage",message,(error)=>{
        $MessageButton.removeAttribute('disabled')
        $MessageInput.value =' ' //clearing input
        $MessageInput.focus()//focus on intput
     //enable
     if(error)
     return console.log(error)

    })
})



//fetch location
sendLocation.addEventListener('click',()=>{
     alert('Wait for a second your location is fetching')
     if(!navigator.geolocation)
     return alert('Geolocation is not supported by your browser')
     sendLocation.setAttribute('disabled','disabled' )
    navigator.geolocation.getCurrentPosition((position)=>{
      //position has object
      const location ={
           latitude:position.coords.latitude,
           longitude:position.coords.longitude
        }
        
       socket.emit('SendLocation',location,()=>{
        sendLocation.removeAttribute('disabled' )
         console.log('Location shared')
     });
         
    }) 


})
// send  to server
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})