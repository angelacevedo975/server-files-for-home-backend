const { File } = require("../models/File");
const fs = require("fs")
const cloudinary = require("cloudinary")
require("dotenv").config()


cloudinary.config({
	cloud_name: process.env.CLOUDNAME,
	api_key: process.env.APIKEY,
	api_secret: process.env.APISECRET,
});



exports.uploadFileToHost = (req, res, next) => {
	const file = req.file;
	cloudinary.v2.uploader.upload(file.path,
		{ folder: "home-files", resource_type: "auto" },
		(err, fileResponse) => {
			if (err) {
				return res.json({ error: "An error has ocurred while uploading" })
			}
			req.fileResponse = fileResponse
			next()
		}
	)
}

exports.uploadFileToDB = (req, res) => {
	const file = new File({
		name: `${req.fileResponse.original_filename}.${req.fileResponse.format}`,
		path: req.fileResponse.secure_url,
		extension: req.fileResponse.format,
	})
	file.save((err, uploadedFile) => {
		if (err) {
			return res.json({ error: "An error has ocurred while uploading the file" })
		}
		return res.json(uploadedFile)
	})
}

exports.filesList = (req, res) => {
	File.find({
		status: "ACTIVE"
	}, (err, files) => {
		if (err) {
			return res.json({ error: err })
		}
		return res.json(files)
	})
}

exports.validateFileExisting = (req, res, next) => {
	const filename = req.body.filename ? req.body.filename : req.params.filename
	File.findOne({
		name: filename
	}, (err, file) => {
		if (err) {
			return res.json({ error: err })
		}
		if (!file) {
			return res.json({ error: "The file was not found" })
		}
		req.dbFile = file
		next()
	})
}

exports.removeFile = (req, res) => {
	const filename = req.body.filename ? req.body.filename : req.params.filename
	File.findOneAndUpdate({
		name: filename
	}, {
		status: "DELETE"
	}, (err, doc) => {
		if (err) {
			return res.json({ error: err })
		}
		return res.json(doc)
	})
}

exports.removeFilePermanentlyDB = (req, res, next) => {
	File.findOneAndDelete({
		name: req.body.filename
	}, (err, deletedFile) => {
		if (err) {
			return res.json({ error: err })
		}
		req.deletedFile = deletedFile
		next()
	})
}

exports.removeFilePermanentlyFromHost = (req, res) => {
	const route = path.join(__dirname, `../uploads/${req.deletedFile.name}`)
	fs.unlink(route, (err) => {
		if (err) {
			return res.json({ error: err })
		}
		return res.json(req.deletedFile)
	})
}