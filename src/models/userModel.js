import mongoose from "mongoose";

 const collection="usuarios";

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const UserModel = mongoose.model(collection, userSchema);

export default UserModel;