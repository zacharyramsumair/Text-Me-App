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
		nextDate = new Date(y, m - 1, d, 23, 59, 59, 999);
		// while (new Date() > nextDate) {

		// }

		//get date of today at 12:00 am

		let today = JSON.stringify(new Date());

		let month = `${today[6]}${today[7]}`;
		console.log(month);
		if (month[0] == "0") {
			// console.log(month);
			// console.log(month[0]);
			month = month[1];
			// console.log(month);
		}
		console.log(month);
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
			nextDate = baseDate;
			baseDate = baseDate.addDays(-friend.level);
		}

		nextDate = JSON.stringify(nextDate);

		month = `${nextDate[6]}${nextDate[7]}`;
		console.log(month);
		if (month[0] == "0") {
			month = month[1];
		}
		console.log(month);
		day = `${nextDate[9]}${nextDate[10]}`;
		if (day[0] == "0") {
			day = day[1];
		}
		year = `${nextDate[1]}${nextDate[2]}${nextDate[3]}${nextDate[4]}`;

		let compressedDate = `${month}/${day}/${year}`;
		console.log("------------------------");
		console.log("compresses", compressedDate);
		friend.nextDate = compressedDate;
		friend.baseDate = baseDate;

		await friend.save();
	}
}
