var express = require("express")
var bodyParser = require('body-parser')
var app = express()
var http =require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var port = process.env.PORT || 5000

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false},{ useNewUrlParser: true }))



var dbUrl = 'mongodb+srv://admin:admin123@sanketchat-gakep.mongodb.net/test?retryWrites=true&w=majority'


//specifyitng the route for get services



var Message = mongoose.model('Message',{
    name : String,
    message : String
})

var messages =[
    {name:"Sanket",message:"hello"},
    {name:"Alan",message :"Lets Rock"},

]


app.get('/messages', (_req,res)=>{
    Message.find({},(_err,messages) =>{
        res.send(messages)
    

    })
    
})

app.post('/messages', (req,res)=> {
    var message = new Message(req.body)
    message.save((err)=>{
      if(err)
            sendStatus(500)

            
    io.emit('message',req.body)
    res.sendStatus(200)
    })
    
})

io.on('connection',(_socket)=> {
    console.log('user connected')
})

mongoose.connect(dbUrl,{useNewUrlParser:true}, { useUnifiedTopology: true } ,(_err) => {
   
    console.log('mongodb connection successful')

})

var server = http.listen(port, () => {
    console.log("SERVER IS LISTENING ON PORT %d ", port)

})



