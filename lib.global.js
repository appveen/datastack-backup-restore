var d = document;
d.i = d.getElementById;
d.c = d.getElementsByClassName

var api_req_token = null;
var api_req_refresh_token = null;
var api_req_token_duration = null
var api_req_baseUrl = null;

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