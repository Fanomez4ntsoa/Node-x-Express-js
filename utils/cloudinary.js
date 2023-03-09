const cloudinary = request('cloudinary');

cloudinary.config({
  cloud_name: process.env.NAME_CLOUDINARY,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY
});

const cloudinaryUpload = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      resolve({
        ulr: result.secure_url
      }, {
        resource_type: 'auto',
      });
    });
  })
}

module.exports = cloudinaryUpload;