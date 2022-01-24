var d = document;
d.i = d.getElementById;
d.c = d.getElementsByClassName

var api_req_token = null;
var api_req_refresh_token = null;
var api_req_token_duration = null
var api_req_baseUrl = null;

var apps_list = [];
var apps_list_clone = [];
var app_selected = null;

function callAPI(method, api, headers, urlParams, payload, cb) {
	let constructedURL = `${api_req_baseUrl}${api}`;
	let xhttp = new XMLHttpRequest();

	if (urlParams) {
		constructedURL += "?";
		for (var key in urlParams) {
			if (key == "filter") constructedURL += `${key}=${JSON.stringify(urlParams[key])}&`;
			else constructedURL += `${key}=${urlParams[key]}&`;
		}
	}
	constructedURL = encodeURI(constructedURL)

	xhttp.open(method, constructedURL, false);
	xhttp.setRequestHeader("Content-type", "application/json");
	// xhttp.setRequestHeader("Access-Control-Allow-Headers", "*");
	if (api_req_token) xhttp.setRequestHeader("Authorization", `JWT ${api_req_token}`);
	if (headers) {
		for (let header in headers) {
			xhttp.setRequestHeader(header, headers[header]);
		}
	}

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) cb(JSON.parse(this.responseText))
			else if (this.status == 401) {
				logoutAction();
			} else {
				console.error(`Error invoking API : ${method} ${constructedURL}`)
				console.error(`Headers : ${JSON.stringify(headers)}`)
				console.error(`URLParams : ${JSON.stringify(urlParams)}`)
				console.error(`payload : ${JSON.stringify(payload)}`)
				console.error(`Response : ${JSON.stringify(this.responseText)}`)
				alert(this.responseText)
			}
		}
	};
	if (payload) xhttp.send(JSON.stringify(payload));
	else xhttp.send();
}

function logoutAction() {
	api_req_token = null;
	api_req_refresh_token = null;
	api_req_token_duration = null
	api_req_baseUrl = null;
}

function nullCheckAndShowError(value, message) {
	if (!value || value == "") {
		alert(message);
		return true;
	}
	return false;
}

function stringComparator(a, b) {
	let nameA = a._id.toUpperCase();
	let nameB = b._id.toUpperCase();
	if (nameA < nameB) return -1;
	if (nameA > nameB) return 1;
	return 0;
}