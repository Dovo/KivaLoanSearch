/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function searchName()
{
    alert("Searched");
    var searchName = document.getElementById("searchField").value;
    var fullSearch = "http://api.kivaws.org/v1/loans/search.json?q=" + searchName;
    $.getJSON(fullSearch, function(json_data)
    {
        //alert(JSON.stringify(json_data));
        
        createTable(json_data);
    });
    
    
}

function createTable(data)
{
    //alert(JSON.stringify(data));
    var resultList;
    resultList = "<ol id=\"resultsTable\">";
    var Aloans = data['loans'];
    var loans = JSON.stringify(Aloans);
    
    //alert(loans);
    
    $.each(JSON.parse(loans), function(index, object)
    {
        var row = object.name;
        var id = object.id;

//alert(row);
        resultList += "<li class=\"person\">";
        resultList += row;
        resultList += " ";
        resultList += id;   
        resultList += "</li>";   
    });
    resultList += "</ol>";
    $("#results").append(resultList);
    
    $("#resultsTable").selectable({
        selected: function(event, ui) {
            alert("got selection");
            $(".ui-selected", this).each(function() {
            var resIndex = $("#resultsTable li").index(this);
            var res = $(this).text();
            var split = res.split(" ");
            finalIndex = split.length;
            //alert(resIndex);
            //alert(split[finalIndex-1]);
            populateDetails(split[finalIndex-1]);      
            });
        

        }/*,
        stop: function() {
            alert("stopped");
            
        }*/
        
    });
}

function populateDetails(gotId)
{
    alert(gotId);
    
    var lenderSearch = "http://api.kivaws.org/v1/loans/" + gotId + "/lenders.json";
    alert(lenderSearch);
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
            //alert(lenderName);
            
            lenderList += "<li class=\"lender\">";
            lenderList += lenderName;
            lenderList += "</li>";
        });
        lenderList += "</ol> </div>";  
        $("#lenderBox").append(lenderList);
    });
    
    var teamSearch = "http://api.kivaws.org/v1/loans/" + gotId + "/teams.json";
    $.getJSON(teamSearch, function(json_data)
    {
        alert(JSON.stringify(json_data));  
        
        var teams = json_data['teams'];
        var teamString = JSON.stringify(teams);
        
        var teamList;
        teamList = "<div id=\"teamTable\"> <ol id=\"teamTable\">"; 
        $.each(JSON.parse(teamString), function(index, object)
        {
            var teamName = object.shortname;
            //alert(lenderName);
            
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
    
    
    
}


