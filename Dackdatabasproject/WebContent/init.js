$(document).ready(function(){
	var visited = $.cookie("visited");
	if(visited == null){
		$.cookie('visited', 'yes');
		console.log("first time!!");
		var i=1;
		$.ajax({
			type: "GET",
			url: "/dackdataxml.xml",
			dataType: "xml",
			success: function(xml) {
				$(xml).find('Row').each(function(){
					try {
						var carModelObject = new Object();
						carModelObject.carMaker = $(this).find('Car_maker').text();
						carModelObject.model = $(this).find('Model').text();
						carModelObject.engine = $(this).find('Engine').text();
						carModelObject.OE_base = $(this).find('OE_base').text();
						carModelObject.width = $(this).find('width').text();
						carModelObject.series = $(this).find('series').text();
						carModelObject.R = $(this).find('R').text();
						carModelObject.rim = $(this).find('rim').text();
						carModelObject.LI = $(this).find('LI').text();
						carModelObject.SI = $(this).find('SI').text();
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
	$('#mySelectID2').find('option').remove();
	$.each(models, function() {
		$('#mySelectID2').append($('<option>').attr('val', this).attr('text', this).text(this));
	});
}