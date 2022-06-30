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

	//start
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

	//end
};

async function reloadDate(friends) {
	for (let friend of friends) {
		let nextDate = friend.nextDate;

		let baseDate = friend.baseDate;
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
		nextDate = new Date(y, m - 1, d - 1, 23, 59, 59, 999);

		// while (new Date() > nextDate) {

		// }

		//get date of today at 12:00 am

		let today = JSON.stringify(new Date());

		let month = `${today[6]}${today[7]}`;

		if (month[0] == "0") {
			month = month[1];
		}

		let day = `${today[9]}${today[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		let year = `${today[1]}${today[2]}${today[3]}${today[4]}`;

		startToday = new Date(year, month - 1, day, 0, 0, 0, 0);

		if (new Date() > nextDate) {
			while (baseDate < startToday) {
				baseDate = baseDate.addDays(friend.level);
			}
			//gonna change it by -1
			// nextDate = baseDate.addDays(-1);
			//end check

			// nextDate = baseDate;

			baseDate = baseDate.addDays(-friend.level);
			nextDate = baseDate.addDays(friend.level);
		}
		// console.log("==================");
		// console.log("nextdate", nextDate);
		friend.displayedNextDate = nextDate.toDateString();
		nextDate = JSON.stringify(nextDate);

		month = `${nextDate[6]}${nextDate[7]}`;

		if (month[0] == "0") {
			month = month[1];
		}

		day = `${nextDate[9]}${nextDate[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;

		let compressedDate = `${month}/${day}/${year}`;

		friend.nextDate = compressedDate;
		friend.baseDate = baseDate;

		// console.log( "reload Next", friend.nextDate)
		// console.log( "reload base", friend.baseDate)
		await friend.save();
	}
}

router.get(
	"/", isLoggedIn,
	// "/", 
	catchAsync(async (req, res) => {
		const friends = await Friend.find({}).populate("author");

		//make sure
		let makeSure = new Date();
		makeSure = JSON.stringify(makeSure)
		
		let month = `${makeSure[6]}${makeSure[7]}`;
		if (month[0] == "0") {
			month = month[1];
		}
		
		let day = `${makeSure[9]}${makeSure[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		let year = `${makeSure[1]}${makeSure[2]}${makeSure[3]}${makeSure[4]}`;

		let reallyMakeSure = new Date(year, month-1 , day)
		// console.log('really', reallyMakeSure)
		// let reallyMakeSure = new Date(year, month-1 , day-1)
		//end make sure
		//get today date and date for the next 7 days
		let todayDate = reallyMakeSure
		let todayAndOne = todayDate.addDays(1);
		let todayAndTwo = todayDate.addDays(2);
		let todayAndThree = todayDate.addDays(3);
		let todayAndFour = todayDate.addDays(4);
		let todayAndFive = todayDate.addDays(5);
		let todayAndSix = todayDate.addDays(6);
		let todayAndSeven = todayDate.addDays(7);

		function ObjectToString(date) {
			date = JSON.stringify(date);
			// console.log("date7", date);

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
		let upcomingDays = [
			todayAndOne,
			todayAndTwo,
			todayAndThree,
			todayAndFour,
			todayAndFive,
			todayAndSix,
			todayAndSeven,
		];
		//end

		// console.log('todayDate',todayDate)

		await reloadDate(friends);

		
		res.render("friends/indexDeveloper2", {
			friends,
			todayDate,
			upcomingDays,
		});

		
		// res.render("friends/index", {
		// 	friends,
		// 	todayDate,
		// 	upcomingDays,
		// });

		//this is the end
	})
);

router.get("/new", isLoggedIn, (req, res) => {
	res.render("friends/new");
});

router.get("/test",  (req, res) => {
	res.render("friends/test");
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

		//start 
		// const { name, description, level, category  } = req.body;
		// const friend = new Friend({ name, description, level, category  });
		// const friend = new Friend(req.body.friend);
		// eval(locus);
		//end
		
		// console.log('this si the req',req.body)
		// const friend = new Friend({
		// 	name : req.body.name,
		// 	category : req.body.category,
		// 	level : req.body.level,
		// 	description : req.body.description,
		// });

		// console.log('this si my friend',friend)


		const friend = new Friend(req.body.friend);

		//make sure we really get todays date
		let makeSure = new Date();
		makeSure = JSON.stringify(makeSure)
		
		let month = `${makeSure[6]}${makeSure[7]}`;
		if (month[0] == "0") {
			month = month[1];
		}
		
		let day = `${makeSure[9]}${makeSure[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		let year = `${makeSure[1]}${makeSure[2]}${makeSure[3]}${makeSure[4]}`;

		let reallyMakeSure = new Date(year, month-1 , day)
		// reallyMakeSure=reallyMakeSure.toDateString()
		// end of make sure

		// friend.name2 = req.body.friend.name2;
		
		let date = reallyMakeSure
		let prestring = date.addDays(friend.level);
		// console.log("prestring 1", prestring);
		// if I didn't put the adddays -1 , you would end up with something like this
		// next date on the 17th and displayednext date on the 16th , when the base is 10 and level is 6
		let string = JSON.stringify(prestring.addDays(0));
		// console.log("string 1", string);

		// console.log("==================");
		// console.log("prestring", prestring);
		friend.displayedNextDate = prestring.toDateString();
		 month = `${string[6]}${string[7]}`;
		if (month[0] == "0") {
			month = month[1];
		}
		// console.log(month);
		 day = `${string[9]}${string[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		 year = `${string[1]}${string[2]}${string[3]}${string[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		friend.baseDate = reallyMakeSure
		// console.log("basedate re 0", friend.baseDate);

		friend.nextDate = compressedDate;
		friend.author = req.user._id;
		await friend.save();
		// console.log(friend);
		req.flash("success", "Successfully made a new reminder!");

		res.redirect(`/friends/${friend._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const friend = await Friend.findById(req.params.id).populate("author");
		if (!friend) {
			req.flash("error", "Cannot find that reminder!");

			return res.redirect("/friends");
		}
		//doing the update and seeing what happens
		let baseDate = friend.baseDate;
		let nextDate = baseDate.addDays(friend.level);
		// console.log("==================");
		// console.log("nextdate", nextDate);
		friend.displayedNextDate = nextDate.toDateString();
		nextDate = JSON.stringify(nextDate);

		month = `${nextDate[6]}${nextDate[7]}`;
		if (month[0] == "0") {
			month = month[1];
		}
		day = `${nextDate[9]}${nextDate[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		friend.nextDate = compressedDate;

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
			req.flash("error", "Cannot find that reminder!");

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
		req.flash("success", "Successfully updated a reminder!");

		res.redirect(`/friends/${friend._id}`);
	})
);

router.delete(
	"/:id",
	isLoggedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Friend.findByIdAndDelete(id);
		req.flash("success", "Successfully deleted a reminder!");

		res.redirect("/friends");
	})
);

module.exports = router;
