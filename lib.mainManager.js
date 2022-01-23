
var listOfRandomNames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]

var mainMap = {
	"title": {
		"dataservice": "Dataservice",
		"library": "Library",
		"functions": "Functions",
		"bookmarks": "Bookmarks",
		"groups": "Groups"
	},
	"count": {
		"dataservice": { 
			total: listOfRandomNames.length,
			selected: JSON.parse(JSON.stringify(listOfRandomNames)),
			raw: JSON.parse(JSON.stringify(listOfRandomNames))
		},
		"library": { 
			total: listOfRandomNames.length,
			selected: JSON.parse(JSON.stringify(listOfRandomNames)),
			raw: JSON.parse(JSON.stringify(listOfRandomNames))
		},
		"functions": { 
			total: listOfRandomNames.length,
			selected: JSON.parse(JSON.stringify(listOfRandomNames)),
			raw: JSON.parse(JSON.stringify(listOfRandomNames))
		},
		"bookmarks": { 
			total: listOfRandomNames.length,
			selected: JSON.parse(JSON.stringify(listOfRandomNames)),
			raw: JSON.parse(JSON.stringify(listOfRandomNames))
		},
		"groups": { 
			total: listOfRandomNames.length,
			selected: JSON.parse(JSON.stringify(listOfRandomNames)),
			raw: JSON.parse(JSON.stringify(listOfRandomNames))
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

function renderMenuData(){
	main_dataservice_selected_count.innerHTML = `${mainMap.count.dataservice.selected.length}/${mainMap.count.dataservice.total}`;
	main_library_selected_count.innerHTML = `${mainMap.count.library.selected.length}/${mainMap.count.library.total}`;
	main_functions_selected_count.innerHTML = `${mainMap.count.functions.selected.length}/${mainMap.count.functions.total}`;
	main_bookmarks_selected_count.innerHTML = `${mainMap.count.bookmarks.selected.length}/${mainMap.count.bookmarks.total}`;
	main_groups_selected_count.innerHTML = `${mainMap.count.groups.selected.length}/${mainMap.count.groups.total}`;
}
renderMenuData()

function menuSelect(selectedItem) {
	removeSelectedClass();
	menuHideContainerElements();
	let item = menu_item[selectedItem];
	item.setAttribute("class", "selected");
	main_selected = selectedItem;
	main_selected_title.innerHTML = mainMap.title[selectedItem];
	main_selected_data.style.display = "grid";
	populateSelectedList(selectedItem, mainMap.count[selectedItem].raw);
}
menuSelect("dataservice");

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
