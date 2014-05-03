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
    var stuff;
    stuff = "<table id=\"resultsTable\">";
    var Aloans = data['loans'];
    var loans = JSON.stringify(Aloans);
    
     $.each(JSON.parse(loans), function(index, object)
    {
        var row = object.name;
        var id = object.id;

//alert(row);
        stuff += "<tr><td>";
        stuff += id;
        stuff += "</td><td>";
        stuff += row;   
        stuff += "</td></tr>";   
    });
    stuff += "</table";
    $(".results").append(stuff);
    
    
}


