const mongoose = require("mongoose");
const Friend = require("../models/friends");
const { names, levels, descriptions } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/text-app");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

Date.prototype.addDays = function (days) {
	let date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

let date = new Date();

console.log(JSON.stringify(date.addDays(5)));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Friend.deleteMany({});

	for (let i = 0; i < 5; i++) {
		let l = `${sample(levels)}`;
		let string = JSON.stringify(date.addDays(l));
		let month = `${string[6]}${string[7]}`;
		if (month[0] == "0") {
			month = month[1];
		}
		console.log(month);
		let day = `${string[9]}${string[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		let year = `${string[1]}${string[2]}${string[3]}${string[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		const friend = new Friend({
			author: "625aa9c22fc8a01487bbaa5e",
			name: `${sample(names)}`,
			level: l,
			baseDate: new Date(),
			nextDate: compressedDate,
			description: `${sample(descriptions)}`,
		});
		await friend.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});

// "_id" : ObjectId("625aa9c22fc8a01487bbaa5e"
