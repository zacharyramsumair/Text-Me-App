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

async function reloadDate(friends) {
	for (let friend of friends) {
		let nextDate = friend.nextDate;
		console.log("=================");
		console.log("nextDate1", nextDate);

		let baseDate = friend.baseDate;
		let date = nextDate.split("/");
		console.log("date", date);

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
		console.log("d", d);

		y = date[2];

		// this to is for 11:59:59:999 so the last millisecond before the next day
		// nextDate = `${y}-${m}-${d}T03:59:59.999Z`;
		nextDate = new Date(y, m - 1, d - 1, 23, 59, 59, 999);
		console.log("nextDate2.1", nextDate);

		// while (new Date() > nextDate) {

		// }

		//get date of today at 12:00 am

		let today = JSON.stringify(new Date());

		let month = `${today[6]}${today[7]}`;
		// console.log(month);
		if (month[0] == "0") {
			// console.log(month);
			// console.log(month[0]);
			month = month[1];
			// console.log(month);
		}
		// console.log(month);
		let day = `${today[9]}${today[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		let year = `${today[1]}${today[2]}${today[3]}${today[4]}`;

		startToday = new Date(year, month - 1, day, 0, 0, 0, 0);
		console.log("nextDate2.2", nextDate);

		if (new Date() > nextDate) {
			while (baseDate < startToday) {
				baseDate = baseDate.addDays(friend.level);
			}
			//gonna change it by -1
			// nextDate = baseDate.addDays(-1);
			//end check

			// nextDate = baseDate;
			// console.log("===============");
			// console.log("nextDay1", nextDate);
			console.log("nextDate4", nextDate);

			baseDate = baseDate.addDays(-friend.level);
			nextDate = baseDate.addDays(friend.level);
			console.log("nextDate5", nextDate);

			// console.log("nextDay2", nextDate);

			// console.log("===============");
		}
		console.log("nextDate6", nextDate);

		nextDate = JSON.stringify(nextDate);
		console.log("nextDate7", nextDate);

		month = `${nextDate[6]}${nextDate[7]}`;
		// console.log(month);
		if (month[0] == "0") {
			month = month[1];
		}
		// console.log(month);
		day = `${nextDate[9]}${nextDate[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		console.log("nextDate8 compress", compressedDate);

		// console.log("------------------------");
		// console.log("compresses", compressedDate);
		friend.nextDate = compressedDate;
		friend.baseDate = baseDate;

		await friend.save();
	}
}

// async function reloadNext(friends) {
// 	for (let friend of friends) {
// 		let nextDate = friend.nextDate;
// 		let date = nextDate.split("/");

// 		if (date[0] < 10) {
// 			m = `0${date[0]}`;
// 		} else {
// 			m = `${date[0]}`;
// 		}

// 		if (date[1] < 10) {
// 			d = `0${date[1]}`;
// 		} else {
// 			d = `${date[1]}`;
// 		}

// 		y = date[2];

// 		// this to is for 11:59:59:999 so the last millisecond before the next day
// 		// nextDate = `${y}-${m}-${d}T03:59:59.999Z`;
// 		nextDate = new Date(y, m - 1, d, 23, 59, 59, 999);
// 		while (new Date() > nextDate) {
// 			// i did -1 cause the dates ended up going one above for some reason
// 			nextDate = nextDate.addDays(friend.level);
// 		}

// 		nextDate = JSON.stringify(nextDate);

// 		let month = `${nextDate[6]}${nextDate[7]}`;
// 		console.log(month);
// 		if (month[0] == "0") {
// 			// console.log(month);
// 			// console.log(month[0]);
// 			month = month[1];
// 			// console.log(month);
// 		}
// 		console.log(month);
// 		let day = `${nextDate[9]}${nextDate[10]}`;
// 		if (day[0] == "0") {
// 			day = day[1];
// 		}
// 		let year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;

// 		let compressedDate = `${month}/${day}/${year}`;
// 		console.log("------------------------");
// 		console.log("compresses", compressedDate);
// 		friend.nextDate = compressedDate;

// 		await friend.save();
// 	}
// }

// async function reloadBase(friends) {
// 	for (let friend of friends) {
// 		let nextDate = friend.nextDate;
// 		let date = nextDate.split("/");
// 		if (date[0] < 10) {
// 			m = `0${date[0]}`;
// 		} else {
// 			m = `${date[0]}`;
// 		}
// 		if (date[1] < 10) {
// 			d = `0${date[1]}`;
// 		} else {
// 			d = `${date[1]}`;
// 		}
// 		y = date[2];
// 		nextDate = new Date(y, m - 1, d, 23, 59, 59, 999);
// 		baseDate = nextDate.addDays(-1 * friend.level);
// 		console.log("==================");
// 		console.log("base", baseDate);
// 		console.log("next", nextDate);
// 		friend.baseDate = baseDate;
// 		await friend.save();
// 		// nextDate = baseDate.addDays(friend.level);
// 		// //
// 		// nextDate = JSON.stringify(nextDate);
// 		// let month = `${nextDate[6]}${nextDate[7]}`;
// 		// if (month[0] == "0") {
// 		// 	month = month[1];
// 		// }
// 		// let day = `${nextDate[9]}${nextDate[10]}`;
// 		// if (day[0] == "0") {
// 		// 	day = day[1];
// 		// }
// 		// let year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;
// 		// let compressedDate = `${month}/${day}/${year}`;
// 		// console.log("next com", compressedDate);
// 		// console.log("==================");
// 		// friend.nextDate = compressedDate;
// 		// await friend.save();
// 	}
// }

// let date = new Date();

// console.log(date.addDays(5));
//make date

router.get(
	"/",
	catchAsync(async (req, res) => {
		const friends = await Friend.find({}).populate("author");

		// reloadDates(friends);
		// await reloadNext(friends);
		// await reloadBase(friends);
		await reloadDate(friends);

		//change this to index when done ; but in indexDeveloper while making changes
		res.render("friends/indexDeveloper", { friends });
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

		// console.log(" here ", friend);
		// console.log(friend.level);
		let date = new Date();
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

		friend.nextDate = compressedDate;
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
		//doing the update and seeing what happens
		let baseDate = friend.baseDate;
		let nextDate = baseDate.addDays(friend.level);
		nextDate = JSON.stringify(nextDate);

		month = `${nextDate[6]}${nextDate[7]}`;
		// console.log(month);
		if (month[0] == "0") {
			month = month[1];
		}
		// console.log(month);
		day = `${nextDate[9]}${nextDate[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		friend.nextDate = compressedDate;
		// console.log("------------------------");
		// console.log("compresses", compressedDate);

		//update

		friend.save();

		// friend;
		// reloadBase(friend);
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
			// do friend.nedxt = basedate.adddays(friend.level)
			//then turn it from an object bcak to m/d/y
			// await friend.save
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
