import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox(props) {
	return (
		<Card
			onClick={props.onClick}
			className={`infobox ${props.active && "infoBox--selected"} ${
				props.isRed && "infoBox--red"
			}`}
		>
			<CardContent>
				<Typography className="infobox_title" color="textSecondary">
					{props.title}
				</Typography>
				<h2
					className={`infobox_cases ${!props.isRed && "infoBox__cases--green"}`}
				>
					{props.cases}
				</h2>
				<Typography className="infobox_total" color="textSecondary">
					{props.total} Total
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
