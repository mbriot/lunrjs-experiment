importScripts('/js/decatIndex.js');

var idx = new DecatIndex(
	{ref : "productId", 
		fieldsToIndex : [{name : 'productName',type : 'string'},{name : 'wordToIndex',type : 'string'}], 
		fieldsToStore : ['imageUrl','productName']
});

var filters;

self.addEventListener('message', function(e) {
    switch (e.data.operation) {
        case "index":
            buildIndex(e.data.products);
            filters = e.data.filters;
            postMessage({"type" : "indexation-done","message":"indexation done"});
            break;
        case "free-search":
            var results = idx.search(e.data.searchedtext,"freeSearch");
            postMessage({"type":"free-search-results","results":results});
            break;
        case "filter-search":
            console.log("filter-search for : " + e.data.searchedtext);
            var results = idx.search(e.data.searchedtext);
            var resultsByFilters = numberOfResultByFilterValue(e.data.searchedtext);
            postMessage(
                {"type":"filter-search-results",
                 "results":results,
                 "resultsByFilters":resultsByFilters});
            break;
        case "init-values-by-filters":
            var resultsByFilters = initResultByFilters();
            postMessage({"type":"init-values-by-filters-results","resultsByFilters":resultsByFilters});
            break;
        default:
            console.log("Not a valid task");
            break;
    }
}, false);

var buildIndex = function(products){
    for(var i = 0;i<products.length;i++){
        idx.indexDoc(products[i]);
    }
};

var search =  function(searchText,searchType) {
    return ;
};

var numberOfResultByFilterValue = function(actualSearch){
    var resultsByFilters = [];
    var actualNumberOfResults = idx.search(actualSearch).length;
    for(var i = 0; i < filters.length; i++) {
        var resultByFilter = [];
        var filterName = filters[i].filterName;
        var filterValues = filters[i].values;
        for(var j = 0;j<filterValues.length;j++){
            var formattedValue = filterValues[j].split(" ").join("");
            var withThisFilter = actualSearch + " " + formattedValue;
            var results = idx.search(withThisFilter);
            var numberOfResults = results.length;
            var isPertinent = numberOfResults > 0 && numberOfResults < actualNumberOfResults;
            if(!isPertinent){
                resultByFilter.push([formattedValue,0]);
            } else {
                resultByFilter.push([formattedValue,numberOfResults]);
            }

        }
        resultsByFilters.push({name:filterName,resultByFilter:resultByFilter});
    }
    return resultsByFilters;
};


var initResultByFilters = function () {
    var resultsByFilters = [];
    for(var i = 0; i < filters.length; i++) {
        var resultByFilter = [];
        var filterName = filters[i].filterName;
        var filterValues = filters[i].values;
        for(var j = 0;j<filterValues.length;j++){
            var formattedValue = filterValues[j].split(" ").join("");
            var results = idx.search(formattedValue);
            var numberOfResults = results.length;
            resultByFilter.push([formattedValue,numberOfResults]);
        }
        resultsByFilters.push({name:filterName,resultByFilter:resultByFilter});
    }
    return resultsByFilters;
};