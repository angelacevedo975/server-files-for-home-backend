const express = require("express")
const { uploadFile, filesList, removeFile, validateFileExisting, removeFilePermanentlyDB, removeFilePermanentlyFromHost, downloadFile } = require("../controllers/files")
const { upload } = require("../multer/multer")
const path = require("path")

const router = express.Router()


router.get("/", filesList)

router.get("/download/:filename",
	validateFileExisting,
	downloadFile
)

router.post("/remove/:filename",
	validateFileExisting,
	removeFile
)

router.delete("/remove/permanently",
	validateFileExisting,
	removeFilePermanentlyDB,
	removeFilePermanentlyFromHost
)

router.post("/upload",
	upload.fields([
		{ name: "file", maxCount: 15 }
	]),
	uploadFile)

module.exports = router