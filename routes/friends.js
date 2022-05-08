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

router.get(
	"/",
	catchAsync(async (req, res) => {
		const friends = await Friend.find({});
		res.render("friends/index", { friends });
	})
);

router.get("/new", isLoggedIn, (req, res) => {
	res.render("friends/new");
});

router.post(
	"/",
	isLoggedIn,
	validateFriend,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
		const friend = new Friend(req.body.friend);
		await friend.save();
		req.flash("success", "Successfully made a new friend!");

		res.redirect(`/friends/${friend._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const friend = await Friend.findById(req.params.id);
		if (!friend) {
			req.flash("error", "Cannot find that friend!");

			return res.redirect("/friends");
		}
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
