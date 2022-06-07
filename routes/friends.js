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
	// const { error } = friendSchema.validate(req.body);
	// if (error) {
	// 	const msg = error.details.map((el) => el.message).join(",");
	// 	throw new ExpressError(msg, 400);
	// } else {
	// 	next();
	// }
	const { error1 } = friendSchema.validate(req.body.name);
	const { error2 } = friendSchema.validate(req.body.level);
	const { error3 } = friendSchema.validate(req.body.description);
	if (error1) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		if (error2) {
			const msg = error.details.map((el) => el.message).join(",");
			throw new ExpressError(msg, 400);
		} else {
			if (error3) {
				const msg = error.details.map((el) => el.message).join(",");
				throw new ExpressError(msg, 400);
			} else {
				next();
			}
		}
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

router.get(
	"/",
	catchAsync(async (req, res) => {
		const friends = await Friend.find({}).populate("author");

		//get today date and date for the next 7 days
		let todayDate = new Date();
		let todayAndOne = todayDate.addDays(1);
		let todayAndTwo = todayDate.addDays(2);
		let todayAndThree = todayDate.addDays(3);
		let todayAndFour = todayDate.addDays(4);
		let todayAndFive = todayDate.addDays(5);
		let todayAndSix = todayDate.addDays(6);
		let todayAndSeven = todayDate.addDays(7);

		function ObjectToString(date) {
			date = JSON.stringify(date);
			console.log("date7", date);

			month = `${date[6]}${date[7]}`;
			// console.log(month);
			if (month[0] == "0") {
				month = month[1];
			}
			// console.log(month);
			day = `${date[9]}${date[10]}`;
			if (day[0] == "0") {
				day = day[1];
			}
			year = `${date[1]}${date[2]}${date[3]}${date[4]}`;

			let compressedDate = `${month}/${day}/${year}`;
			return compressedDate;
		}

		todayDate = ObjectToString(todayDate);
		todayAndOne = ObjectToString(todayAndOne);
		todayAndTwo = ObjectToString(todayAndTwo);
		todayAndThree = ObjectToString(todayAndThree);
		todayAndFour = ObjectToString(todayAndFour);
		todayAndFive = ObjectToString(todayAndFive);
		todayAndSix = ObjectToString(todayAndSix);
		todayAndSeven = ObjectToString(todayAndSeven);

		//end

		await reloadDate(friends);

		//change this to index when done ; but in indexDeveloper while making changes
		res.render("friends/indexDeveloper", {
			friends,
			todayDate,
			todayAndOne,
			todayAndTwo,
			todayAndThree,
			todayAndFour,
			todayAndFive,
			todayAndSix,
			todayAndSeven,
		});
		// res.render("friends/index", { friends });
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

		friend.name2 = req.body.friend.name2;
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
