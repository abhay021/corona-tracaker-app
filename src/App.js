import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	FormControl,
	MenuItem,
	Select,
} from "@material-ui/core";
import axios from "axios";
import InfoBox from "./InfoBox";
import Maps from "./Maps";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData, prettyPrintStat } from "./utill";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 34.8746, lng: -40.4796 });
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMApCountries] = useState([]);
	const [casesType, setCasesType] = useState("cases");

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then(res => res.json())
			.then(data => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		// async const response = await axios.get("https://disease.sh/v3/covid-19/countries");
		// console.log(response);
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then(response => response.json())
				.then(data => {
					const countries = data.map(country => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));
					const sortedData = sortData(data);
					setTableData(sortedData);
					setMApCountries(data);
					setCountries(countries);
				});
		};
		getCountriesData();
	}, []);

	const onCountryChange = async event => {
		const countryCode = event.target.value;

		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`;

		await fetch(url)
			.then(response => response.json())
			.then(data => {
				setCountry(countryCode);
				//All of the data from the country response
				setCountryInfo(data);
				// setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				countryCode === "worldwide" ? setMapCenter([34.8746, -40.4796]) : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
			});
	};

	return (
		<div className="app">
			<div className="app_left">
				<div className="app_header">
					<h1>COVID 19 TRACKER</h1>
					<FormControl className="app_dropdown">
						<Select
							variant="outlined"
							onChange={onCountryChange}
							value={country}
						>
							<MenuItem value="worldwide">WorldWide</MenuItem>
							{/* Loop through all the countries */}
							{countries.map(country => (
								<MenuItem value={country.value}>{country.name}</MenuItem>
							))}
							{/* <MenuItem value="worldwide">WorldWide</MenuItem>
						<MenuItem value="worldwide">Option 2</MenuItem>
						<MenuItem value="worldwide">Option 3</MenuItem>
						<MenuItem value="worldwide">Option 4</MenuItem> */}
						</Select>
					</FormControl>
				</div>
				<div className="app_stats">
					<InfoBox
						isRed
						active={casesType === "cases"}
						onClick={e => setCasesType("cases")}
						title="CoronaVirus Cases"
						total={prettyPrintStat(countryInfo.cases)}
						cases={prettyPrintStat(countryInfo.todayCases)}
					/>
					<InfoBox
						active={casesType === "recovered"}
						onClick={e => setCasesType("recovered")}
						title="Recovered"
						total={prettyPrintStat(countryInfo.recovered)}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
					/>
					<InfoBox
						isRed
						active={casesType === "deaths"}
						onClick={e => setCasesType("deaths")}
						title="Deaths"
						total={prettyPrintStat(countryInfo.deaths)}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
					/>
				</div>
				{/* Map */}
				<Maps
					casesType={casesType}
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>
			<Card className="app_right">
				<CardContent>
					{/* Table */}
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
					{/* Graph */}
					<h3 className="app_graphTitle">WorldWide new {casesType}</h3>
					<LineGraph className="app_graph" casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
