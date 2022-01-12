var configs = localStorage.getItem("configs");

// hide all config
function hideAllConfig() {
	configManager.style.display = "none";
	noConfig.style.display = "none";
	configForm.style.display = "none";
	configList.style.display = "none";
}

function loadConfigs() {
	hideAllConfig();
	if (!configs) {
		noConfig.style.display = "block";
		configForm.style.display = "block";
		configManager.style.display = "block";
		configs = [];
		return;
	}
	configManager.style.display = "block";
	configList.style.display = "block";
	configs = JSON.parse(localStorage.getItem("configs"));
	let option = document.createElement('option');
	let selectedIndex = 0;
	configSelect.innerHTML = "";
	configs.forEach((config, index) => {
		let clone = option.cloneNode();
		clone.value = index;
		clone.innerHTML = `${config.name} (${config.username})`;
		configSelect.appendChild(clone);
	})
	configSelect.selectedIndex = 0;
	configSelectChanged();
}
// loadConfigs();
hideAllConfig()

function configSelectChanged() {
	configProperties.innerHTML = `
			<label>URL</label><span>${configs[configSelect.value].url}</span>
			<p></p>
			<label>Username</label><span>${configs[configSelect.value].username}</span>
			`;
	configInputPassword.value = "";
}

function addNewConfig() {
	hideAllConfig();
	configForm.style.display = "block";
	configManager.style.display = "block";
	configInputPassword.value = "";
}

function saveConfig() {
	let name = configInputName.value;
	let url = configInputURL.value;
	let username = configInputUsername.value;
	if (nullCheckAndShowError(name, "Name is required.")) return;
	if (nullCheckAndShowError(url, "URL is required.")) return;
	if (nullCheckAndShowError(username, "Username is required.")) return;
	configs.push({ name, url, username });
	localStorage.setItem("configs", JSON.stringify(configs));
	clearConfig();
	loadConfigs();
}

function clearConfig() {
	configInputName.value = "";
	configInputURL.value = "";
	configInputUsername.value = "";
}

function deleteConfig() {
	configs.splice(configSelect.value, 1);
	localStorage.setItem("configs", JSON.stringify(configs));
	loadConfigs();
}

function login() {
	let data = configs[configSelect.value];
	data.password = configInputPassword.value;
	api_req_baseUrl = data.url;
	callAPI("POST", APIS.LOGIN, null, null, data, (responseData) => {
		api_req_token = responseData.token;
		api_req_refresh_token = responseData.rToken;
		api_req_token_duration = (responseData.rbacUserTokenDuration - (5 * 60)) * 1000;
		if (responseData.bot) {
			api_req_token_duration = (responseData.rbacBotTokenDuration - (5 * 60)) * 1000;
		}
		createTokenRefreshRoutine();
		hideAllConfig();
		loadApps();
	})
}

function createTokenRefreshRoutine() {
	setInterval(() => {
		console.log("Refresh triggered")
		let header = {
			"rToken": `JWT ${api_req_refresh_token}`
		}
		callAPI("GET", APIS.REFRESH, header, null, null, (responseData) => {
			api_req_token = responseData.token;
			api_req_refresh_token = responseData.rToken;
		})
	}, api_req_token_duration)
}