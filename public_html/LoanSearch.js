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
    
    var fullSearch = "http://api.kivaws.org/v1/loans/" + gotId + "/lenders.json";
    alert(fullSearch);
    $.getJSON(fullSearch, function(json_data)
    {
        alert(JSON.stringify(json_data));  
        
        
    });
    
    
    
}


