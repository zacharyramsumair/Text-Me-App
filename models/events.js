const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	Date: Date,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("Friend", FriendSchema);
