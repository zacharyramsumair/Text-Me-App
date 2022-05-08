import ThisPersonDoesNotExist from "thispersondoesnotexist-js";

const dnte = new ThisPersonDoesNotExist();

dnte
	.getImage()
	.then((res) => {
		console.log("result->", res);
	})
	.catch((err) => {
		console.log("error->", err);
	});
