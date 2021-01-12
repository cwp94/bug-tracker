import React from "react";
import { useSelector } from "react-redux";

// Components
import ListViewSearchFilterSortBar from "./ListViewSearchFilterSortBar";
import ListViewCreateItemSidebar from "./ListViewCreateItemSidebar";
import ListViewTable from "./ListViewTable";
import ListViewMassDeleteItemsModal from "./ListViewMassDeleteItemsModal";

export default function ListView(props) {
	const reduxState = useSelector((state) => state);

	return (
		<div className="list-container-component">
			<ListViewSearchFilterSortBar
				reduxContainerName={props.reduxContainerName}
			/>
			{reduxState[props.reduxContainerName].componentsDisplay.listViewCreateItemSidbar ? (
				<ListViewCreateItemSidebar reduxContainerName={props.reduxContainerName} />
			) : null}
			<ListViewTable reduxContainerName={props.reduxContainerName} />
			{reduxState[props.reduxContainerName].componentsDisplay.listViewMassDeleteItemsModal ? (
				<ListViewMassDeleteItemsModal reduxContainerName={props.reduxContainerName} />
			) : null}
		</div>
	);
}