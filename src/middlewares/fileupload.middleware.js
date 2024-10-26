// 1. Import multer.
import multer from "multer";
import path from "path";

// 2. Configure storage with filename and location.

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    cb(null, "avatar-" + timestamp + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
});
