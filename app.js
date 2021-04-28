const express = require("express")
const bodyParser = require("body-parser")
const files = require("./routes/files.js")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()


//  DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}).then(() => console.log('DB Connected'))
	.catch((err) => console.log(`CATCH: ${err}`));


const app = express()


//  PARSE TO JSON	
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//   MIDDLEWARES
app.use(express.static(__dirname + "/public"))


// CORS
app.use(cors())

//   ROUTERS
app.use("/file", files)



app.listen(process.env.PORT || 3005, process.env.HOST || "localhost", () => {
	console.log(`Listening on ${process.env.HOST || 3005} - ${process.env.PORT || "localhost"}`);
});