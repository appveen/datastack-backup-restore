var mainMap = {
	"apis": (app) => [
		["dataservice", APIS.DATASERVICE],
		["library", APIS.LIBRARY],
		["functions", APIS.FUNCTIONS],
		["bookmarks", APIS.BOOKMARKS(app)],
		["groups", APIS.GROUPS(app)],
		["roles", APIS.ROLES]
	],
	"title": {
		"dataservice": "Dataservice",
		"library": "Library",
		"functions": "Functions",
		"bookmarks": "Bookmarks",
		"groups": "Groups"
	},
	"count": {
		"dataservice": { 
			"total": 0,
			"selected": [],
			"raw": [],
			"rawData": []
		},
		"library": { 
			"total": 0,
			"selected": [],
			"raw": [],
			"rawData": []
		},
		"functions": { 
			"total": 0,
			"selected": [],
			"raw": [],
			"rawData": []
		},
		"bookmarks": { 
			"total": 0,
			"selected": [],
			"raw": [],
			"rawData": []
		},
		"groups": { 
			"total": 0,
			"selected": [],
			"raw": [],
			"rawData": []
		},
		"roles": { 
			"total": 0,
			"selected": [],
			"raw": [],
			"rawData": []
		}
	},
	"error": {
		"zeroItems": {
			"dataservice": "No dataservices found!",
			"library": "No libraries found!",
			"functions": "No functions found!",
			"bookmarks": "No bookmarks found!",
			"groups": "No groups found!"
		}
	}
};


var main_selected = null

function removeSelectedClass() {
	for(item in menu_item){
		menu_item[item].setAttribute("class", "deselected");
	}
}
removeSelectedClass();

function menuHideContainerElements(){
	main_selected_error.style.display = "none";
	main_selected_data.style.display = "none";
	main_selected_search.value = "";
}
menuHideContainerElements();

function fetchData(){
	main.style.display = "flex";
	let apis = mainMap.apis(app_selected);
	console.log(apis);
	let urlParams = {
		"sort": "name",
		"filter": {app: app_selected},
		"count": -1,
	}
	apis.reduce((_p,_c) => {
		_p.then();
		console.log(`Calling ${_c[0]} api to fetch all the configuration data`);
		return new Promise((resolve) => {
			callAPI("GET", _c[1], null, urlParams, null, (responseData) => {
				let menuNames = [];
				responseData.forEach(item => menuNames.push(item.name));
				mainMap.count[_c[0]].total = responseData.length;
				mainMap.count[_c[0]].rawData = responseData;
				mainMap.count[_c[0]].selected = JSON.parse(JSON.stringify(menuNames));
				mainMap.count[_c[0]].raw = JSON.parse(JSON.stringify(menuNames));
			})
		});
	}, Promise.resolve());
	
	renderMenuData()
	menuSelect("dataservice");
}

function renderMenuData(){
	main_dataservice_selected_count.innerHTML = `${mainMap.count.dataservice.selected.length}/${mainMap.count.dataservice.total}`;
	main_library_selected_count.innerHTML = `${mainMap.count.library.selected.length}/${mainMap.count.library.total}`;
	main_functions_selected_count.innerHTML = `${mainMap.count.functions.selected.length}/${mainMap.count.functions.total}`;
	main_bookmarks_selected_count.innerHTML = `${mainMap.count.bookmarks.selected.length}/${mainMap.count.bookmarks.total}`;
	main_groups_selected_count.innerHTML = `${mainMap.count.groups.selected.length}/${mainMap.count.groups.total}`;
}

function menuSelect(selectedItem) {
	removeSelectedClass();
	menuHideContainerElements();
	let item = menu_item[selectedItem];
	item.setAttribute("class", "selected");
	main_selected = selectedItem;
	main_selected_title.innerHTML = mainMap.title[selectedItem];
	if(mainMap.count[selectedItem].total == 0){
		main_selected_error.innerHTML = `No ${selectedItem} found.`
		main_selected_error.style.display = "block"
	} else {
		main_selected_data.style.display = "grid";
		populateSelectedList(selectedItem, mainMap.count[selectedItem].raw);
	}
}

function populateSelectedList(_type, _listOfItems) {
	let li = document.createElement("li");
	main_selected_list.innerHTML = "";
	_listOfItems.forEach((item,index) => {
		let clone = li.cloneNode();
		let location = mainMap.count[_type].selected.indexOf(item);
		clone.innerHTML = `[${location == -1 ? " " : "*"}] ${item}`;
		clone.setAttribute("id", `menu_selected_list_selected_${index}`)
		clone.addEventListener("click", () => { mainSelectedFromList(_type, item) });
		main_selected_list.appendChild(clone)
	});
	main_selected_summary.innerHTML = `Selected ${mainMap.count[_type].selected.length}/${mainMap.count[_type].total}`;
}

function mainSelectedFromList(_type, _selection) {
	let index = mainMap.count[_type].selected.indexOf(_selection);
	if (index == -1) mainMap.count[_type].selected.push(_selection);
	else mainMap.count[_type].selected.splice(index, 1);
	console.log(mainMap.count[_type].selected.join(", "));
	renderMenuData();
	populateSelectedList(_type, mainMap.count[_type].raw);
}

function mainSelected_SelectAll(){
	let type = main_selected.toLowerCase();
	mainMap.count[type].selected = JSON.parse(JSON.stringify(mainMap.count[type].raw))
	renderMenuData();
	populateSelectedList(type, mainMap.count[type].raw);
}

function mainSelected_ClearAll(){
	let type = main_selected.toLowerCase();
	mainMap.count[type].selected = []
	renderMenuData();
	populateSelectedList(type, mainMap.count[type].raw);
}
