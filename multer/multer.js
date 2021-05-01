const multer = require("multer")
const path = require("path")
const { uuid } = require("uuidv4")
require("dotenv").config()

var storage = multer.diskStorage({
	destination: path.join(__dirname, "../uploads"),
	filename: (req, file, cb) => {
		const extension = file.originalname.split(".").pop()
		req.extension=extension
		cb(null, `${uuid()}.${extension}`)
	}
});

//exports.upload = multer({ storage, dest: path.join(__dirname, "../uploads") })