import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	GENERAL_CONTAINER,
	ACCOUNT_CONTAINER,
	PROJECT_CONTAINER,
	BUG_CONTAINER,
	COMMENT_CONTAINER,
} from "../../../../actions/constants/containerNames";

import {
	updateComment,
	clearBackendErrors,
	setWhichCommentComponentsDisplay,
} from "../../../../actions";

import {
	formatDateMMddYYYY,
	getTextColorClassNameForThemeWithLightOrDarkMode,
	getItemViewFormInputBorderBackgroundTextColorClassNameForThemeWithLightOrDarkMode,
	getItemViewCommentBoxIndividualCommentIconButtonTextColorClassNameForLightOrDarkMode,
	getCharCountLimitReachedTextColorClassNameForLightOrDarkMode,
	getBackendErrorsTextColorClassNameForLightOrDarkMode,
	getformSubmitButtonColorClassNameForTheme,
	getItemViewFormCancelButtonBackgroundColorClassNameForLightOrDarkMode,
} from "../../../../utils";

import { useSubmitFormOnEnter } from "../../../../utils/hooks";

export default function ItemViewCommentsBoxIndividualComment(props) {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	const [commentInfo, setCommentInfo] = useState({
		description: props.comment.description,
		// Following ids are used by the backend to ensure
		// ...the comment will belong to the correct account
		project_id: reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem.id,
		bug_id: reduxState[BUG_CONTAINER].componentsDisplay.targetItem.id,
	});

	// Custome hook will cause form to submit whenever the enter key is pressed
	useSubmitFormOnEnter("js-edit-comment-form");

	// clears prior backend errors when closing the component
	useEffect(() => {
		return () => {
			dispatch(clearBackendErrors());
		};
		// eslint-disable-next-line
	}, []);

	// Resets commentInfo when commentBeingEdited changes so changed
	// ...descriptions don't persist when cancel button is clicked
	// ...and when the comment list size changes since components
	// ...will not belond to the correct comment anymore
	useEffect(() => {
		setCommentInfo({
			// Default commentInfo values
			description: props.comment.description,
			project_id: reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem.id,
			bug_id: reduxState[BUG_CONTAINER].componentsDisplay.targetItem.id,
		});
		// eslint-disable-next-line
	}, [
		// eslint-disable-next-line
		reduxState[COMMENT_CONTAINER].componentsDisplay.commentBeingEdited,
		// eslint-disable-next-line
		reduxState[COMMENT_CONTAINER].list.length,
	]);

	const onChange = (e) => {
		// Since select option values are always strings while priority and status take integers
		if (e.target.name === "description") {
			// Doesn't allow line breaks
			setCommentInfo({
				...commentInfo,
				[e.target.name]: e.target.value.replace(/(\r\n|\n|\r)/gm, ""),
			});
		} else {
			setCommentInfo({ ...commentInfo, [e.target.name]: e.target.value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		dispatch(
			updateComment({
				...commentInfo,
				id:
					reduxState[COMMENT_CONTAINER].componentsDisplay.commentBeingEdited.id,
			})
		);
	};

	const switchToEditingComment = () => {
		dispatch(
			setWhichCommentComponentsDisplay({
				commentBeingEdited: props.comment,
			})
		);
	};

	const cancelEditingComment = () => {
		dispatch(clearBackendErrors());
		dispatch(setWhichCommentComponentsDisplay({}));
	};

	const openDeleteCommentModal = () => {
		dispatch(
			setWhichCommentComponentsDisplay({
				commentBeingEdited:
					reduxState[COMMENT_CONTAINER].componentsDisplay.commentBeingEdited,
				commentDeleteModal: true,
				commentToBeDeleted: props.comment,
			})
		);
	};

	return (
		<form className="js-edit-comment-form" noValidate onSubmit={handleSubmit}>
			<div className="comment-divider">
				{reduxState[COMMENT_CONTAINER].componentsDisplay.commentBeingEdited ===
					null ||
				reduxState[COMMENT_CONTAINER].componentsDisplay.commentBeingEdited
					.id !== props.comment.id ? (
					<div>
						<div className="comment__block">
							<span
								className={getTextColorClassNameForThemeWithLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode,
									reduxState[ACCOUNT_CONTAINER].settings.theme_color
								)}
							>
								{props.comment.description}
							</span>
						</div>
						<div className="comment__block">
							<span>{formatDateMMddYYYY(props.comment.creation_date)}</span>
							<div
								className={
									"comment__block__icon-button" +
									getItemViewCommentBoxIndividualCommentIconButtonTextColorClassNameForLightOrDarkMode(
										reduxState[ACCOUNT_CONTAINER].settings.dark_mode
									)
								}
								onClick={switchToEditingComment}
							>
								<i
									className="fa fa-pencil-square-o"
									aria-hidden="true"
									alt="Icon of a pencil"
								/>
							</div>
							<div
								className={
									"comment__block__icon-button" +
									getItemViewCommentBoxIndividualCommentIconButtonTextColorClassNameForLightOrDarkMode(
										reduxState[ACCOUNT_CONTAINER].settings.dark_mode
									)
								}
								onClick={openDeleteCommentModal}
							>
								<i
									className="fa fa-trash-o"
									aria-hidden="true"
									alt="Icon of a trash can"
								/>
							</div>
						</div>
					</div>
				) : (
					<div>
						<span
							className={
								"item-box__form-char-counter" +
								(reduxState[GENERAL_CONTAINER].globalConstants
									.descriptionCharLimit < commentInfo.description.length
									? getCharCountLimitReachedTextColorClassNameForLightOrDarkMode(
											reduxState[ACCOUNT_CONTAINER].settings.dark_mode
									  )
									: "")
							}
						>
							{commentInfo.description.length +
								"/" +
								reduxState[GENERAL_CONTAINER].globalConstants
									.descriptionCharLimit}
						</span>
						<textarea
							name="description"
							onChange={(e) => onChange(e)}
							value={commentInfo.description}
							id="edit-comment-description"
							className={
								"item-box__form-textarea item-box__form-textarea--shorter" +
								getItemViewFormInputBorderBackgroundTextColorClassNameForThemeWithLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode,
									reduxState[ACCOUNT_CONTAINER].settings.theme_color
								)
							}
						/>
						<span>{formatDateMMddYYYY(props.comment.creation_date)}</span>
						<div
							className={
								"comment__block__icon-button" +
								getItemViewCommentBoxIndividualCommentIconButtonTextColorClassNameForLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode
								)
							}
							onClick={openDeleteCommentModal}
						>
							<i
								className="fa fa-trash-o"
								aria-hidden="true"
								alt="Icon of a trash can"
							/>
						</div>
						<span
							className={
								"backend-errors backend-errors--edit-comment" +
								getBackendErrorsTextColorClassNameForLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode
								)
							}
						>
							{
								reduxState[GENERAL_CONTAINER].backendErrors
									.validationEditCommentDescription
							}
							{reduxState[GENERAL_CONTAINER].backendErrors.validationComment}
							{reduxState[GENERAL_CONTAINER].backendErrors.serverItem}
							{reduxState[GENERAL_CONTAINER].backendErrors.serverConnection}
						</span>
						<div className="comment__centering-container">
							<div className="comment__centering-container__pair-container">
								<button
									type="submit"
									className={
										"comment__centering-container__pair-container__submit-edit-button" +
										getformSubmitButtonColorClassNameForTheme(
											reduxState[ACCOUNT_CONTAINER].settings.theme_color
										)
									}
								>
									Edit Comment
								</button>
								<div
									className={
										"comment__centering-container__pair-container__cancel-button" +
										getItemViewFormCancelButtonBackgroundColorClassNameForLightOrDarkMode(
											reduxState[ACCOUNT_CONTAINER].settings.dark_mode
										)
									}
									onClick={cancelEditingComment}
								>
									Cancel
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</form>
	);
}
