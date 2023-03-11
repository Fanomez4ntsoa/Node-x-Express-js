const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.NAME_CLOUD,
  api_key: process.env.API_KEY_CLOUD,
  api_secret: process.env.API_SECRET_CLOUD
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      resolve({
        url: result.secure_url
      }, {
        resource_type: 'auto',
      });
    });
  })
}

module.exports = cloudinaryUploadImg;