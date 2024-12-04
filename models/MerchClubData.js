import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var MerchClubData = new Schema({
  email: String,
  phone: String,
  country: String,
  shirtSize: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    default: "M",
  },
  shirtCut: {
    type: String,
    enum: ["Unisex", "Ladies"],
    default: "Unisex",
  },
});

// create the model for users and expose it to our app
export default mongoose.model("MerchClubData", MerchClubData);
