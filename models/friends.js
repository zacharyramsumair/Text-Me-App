const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
	name: String,
	image: String,
	level: Number,
	nextDate: String,
	description: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("Friend", FriendSchema);
