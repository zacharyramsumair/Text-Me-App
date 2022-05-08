const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
	name: String,
	image: String,
	level: String,
	description: String,
});

module.exports = mongoose.model("Friend", FriendSchema);
