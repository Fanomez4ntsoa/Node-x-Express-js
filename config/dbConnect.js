const { default: mongoose } = require("mongoose")

mongoose.set('strictQuery', true);

const dbConnect = async() => {
  try {
    const connect = mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    // throw new Error(error);
    console.log("Database Error");
  }
};
module.exports = dbConnect;