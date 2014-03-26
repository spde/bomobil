//Define global variables

	//Variable containing an array of objects and their data
		var objects = new Array();

	//Variable containing two arrays of AJAX request trackers
		var ongoing_requests = new Array(Array(), Array());

	//Variable containing an array of page data
		var pages_data = new Array();

	//Variable containing sorting order
		var sorting_order = new Array();

function processPageData(x, page_number){
	return function (returnData){
		//Add page html to array
			pages_data.push(returnData);
		
		//Finish tracking of page AJAX req
			ongoing_requests[0][(x-2)] = false;

		//Update progress
			updateProgress(5+((x-1)/page_number)*10);

		//Check if there are any remaining page requests
			checkPageFetchCompletion();
		}
	}

function checkPageFetchCompletion(){
	
	//Count how many page requests have been completed
		var count = 0;
		for (y = 0; y < ongoing_requests[0].length; y++){
			if (ongoing_requests[0][y] == false){
				count++;
				}
			}

	//Update progress bar
		value = (count / ongoing_requests[0].length) * 15 + 5;
		updateProgress(value);

	//If all pages have been fetched, proceed to process objects
		if (count == ongoing_requests[0].length){
			processObjects();
			}
	}

function processObjects(){
	//Iterate through objects
		for (var k = 0; k < pages_data.length; k++){
			extractObjects(pages_data[k]);
			}
	}

function fetchPages(){
	
	//Track initial AJAX req
		ongoing_requests[0][0] = true;
	
	//Initiate initial AJAX req (first page)
		$.ajax({
			url: "http://www.boplats.se/HSS/Object/object_list.aspx?cmguid=4e6e781e-5257-403e-b09d-7efc8edb0ac8&objectgroup=1",
			dataType: 'html',
			success: function(returnData) {
				updateProgress(5);
				
				//Place data in array
					pages_data[0] = returnData;

				//Fetch additional pages (if applicable)
					page_number = $(returnData).find("span[id=ucNavigationBarSimple_lblNoOfPages]").html().split(" ")[1].split("/");
					page_number = parseInt(page_number[1]);
					i = 2;
					if (page_number > 1){
						for (i = 2; i <= page_number; i++){
							ongoing_requests[0][(i-2)] = true;
							$.ajax({ 
								url: "http://www.boplats.se/HSS/Object/object_list.aspx?cmguid=4e6e781e-5257-403e-b09d-7efc8edb0ac8&objectgroup=1&page="+i,
								dataType: 'html',
								success: processPageData(i, page_number),
								error: function(xhr, textStatus, error){
									alert(xhr.statusText+", "+textStatus+", "+error)
									},
								});
							
							}
						}

				//Mark initial AJAX req as complete
					ongoing_requests[0][0] = false;

				//Check if page fetch is completed
					checkPageFetchCompletion();

				},
			error: function(xhr, textStatus, error){
				alert(xhr.statusText+", "+textStatus+", "+error)
				},
			});
	
	}

function extractObjects(html_data){

	//Set object counter
		z = objects.length > 0 ? objects.length : 0;
	
	//Find objects in page
		$(html_data).find("table[id=dgList] tr.tbl_cell_list_even, table[id=dgList] tr.tbl_cell_list_odd").each(function(){
		
			//Track object req
				ongoing_requests[1][z] = true;
			
			//Insert object
				objects[z] = new Array();

			//Find object columns
				var columns = $(this).find("td");

			//Put data in object array
				for (i = 0; i < columns.length; i++){
					if (i == 0){
						url = $(columns[i]).find("a").attr('href');
						objects[z]['url'] = url;
						objects[z]['id'] = url.split("?")[1].split("=")[1];
						}
					if (i == 1){
						objects[z]['address'] = $(columns[i]).text().trim();
						}
					if (i == 2){
						objects[z]['area2'] = $(columns[i]).text().trim();
						}
					if (i == 3){
						objects[z]['rooms'] = $(columns[i]).text().trim();
						}
					if (i == 4){
						objects[z]['cost'] = $(columns[i]).text().trim();
						}
					if (i == 5){
						objects[z]['interested'] = $(columns[i]).find('span').text().trim();
						}
					}

			//Fetch additional page data
				extractObjectDeep(objects[z]['id'], z);

			z++;
			});

	}

function extractObjectDeep(id, z){
	
	//Initiate AJAX call to fetch more object data
		$.ajax({ 
			url: "http://www.boplats.se/HSS/Object/object_details.aspx?objectguid=" + id,
			dataType: 'html',
			success: processObjectDeep(id, z),
			error: function(xhr, textStatus, error){
				alert(xhr.statusText+", "+textStatus+", "+error)
				},
			});
	}

function processObjectDeep(id, z){
	return function (returnData){
		
		//If response is null, restart ajax request
			regexp = new RegExp("HTTP request failed");
			if (regexp.test(returnData) == true || returnData == null){
				extractObjectDeep(id, z);
				return;
				}

		//Put data in object array
			objects[z]['size'] = $(returnData).find("span[id=lblSize]").text().trim().split(" ");
			objects[z]['floor'] = $(returnData).find("span[id=lblFloor]").text().trim();
			objects[z]['move_in_date'] = $(returnData).find("span[id=lblMoveIn]").text().trim();
			objects[z]['available_date'] = $(returnData).find("span[id=lblDateAvailable]").text().trim();
			objects[z]['last_reg_date'] = $(returnData).find("span[id=lblLastRegDate]").text().trim();
			objects[z]['boplats_id'] = $(returnData).find("span[id=lblObjectId]").text().trim();
			objects[z]['area'] = $(returnData).find("span[id=lblArea]").text().trim();
			objects[z]['description'] = $(returnData).find("span[id=lblDescription]").text().trim();
			objects[z]['planning'] = $(returnData).find("span[id=lblPlanning]").text().trim();
			objects[z]['properties'] = $(returnData).find("table[id=dlProperties] b").map(function(){return $(this).html().trim()}).get().join(", ");
			objects[z]['images'] = $(returnData).find("table[id=dlMultimedia] img").map(function(){if ($(this).attr("temp") != "../../img/ico_pdf.gif"){return "http://www.boplats.se"+$(this).attr("temp").trim()}}).get();
			objects[z]['pdfs'] = $(returnData).find("table[id=dlMultimedia] a").map(function(){return $(this).attr("href").trim().replace(/\.{2}\/\.{2}/, "http://www.boplats.se")}).get();
			objects[z]['icons'] = $(returnData).find("tr[id=trIcons] a.apartment_detail_legend").map(function(){return {id: $(this).attr("id"), src: $("img", this).attr("temp").trim().replace(/\.{2}\/\.{2}/, "http://www.boplats.se")};}).get();
		
		//Set object tracking to complete
			ongoing_requests[1][z] = false;

		//Check if there are ongoing objects
			checkOngoingObjectRequests();
		}
	}

function scrollToOpenCollapsible(current_collapsible){
	
	//Check if there are any expanded items waiting to be collapsed
		var current_index = $(current_collapsible).index();
		$(current_collapsible).parent().children().each(function(){
			if (current_index != $(this).index() && $(this).collapsible("option", "collapsed") == false){
				setTimeout(function(){scrollToOpenCollapsible(current_collapsible)}, 5);
				false;
				}
			});
	
	//Scroll
		$.mobile.silentScroll($(current_collapsible).offset().top);
	}

function filterObjects(object_array){
	
	var new_object_array = Array();
	
	for (i = 0; i < object_array.length; i++){
		(function(){
			
			//Filters

				//Area
					if ($.inArray(object_array[i]['area'], $("input[id^='area[']:checked").map(function(){return $(this).val()}).get()) == -1){
						return;
						}

				//Rooms
					if (parseInt(object_array[i]['rooms']) < $("#min_rooms").val() || parseInt(object_array[i]['rooms']) > $("#max_rooms").val()){
						return;
						}
				
				//Cost
					if (parseInt(object_array[i]['cost']) < $("#min_cost").val() || parseInt(object_array[i]['cost']) > $("#max_cost").val()){
						return;
						}

				//Size
					if (parseInt(object_array[i]['size'][0]) < $("#min_size").val() || parseInt(object_array[i]['size'][0]) > $("#max_size").val()){
						return;
						}

				//Floor
					if (parseInt(object_array[i]['floor']) < $("#min_floor").val() || parseInt(object_array[i]['floor']) > $("#max_floor").val()){
						return;
						}

				//Available
					if ($("#available").val() != null && $.datepicker.parseDate('yy-mm-dd', $("#available").val()) > $.datepicker.parseDate('yy-mm-dd', object_array[i]['move_in_date'])){
						return;
						}

				//Icons
					for (z = 0; z < object_array[i]['icons'].length; z++){
						if ($.inArray(object_array[i]['icons'][z].id, $("input[id^='icon[']:checked").map(function(){return $(this).val()}).get()) == -1){
							return;
							}
						}

			//Add to new array
				new_object_array.push(object_array[i]);
			})();
		}
	
	return new_object_array;
	}

function sortObjects(object_array){
	
	//Empty sorting order
		sorting_order = Array();

	//Build new sorting order
		$("#sort_list li").each(function(){
			sorting_order.push($(this).attr("value"));
			});

	return object_array.sort(customSort);
	}

function customSort(a, b, level){
	
	//If level is undefined, set to initial level
		if (typeof(level) === "undefined"){
			level =	0;
			}

	//Fetch sorting column
		sorting_column = sorting_order[level];

	//Comparison values
		var pattern = /^\d+$/;
		value_a = $.isArray(a[sorting_column]) == true ? pattern.test(a[sorting_column][0]) == true ? parseInt(a[sorting_column][0]) : a[sorting_column][0].toLowerCase() : pattern.test(a[sorting_column]) == true ? parseInt(a[sorting_column]) : a[sorting_column].toLowerCase();
		value_b = $.isArray(b[sorting_column]) == true ? pattern.test(b[sorting_column][0]) == true ? parseInt(b[sorting_column][0]) : b[sorting_column][0].toLowerCase() : pattern.test(b[sorting_column]) == true ? parseInt(b[sorting_column]) : b[sorting_column].toLowerCase();

	//Run nested sorting function if needed
		if (value_a == value_b && level < (sorting_order.length - 1)){
			return customSort(a, b, (level + 1));
			}

	return value_a > value_b ? 1 : -1;
	}

function showResults(){
	
	//Change page
		location.hash = "#resultsPage";
	
	//Create collapsibleset div
		collapsiblesetdiv = $("<div>");
		collapsiblesetdiv.attr("data-role", "collapsibleset");
		collapsiblesetdiv.attr("data-theme", "a");
		collapsiblesetdiv.attr("data-content-theme", "a");
		collapsiblesetdiv.attr("data-inset", false);

	//Filter & sort objects
		var temp_objects = new Array();
		temp_objects = filterObjects(objects);
		temp_objects = sortObjects(temp_objects);

	//Add objects to collabsibleset div
		for (i = 0; i < temp_objects.length; i++){
			addResultObject(temp_objects[i], collapsiblesetdiv);
			}

	//Append to results page
		$("#resultsPage div[role='main']").empty();
		$("#resultsPage div[role='main']").append(collapsiblesetdiv);
	
	//Activate collapsibleset widget
		collapsiblesetdiv.collapsibleset().trigger('create');
		collapsiblesetdiv.children(":first").trigger('expand');
	}

function addResultObject(object, collapsiblesetdiv){

	//Create collapsiblediv
		var collapsiblediv = $("<div>").appendTo(collapsiblesetdiv)
			.attr("data-role", "collapsible")
			.on("collapsibleexpand", function (event, ui){
				scrollToOpenCollapsible(this);
				});

	//Add header
		var header = $("<h3>").appendTo(collapsiblediv);
		header.html(object['address'] + " (" + object['area2'] + ", " + object['area'] + ")");
	
	//Add body (<p>)
		var p = $("<p>").appendTo(collapsiblediv);

	//Icons
		var icons_div = $("<div>");
		if (object['icons'].length > 0){
			for (z = 0; z < object['icons'].length; z++){
				var img = $("<img>")
					.attr("src", object['icons'][z].src)
					.css({
						"padding-left": "5px",
						"padding-right": "5px",
						})
					.appendTo(icons_div);
				}
			}

	//Grid of details
		grid = Array(
			Array("Hyra", object['cost'], "Rum", object['rooms']),
			Array("Tillträde", object['move_in_date'], "Våning", object['floor']),
			Array("Tillgänglig", object['available_date'], "Storlek", object['size'].join("&nbsp;")),
			Array("Anm. datum", object['last_reg_date'], "Anmäl.", object['interested']),
			Array("Boplats&nbsp;ID", object['boplats_id'], null, icons_div)
			);

		for (z = 0; z < grid.length; z++){
			var div = $("<div>").addClass("ui-grid-a")
				.append($("<div>")
					.addClass("ui-block-a bold")
					.css("width", "30%")
					.append(grid[z][0]))
				.append($("<div>")
					.addClass("ui-block-b")
					.css("width", "30%")
					.append(grid[z][1]))
				.append($("<div>")
					.addClass("ui-block-c bold")
					.css("width", "25%")
					.append(grid[z][2]))
				.append($("<div>")
					.addClass("ui-block-d")
					.css("width", "15%")
					.append(grid[z][3]));
			p.append(div);
			}

	//Description
		if (typeof(object['description']) !== 'undefined'){
			var div = $("<div>")
				.addClass("bold")
				.html("Beskrivning");
			p.append(div).append(object['description'].replace(/(<([^>]+)>)/ig,""));
			}
	
	//Properties
		if (typeof(object['properties']) !== 'undefined'){
			var div = $("<div>")
				.addClass("bold")
				.html("Bostaden har");
			p.append(div).append(object['properties'].replace(/(<([^>]+)>)/ig,""));
			}

	//Planning
		if (typeof(object['planning']) !== 'undefined'){
			var div = $("<div>")
				.addClass("bold")
				.html("Planlösning");
			p.append(div).append(object['planning'].replace(/(<([^>]+)>)/ig,""));
			}
	
	//Buttons
		var buttons_div = $("<fieldset data-role='controlgroup' data-type='horizontal'>").appendTo(p);

		//Location button
			location_btn = $("<a>")
				.appendTo(buttons_div)
				.addClass("ui-btn ui-shadow ui-corner-all ui-icon-location ui-btn-icon-notext")
				.html("Location")
				.click({address: object['address'], area: (object['area'] == "Kommuner nära Göteborg" ? object['area2'] : "Göteborg")}, function(event){

					$("#mapIframe").get(0).contentWindow.setAddressMarker(event.data.address+", "+event.data.area);
					
					$("#mapPopup").popup("open", {
						"positionTo": "window",
						"transition": "fade",
						"tolerance": "15,15,15,15",
						})
						.popup({
							afterclose: function() {
								$("#mapIframe").get(0).contentWindow.removeAddressMarker();
								},
							});
					});

		//Images button
			if (object['images'].length > 0){
				image_btn = $("<a>")
					.appendTo(buttons_div)
					.addClass("ui-btn ui-shadow ui-corner-all ui-icon-camera ui-btn-icon-notext")
					.html("Photos")
					.click({imgs: object['images']}, function(event){
						img = $("<img>")
							.attr("id", "image_object")
							.addClass("photo")
							.load(function(){
								$("#imagePopup").popup("open", {
									"positionTo": "window",
									"transition": "fade",
									})
									.popup({
										afterclose: function() {
											$("#image_object").remove();
											},
										});
								})
							.error(function(){
								$("#image_object").remove();
								alert("Kunde inte ladda bild, fel på bilden");
								console.log('image error:' + this.src);
								})
							.attr("src", event.data.imgs[0]);
						$("#imagePopup").append(img);
						});
				}

		//PDF button
			if (object['pdfs'].length > 0){
				pdf_btn = $("<a>")
					.appendTo(buttons_div)
					//.attr("href", object['pdfs'][0])
					//.attr("data-ajax", false)
					.attr("href", "#pdfPopup")
					.addClass("ui-btn ui-shadow ui-corner-all ui-icon-grid ui-btn-icon-notext")
					.attr("data-transition", "fade")
					.attr("data-rel", "popup")
					.html("PDFs");
				pdf_btn.click({pdfs: object['pdfs']}, function(event){
					//$("#pdf_div").load("http://docs.google.com/viewer?url="+event.data.pdfs[0]);
					$("#pdfDiv").load("test.html");
					});
				}

	}

function checkOngoingObjectRequests(){
	//Return true if there are still ongoing requests
		for (x = 0; x < ongoing_requests[1].length; x++){
			if (ongoing_requests[1][x] == true){
				updateProgress();
				return true;
				}
			}

	//If there are no ongoing requests, complete status bar and change to search page
		updateProgress(100);
		location.hash = "#searchPage";
	}

function updateProgress(value){
	
	//If no value is defined, calculate approximate progress based on ongoing requests compared to total requests
		if (typeof(value) === "undefined"){
			var count = 0;
			for (y = 0; y < ongoing_requests[1].length; y++){
				if (ongoing_requests[1][y] == false){
					count++;
					}
				}
			value = (count / ongoing_requests[1].length) * 80 + 20;
			}

	//Update progress bar
		$("#progressbar").progressbar("value", Math.round(value));

	}