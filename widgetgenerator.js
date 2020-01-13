"use strict";

const displayContainer = document.getElementById("displayContainer");

const colorArray = ["#001F3F", "#FF851B", "#85144b", "#3D9970", "#FF4136"];

function Random(int1, int2) {
	return Math.floor(Math.random() * (int2 - int1) + int1);
}

//function assumes an array of objects
function createTableObjects(array) {
	if (array !== null && Array.isArray(array)) {
		let table = document.createElement("table");
		let tableHead = document.createElement("thead");
		let tableBody = document.createElement("tbody");
		if (Array.isArray(array)) {
			let tableHeaders = Object.keys(array[0]);
			let headerRow = document.createElement("tr");
			tableHeaders.forEach(tableHeaderItem => {
				let tableHeader = document.createElement("th");
				tableHeader.innerText = tableHeaderItem;
				headerRow.append(tableHeader);
			});
			tableHead.append(headerRow);
			table.append(tableHead);
			array.forEach(arrayItem => {
				let values = Object.values(arrayItem);
				let dataRow = document.createElement("tr");
				values.forEach(value => {
					let data = document.createElement("td");
					data.innerText = value;
					dataRow.append(data);
				});
				tableBody.append(dataRow);
			});
			table.append(tableBody);
			return table;
		} else {
			return null;
		}
	}
}

function runQuery(queryObject) {
	let data = null;
	$.ajax({
		url: queryObject.Method,
		method: "POST",
		async: false,
		data: JSON.stringify({
			QueryObject: JSON.stringify(queryObject),
		}),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (response) {
			data = JSON.parse(response.d);
		},
		error: function (error) {
			console.log(error);
		}
	});
	return data;
}

function getTable(method, query) {
	let data = null;
	$.ajax({
		url: method,
		type: "POST",
		async: false,
		data: JSON.stringify({ Query: query }),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (response) {
			data = response.d;
		},
		error: function (error) {
			console.log(error);
		}
	});
	return data;
}

function loadAllQueries() {
	let data = null;
	$.ajax({
		url: "Default.aspx/GetQueries",
		type: "POST",
		async: false,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (response) {
			data = response.d;
		},
		error: function (error) {
			console.log(error);
		}
	});
	return data;
}

function createDefaultWidget(dataObject) {
	if (dataObject !== null) {
		if (dataObject.ResultType === "T")
		{
			return CreateTableWidget(dataObject);
		}
		else if (dataObject.ResultType === "S")
		{
			return CreateScalarWidget(dataObject);
		}
	}
	else {
		return null;
	}
}

function modifyWidgetBodyContent(widgetBody, queryResult) {
	if (widgetBody !== null && queryResult !== null) {
		if (queryResult.ResultType === "S") {
			return modifyWidgetScalarBodyContent(widgetBody, queryResult);
		} else if (queryResult.ResultType == "T") {
			return modifyWidgetTableBodyContent(widgetBody, queryResult);
		} else {
			return null;
		}
	}
}

function modifyWidgetScalarBodyContent(widgetBody, queryResult) {
	if (widgetBody !== null && queryResult !== null) {
		widgetBody.innerHTML = "";

		let widgetBodySection = document.createElement("div");
		widgetBodySection.classList.add("widgetBodySectionColumn");

		if (queryResult.Caption !== null) {
			let widgetBodyRowLabel = document.createElement("div");
			widgetBodyRowLabel.classList.add("widgetBodyRowLabelDefault");

			let widgetBodyRowLabelText = document.createElement("h4");
			widgetBodyRowLabelText.classList.add("widgetBodyRowLabelText");
			widgetBodyRowLabelText.innerText = replaceCaption(queryResult.Caption);

			widgetBodySection.append(widgetBodyRowLabel);
			widgetBodyRowLabel.append(widgetBodyRowLabelText);
		}
		widgetBody.append(widgetBodySection);

		let table = createTableObjects(JSON.parse(queryResult.Result));
		table.classList.add("widgetBodyTable");
		widgetBodySection.append(table);
	}
}

function modifyWidgetTableBodyContent(widgetBody, queryResult) {
	if (widgetBody !== null && queryResult !== null) {
		widgetBody.innerHTML = "";

		let widgetBodySection = document.createElement("div");
		widgetBodySection.classList.add("widgetBodySectionColumn");
		if (queryResult.Caption !== null) {
			let widgetBodyRowLabel = document.createElement("div");
			widgetBodyRowLabel.classList.add("widgetBodyRowLabelDefault");

			let widgetBodyRowLabelText = document.createElement("h4");
			widgetBodyRowLabelText.classList.add("widgetBodyRowLabelText");
			widgetBodyRowLabelText.innerText = replaceCaption(queryResult.Caption);

			widgetBodySection.append(widgetBodyRowLabel);
			widgetBodyRowLabel.append(widgetBodyRowLabelText);
		}

		widgetBody.append(widgetBodySection);

		let table = createTableObjects(JSON.parse(queryResult.Result));
		table.classList.add("widgetBodyTable");
		widgetBodySection.append(table);
	}
}

function replaceCaption(caption) {
	let captionText = caption.replace("{now}", new Date().toLocaleTimeString());
	return captionText;
}

function CreateScalarWidget(dataObject) {
	let widgetBoard = document.createElement("div");
	widgetBoard.classList.add("col-3", "my-2");

	let widget = document.createElement("div");
	widget.classList.add("col-12", "p-0");
	widget.style.height = "350px";

	let widgetHeader = document.createElement("div");
	widgetHeader.classList.add("col-12", "p-0");
	widgetHeader.style.backgroundColor = colorArray[Random(0, colorArray.length)];
	widgetHeader.style.height = "20%";

	let widgetHeaderTitleContainer = document.createElement("div");
	widgetHeaderTitleContainer.classList.add("p-2");

	let widgetHeaderTitle = document.createElement("p");
	widgetHeaderTitle.classList.add("font24", "font-weight-bold", "text-white");
	widgetHeaderTitle.innerText = dataObject.Name;

	let widgetBody = document.createElement("div");
	widgetBody.classList.add("col-12", "p-0", "overflow-auto");
	widgetBody.style.backgroundColor = "rgba(250,250,250,1)";
	widgetBody.style.height = "60%";

	let widgetFooter = document.createElement("div");
	widgetFooter.classList.add("col-12", "p-0");
	widgetFooter.style.height = "20%";

	let widgetRefreshButton = document.createElement("button");
	widgetRefreshButton.classList.add("col-12", "h-100", "m-0", "p-0", "btn", "btn-primary", "font24", "font-weight-bold");
	widgetRefreshButton.innerText = "Refresh";

	widgetBoard.append(widget);
	widget.append(widgetHeader);
	widgetHeader.append(widgetHeaderTitleContainer);
	widgetHeaderTitleContainer.append(widgetHeaderTitle);
	widget.append(widgetBody);
	widget.append(widgetFooter);
	widgetFooter.append(widgetRefreshButton);

	if (dataObject.ParameterList.length > 0) {
		let widgetBodyInputsDiv = document.createElement("div");
		widgetBodyInputsDiv.classList.add("col-12");
		for (let i = 0; i < dataObject.ParameterList.length; i++) {
			let widgetBodyInputDiv = document.createElement("div");
			widgetBodyInputDiv.classList.add("row", "col-10", "mx-auto", "my-2", "input-group", "font16");

			let inputLabelContainer = document.createElement("div");
			inputLabelContainer.classList.add("col-6", "input-group-prepend", "px-0");

			let inputLabel = document.createElement("span");
			inputLabel.innerText = dataObject.ParameterList[i].Prompt;
			inputLabel.classList.add("col-12", "input-group-text", "text-center");

			let widgetBodyInputField = document.createElement("input");
			widgetBodyInputField.type = "text";
			widgetBodyInputField.classList.add("col-6", "form-control");

			widgetBodyInputDiv.append(inputLabelContainer);
			inputLabelContainer.append(inputLabel);
			widgetBodyInputDiv.append(widgetBodyInputField);
			widgetBodyInputsDiv.append(widgetBodyInputDiv);

			if (dataObject.ParameterList[i].DataType === "D") {
				widgetBodyInputField.addEventListener("focus", function () {
					$(this).datepicker();
				});
			}
		}
		widgetBody.append(widgetBodyInputsDiv);

		let widgetEditButton = document.createElement("button");
		widgetEditButton.classList.add("widgetEditButton", "mx-2");
		widgetEditButton.addEventListener("click", function (event) {
			event.preventDefault();
			widgetBody.innerHTML = "";
			widgetBody.append(widgetBodyInputsDiv);

		});

		widgetHeader.append(widgetEditButton);
	}
	else
	{
		let widgetBodySection = document.createElement("div");
		widgetBodySection.classList.add("widgetBodySectionColumn");

		if (dataObject.Caption !== null) {

			let widgetBodyRowLabel = document.createElement("div");
			widgetBodyRowLabel.classList.add("widgetBodyRowLabelDefault");

			let widgetBodyRowLabelText = document.createElement("h4");
			widgetBodyRowLabelText.classList.add("widgetBodyRowLabelText");
			widgetBodyRowLabelText.innerText = replaceCaption(dataObject.Caption);
			widgetBodySection.append(widgetBodyRowLabel);
			widgetBodyRowLabel.append(widgetBodyRowLabelText);
		}

		let table = createTableObjects(dataObject.QueryResult);
		table.classList.add("widgetBodyTable");

		widgetBodySection.append(table);
		widgetBody.append(widgetBodySection);
	}

	widgetRefreshButton.addEventListener("click", function (event) {
		event.preventDefault();
		let inputFieldsArray = Array.from(
			widgetBody.getElementsByTagName("input")
		);

		let inputsArray = [];
		let paramsArray = [];
		let dataTypesArray = [];

		inputFieldsArray.forEach((item, index) => {
			inputsArray.push(item.value);
			paramsArray.push(dataObject.ParameterList[index].Name);
			dataTypesArray.push(dataObject.ParameterList[index].DataType);
		})

		if (inputsArray.includes("") === false) {

			let queryObject = {
				Caption: dataObject.Caption,
				Method: dataObject.Method,
				InputsArray: inputsArray,
				InputParameters: paramsArray,
				DataTypesArray: dataTypesArray,
				QueryText: dataObject.QueryText,
				ResultType: dataObject.ResultType,
				ServerName: dataObject.Servername,
				Databasename: dataObject.DatabaseName
			};

			let queryResult = runQuery(queryObject);
			if (queryResult !== null) {
				modifyWidgetBodyContent(widgetBody, queryResult);
			}
			else {
				inputFieldsArray.forEach(item => {
					item.style.border = "2px solid Red";
				});
			}
		}
		else {
			inputFieldsArray.forEach(item => {
				item.style.border = "2px solid Red";
			});
		}
	});
	return widgetBoard;
}

function CreateTableWidget(dataObject) {
	let widgetBoard = document.createElement("div");
	widgetBoard.classList.add("col-6", "my-2");

	let widget = document.createElement("div");
	widget.classList.add("col-12", "p-0");
	widget.style.height = "350px";

	let widgetHeader = document.createElement("div");
	widgetHeader.classList.add("col-12", "p-0");
	widgetHeader.style.backgroundColor = colorArray[Random(0, colorArray.length)];
	widgetHeader.style.height = "30%";

	let widgetHeaderTitleContainer = document.createElement("div");
	widgetHeaderTitleContainer.classList.add("p-2");

	let widgetHeaderTitle = document.createElement("p");
	widgetHeaderTitle.classList.add("font24", "font-weight-bold", "text-white");
	widgetHeaderTitle.innerText = dataObject.Name;

	let widgetBody = document.createElement("div");
	widgetBody.classList.add("col-12", "p-0", "overflow-auto");
	widgetBody.style.backgroundColor = "rgba(250,250,250,1)";
	widgetBody.style.height = "50%";

	let widgetFooter = document.createElement("div");
	widgetFooter.classList.add("col-12", "p-0");
	widgetFooter.style.height = "20%";

	let widgetRefreshButton = document.createElement("button");
	widgetRefreshButton.classList.add("col-12", "h-100", "m-0", "p-0", "btn", "btn-primary", "font24", "font-weight-bold");
	widgetRefreshButton.innerText = "Refresh";

	widgetBoard.append(widget);
	widget.append(widgetHeader);
	widgetHeader.append(widgetHeaderTitleContainer);
	widgetHeaderTitleContainer.append(widgetHeaderTitle);
	widget.append(widgetBody);
	widget.append(widgetFooter);
	widgetFooter.append(widgetRefreshButton);

	if (dataObject.ParameterList.length > 0) {
		let widgetHeaderInputsDiv = document.createElement("div");
		widgetHeaderInputsDiv.classList.add("col-12", "row", "justify-content-around");
		for (let i = 0; i < dataObject.ParameterList.length; i++) {
			let widgetHeaderInputDiv = document.createElement("div");
			widgetHeaderInputDiv.classList.add("row", "col-4", "mx-auto", "input-group", "font16");

			let inputLabelContainer = document.createElement("div");
			inputLabelContainer.classList.add("col-6", "input-group-prepend", "px-0");

			let inputLabel = document.createElement("span");
			inputLabel.innerText = dataObject.ParameterList[i].Prompt;
			inputLabel.classList.add("col-12", "input-group-text", "text-center");

			let widgetHeaderInputField = document.createElement("input");
			widgetHeaderInputField.type = "text";
			widgetHeaderInputField.classList.add("col-6", "form-control");

			widgetHeaderInputDiv.append(inputLabelContainer);
			inputLabelContainer.append(inputLabel);
			widgetHeaderInputDiv.append(widgetHeaderInputField);
			widgetHeaderInputsDiv.append(widgetHeaderInputDiv);

			if (dataObject.ParameterList[i].DataType === "D") {
				widgetHeaderInputField.addEventListener("focus", function () {
					$(this).datepicker();
				});
			}
		}
		widgetHeader.append(widgetHeaderInputsDiv);
	}
	else
	{
		let widgetBodySection = document.createElement("div");
		widgetBodySection.classList.add("widgetBodySectionColumn");

		if (dataObject.Caption !== null) {

			let widgetBodyRowLabel = document.createElement("div");
			widgetBodyRowLabel.classList.add("widgetBodyRowLabelDefault");

			let widgetBodyRowLabelText = document.createElement("h4");
			widgetBodyRowLabelText.classList.add("widgetBodyRowLabelText");
			widgetBodyRowLabelText.innerText = replaceCaption(dataObject.Caption);
			widgetBodySection.append(widgetBodyRowLabel);
			widgetBodyRowLabel.append(widgetBodyRowLabelText);
		}

		let table = createTableObjects(dataObject.QueryResult);
		table.classList.add("widgetBodyTable");

		widgetBodySection.append(table);
		widgetBody.append(widgetBodySection);
	}

	widgetRefreshButton.addEventListener("click", function (event) {
		event.preventDefault();
		let inputFieldsArray = Array.from(
			widgetHeader.getElementsByTagName("input")
		);

		let inputsArray = [];
		let paramsArray = [];
		let dataTypesArray = [];

		inputFieldsArray.forEach((item, index) => {
			inputsArray.push(item.value);
			paramsArray.push(dataObject.ParameterList[index].Name);
			dataTypesArray.push(dataObject.ParameterList[index].DataType);
		})

		if (inputsArray.includes("") === false) {

			let queryObject = {
				Caption: dataObject.Caption,
				Method: dataObject.Method,
				InputsArray: inputsArray,
				InputParameters: paramsArray,
				DataTypesArray: dataTypesArray,
				QueryText: dataObject.QueryText,
				ResultType: dataObject.ResultType,
				ServerName: dataObject.Servername,
				Databasename: dataObject.DatabaseName
			};

			let queryResult = runQuery(queryObject);
			if (queryResult !== null) {
				modifyWidgetBodyContent(widgetBody, queryResult);
			}
			else {
				inputFieldsArray.forEach(item => {
					item.style.border = "2px solid Red";
				});
			}
		}
		else {
			inputFieldsArray.forEach(item => {
				item.style.border = "2px solid Red";
			});
		}
	});
	return widgetBoard;
}
