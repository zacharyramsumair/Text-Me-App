const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
	name: String,
	// name2: String,
	image: String,
	level: Number,
	baseDate: Object,
	nextDate: String,
	displayedNextDate: String,
	category: {
		type: String,
		possibleValues: ["People", "Life Maintenance", "Other"],
	},
	description: String,

	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

FriendSchema.add({ category: "string" });

module.exports = mongoose.model("Friend", FriendSchema);
