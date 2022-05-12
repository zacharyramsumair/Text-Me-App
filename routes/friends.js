const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { friendSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const Friend = require("../models/friends");

const validateFriend = (req, res, next) => {
	const { error } = friendSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

async function reloadBase(friends) {
	for (let friend of friends) {
		let y = "";
		let m = "";
		let d = "";
		let nextDate = friend.nextDate;
		console.log(friend.baseDate);
		let baseDate = JSON.stringify(friend.baseDate);
		// let todayDate = new Date();
		// let baseDate = JSON.stringify(todayDate);

		let date = nextDate.split("/");
		// console.log(date);
		//code for month
		if (date[0] < 10) {
			m = `0${date[0]}`;
		} else {
			m = `${date[0]}`;
		}

		//code for day
		if (date[1] < 10) {
			d = `0${date[1]}`;
		} else {
			d = `${date[1]}`;
		}

		y = date[2];

		// this to is for 11:59:59:999 so the last millisecond before the next day
		nextDate = `${y}-${m}-${d}T03:59:59.999Z`;
		// console.log("next2", nextDate);

		if (baseDate > nextDate) {
			baseDate = nextDate;
		} else {
			baseDate = baseDate;
		}
		let boo = baseDate < nextDate;
		// console.log("if", boo);
		// console.log("base2", baseDate);

		//turn string baseDate to object

		friend.baseDate = baseDate;

		await friend.save();
	}
}

const reloadNext = (friend) => {
	// update Next date
	let baseDate = friend.baseDate;
	let string = JSON.stringify(baseDate.addDays(friend.level));

	let month = `${string[6]}${string[7]}`;
	if (month[0] == "0") {
		month = month[1];
	}
	// console.log(month);
	let day = `${string[9]}${string[10]}`;
	if (day[0] == "0") {
		day = day[1];
	}
	let year = `${string[1]}${string[2]}${string[3]}${string[4]}`;

	let compressedDate = `${month}/${day}/${year}`;
	return compressedDate;
	// friend.nextDate = compressedDate;

	// end update Next date
};

// async function reload(friend) {
// 	reloadBase(friend);
// 	await friend.save();
// 	reloadNext(friend);
// 	await friend.save();
// }

//make date
Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

// let date = new Date();

// console.log(date.addDays(5));
//make date

router.get(
	"/",
	catchAsync(async (req, res) => {
		const friends = await Friend.find({}).populate("author");
		// console.log("==========", friends);
		// reload(friends);
		reloadBase(friends);
		res.render("friends/index", { friends });
		console.log("friend 0:", friends[0]);
		console.log("friend 1:", friends[1]);
	})
);

router.get("/new", isLoggedIn, (req, res) => {
	res.render("friends/new");
});

router.get("/calendar", isLoggedIn, async (req, res) => {
	const friends = await Friend.find({}).populate("author");
	res.render("friends/calendar", { friends });
});

router.post(
	"/",
	isLoggedIn,
	validateFriend,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
		const friend = new Friend(req.body.friend);
		reloadDate(friend);
		// console.log(friend);
		// console.log(friend.level);

		let string = JSON.stringify(date.addDays(friend.level));

		let month = `${string[6]}${string[7]}`;
		if (month[0] == "0") {
			month = month[1];
		}
		// console.log(month);
		let day = `${string[9]}${string[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		let year = `${string[1]}${string[2]}${string[3]}${string[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		friend.baseDate = new Date();

		friend.nextDate = compressedDate || "tomorrow";
		friend.author = req.user._id;
		await friend.save();
		// console.log(friend);
		req.flash("success", "Successfully made a new friend!");

		res.redirect(`/friends/${friend._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const friend = await Friend.findById(req.params.id).populate("author");
		if (!friend) {
			req.flash("error", "Cannot find that friend!");

			return res.redirect("/friends");
		}
		// friend;
		reloadBase(friend);
		res.render("friends/show", { friend });
	})
);

router.get(
	"/:id/edit",
	isLoggedIn,
	catchAsync(async (req, res) => {
		const friend = await Friend.findById(req.params.id);
		if (!friend) {
			req.flash("error", "Cannot find that friend!");

			return res.redirect("/friends");
		}
		res.render("friends/edit", { friend });
	})
);

router.put(
	"/:id",
	isLoggedIn,
	validateFriend,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const friend = await Friend.findByIdAndUpdate(id, {
			...req.body.friend,
		});
		req.flash("success", "Successfully updated a friend!");

		res.redirect(`/friends/${friend._id}`);
	})
);

router.delete(
	"/:id",
	isLoggedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Friend.findByIdAndDelete(id);
		req.flash("success", "Successfully deleted a friend!");

		res.redirect("/friends");
	})
);

module.exports = router;
