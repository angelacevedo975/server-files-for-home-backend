const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now
	},
	path: {
		type: String,
		required: true,
	},
	extension: {
		type: String,
		required: true,
	},
	status: {
		type:String,
		default: "ACTIVE"
	}
})

exports.File = mongoose.model("File", fileSchema)