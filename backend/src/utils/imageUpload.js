const cloudinary = require('cloudinary');

const uploadImage = async (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: 'movie_reviews_app', // Optional folder name in Cloudinary
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });
};

module.exports = uploadImage;