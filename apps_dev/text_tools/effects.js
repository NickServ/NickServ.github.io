function convert() {
	watched_input = $("#text_before").val();
	
	if($("find_text").val() != "") {
		if($("#regexp_toggle").attr("checked", false)) {
			counts.find = watched_input.split($("#find_text").val()).length-1;
			$("#counts.find").html(" ("+counts.find+")");
		}
		else {
			counts.find = watched_input.split(new RegExp($("#find_text").val(), "gi")).length-1;
			$("#counts.find").html(" ("+counts.find+")");
		}
	}
	else {
		$("#counts.find").html("");
	}
	
	switch(effect) {
		case "normal":
			update(watched_input);
			break;
		case "lowercase":
			update(watched_input.toLowerCase());
			break;
		case "uppercase":
			update(watched_input.toUpperCase());
			break;
		case "htmllower":
			htmlCaseChanger("lower");
			break;
		case "htmlupper":
			htmlCaseChanger("upper");
			break;
		case "titlecase":
			update(watched_input.toLowerCase().toTitleCase());
			break;
		case "find":
			if($("#regexp_toggle").attr("checked", false)) {
				$("#text_after").val(watched_input.replace($("#find_test").val(), $("#find_text").val().toUpperCase()));
			}
			else {
				$("#text_after").val(watched_input.replace(new RegExp($("#find_text").val(), "gi"), ("#find_text").val().toUpperCase()));
			}
			break;
		case "replace":
			if($("#regexp_toggle").attr("checked", false)) {
				$("#text_after").val(watched_input.replace($("#find_text").val(), $("#replace_text").val()));
			}
			else {
				$("#text_after").val(watched_input.replace(new RegExp($("#find_text").val(), "gi"), $("#replace_text").val()));
			}
			break;
		case "list":
			if($("#number_list").attr("checked")) {
				listNumbers();
			}
			else {
				$("#text_after").val($("#list_start").val() + watched_input.replace(new RegExp("\n","gi"),"\n" + $("#list_start").val()));
			}
			break;
		case "remove_list":
			var text_array = watched_input.split("\n");
			for (var i=0; i<text_array.length; i++) {
				text_array[i] = text_array[i].substring(watched_cutoff);
			}
			update(text_array.join("\n"));
			break;
		case "repeat":
			update(watched_input.repeat(parseInt($("#repetitions").text())));
			break;
		case "wordcount":
			counts.char = watched_input.length;
			counts.line = watched_input.split("\n");
			counts.line = counts.line.length;
			counts.word = watched_input.split(" ");
			counts.word = counts.word.length + counts.line - 1;
			if(watched_input == "") {
				counts.word=0;
			}
			update("Characters: "+counts.char+"\nWords: "+counts.word+"\nLines: "+counts.line);
			break;
		case "sortaz":
			var text_array = watched_input.split("\n");
			text_array = text_array.sort();
			update(text_array.join("\n"));
			break;
		case "sortza":
			var text_array = watched_input.split("\n");
			text_array = text_array.sort();
			text_array = text_array.reverse();
			update(text_array.join("\n"));
			break;
		case "sortreverse":
			var text_array = watched_input.split("\n");
			text_array = text_array.reverse();
			update(text_array.join("\n"));
			break;
		case "sortrandom":
			var text_array = watched_input.split("\n");
			text_array = text_array.sort(function() {
				return 0.5 - Math.random();
			});
			update(text_array.join("\n"));
			break;
		case "rot13":
			update(watched_input.replace(/[a-zA-Z]/g, function(c){
				return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
			}));
			break;
		case "backwards":
			var backwards = "";
			for(var i = 0; i <= watched_input.length; i++) {
				backwards = watched_input.substring(i, i+1) + backwards;
			}
			update(backwards);
			break;
	}
	
	//output autoselect exclusion
	if(last.focused == $("#text_after") &&
		effect != "find" &&
		effect != "replace" &&
		effect != "list" &&
		effect != "remove_list" &&
		effect != "repeat") {
			selectAll($("#text_after"));
	}
}

//numbered lists
function listNumbers() {
	last.input = "";
	content_array = [];
	content_array = watched_input.split(new RegExp("\n", "gi"));
	var list_length = content_array.length;
	var num = 0;
	for (i=0; i<list_length; i++) { //act sequentially on all array items
		last.input = last.input + ++num + $("#list_start").val() + content_array.shift() + "\n";
	}
	update(last.input.slice(0,last.input.length-1));
}

//html upper/lower
function htmlCaseChanger(html_case_mode) {
	last.input = watched_input;
	content_array = [];
	for (i = 1; i<watched_input.split(new RegExp("<", "gi")).length; i++) { //set the input into an array
		if(last.input.indexOf("<") != -1) {
			content_array.push(last.input.substring(0,last.input.indexOf("<"))+"<");
			last.input = last.input.substring(last.input.indexOf("<")+1);
		}
		if(last.input.indexOf(">") != -1) {
			content_array.push(last.input.substring(0,last.input.indexOf(">"))+">");
			last.input = last.input.substring(last.input.indexOf(">")+1);
		}
	}
	content_array.push(last.input);
	for (i = 1; i<content_array.length; i = i+2) { //change the case of html
		if(html_case_mode == "lower") {
			content_array[i] = content_array[i].toLowerCase();
		}
		if(html_case_mode == "upper") {
			content_array[i] = content_array[i].toUpperCase();
		}
	}
	update(content_array.join("")); //set this value as blank when not bug testing
}

/* 
 * To Title Case 2.0.1 – http://individed.com/code/to-title-case/
 * Copyright © 2008–2012 David Gouch. Licensed under the MIT License. 
 */

String.prototype.toTitleCase = function () {
	var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

	return this.replace(/([^\W_]+[^\s-]*) */g, function (match, p1, index, title) {
		if (index > 0 && index + p1.length !== title.length &&
			p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && 
			title.charAt(index - 1).search(/[^\s-]/) < 0) {
			return match.toLowerCase();
		}

		if (p1.substr(1).search(/[A-Z]|\../) > -1) {
			return match;
		}

		return match.charAt(0).toUpperCase() + match.substr(1);
	});
};
