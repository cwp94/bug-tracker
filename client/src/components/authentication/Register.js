import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GENERAL_CONTAINER } from "../../actions/constants/containerNames";

import {
	registerAccount,
	clearBackendErrors,
	setWhichGeneralComponentsDisplay,
} from "../../actions";

import { getCharCountLimitReachedTextColorClassNameForLightOrDarkMode } from "../../utils";

export default function Register() {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	const [accountInfo, setAccountInfo] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
	});

	// clears prior backend errors when closing the component
	useEffect(() => {
		return () => {
			dispatch(clearBackendErrors());
		};
		// eslint-disable-next-line
	}, []);

	const onChange = (e) => {
		setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(registerAccount(accountInfo));
	};

	const openLogin = () => {
		dispatch(setWhichGeneralComponentsDisplay({ login: true }));
	};

	return (
		<div className="register-login-components">
			<div className="background" />
			<div className="border-container">
				<h1 className="title">Register</h1>
				<form className="form" noValidate onSubmit={handleSubmit}>
					<div className="form__pair-container">
						<div className="form__pair-container__single-container">
							<label htmlFor="register-first-name" className="form__label">
								First name
							</label>
							{accountInfo.first_name.length >
							reduxState[GENERAL_CONTAINER].globalConstants.nameCharLimit ? (
								<span
									className={
										"form__char-counter" +
										getCharCountLimitReachedTextColorClassNameForLightOrDarkMode(
											false
										)
									}
								>
									{accountInfo.first_name.length +
										"/" +
										reduxState[GENERAL_CONTAINER].globalConstants.nameCharLimit}
								</span>
							) : null}
							<input
								type="text"
								name="first_name"
								onChange={(e) => onChange(e)}
								value={accountInfo.first_name}
								id="register-first-name"
								className="form__input-text"
							/>
							<span className="backend-errors">
								{
									reduxState[GENERAL_CONTAINER].backendErrors
										.validationAccountFirstName
								}
							</span>
						</div>
						<div className="form__pair-container__single-container form__pair-container__single-container--right">
							<label htmlFor="register-last-name" className="form__label">
								Last name
							</label>
							{accountInfo.last_name.length >
							reduxState[GENERAL_CONTAINER].globalConstants.nameCharLimit ? (
								<span
									className={
										"form__char-counter" +
										getCharCountLimitReachedTextColorClassNameForLightOrDarkMode(
											false
										)
									}
								>
									{accountInfo.last_name.length +
										"/" +
										reduxState[GENERAL_CONTAINER].globalConstants.nameCharLimit}
								</span>
							) : null}
							<input
								type="text"
								name="last_name"
								onChange={(e) => onChange(e)}
								value={accountInfo.last_name}
								id="register-last-name"
								className="form__input-text"
							/>
							<span className="backend-errors">
								{
									reduxState[GENERAL_CONTAINER].backendErrors
										.validationAccountLastName
								}
							</span>
						</div>
					</div>
					<label htmlFor="register-email" className="form__label">
						Email
					</label>
					<input
						type="email"
						name="email"
						onChange={(e) => onChange(e)}
						value={accountInfo.email}
						id="register-email"
						className="form__input-text"
					/>
					<span className="backend-errors">
						{reduxState[GENERAL_CONTAINER].backendErrors.validationAccountEmail}
					</span>
					<label htmlFor="register-password" className="form__label">
						Password
					</label>
					{accountInfo.password.length >
					reduxState[GENERAL_CONTAINER].globalConstants.passwordCharLimit ? (
						<span
							className={
								"form__char-counter" +
								getCharCountLimitReachedTextColorClassNameForLightOrDarkMode(
									false
								)
							}
						>
							{accountInfo.password.length +
								"/" +
								reduxState[GENERAL_CONTAINER].globalConstants.passwordCharLimit}
						</span>
					) : null}
					<input
						type="password"
						name="password"
						onChange={(e) => onChange(e)}
						value={accountInfo.password}
						id="register-password"
						className="form__input-text"
					/>
					<span className="backend-errors">
						{
							reduxState[GENERAL_CONTAINER].backendErrors
								.validationAccountPassword
						}
					</span>
					<button type="submit" className="form__submit">
						REGISTER
					</button>
					<span className="backend-errors">
						{reduxState[GENERAL_CONTAINER].backendErrors.validationAccount}
						{reduxState[GENERAL_CONTAINER].backendErrors.serverAccount}
						{reduxState[GENERAL_CONTAINER].backendErrors.serverConnection}
					</span>
				</form>
				<div className="bottom-question">
					<span>Already a Member?</span>
					<span className="bottom-question__link" onClick={openLogin}>
						Login
					</span>
				</div>
			</div>
		</div>
	);
}
