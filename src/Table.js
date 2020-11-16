import React from "react";
import numeral from "numeral";
import "./Table.css";

function Table(props) {
	return (
		<div className="table">
			{props.countries.map(({ country, cases }) => (
				<tr>
					<td>{country}</td>
					<td>
						<strong>{numeral(cases).format("0,0")}</strong>
					</td>
				</tr>
			))}
		</div>
	);
}

export default Table;
