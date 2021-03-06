(function($) {

    var worker = new Worker('/js/indexer-searcher.js');

    worker.addEventListener('message', function(e) {
        switch (e.data.type) {
            case "indexation-done":
                break;
            case "free-search-results":
                displayResults(e.data.results);
                break;
            case "filter-search-results":
                displayResults(e.data.results);
                manageFilters(e.data.resultsByFilters);
                displayRemoveFilter();
                if (e.data.url) {
                    var url = getCategory(window.location.pathname) + e.data.url;
                    history.pushState({}, '', url);
                }
                break;
            case "init-values-by-filters-results":
                manageFilters(e.data.resultsByFilters);
                break;
            default:
                break;
        }
    }, false);

    worker.postMessage({'operation':'index','products':products,'filters':filters});
    worker.postMessage({'operation':'init-values-by-filters'});
    

    $(document).ready(function (e) {
        var category = getCategory(window.location.pathname);

        var $productsFilter = $("#free-search");
        $productsFilter.bind("keyup", function () {
            var searchedtext = $productsFilter.val();
            if (searchedtext === "") { displayAllProduct(); return; }
            worker.postMessage({'operation':'free-search','searchedtext':searchedtext});
        });

        var selectedFilters = [];
        $(".filter-name li a").on("click", function(){
            var selectedVal = $(this).attr("data-value");
            selectedFilters.push(selectedVal);
            worker.postMessage({'operation':'filter-search','selectedFilters':selectedFilters});
        });

        $(".remove-filter span").on("click", function(){
            selectedFilters = [];
            $(".filter-name").removeClass("novalue");
            $(".filter-value").removeClass("novalue");
            $(".remove-filter").addClass("nofilter");
            worker.postMessage({'operation':'init-values-by-filters'});
            history.pushState({}, '', category);
            displayAllProduct();
        });
        
        var selectedFilters = getSelectedFilters(window.location.pathname);
        if (selectedFilters.length > 0) {
            worker.postMessage({'operation':'filter-search-by-url','selectedFilters':selectedFilters});
        }
        
    });
    
    var getCategory = function(url) {
        if (url.length > 0) {
            var urlSplitted = url.split('/');
            if (urlSplitted[1] && urlSplitted[1].indexOf('C-') === 0) {
                return '/' + urlSplitted[1];
            }
        }
        return '';
    }

    var displayResults = function (results) {
        var newProductList = [];
        for (var i = 0; i < results.length; i++) {
            newProductList.push({
                productId : results[i].productId,
                productName : results[i].productName,
                imageUrl : results[i].imageUrl});
            if(i > 19) break;
        }

        $(".thumbnail").remove();
        var newProductsHtml = "";
        for (var i = 0; i < newProductList.length; i++) {
            newProductsHtml = addProducts(newProductsHtml,newProductList[i]);
        }
        $(".productslist").append(newProductsHtml);
    };

    var manageFilters = function(resultsByFilters){
        for(var i = 0;i<resultsByFilters.length;i++){
            var filter = resultsByFilters[i];
            var hasOnlyOnePertinentValue = true;
            var filterNotPertinentAnymore = true;
            for(var j = 0;j<filter.resultByFilter.length;j++){
                var filterElement = document.getElementById(filter.resultByFilter[j][0]);
                var numberOfResults = filter.resultByFilter[j][1];
                if(numberOfResults > 0){
                    $(filterElement).html($(filterElement).attr("data-value") + " (" + filter.resultByFilter[j][1] + ")");
                    $(filterElement).removeClass("novalue");
                    if(!filterNotPertinentAnymore){
                        hasOnlyOnePertinentValue = false;
                    }
                    if(filterNotPertinentAnymore) filterNotPertinentAnymore = false;
                } else {
                    $(filterElement).addClass("novalue");
                }
            }
            var filterList = document.getElementById(filter.name);
            if(filterNotPertinentAnymore || (!filterNotPertinentAnymore && hasOnlyOnePertinentValue)){
                $(filterList).addClass("novalue");
            } else {
                $(filterList).removeClass("novalue");
            }
        }
    };

    var displayAllProduct = function () {
        $(".thumbnail").remove();
        var newProductsHtml = "";
        var limit = products.length > 21 ? 21 : products.length -1;
        for (var i = 0; i < limit; i++) {
            newProductsHtml = addProducts(newProductsHtml,products[i]);
        }
        $(".productslist").append(newProductsHtml);
    };

    var addProducts = function(buildingString,product){
        buildingString += '<div class="col-md-3 col-xs-12 thumbnail" id=' + product.productId + '" style="display:block">';
        buildingString += '<img src="' + product.imageUrl + '">';
        buildingString += '<h1 class="productname">' + product.productName + '</h1>';
        buildingString += '</div>';
        return buildingString;
    };

    var displayRemoveFilter = function(){
        $(".remove-filter").removeClass("nofilter");
    };
    
    var getSelectedFilters = function(path) {
        var filterValuesUrl = [];
        var pathSplitted = path.split('/');
        for (var i = 0; i < pathSplitted.length; i++) {
            var pathElement = pathSplitted[i];
            if (pathElement.indexOf('N-') === 0) {
                filterValuesUrl.push('/' + pathElement);
            }
        }
        return filterValuesUrl;
    };
    
    
} )(jQuery);

