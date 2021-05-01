const express = require("express")
const { uploadFile, filesList, removeFile, validateFileExisting, removeFilePermanentlyDB, removeFilePermanentlyFromHost, downloadFile, uploadFileToHost, uploadFileToDB } = require("../controllers/files")
const path = require("path")
const multer = require('multer');
const upload = multer({ dest: '/tmp' })


const router = express.Router()


router.get("/", filesList)


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
	upload.single('file'),
	uploadFileToHost,
	uploadFileToDB,
)

module.exports = router