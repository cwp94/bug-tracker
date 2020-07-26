const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = (req, res, next) => {
	let inputErrors = {};

	try {
		let { name, description } = req.body;

		// Convert empty fields to an empty string so we can use validator functions
		name = !isEmpty(name) ? name : "";
		description = !isEmpty(description) ? description : "";

		// Name checks
		if (Validator.isEmpty(name)) {
			inputErrors.name = "Name field is required";
		} else if (!Validator.isLength(name, { max: 35 })) {
			inputErrors.name = "Name can't be longer than 35 characters";
		}

		// Description checks
		if (!Validator.isLength(description, { max: 2000 })) {
			inputErrors.description = "Description can't be longer than 2000 characters";
		}

		if (!isEmpty(inputErrors)) {
			return res.status(400).json({ success: true, inputErrors });
		}

		next();
	} catch (err) {
		console.error(err.message);
		inputErrors.validation = "Validation Error";
		return res.status(403).json({ success: true, inputErrors });
	}
};
