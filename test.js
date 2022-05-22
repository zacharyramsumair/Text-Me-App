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

// // start of reloadNext

// async function reloadNext(friends) {
// 	for (let friend of friends) {
// 		nextDate = friend.nextDate;
// 		while (new Date() > nextDate) {
// 			nextdate = nextdate.adddays(friend.level);
// 		}

// 		nextdate = JSON.stringify(nextDate);

// 		let month = `${nextDate[5]}${nextDate[6]}`;
// 		if (month[0] == "0") {
// 			month = month[1];
// 		}
// 		// console.log(month);
// 		let day = `${nextDate[8]}${nextDate[9]}`;
// 		if (day[0] == "0") {
// 			day = day[1];
// 		}
// 		let year = `${nextDate[0]}${nextDate[1]}${nextDate[2]}${nextDate[3]}`;

// 		compressedDate = `${month}/${day}/${year}`;

// 		friend.nextDate = compressedDate;
// 		await friend.save;
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

// 		// this to is for 11:59:59:999 so the last millisecond before the next day
// 		nextDate = `${y}-${m}-${d}T03:59:59.999Z`;
// 		nextDate = new Date(y, m - 1, d, 23, 59, 59, 999);
// 		// new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
// 		nextDate = JSON.stringify(nextDate);

// 		baseDate = nextDate.adddays(-1 * friend.level);
// 		friend.baseDate = baseDate;
// 		await friend.save;
// 	}
// }

// things i am console

let nextDate = new Date(2022, 5 - 1, 4, 23, 59, 59, 999);
Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

console.log("1st nextdate", nextDate);
while (new Date() > nextDate) {
	nextDate = nextDate.addDays(2);
}
console.log("2nd nextdate", nextDate);

nextDate = JSON.stringify(nextDate);
console.log("3d nextdate", nextDate);

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
console.log("compresses", compressedDate);
