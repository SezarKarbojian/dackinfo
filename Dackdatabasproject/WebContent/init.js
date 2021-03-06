$(document).ready(function(){
	
	var visited = $.cookie("visited");
	if(visited == null){
		$.cookie('visited', 'yes');
		//console.log("first time!!");
		var i=1;
		$.ajax({
			type: "GET",
			url: "/dackdataxml.xml",
			dataType: "xml",
			async: false,
			success: function(xml) {
				$(xml).find('Row').each(function(){
					try {
						var carModelObject = new Object();
						carModelObject.carMaker = $(this).find('Car_maker').text();
						carModelObject.model = $(this).find('Model').text();
						if (typeof($(this).find('Engine').text()) == "undefined" || $(this).find('Engine').text() === ""){
							carModelObject.engine = "Non Original";
						}else{
							carModelObject.engine = $(this).find('Engine').text();
						}
						carModelObject.OE_base = $(this).find('OE_base').text();
						carModelObject.P_LT = $(this).find('P_LT').text();
						carModelObject.width = $(this).find('width').text();
						carModelObject.series = $(this).find('series').text();
						carModelObject.ZR = $(this).find('ZR').text();
						carModelObject.R = $(this).find('R').text();
						carModelObject.rim = $(this).find('rim').text();
						carModelObject.LI = $(this).find('LI').text();
						carModelObject.SI = $(this).find('SI').text();
						carModelObject.axle = $(this).find('axle').text();
						carModelObject.RF_XL_C = $(this).find('RF_XL_C').text();
						carModelObject.PR = $(this).find('PR').text();
						carModelObject.f4x4 = $(this).find('4x4').text();
						carModelObject.bar_part__front = $(this).find('bar_part__front').text();
						carModelObject.bar_part__rear = $(this).find('bar_part__rear').text();
						carModelObject.bar_full_front = $(this).find('bar_full_front').text();
						carModelObject.bar_full_rear = $(this).find('bar_full_rear').text();
						localStorage.setItem(i, JSON.stringify(carModelObject));
						i++;
					}
					catch (e) {
						if (e == DOMException.QUOTA_EXCEEDED_ERR) {
							console.log("Error: Local Storage limit exceeds.");
						}
						else {
							console.log("Error: Saving to local storage.");
						}
					}
				});
			}
		});
	}
	populateMakerSelect();
	$.cookie('visited', 'yes', { expires: 1, path: '/' });

});

function populateMakerSelect(){
	var carMakers = [];
	$.each(localStorage, function(key, value) {
		var carMakerItem = JSON.parse(localStorage.getItem(localStorage.key(key)));
		if($.inArray(carMakerItem.carMaker, carMakers)===-1){
			carMakers.push(carMakerItem.carMaker);
		};
	});
	carMakers.sort();
	
	$.each(carMakers, function() {
		$('#mySelectID').append($('<option>').attr('val', this).attr('text', this).text(this));
	});
}

function populateModelSelect(selected){
	var selectedCarMaker = selected.value;
	var models = [];
	$.each(localStorage, function(key, value) {
		var row = JSON.parse(localStorage.getItem(localStorage.key(key)));
		if(row.carMaker == selectedCarMaker){
			if($.inArray(row.model, models)===-1){
				models.push(row.model);
			};
		};
	});
	models.sort();
	$('#mySelectID2').find('option').remove();
	$('#mySelectID2').append($('<option>').attr('val', "").text("Modell"));
	$.each(models, function() {
		$('#mySelectID2').append($('<option>').attr('val', this).attr('text', this).text(this));
	});
}

function updateTable(){
	var selectedCarMaker = document.getElementById('mySelectID');
	var carMaker_query = selectedCarMaker.options[selectedCarMaker.selectedIndex].text;
	var selectedModel = document.getElementById('mySelectID2');
	var model_query = selectedModel.options[selectedModel.selectedIndex].text;
	//console.log(carMaker_query + " : " + model_query);
	var carMakerMatch = new RegExp(carMaker_query, "i");
	if (typeof(carMaker_query) == "undefined" || carMaker_query === "" )
	{
	}
	else
	{
		var filteredResult = [];
		$.each(localStorage, function(key, value) {
			var item = JSON.parse(localStorage.getItem(localStorage.key(key)));
			var arrayObj = [];
			if (carMakerMatch.test(item.carMaker)){
				if(model_query.replace(/\s/g, '') == item.model.replace(/\s/g, '')){
					//console.log('true!!!!!');
					for(var x in item){
						arrayObj.push(item[x]);
					}
					filteredResult.push(arrayObj);
				}
			}
		});
		$('#myTable').DataTable( {
			destroy: true,
			data: filteredResult,
			columns: [
			          { className: "never" },
			          { className: "never" },
			          { title: "Engine", className: "all" },
			          { title: "OE_base", className: "min-desktop" },
			          { title: "P_LT", className: "none" },
			          { title: "Width", className: "min-desktop" },
			          { title: "Series", className: "min-desktop" },
			          { title: "ZR", className: "none" },
			          { title: "R", className: "min-desktop" },
			          { title: "Rim", className: "min-desktop" },
			          { title: "LI", className: "min-desktop" },
			          { title: "SI", className: "min-desktop" },
			          { title: "axle", className: "none" },
			          { title: "RF_XL_C", className: "none" },
			          { title: "PR", className: "min-desktop" },
			          { title: "4x4", className: "none" },
			          { title: "bar_part__front", className: "min-desktop" },
			          { title: "bar_part__rear", className: "min-desktop" },
			          { title: "bar_full_front", className: "min-desktop" },
			          { title: "bar_full_rear", className: "min-desktop" }
			          ],
			          "order": [[ 2, 'asc' ]],
			          "paging":   false,
			          "info": false,
			          "filter": false
		} );
	}
}
