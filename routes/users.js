const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const Friend = require("../models/friends");
const async = require("async");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
require("dotenv").config();

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res, next) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			req.login(registeredUser, (err) => {
				if (err) return next(err);
				req.flash("success", "Welcome to Text App!");
				res.redirect("/friends");
			});
		} catch (e) {
			req.flash("error", e.message);
			res.redirect("register");
		}
	})
);

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	(req, res) => {
		req.flash("success", "welcome back!");
		const redirectUrl = req.session.returnTo || "/friends";
		delete req.session.returnTo;
		res.redirect(redirectUrl);
	}
);

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Goodbye!");
	res.redirect("/");
});

//start of forgot password

// forgot password
router.get("/forgot", function (req, res) {
	res.render("users/forgot"  );
});

router.get("/forgotConfirm", function (req, res) {
	res.render("users/forgotConfirm"  );
});

router.post("/forgot", function (req, res, next) {
	async.waterfall(
		[
			function (done) {
				crypto.randomBytes(20, function (err, buf) {
					var token = buf.toString("hex");
					done(err, token);
				});
			},
			function (token, done) {
				User.findOne({ email: req.body.email }, function (err, user) {
					if (!user) {
						req.flash(
							"error",
							"No account with that email address exists."
						);
						return res.redirect("/forgot");
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

					user.save(function (err) {
						done(err, token, user);
					});
				});
			},

			function (token, user, done) {
				sgMail.setApiKey(process.env.SENDGRID_API_KEY);
				// console.log("this is done", done);
				const msg = {
					to: user.email, // Change to your recipient
					from: "reminderfortrinidad@gmail.com", // Change to your verified sender
					subject: "Change Password",
					text: "this is text",
					html:
						"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
						"Please click on the following link, or paste this into your browser to complete the process:\n\n" +
						"http://" +
						req.headers.host +
						"/reset/" +
						token +
						"\n\n" +
						"If you did not request this, please ignore this email and your password will remain unchanged.\n",
				};
				// done(err,  "done");

				sgMail
					.send(msg, user)
					.then((response, user) => {
						console.log(response[0].statusCode);
						console.log(response[0].headers);
						console.log("mail sent");

						res.redirect("/forgotConfirm" );
				

						// done(err, "done");
					})
					.catch((error) => {
						console.error(error);
						res.redirect("/forgot");
					});

				

				//may

				// console.log("mail sent");

				// },
				// 			//use of email
				// 			function (token, user, done) {
				// 				var smtpTransport = nodemailer.createTransport({
				// 					service: "Gmail",
				// 					auth: {
				// 						user: "zachlovesbbc@gmail.com",
				// 						// pass: process.env.GMAILPW,
				// 						pass: "kaelonhas9inches"
				// 					},
				// 				});
				// 				var mailOptions = {
				// 					to: user.email,
				// 					from: "learntocodeinfo@gmail.com",
				// 					subject: "Node.js Password Reset",
				// 					text:
				// "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
				// "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
				// "http://" +
				// req.headers.host +
				// "/reset/" +
				// token +
				// "\n\n" +
				// "If you did not request this, please ignore this email and your password will remain unchanged.\n",
				// 				};
				// 				smtpTransport.sendMail(mailOptions, function (err) {
				// 					console.log("mail sent");
				// 					req.flash(
				// 						"success",
				// 						"An e-mail has been sent to " +
				// 							user.email +
				// 							" with further instructions."
				// 					);
				// 					done(err, "done");
				// 				});
				// 			},
				// 		],
				// 		function (err) {
				// 			if (err) return next(err);
				// 			res.redirect("users/forgot");
				// 		}
				// 	);
				// });
			},
		]
		// function (user) {
		// 	console.log("mail sent");
		// 	req.flash(
		// 		"success",
		// 		"An e-mail has been sent to " +
		// 			user.email +
		// 			" with further instructions."
		// 	);
		// 	done(err, "done");
		// },
		// function (err) {
		// 	if (err) return next(err);
		// 	res.redirect("users/forgot");
		// }
	);
});

router.get("/reset/:token", function (req, res) {
	User.findOne(
		{
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		},
		function (err, user) {
			if (!user) {
				req.flash(
					"error",
					"Password reset token is invalid or has expired."
				);
				return res.redirect("/forgot");
			}
			res.render("users/reset", { token: req.params.token });
		}
	);
});

router.post("/reset/:token", function (req, res) {
	async.waterfall([
		function (done) {
			User.findOne(
				{
					resetPasswordToken: req.params.token,
					resetPasswordExpires: { $gt: Date.now() },
				},
				function (err, user) {
					if (!user) {
						req.flash(
							"error",
							"Password reset token is invalid or has expired."
						);
						return res.redirect("back");
					}
					if (req.body.password === req.body.confirm) {
						user.setPassword(req.body.password, function (err) {
							user.resetPasswordToken = undefined;
							user.resetPasswordExpires = undefined;

							user.save(function (err) {
								req.logIn(user, function (err) {
									done(err, user);
									return res.redirect("/friends")
								});
							});
						});
					} else {
						req.flash("error", "Passwords do not match.");
						return res.redirect("back");
					}
				}
			);
		},
		// 			//use of email
		// 			function (user, done) {

		// 				var smtpTransport = nodemailer.createTransport({
		// 					service: "Gmail",
		// 					auth: {
		// 						user: "learntocodeinfo@gmail.com",
		// 						pass: process.env.GMAILPW,
		// 					},
		// 				});
		// 				var mailOptions = {
		// 					to: user.email,
		// 					from: "learntocodeinfo@mail.com",
		// 					subject: "Your password has been changed",
		// 					text:
		// 						"Hello,\n\n" +
		// 						"This is a confirmation that the password for your account " +
		// 						user.email +
		// 						" has just been changed.\n",
		// 				};
		// 				smtpTransport.sendMail(mailOptions, function (err) {
		// 					req.flash("success", "Success! Your password has been changed.");
		// 					done(err);
		// 				});
		// 			},
		// 		],
		// 		function (err) {
		// 			res.redirect("/campgrounds");
		// 		}
		// 	);
		// });
	]);
});

module.exports = router;
