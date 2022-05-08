const Joi = require("joi");

module.exports.friendSchema = Joi.object({
	friend: Joi.object({
		name: Joi.string().required(),
		level: Joi.string().required(),
		description: Joi.string().required(),
	}).required(),
});
