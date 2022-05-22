const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { friendSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const Friend = require("../models/friends");

Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

const validateFriend = (req, res, next) => {
	const { error } = friendSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

// async function reloadDates(friends) {
// 	for (let friend of friends) {
// 		// let nextDate = friend.nextDate;
// 		// let date = nextDate.split("/");

// 		// //next date string
// 		// //code for month
// 		// if (date[0] < 10) {
// 		// 	m = `0${date[0]}`;
// 		// } else {
// 		// 	m = `${date[0]}`;
// 		// }

// 		// //code for day
// 		// if (date[1] < 10) {
// 		// 	d = `0${date[1]}`;
// 		// } else {
// 		// 	d = `${date[1]}`;
// 		// }

// 		// y = date[2];

// 		// // this to is for 11:59:59:999 so the last millisecond before the next day
// 		// nextDate = `${y}-${m}-${d}T03:59:59.999Z`;
// 		// nextDate = JSON.stringify(nextDate);

// 		// console.log("enter while loop? :", JSON.stringify(new Date()) > nextDate);

// 		// while (JSON.stringify(new Date()) > nextDate) {
// 		// while (JSON.stringify(new Date()) > JSON.stringify(friend.baseDate)) {
// 		let y = "";
// 		let m = "";
// 		let d = "";
// 		let baseDate;
// 		let nextDate = friend.nextDate;
// 		let todayDate = new Date();
// 		todayDate = JSON.stringify(todayDate);
// 		// `${y}-${m}-${d}T03:59:59.999Z`
// 		y = `${todayDate[0]}${todayDate[1]}${todayDate[2]}${todayDate[3]}`;
// 		m = `${todayDate[5]}${todayDate[6]}`;
// 		d = `${todayDate[8]}${todayDate[9]}`;
// 		todayDate = new Date(y, m - 1, d, 0, 0, 0, 0);
// 		todayDate = JSON.stringify(todayDate);
// 		let date = nextDate.split("/");

// 		//next date string
// 		//code for month
// 		if (date[0] < 10) {
// 			m = `0${date[0]}`;
// 		} else {
// 			m = `${date[0]}`;
// 		}

// 		//code for day
// 		if (date[1] < 10) {
// 			d = `0${date[1]}`;
// 		} else {
// 			d = `${date[1]}`;
// 		}

// 		y = date[2];

// 		// this to is for 11:59:59:999 so the last millisecond before the next day
// 		nextDate = `${y}-${m}-${d}T03:59:59.999Z`;
// 		// console.log("%%%%%%%%%%%%%%%%%%%%%%%");
// 		// console.log("today", todayDate);
// 		// console.log("next", nextDate);
// 		// console.log(todayDate > nextDate);
// 		// console.log("%%%%%%%%%%%%%%%%%%%%%%%");

// 		if (todayDate > nextDate) {
// 			baseDate = new Date(date[2], date[0] - 1, date[1], 0, 0, 0, 0);
// 		} else {
// 			baseDate = friend.baseDate;
// 		}

// 		friend.baseDate = baseDate;

// 		await friend.save();

// 		// 		baseDate = friend.baseDate;
// 		// 		// console.log(baseDate);
// 		// 		nextdate = JSON.stringify(baseDate.addDays(friend.level));

// 		// 		let month = `${nextDate[5]}${nextDate[6]}`;
// 		// 		if (month[0] == "0") {
// 		// 			month = month[1];
// 		// 		}
// 		// 		// console.log(month);
// 		// 		let day = `${nextDate[8]}${nextDate[9]}`;
// 		// 		if (day[0] == "0") {
// 		// 			day = day[1];
// 		// 		}
// 		// 		let year = `${nextDate[0]}${nextDate[1]}${nextDate[2]}${nextDate[3]}`;

// 		// 		compressedDate = `${month}/${day}/${year}`;

// 		// 		friend.nextDate = compressedDate;

// 		// 		await friend.save();
// 		// 		console.log(friend.baseDate);
// 		// 		console.log(friend.nextDate);
// 		// 	}
// 	}
// }

//make date

async function reloadNext(friends) {
	for (let friend of friends) {
		let nextDate = friend.nextDate;
		let date = nextDate.split("/");

		if (date[0] < 10) {
			m = `0${date[0]}`;
		} else {
			m = `${date[0]}`;
		}

		if (date[1] < 10) {
			d = `0${date[1]}`;
		} else {
			d = `${date[1]}`;
		}

		y = date[2];

		// this to is for 11:59:59:999 so the last millisecond before the next day
		// nextDate = `${y}-${m}-${d}T03:59:59.999Z`;
		nextDate = new Date(y, m - 1, d, 23, 59, 59, 999);
		while (new Date() > nextDate) {
			nextDate = nextDate.addDays(friend.level);
		}

		nextDate = JSON.stringify(nextDate);

		let month = `${nextDate[6]}${nextDate[7]}`;
		console.log(month);
		if (month[0] == "0") {
			// console.log(month);
			// console.log(month[0]);
			month = month[1];
			// console.log(month);
		}
		console.log(month);
		let day = `${nextDate[9]}${nextDate[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		let year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		console.log("compresses".compressedDate);
		friend.nextDate = compressedDate;
		await friend.save();
	}
}

async function reloadBase(friends) {
	for (let friend of friends) {
		let nextDate = friend.nextDate;
		let date = nextDate.split("/");

		if (date[0] < 10) {
			m = `0${date[0]}`;
		} else {
			m = `${date[0]}`;
		}

		if (date[1] < 10) {
			d = `0${date[1]}`;
		} else {
			d = `${date[1]}`;
		}

		y = date[2];

		// this to is for 11:59:59:999 so the last millisecond before the next day
		// nextDate = `${y}-${m}-${d}T03:59:59.999Z`;
		nextDate = new Date(y, m - 1, d, 23, 59, 59, 999);
		// new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
		// nextDate = JSON.stringify(nextDate);

		baseDate = nextDate.addDays(-1 * friend.level);
		friend.baseDate = baseDate;
		await friend.save();
		nextDate = baseDate.addDays(friend.level);
		//
		nextDate = JSON.stringify(nextDate);

		let month = `${nextDate[6]}${nextDate[7]}`;
		console.log(month);
		if (month[0] == "0") {
			// console.log(month);
			// console.log(month[0]);
			month = month[1];
			// console.log(month);
		}
		console.log(month);
		let day = `${nextDate[9]}${nextDate[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		let year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		friend.nextDate = compressedDate;
		await friend.save();
	}
}

// let date = new Date();

// console.log(date.addDays(5));
//make date

router.get(
	"/",
	catchAsync(async (req, res) => {
		const friends = await Friend.find({}).populate("author");

		// reloadDates(friends);
		await reloadNext(friends);
		await reloadBase(friends);

		res.render("friends/index", { friends });
		// console.log("friend 0:", friends[0]);
		// console.log("friend 1:", friends[1]);
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
