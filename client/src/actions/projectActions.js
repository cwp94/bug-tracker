import axios from "axios";
import { setInputErrors } from "./index";
import { logoutAccount } from "./accountActions";
import { setWhichProjectComponentsDisplay } from "./componentActions";
import { setProjectOrBugMassDeleteList } from "./switchActions";
import { projectContainerName } from "../reducers/containerNames";
import { PROJECT_CONTAINER } from "./typeContainer";
import { SET_LIST } from "./types";

export const setProjects = (list) => (dispatch) => {
	dispatch({
		container: PROJECT_CONTAINER,
		type: SET_LIST,
		list: list,
	});
};

export const createProject = (projectInfo) => (dispatch) => {
	const headers = { headers: { jwToken: localStorage.jwToken } };
	axios
		.post("/api/project/create", projectInfo, headers)
		.then((res) => {
			const { projects } = res.data;
			dispatch(setProjects(projects));
			dispatch(setWhichProjectComponentsDisplay({ listContainer: true }));
		})
		.catch((err) => {
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				dispatch(logoutAccount());
			}
		});
};

export const retrieveProjects = () => (dispatch) => {
	const headers = { headers: { jwToken: localStorage.jwToken } };
	axios
		.post("/api/project/retrieve", null, headers)
		.then((res) => {
			const { projects } = res.data;
			dispatch(setProjects(projects));
		})
		.catch((err) => {
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				dispatch(logoutAccount());
			}
		});
};

export const updateProject = (projectInfo, projectComponentsDisplay) => (
	dispatch
) => {
	const headers = { headers: { jwToken: localStorage.jwToken } };
	axios
		.post("/api/project/update", projectInfo, headers)
		.then((res) => {
			const { projects } = res.data;
			dispatch(setProjects(projects));
			// Done here so components only changes when update is succesful
			dispatch(
				setWhichProjectComponentsDisplay({
					...projectComponentsDisplay,
					// Set redux target project to match project update on server side
					targetItem: projects.filter((project) => {
						return project.id === projectInfo.id;
					})[0],
					itemContainerEditInfo: false,
				})
			);
		})
		.catch((err) => {
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				dispatch(logoutAccount());
			}
		});
};

export const deleteProject = (id, massDeleteList, indexOfTargetProjectId) => (
	dispatch
) => {
	const headers = { headers: { jwToken: localStorage.jwToken } };
	axios
		.post("/api/project/delete", id, headers)
		.then((res) => {
			const { projects } = res.data;
			dispatch(setProjects(projects));
			// Done here so following code only runs if deletion is succesful
			if (indexOfTargetProjectId > -1) {
				console.log(massDeleteList);
				massDeleteList.splice(indexOfTargetProjectId, 1);
				console.log(massDeleteList);
				dispatch(
					setProjectOrBugMassDeleteList(projectContainerName, massDeleteList)
				);
			}
			dispatch(
				setWhichProjectComponentsDisplay({
					listContainer: true,
				})
			);
		})
		.catch((err) => {
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				dispatch(logoutAccount());
			}
		});
};

export const deleteMultipleProjects = (
	massDeleteList,
	projectComponentsDisplay
) => (dispatch) => {
	const headers = { headers: { jwToken: localStorage.jwToken } };
	axios
		.post(
			"/api/project/delete-multiple",
			{ projectsArray: massDeleteList },
			headers
		)
		.then((res) => {
			const { projects } = res.data;
			dispatch(setProjects(projects));
			// Done here so following code only runs if deletion is succesful
			dispatch(setProjectOrBugMassDeleteList(projectContainerName, []));
			dispatch(
				setWhichProjectComponentsDisplay({
					...projectComponentsDisplay,
					listContainerMassDeleteItemsModal: false,
				})
			);
		})
		.catch((err) => {
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				dispatch(logoutAccount());
			}
		});
};
