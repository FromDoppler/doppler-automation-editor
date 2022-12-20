function enableButtons() {
    document.getElementById("nextMainButton").removeAttribute("disabled");
    document.getElementById("saveAndCloseMainButton").removeAttribute("disabled");
        
}

function disableButtons() {
    document.getElementById("nextMainButton").setAttribute("disabled", "disabled");
    document.getElementById("saveAndCloseMainButton").setAttribute("disabled", "disabled");
}

function createEditor() {
	tinyMCE.init({
		// Added by Diego
		//body_id : "my_id",

		// General options
		mode: "exact",
		elements: "editorTextarea, editorTextareaCampaignB",
		theme: "advanced",
		plugins: "imagemanager,style,layer,table,save,advhr,advimage,emotions,imgmap,inlinepopups,contextmenu,paste,directionality,fullpage,fullscreen,noneditable,visualchars",

		//Encoding options
		//entity_encoding : "raw",
		convert_urls: false,
		relative_urls: false,
		remove_script_host: false,

		//Souce Formatting
		apply_source_formatting: true,

		// Theme options
		theme_advanced_buttons1: "code,|,fullscreen,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,image,imgmap,cleanup,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,advhr",
		theme_advanced_buttons4: "newdocument,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,blockquote,pagebreak,|,insertfile|,ltr,rtl",
		theme_advanced_toolbar_location: "top",
		theme_advanced_toolbar_align: "left",

		theme_advanced_path: false,
		auto_resize: false,
		width: 680,
		height: 600,
		visual: false,
		//Eliminates p issue for mails
		force_br_newlines: false,
		force_p_newlines: true,
		forced_root_block: 'div',
		convert_newlines_to_brs: true,
		remove_redundant_brs: false,
		remove_linebreaks: false,
		invalid_elements: "p",


		// Drop lists for link/image/media
		//        external_link_list_url: "lists/link_list.js",
		//        external_image_list_url: "lists/image_list.js",
		//        media_external_list_url: "lists/media_list.js",

		setup: function (ed) {
			ed.onKeyUp.add(function (ed, e) {
				if ($(ed.getBody()).html() != "") {
					enableButtons();
				} else {
					disableButtons();
				}
			});

			ed.onSetContent.add(function (ed, o) {
				if ($(ed.getBody()).html() != "") {
					enableButtons();
				} else {
					disableButtons();
				}
			});


			ed.onExecCommand.add(function (ed, cmd, ui, val) {
				if ((cmd == "mceInsertContent") || (cmd == "mceRepaint")) {
					if ($(ed.getBody()).html() != "") {
						enableButtons();
					} else {
						disableButtons();
					}
				}
			});


			ed.onInit.add(function (ed) {

				$("#editorTextarea_ifr").css("background", "#FFFFFF");
				if ($("#editorTextareaCampaignB_tbl").length > 0) {
					$("#editorTextareaCampaignB_tbl").css("background", "#FFFFFF");
				}
				if ($('#editorTextarea').html() == "") {
					disableButtons();
				}
			});


		}
	});
}

function initHTMLEditor() {
	$("#tittleSubject").hide();
	$('#cleanSearchField a').click(function () {
		$('#fieldSearchText').val("");
		$('#cleanSearchField').hide();

		$('#fieldSearchText').focus();
	});

	ClickAndKeyUpOptions();


	function findContent(string, container) {
		if (container.toLowerCase().indexOf(string.toLowerCase()) != -1) {
			return true;
		}
		else {
			return false;
		}
	}

	function filterField(fieldList) {

		fieldList.html("");
		for (i = 0; i < Fields.length; i++) {
			if (findContent($("#fieldSearchText").val(), Fields[i].Name)) {
				var fieldElement = $("<span></span>", { "class": "fieldTag", id: "field-" + Fields[i].IdField }).text(fieldDelimiters['Field_Start_Delimiter'] + Fields[i].Name + fieldDelimiters['Field_End_Delimiter']);
				fieldList.append(fieldElement);
			}
		}

	}


	applyScrollStylesToContainer("#fieldList", false);
}
