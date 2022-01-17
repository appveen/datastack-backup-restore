function loadApps() {
	console.debug("Loading apps");
	hideAppManager();
	let urlParams = {
		"select": "_id",
		"count": "-1"
	}
	callAPI("GET", APIS.APPS, null, urlParams, null, (responseData) => {
		responseData
			.sort(function (a, b) {
				var nameA = a._id.toUpperCase();
				var nameB = b._id.toUpperCase();
				if (nameA < nameB) return -1;
				if (nameA > nameB) return 1;
				return 0;
			})
			.forEach(app => apps_list.push(app._id))
		populateAppList();
	})
}

function populateAppList() {
	appManager.style.display = "block";
	apps_list_clone = apps_list
	if (apps_list.length < 1) {
		appList.innerHTML = `<span class="red">No apps found</span>`;
		appSearch.style.display = "none";
		return;
	}
	populateAppLi()
}

function searchApps() {
	let searchString = appSearch.value;
	apps_list_clone = apps_list.filter(app => app.toLowerCase().indexOf(searchString) != -1)
	populateAppLi()
}

function populateAppLi() {
	if (apps_list_clone.length < 1) {
		appList.innerHTML = `<li>No matching apps found!</li>`;
		return;
	}
	let li = document.createElement("li");
	appList.innerHTML = "";
	apps_list_clone.forEach(app => {
		let clone = li.cloneNode();
		clone.innerHTML = app;
		clone.addEventListener("click", () => { appSelected(app) });
		appList.appendChild(clone)
	})
}

function appSelected(_selectedApp) {
	app_selected = _selectedApp;
	console.log(`Selected app :: ${app_selected}`)
}