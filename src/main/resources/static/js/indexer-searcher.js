importScripts('https://cdnjs.cloudflare.com/ajax/libs/lunr.js/0.7.1/lunr.min.js');
var indexFilter = lunr(function () {
    this.field('wordToIndex');
    this.ref('productId');
});

var indexProductName = lunr(function () {
    this.field('productName');
    this.ref('productId');
});
var store = {};

var filters;

self.addEventListener('message', function(e) {
    switch (e.data.operation) {
        case "index":
            buildIndex(e.data.products);
            filters = e.data.filters;
            postMessage({"type" : "indexation-done","message":"indexation done"});
            break;
        case "free-search":
            var results = search(e.data.searchedtext,"freeSearch");
            postMessage({"type":"free-search-results","results":results});
            break;
        case "filter-search":
            console.log("filter-search for : " + e.data.selectedFilters);
            var filtersToApply = getFiltersByProperty(e.data.selectedFilters, 'value');
            var searchedtext = getSearchedText(filtersToApply);
            var url = getUrl(filtersToApply);
            postFilterSearchResult(searchedtext, url);
            break;
        case "filter-search-by-url":
            console.log("filter-search-by-url for : " + e.data.selectedFilters);
            var filtersToApply = getFiltersByProperty(e.data.selectedFilters, 'url');
            if (filtersToApply.length > 0) {
                var searchedtext = getSearchedText(filtersToApply);
                postFilterSearchResult(searchedtext);
            }
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
        indexFilter.add({
            productId: products[i].productId,
            wordToIndex : products[i].wordToIndex
        });
        indexProductName.add({
            productId: products[i].productId,
            productName : products[i].productName
        });
        store[products[i].productId] = {
            productId: products[i].productId,
            productName: products[i].productName,
            imageUrl: products[i].imageUrl
        };
    }
};

var search =  function(searchText,searchType) {
    var searchResults = (searchType === "freeSearch") ? indexProductName.search(searchText) : indexFilter.search(searchText);
    var results = [];
    for(var i = 0;i < searchResults.length ;i++){
        var productId = store[searchResults[i].ref].productId;
        var imageUrl = store[searchResults[i].ref].imageUrl;
        var productName = store[searchResults[i].ref].productName;
        results.push({productId:productId,imageUrl:imageUrl,productName:productName});
    }
    return results;
};

var numberOfResultByFilterValue = function(actualSearch){
    var resultsByFilters = [];
    var actualNumberOfResults = indexFilter.search(actualSearch).length;
    for(var i = 0; i < filters.length; i++) {
        var resultByFilter = [];
        var filterName = filters[i].filterName;
        var filterValues = filters[i].values;
        for(var j = 0;j<filterValues.length;j++){
            var formattedValue = filterValues[j].value.split(" ").join("");
            var withThisFilter = actualSearch + " " + formattedValue;
            var results = indexFilter.search(withThisFilter);
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

var getFiltersByProperty = function(selectedFilters, property) {
    var filtersToApply = [];
    for(var i = 0; i < filters.length; i++) {
        var filterValues = filters[i].values;
        for(var j = 0; j < filterValues.length; j++) {
            for(var k = 0; k < selectedFilters.length; k++){
                if (filterValues[j][property] === selectedFilters[k]) {
                    filtersToApply.push(filterValues[j]);
                    break;
                }
            }
        }
    }
    return filtersToApply;
}

var getSearchedText = function(filtersToApply) {
    var searchedText = [];
    for (var i = 0; i < filtersToApply.length; i++) {
        searchedText.push(filtersToApply[i].value.split(" ").join(""));
    }
    return searchedText.join(" ");
};


var getUrl = function(filtersToApply) {
    var url = '';
    for(var i = 0; i < filtersToApply.length; i++) {
        url += filtersToApply[i].url;
    }
    return url;
};

var initResultByFilters = function () {
    var resultsByFilters = [];
    for(var i = 0; i < filters.length; i++) {
        var resultByFilter = [];
        var filterName = filters[i].filterName;
        var filterValues = filters[i].values;
        for(var j = 0;j<filterValues.length;j++){
            var formattedValue = filterValues[j].value.split(" ").join("");
            var withThisFilter = formattedValue;
            var results = indexFilter.search(withThisFilter);
            var numberOfResults = results.length;
            resultByFilter.push([formattedValue,numberOfResults]);
        }
        resultsByFilters.push({name:filterName,resultByFilter:resultByFilter});
    }
    return resultsByFilters;
};

var postFilterSearchResult = function(searchedtext, url) {
    var results = search(searchedtext, "filterSearch");
    var resultsByFilters = numberOfResultByFilterValue(searchedtext);
    postMessage({
        "type" : "filter-search-results",
        "results" : results,
        "resultsByFilters" : resultsByFilters,
        "url": url
    });
}