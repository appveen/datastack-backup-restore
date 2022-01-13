const errorManager = d.i("errorManager");

const configManager = d.i("configManager");
const noConfig = d.i("noConfig");
const configForm = d.i("configForm");
const configList = d.i("configList");
const configInputName = d.i("configInputName");
const configInputURL = d.i("configInputURL");
const configInputUsername = d.i("configInputUsername");
const configInputPassword = d.i("configInputPassword");
const configSelect = d.i("configSelect");
const configProperties = d.i("configProperties");
const configButtonSave = d.i("configButtonSave");
const configButtonClear = d.i("configButtonClear");
const configButtonDiscard = d.i("configButtonDiscard");
const configButtonAdd = d.i("configButtonAdd");
const configButtonDelete = d.i("configButtonDelete");
const configButtonLogin = d.i("configButtonLogin");

const appManager = d.i("appManager");
const appSearch = d.i("appSearch");
const appList = d.i("appList");


function hideAllConfig() {
	configManager.style.display = "none";
	noConfig.style.display = "none";
	configForm.style.display = "none";
	configList.style.display = "none";
}

function hideAppManager() {
	appManager.style.display = "none";
	appSearch.value = "";
	appList.innerHTML = ""
}

hideAllConfig();
hideAppManager();