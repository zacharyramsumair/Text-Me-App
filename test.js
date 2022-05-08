Date.prototype.addDays = function (days) {
	let date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

let date = new Date();

console.log(JSON.stringify(date.addDays(5)));

let string = JSON.stringify(date.addDays(5));

let month = `${string[6]}${string[7]}`;
if (month[0] == "0") {
	month = month[1];
}
console.log(month);
let day = `${string[9]}${string[10]}`;
if (day[0] == "0") {
	day = day[1];
}
let year = `${string[1]}${string[2]}${string[3]}${string[4]}`;

let compressedDate = `${month}/${day}/${year}`;
console.log(compressedDate);
