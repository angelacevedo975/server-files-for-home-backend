const express = require("express")
const { uploadFile, filesList, removeFile, validateFileExisting, removeFilePermanentlyDB, removeFilePermanentlyFromHost } = require("../controllers/files")
const { upload } = require("../multer/multer")


const router = express.Router()


router.get("/", filesList)

router.delete("/remove",
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