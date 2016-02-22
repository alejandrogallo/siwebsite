// created by Alejandro Gallo 2015
// This script builds the navigation bar for all 
// html static pages in javascript. 


function Navigation () {
	// Creating the navigation class 
	// this.height=0.05*window.screen.availHeight;
	// this.width=window.screen.availWidth;
	this.tagName = "nav";
	this.sections = [
		{
			"label":"About",
			"href":"./index.html#about",
			"type":"inline"
		},{
			"label":"Contact",
			"href":"./contact.html",
			"type":"inline"
		},{
			"label":"Products",
			"href":"#",
			"type":"dropdown",
			"dropdownItems":[
				{"label":"TimeTagger 20","href":"./timetagger.html"},
				{"label":"PulseStreamer 8","href":"./pulsestreamer.html"},
				{"label":"PulseEmitter\n <span style='color:red'><i>(Coming soon!)</i></span>","href":"#"},
				{"label":"PIDCOntroller\n <span style='color:red'><i>(Coming soon!)</i></span>","href":"#"}
				]
		},
	];

	this.textLogo = {
		"label":"Swabian Instruments",
		"href":"./index.html"
	};

	// this.getCurrentPage = function(){
	// 	var currentPage = location.pathname.split("/").slice(-1);// get the last element of the path 
	// 	return currentPage; 
	// }


	this.getNavigationNode = function(){
		var nav = document.getElementsByTagName(this.tagName)[0];
		if (nav) {
			return nav; 
		}
		else{
			alert("Error: Navigation.js :: There is no "+this.tagName+" tag in your html document, put it so that you can have a navigation or remove the navigation.js script tag from your html document. ");
		}
	}

	this.createInlineTab = function(parentNode , tabObject ){
		var tabNode = document.createElement("li");
		var tabNodeLink = document.createElement("a");

		tabNodeLink.href= tabObject.href;
		tabNodeLink.innerHTML=tabObject.label;

		parentNode.appendChild(tabNode);
		tabNode.appendChild(tabNodeLink);  
	}

	this.createDropdownTab = function(parentNode , tabObject ){
		var tabNode = document.createElement("li");
		var innerHTML="";

		parentNode.appendChild(tabNode);
		tabNode.role="presentation";
		tabNode.className="dropdown";
		innerHTML='<a class="dropdown-toggle" data-toggle="dropdown" href="'+tabObject.href+'" role="button" aria-haspopup="true" aria-expanded="false">\
                '+tabObject.label+' <span class="caret"></span>\
            </a>\
            <ul class="dropdown-menu">';

        var dropdownItems=tabObject.dropdownItems;

        for (var i = 0; i < dropdownItems.length; i++) {
        	innerHTML+='\
                <li>\
                    <a href="'+dropdownItems[i].href+'">'+dropdownItems[i].label+'</a>\
                </li>\
                ';
        };

        innerHTML+='</ul>';

        tabNode.innerHTML=innerHTML;
	}

	this.createTextLogo = function(parentNode , tabNode ){
		var tabNodeLink = document.createElement("a");
		tabNodeLink.className = "navbar-brand";
		tabNodeLink.innerHTML=tabNode.label;
		tabNodeLink.href=tabNode.href;

		parentNode.appendChild(tabNodeLink);

	}

	this.createTab = function(parentNode, tabObject){
		if (tabObject.type=="inline"){
			this.createInlineTab(parentNode, tabObject);
		}
		else if (tabObject.type=="dropdown"){
			this.createDropdownTab(parentNode, tabObject);
		}
		else{
			alert("Error in navigation.js,  Navigation.createTab():::: Please type in a valid type for "+tabObject.label);
		}
	}
	
	this.createNavigation = function(){
		var nav = this.getNavigationNode();

		nav.className = "navbar navbar-inverse navbar-static-top" ;
		nav.role="navigation";


		var mainContainer = document.createElement("div");
		mainContainer.className="container";
		nav.appendChild(mainContainer);

		var headerContainer = document.createElement("div");
		headerContainer.className="navbar-header";
		var toggleButton = '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#main-navigation">\
                   	<span class="sr-only">Toggle navigation</span>\
                    <span class="icon-bar"></span>\
                    <span class="icon-bar"></span>\
                    <span class="icon-bar"></span>\
                </button>';
        headerContainer.innerHTML+=toggleButton;
        this.createTextLogo(headerContainer, this.textLogo);
        mainContainer.appendChild(headerContainer);



        var mainNavigationContainer = document.createElement("div");
		mainNavigationContainer.className="collapse navbar-collapse";
		mainNavigationContainer.id="main-navigation";
		mainContainer.appendChild(mainNavigationContainer);

        var mainNavigationList = document.createElement("ul");
        mainNavigationList.className="nav navbar-nav";
		mainNavigationContainer.appendChild(mainNavigationList);

		for (var i = 0; i < this.sections.length; i++) {
			this.createTab(mainNavigationList, this.sections[i]);
		};

	}

	this.init = function(){
		// this method inits 	everything together
		this.createNavigation();
	}
}

var nav = new Navigation();
nav.init();

