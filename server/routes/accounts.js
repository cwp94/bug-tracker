// Database
const express = require("express");
const pool = require("../db");
const router = express.Router();
// Security
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Middleware
const validateRegisterInput = require("../middleware/validation/registerValidation");
const validateLoginInput = require("../middleware/validation/loginValidation");
const validateInfoUpdateInput = require("../middleware/validation/updateInfoValidation");
const validateEmailUpdateInput = require("../middleware/validation/updateEmailValidation");
const validatePasswordUpdateInput = require("../middleware/validation/updatePasswordValidation");
const passwordAuthentication = require("../middleware/auth/passwordAuthentication");
const tokenAuthorization = require("../middleware/auth/tokenAuthorization");
// Used instead of the Date function
const moment = require("moment");

//==================
// Register account
//==================
router.route("/register").post(validateRegisterInput, async (req, res) => {
	let inputErrors = {};

	try {
		const { email, password, firstName, lastName } = req.body;
		// Moment() is easier to use than Date()
		const join_date = moment().format("YYYY-MM-DD");
		let inputErrors = {};

		// Verify that email does not already exist
		const activeAccounts = await pool.query(
			"SELECT * FROM account WHERE email = $1",
			[email]
		);

		if (activeAccounts.rows.length > 0) {
			inputErrors = { email: "Email already in use" };
			return res.status(400).json({ success: false, inputErrors });
		}

		// Generate hashed password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, async (err, hash) => {
				if (err) throw err;

				const newAccount = await pool.query(
					"INSERT INTO account (email, hash_pass, first_name, last_name, join_date) VALUES($1, $2, $3, $4, $5)",
					[email, hash, firstName, lastName, join_date]
				);

				if (newAccount.rowCount === 0) {
					inputErrors.account = "Could not create account";
					return res.status(500).json({ success: false, inputErrors });
				}

				res.json({ success: true, message: "Account created" });
			});
		});
	} catch (err) {
		console.error(err.message);
		inputErrors.server = "Server Error";
		return res.status(500).json({ success: false, inputErrors });
	}
});

//===============
// Login account
//===============
router.route("/login").post(validateLoginInput, async (req, res) => {
	let inputErrors = {};

	try {
		const { email, password } = req.body;
		let inputErrors = {};

		// Verifies that an account with that email exisits
		const account = await pool.query(
			"SELECT account_id, email, hash_pass, first_name, last_name, join_date FROM account WHERE LOWER(email) = LOWER($1)",
			[email]
		);

		if (account.rows.length === 0) {
			inputErrors = { email: "Email unregistered" };
			return res.status(401).json({ success: false, inputErrors });
		}

		// Verfies that password is correct
		const passwordMatch = await bcrypt.compare(
			password,
			account.rows[0].hash_pass
		);

		if (!passwordMatch) {
			inputErrors = { password: "Incorrect password" };
			return res.status(401).json({ success: false, inputErrors });
		}

		const accountPayload = {
			accountId: account.rows[0].account_id,
			email: account.rows[0].email,
			firstName: account.rows[0].first_name,
			lastName: account.rows[0].last_name,
			joinDate: account.rows[0].join_date,
		};

		const tokenPayload = {
			accountId: account.rows[0].account_id,
		};

		// Sign token
		jwt.sign(
			tokenPayload,
			process.env.jwtSecret,
			{
				expiresIn: "1m",
			},
			(err, jwToken) => {
				res.json({
					success: true,
					jwToken: jwToken,
					account: accountPayload,
				});
			}
		);
	} catch (err) {
		console.error(err.message);
		inputErrors.server = "Server Error";
		return res.status(500).json({ success: false, inputErrors });
	}
});

//=====================
// Check authorization
//=====================
router
	.route("/check-authorization")
	.get(tokenAuthorization, async (req, res) => {
		let inputErrors = {};

		try {
			res.json(true);
		} catch (err) {
			console.error(err.message);
			inputErrors.authorization = "Not authorized";
			return res.status(403).json({ success: false, inputErrors });
		}
	});

//===================
//  Retrieve account
//===================
router.route("/retrieve").get(tokenAuthorization, async (req, res) => {
	let inputErrors = {};

	try {
		// declared in the tokenAuthorization middleware
		const { accountId } = req;

		const account = await pool.query(
			"SELECT email, first_name, last_name, join_date FROM account WHERE account_id = $1",
			[accountId]
		);

		if (account.rows.length === 0) {
			inputErrors.account = "Account not found";
			return res.status(401).json({ success: false, inputErrors });
		}

		const accountPayload = {
			accountId: accountId,
			email: account.rows[0].email,
			firstName: account.rows[0].first_name,
			lastName: account.rows[0].last_name,
			joinDate: account.rows[0].join_date,
		};

		res.json(accountPayload);
	} catch (err) {
		console.error(err.message);
		inputErrors.server = "Server Error";
		return res.status(500).json({ success: false, inputErrors });
	}
});

module.exports = router;

//=====================
// Update account info
//=====================
router
	.route("/update-info")
	.post(tokenAuthorization, validateInfoUpdateInput, async (req, res) => {
		let inputErrors = {};

		try {
			// declared in the tokenAuthorization middleware
			const { accountId } = req;
			// passed in the body
			const { firstName, lastName } = req.body;

			const updatedAccount = await pool.query(
				"UPDATE account SET first_name = $1, last_name = $2 WHERE account_id = $3",
				[firstName, lastName, accountId]
			);

			if (updatedAccount.rowCount === 0) {
				inputErrors.account = "Could not be updated";
				return res.status(500).json({ success: false, inputErrors });
			}

			res.json({ success: true, message: "Account Info Updated" });
		} catch (err) {
			console.error(err.message);
			inputErrors.server = "Server Error";
			return res.status(500).json({ success: false, inputErrors });
		}
	});

//======================
// Update account email
//======================
router
	.route("/update-email")
	.post(
		tokenAuthorization,
		validateEmailUpdateInput,
		passwordAuthentication,
		async (req, res) => {
			let inputErrors = {};

			try {
				// declared in the tokenAuthorization middleware
				const { accountId } = req;
				// passed in the body
				const { email } = req.body;

				const updatedAccount = await pool.query(
					"UPDATE account SET email = $1 WHERE account_id = $2",
					[email, accountId]
				);

				if (updatedAccount.rowCount === 0) {
					inputErrors.account = "Could not be updated";
					return res.status(500).json({ success: false, inputErrors });
				}

				res.json({ success: true, message: "Account Info Updated" });
			} catch (err) {
				console.error(err.message);
				inputErrors.server = "Server Error";
				return res.status(500).json({ success: false, inputErrors });
			}
		}
	);

//=========================
// Update account password
//=========================
router
	.route("/update-password")
	.post(
		tokenAuthorization,
		validatePasswordUpdateInput,
		passwordAuthentication,
		(req, res) => {
			let inputErrors = {};

			try {
				// declared in the tokenAuthorization middleware
				const { accountId } = req;
				// passed in the body
				const { newPassword } = req.body;

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newPassword, salt, async (err, hash) => {
						if (err) throw err;

						const updatedAccount = await pool.query(
							"UPDATE account SET hash_pass = $1 WHERE account_id = $2",
							[hash, accountId]
						);

						if (updatedAccount.rowCount === 0) {
							inputErrors.account = "Could not be updated";
							return res.status(500).json({ success: false, inputErrors });
						}

						res.json({ success: true, message: "Account Info Updated" });
					});
				});
			} catch (err) {
				console.error(err.message);
				inputErrors.server = "Server Error";
				return res.status(500).json({ success: false, inputErrors });
			}
		}
	);

//================
// Delete account
//================
router
	.route("/delete")
	.post(tokenAuthorization, passwordAuthentication, async (req, res) => {
		let inputErrors = {};

		try {
			// declared in the tokenAuthorization middleware
			const { accountId } = req;

			const deletedAccount = await pool.query(
				"DELETE FROM account WHERE account_id = $1",
				[accountId]
			);

			if (deletedAccount.rowCount === 0) {
				inputErrors.account = "Could not be deleted";
				return res.status(500).json({ success: false, inputErrors });
			}

			return res.json({ success: true, message: "Account Deleted" });
		} catch (err) {
			console.error(err.message);
			inputErrors.server = "Server Error";
			return res.status(500).json({ success: false, inputErrors });
		}
	});