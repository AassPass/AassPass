import multer from "multer";

// Configure Multer for image upload (store in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const businessImageUpload = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'bannerPicture', maxCount: 1 }
]);


export { upload, businessImageUpload };