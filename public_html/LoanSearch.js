/* 
 * Javascript source for Kiva Lona Search webpage.
 * Includes functons for retrieving data on borrowers
 * and displaying them in HTML.
 */

/*
 * Function to search by borrower name. Calls createTable to display returned
 * JSON data
 */
function searchName()
{
    //clear previous results data when we get a new search
    $("#results").empty();
    $("#details").empty();
    $("#lenderBox").empty();
    $("#teamBox").empty();
    
    var searchName = document.getElementById("searchField").value;
    var fullSearch = "http://api.kivaws.org/v1/loans/search.json?q=" + searchName;
    $.getJSON(fullSearch, function(json_data)
    {
        createTable(json_data);
    });  
}

/*
 * Function takes in JSON data and creates HTML list with borrower name and ID.
 * Calls populateDetails to display detailed information on selected borrower
 */
function createTable(data)
{
    var divClone = $("#popover").clone();
    
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
        var amount = object.amount;
        var desc = object.use;
        var imageID = object.image.id;

        resultList += "<li class=\"person\">";
        resultList += "<img src=http://www.kiva.org/img/s150/"
        resultList += imageID;
        resultList += ".jpg>";
        resultList += "<h3>";
        resultList += id;
        resultList += ": ";
        resultList += row;
        resultList += "</h3>";
        resultList += "<p>Your loan will help ";
        resultList += row;
        resultList += " ";
        resultList += desc;
        resultList += "</p>";
        resultList += "</li>";   
    });
    resultList += "</ol>";
    $("#results").append(resultList);
    
    //make results selectable and display borrower details on selection
    $("#resultsTable").selectable(
    {
        selected: function(event, ui) 
        {
            $(".ui-selected", this).each(function() 
            {
                var resIndex = $("#resultsTable li").index(this);
                var res = $(this).text();
                var split = res.split(":");
                $("#popover").replaceWith(divClone.clone());
                populateDetails(split[0]); 
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
    var detailSearch = "http://api.kivaws.org/v1/loans/" + gotId + ".json";
    $.getJSON(detailSearch, function(json_data)
    {
        var loan = json_data['loans'];
        var loanString = JSON.stringify(loan);
        //alert(loanString);
        
        $.each(JSON.parse(loanString), function(index, object)
        {
            var fundedAmount = object.funded_amount;
            var loanAmount = object.loan_amount;
            var funded = "<h4>Funded $"
            funded += fundedAmount;
            funded += " out of $";
            funded += loanAmount;
            funded += "</h4>";
            
            $("#details").append(funded);
        });
    });

    //search Kiva for lenders to given ID and create list of results, then
    //append to HTML
    var lenderSearch = "http://api.kivaws.org/v1/loans/" + gotId + "/lenders.json";
    $.getJSON(lenderSearch, function(json_data)
    {   
        var lenders = json_data['lenders'];
        var lendersString = JSON.stringify(lenders);
        
        var lenderList;
        lenderList = "<div id=\"lenderTable\"> <ul id=\"lenderTable\">"; 
        $.each(JSON.parse(lendersString), function(index, object)
        {
            var lenderName = object.name;
            var lenderImage = object.image.id;
            //alert(lenderImage);
            lenderList += "<li id=\"lender\"><a href=\"#\"><img src=http://www.kiva.org/img/s50/";
            lenderList += lenderImage;
            lenderList += ".jpg></a></li>";
        });
        lenderList += "</ul> </div>";  
        $("#lenderBox").append(lenderList);
    });

    //search Kiva for lenders to given ID and create list of results, then
    //apend to HTML
    var teamSearch = "http://api.kivaws.org/v1/loans/" + gotId + "/teams.json";
    $.getJSON(teamSearch, function(json_data)
    { 
        var teams = json_data['teams'];
        var teamString = JSON.stringify(teams);
        
        var teamList;
        teamList = "<div id=\"teamTable\"> <ul id=\"teamTable\">"; 
        $.each(JSON.parse(teamString), function(index, object)
        {
            var teamName = object.shortname;
            var teamImage = object.image.id;
            
            teamList += "<li id=\"lender\"><a href=\"#\"><img src=http://www.kiva.org/img/s50/";
            teamList += teamImage;
            teamList += ".jpg></a></li>";
        });
        teamList += "</ul> </div>";  
        $("#teamBox").append(teamList);
    });  
    
    $("#popover").show();
}