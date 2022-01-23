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

const main = d.i("main");
const main_appname = d.i("main_appname");
const main_dataservice_summary = d.i("main_dataservice_summary");
const main_library_summary = d.i("main_library_summary");
const main_functions_summary = d.i("main_functions_summary");
const main_bookmarks_summary = d.i("main_bookmarks_summary");
const main_groups_summary = d.i("main_groups_summary");
const main_dataservice_selected_count = d.i("main_dataservice_selected_count");
const main_library_selected_count = d.i("main_library_selected_count");
const main_functions_selected_count = d.i("main_functions_selected_count");
const main_bookmarks_selected_count = d.i("main_bookmarks_selected_count");
const main_groups_selected_count = d.i("main_groups_selected_count");
const menu_item = {
	"dataservice": d.i("main_dataservice_menu_list"),
	"library": d.i("main_library_menu_list"),
	"functions": d.i("main_functions_menu_list"),
	"bookmarks": d.i("main_bookmarks_menu_list"),
	"groups": d.i("main_groups_menu_list")
};
const main_menu_selectAll_button = d.i("main_menu_selectAll_button");
const main_menu_deselectAll_button = d.i("main_menu_deselectAll_button");
const main_selected_title = d.i("main_selected_title");
const main_selected_error = d.i("main_selected_error");
const main_selected_data = d.i("main_selected_data");
const main_selected_search = d.i("main_selected_search");
const main_selected_selectAll_button = d.i("main_selected_selectAll_button");
const main_selected_clearAll_button = d.i("main_selected_clearAll_button");
const main_selected_list = d.i("main_selected_list");
const main_selected_summary = d.i("main_selected_summary");


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

function hideMain() {
	main.style.display = "none";
}

hideAllConfig();
hideAppManager();