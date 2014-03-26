lang = new Array();

lang['rooms'] = [{"SE":"Rum", "EN":"Rooms"}];
lang['min'] = [{"SE":"Min", "EN":"Min"}];
lang['max'] = [{"SE":"Max", "EN":"Max"}];

function changeLanguage(language){
	//alert(language);
	$("label[class=lang]").each(function(){
		temp = $(this).attr('id').split("_");
		//alert(temp[1]);
		//alert($(this).html(lang[temp[1]][language]));
		$(this).html();
		});
	}