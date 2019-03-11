const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");

// Initializing Express
const app = express();

// View Engine & Public(Static) Folder
app.set("view engine", ejs);
app.use(express.static(path.join(__dirname, "/public")));

// ********************************************************************************************************************
// Multer Code
// ********************************************************************************************************************

// Set Storage Engine
const storage = multer.diskStorage({
	destination: "./public/uploads",
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	}
});

// Initializing Upload
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5000000
	},
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	}
}).single("myImage");

// Check File Type
function checkFileType(file, cb) {
	// Allowed Extensions
	const fileTypes = /jpeg|jpg|png|gif/;
	// Check Extensions
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	// Check Mime Type
	const mimeType = fileTypes.test(file.mimetype);

	if (mimeType && extname) {
		return cb(null, true);
	} else {
		return cb("Error: Images Only", false);
	}
}

// ********************************************************************************************************************

app.get("/", (req, res) => {
	res.render("index.ejs");
});

app.post("/upload", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.render("index.ejs", {
				msg: err
			});
		} else {
			if (req.file == undefined) {
				res.render("index.ejs", {
					msg: "Error: No	File Selected"
				});
			} else {
				res.render("index.ejs", {
					msg: "File Uploaded",
					file: `uploads/${req.file.filename}`
				});
			}
		}
	});
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server Started on ${PORT}`);
});
