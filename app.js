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
var allowedOrigins = ['http://localhost:3000'];
var corsOptions = {
	origin: function (origin, callback) {
		// allow requests with no origin     
		// (like mobile apps or curl requests)    
		if (!origin)
			return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			var msg = 'The CORS policy for this site does not ' +
				'allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	}
}
app.use(cors(corsOptions))

//   ROUTERS
app.use("/file", files)



app.listen(process.env.PORT || 3005, process.env.HOST || "localhost", () => {
	console.log(`Listening on ${process.env.HOST || 3005} - ${process.env.PORT || "localhost"}`);
});