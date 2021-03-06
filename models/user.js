const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	resetPasswordToken: String,
    resetPasswordExpires: Date,
	friends: [
		{
			type: Schema.Types.ObjectId,
			ref: "Friend",
		},
	],
});

UserSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Friend.deleteMany({
			_id: {
				$in: doc.friends,
			},
		});
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
