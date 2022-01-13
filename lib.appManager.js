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
			.forEach(app => apps.push(app._id))
		populateAppList();
	})
}

function populateAppList() {
	appManager.style.display = "block";
	let li = document.createElement("li");
	appList.innerHTML = "";
	apps.forEach(app => {
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