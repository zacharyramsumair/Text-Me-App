Date.prototype.addDays = function (days) {
	let date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

// let date = new Date();
// let p = JSON.stringify(date.addDays(5));

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
