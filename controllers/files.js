const { File } = require("../models/File");
const fs = require("fs")
const path = require("path")
require("dotenv").config()

exports.uploadFile = (req, res) => {
	let files = req.files.file.map((file, index) => {
		return {
			name: file.filename,
			path: `${process.env.HOST}:${process.env.PORT}${process.env.STATIC}/${file.filename}`,
			extension: req.extension
		}
	})
	File.insertMany(files)
		.then((doc) => {
			return res.json(doc)
		})
		.catch((err) => {
			return res.json({ error: err })
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
	File.findOne({
		name: req.body.filename
	}, (err, file) => {
		if (err) {
			return res.json({ error: err })
		}
		if (!file) {
			return res.json({ error: "The file was not found" })
		}
		next()
	})
}

exports.removeFile = (req, res) => {
	File.findOneAndUpdate({
		name: req.body.filename
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
	const route = path.join(__dirname, `../public/uploads/${req.deletedFile.name}`)
	fs.unlink(route, (err) => {
		if (err) {
			return res.json({ error: err })
		}
		return res.json(req.deletedFile)
	})
}