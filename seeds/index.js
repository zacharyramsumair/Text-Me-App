const mongoose = require("mongoose");
const Friend = require("../models/friends");
const { names, levels, descriptions } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/text-app");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Friend.deleteMany({});

	for (let i = 0; i < 20; i++) {
		const friend = new Friend({
			name: `${sample(names)}`,
			level: `${sample(levels)}`,
			description: `${sample(descriptions)}`,
		});
		await friend.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
