const path = require("path");
var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors =require('cors');

var FlowerRouter = require('./Routes/FlowerRoute');
var UserRouter = require('./Routes/UserRoute');
var BoughtFlowerRouter = require('./Routes/BoughtFlowerRoute');

// mongoose
//   .connect(
//     "mongodb+srv://Rahma:0123456789rahma@cluster0-2g6em.mongodb.net/FlowersDB?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch(() => {
//     console.log("Connection failed!");
//   });

mongoose.connect("mongodb://localhost:27017/FlowersDB" ,err => {
    if(err){
        console.error(`Eroro ! ${err}`);
    }else{
        console.log(`Connected to MongoDB`)
    }
});
 
const app = express();
const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  };
  
  const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
  };
  
  const port = normalizePort(process.env.PORT || "8080");
  app.set("port", port);


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images", express.static(path.join("Server/../Publics/Images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });
app.use('/api', FlowerRouter);
app.use('/api/user', UserRouter);
app.use('/api', BoughtFlowerRouter);
app.use('/',(request,response)=>{
    response.send('Hello from Server')
});

app.on("error", onError);
app.on("listening", onListening);

app.listen(port,()=>{
    console.log(`Server Running on Localhost : ${port}`)
});