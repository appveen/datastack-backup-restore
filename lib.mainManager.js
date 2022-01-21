
var mainMap = {
	"title": {
		"dataservice": "Dataservice",
		"library": "Library",
		"functions": "Functions",
		"bookmarks": "Bookmarks",
		"groups": "Groups"
	},
	"count": {
		"dataservice": { total: 10, selected: [] },
		"library": { total: 0, selected: [] },
		"functions": { total: 30, selected: [] },
		"bookmarks": { total: 44, selected: [] },
		"groups": { total: 33, selected: [] }
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

var listOfRandomNames = ["Lnvgnntynq", "hhhvQbQecG", "1bU4fyEoFB", "nmXLE0uMRy", "9jAHjTkvCO", "Z2ttgtJ0N9", "tam2YLXyzo", "uJ3BjAYjIK", "BISIkXBuMX", "hIvH3HPtq1", "34wcv3MhXT", "lGwKNEnudd", "4JCCiNPeMs", "VckQZLLPB2", "rwTFZ6L1mM", "Pz197wLlGw"]

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

function menuSelect(selectedItem) {
	removeSelectedClass();
	menuHideContainerElements();
	let item = menu_item[selectedItem];
	item.setAttribute("class", "selected");
	main_selected = selectedItem;
	main_selected_title.innerHTML = mainMap.title[selectedItem];
	main_selected_data.style.display = "grid";
	populateSelectedList(selectedItem, listOfRandomNames);
}
menuSelect("dataservice");

function populateSelectedList(_type, _listOfItems) {
	let li = document.createElement("li");
	main_selected_list.innerHTML = "";
	_listOfItems.forEach((item,index) => {
		let clone = li.cloneNode();
		clone.innerHTML = `[ ] ${item}`;
		clone.setAttribute("id", `menu_selected_list_selected_${index}`)
		clone.addEventListener("click", () => { mainSelectedFromList(_type, item) });
		main_selected_list.appendChild(clone)
	});
}


function mainSelectedFromList(_type, _selection) {
	console.log(_type, _selection);
}