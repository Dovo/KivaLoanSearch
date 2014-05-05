/* 
 * Javascript source for Kiva Lona Search webpage.
 * Includes functons for retrieving data on borrowers
 * and displaying them via HTML.
 */


/*
 * Function to search by borrower name. Calls createTable to display returned
 * JSON data
 */
function searchName()
{
    alert("Searched");
    $("#results").empty();
    var searchName = document.getElementById("searchField").value;
    var fullSearch = "http://api.kivaws.org/v1/loans/search.json?q=" + searchName;
    $.getJSON(fullSearch, function(json_data)
    {
        //alert(JSON.stringify(json_data));
        createTable(json_data);
    });  
}

/*
 * Function takes in JSON data and creates HTML list with borrower name and ID.
 * Calls populateDetails to display detailed information on selected borrower
 */
function createTable(data)
{
    //create string to hold HTML data for borrower list
    var resultList;
    resultList = "<ol id=\"resultsTable\">";
    
    //get loans from JSON data param and stringify
    var Aloans = data['loans'];
    var loans = JSON.stringify(Aloans);
    
    //parse loans and extract name and ID for each borrower found, then
    //add data to borrower list and append it to HTML results attribute
    $.each(JSON.parse(loans), function(index, object)
    {
        var row = object.name;
        var id = object.id;

        resultList += "<li class=\"person\">";
        resultList += row;
        resultList += " ";
        resultList += id;   
        resultList += "</li>";   
    });
    resultList += "</ol>";
    $("#results").append(resultList);
    
    //make results selectable and display borrower details on selection
    $("#resultsTable").selectable(
    {
        selected: function(event, ui) 
        {
            alert("got selection");
            $(".ui-selected", this).each(function() 
            {
                var resIndex = $("#resultsTable li").index(this);
                var res = $(this).text();
                var split = res.split(" ");
                finalIndex = split.length;
                populateDetails(split[finalIndex-1]); 
            });
        }
        
        /*,
        stop: function() {
            alert("stopped");  
        }*/ 
    });
}


/*
 * Function takes borrower ID and param and searches for lenders and lending
 * teams, then displays data found
 */
function populateDetails(gotId)
{
    
    //alert(gotId);
    
    //search Kiva for lenders to given ID and create list of results, then
    //append to HTML
    var lenderSearch = "http://api.kivaws.org/v1/loans/" + gotId + "/lenders.json";
    $.getJSON(lenderSearch, function(json_data)
    {
        alert(JSON.stringify(json_data));  
        
        var lenders = json_data['lenders'];
        var lendersString = JSON.stringify(lenders);
        
        var lenderList;
        lenderList = "<div id=\"lenderTable\"> <ol id=\"lenderTable\">"; 
        $.each(JSON.parse(lendersString), function(index, object)
        {
            var lenderName = object.name;
            lenderList += "<li class=\"lender\">";
            lenderList += lenderName;
            lenderList += "</li>";
        });
        lenderList += "</ol> </div>";  
        $("#lenderBox").append(lenderList);
    });

    //search Kiva for lenders to given ID and create list of results, then
    //apend to HTML
    var teamSearch = "http://api.kivaws.org/v1/loans/" + gotId + "/teams.json";
    $.getJSON(teamSearch, function(json_data)
    {
        //alert(JSON.stringify(json_data));  
        
        var teams = json_data['teams'];
        var teamString = JSON.stringify(teams);
        
        var teamList;
        teamList = "<div id=\"teamTable\"> <ol id=\"teamTable\">"; 
        $.each(JSON.parse(teamString), function(index, object)
        {
            var teamName = object.shortname;
            teamList += "<li class=\"lender\">";
            teamList += teamName;
            teamList += "</li>";
        });
        teamList += "</ol> </div>";  
        $("#teamBox").append(teamList);
    
        if(JSON.parse(lendersString) === 0)
        {
            alert("error!");
        }
        
    });  
    
    //show final results in a <div> element
    //$("#popover").show("drop");
    //$("#popover").dialog("open");
    
     $( "#popover" ).dialog({
      position: { 
          my: "top", at: "center", of: window},
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    });
 
    $( "#popover" ).dialog( "open" );
}

$( ".selector" ).dialog({ position: { my: "left top", at: "left bottom", of: button } });
