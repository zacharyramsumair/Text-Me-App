const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const friendRoutes = require("./routes/friends");
const userRoutes = require("./routes/users");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const MongoStore = require('connect-mongo');


const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/text-app"


// mongoose.connect(dbUrl);
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';


// app.use(session({
// 	store: MongoStore.create({
// 	  mongoUrl: dbUrl,
// 	  secret,
//   	touchAfter: 24 * 60 * 60
// 	})
//   }));

// const store = new MongoStore ({
//   url: dbUrl,
//   secret,
//   touchAfter: 24 * 60 * 60
// });
// store.on("error", function(e){
//   console.log("Session store error", e)
// })

const sessionConfig = {
	store: MongoStore.create({
		mongoUrl: dbUrl,
		secret,
		touchAfter: 24 * 3600 // time period in seconds
	  })
	  
	  ,


	name:"session",
	secret: secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

//dates
// Date.prototype.addDays = function (days) {
// 	let date = new Date(this.valueOf());
// 	date.setDate(date.getDate() + days);
// 	return date;
// };

// let date = new Date();

// console.log(date.addDays(5));

//dates

app.use("/", userRoutes);
app.use("/friends", friendRoutes);

app.get("/", (req, res) => {
	res.render("home");
});

app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Oh No, Something Went Wrong!";
	res.status(statusCode).render("error", { err });
});

const port =  process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});
