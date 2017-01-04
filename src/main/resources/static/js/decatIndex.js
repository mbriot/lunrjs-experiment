(function(){
var FuzzySet = function(arr, useLevenshtein, gramSizeLower, gramSizeUpper) {
    var fuzzyset = {
        version: '0.0.1'
    };

    // default options
    arr = arr || [];
    fuzzyset.gramSizeLower = gramSizeLower || 2;
    fuzzyset.gramSizeUpper = gramSizeUpper || 3;
    fuzzyset.useLevenshtein = (typeof useLevenshtein !== 'boolean') ? true : useLevenshtein;

    // define all the object functions and attributes
    fuzzyset.exactSet = {};
    fuzzyset.matchDict = {};
    fuzzyset.items = {};

    // helper functions
    var levenshtein = function(str1, str2) {
        var current = [], prev, value;

        for (var i = 0; i <= str2.length; i++)
            for (var j = 0; j <= str1.length; j++) {
            if (i && j)
                if (str1.charAt(j - 1) === str2.charAt(i - 1))
                value = prev;
                else
                value = Math.min(current[j], current[j - 1], prev) + 1;
            else
                value = i + j;

            prev = current[j];
            current[j] = value;
            }

        return current.pop();
    };

    // return an edit distance from 0 to 1
    var _distance = function(str1, str2) {
        if (str1 === null && str2 === null) throw 'Trying to compare two null values';
        if (str1 === null || str2 === null) return 0;
        str1 = String(str1); str2 = String(str2);

        var distance = levenshtein(str1, str2);
        if (str1.length > str2.length) {
            return 1 - distance / str1.length;
        } else {
            return 1 - distance / str2.length;
        }
    };
    var _nonWordRe = /[^\w, ]+/;

    var _iterateGrams = function(value, gramSize) {
        gramSize = gramSize || 2;
        var simplified = '-' + value.toLowerCase().replace(_nonWordRe, '') + '-',
            lenDiff = gramSize - simplified.length,
            results = [];
        if (lenDiff > 0) {
            for (var i = 0; i < lenDiff; ++i) {
                value += '-';
            }
        }
        for (var i = 0; i < simplified.length - gramSize + 1; ++i) {
            results.push(simplified.slice(i, i + gramSize));
        }
        return results;
    };

    var _gramCounter = function(value, gramSize) {
        // return an object where key=gram, value=number of occurrences
        gramSize = gramSize || 2;
        var result = {},
            grams = _iterateGrams(value, gramSize),
            i = 0;
        for (i; i < grams.length; ++i) {
            if (grams[i] in result) {
                result[grams[i]] += 1;
            } else {
                result[grams[i]] = 1;
            }
        }
        return result;
    };

    // the main functions
    fuzzyset.get = function(value, defaultValue) {
        // check for value in set, returning defaultValue or null if none found
        var result = this._get(value);
        if (!result && typeof defaultValue !== 'undefined') {
            return defaultValue;
        }
        return result;
    };

    fuzzyset._get = function(value) {
        var normalizedValue = this._normalizeStr(value),
            result = this.exactSet[normalizedValue];
        if (result) {
            return [[1, result]];
        }

        var results = [];
        // start with high gram size and if there are no results, go to lower gram sizes
        for (var gramSize = this.gramSizeUpper; gramSize >= this.gramSizeLower; --gramSize) {
            results = this.__get(value, gramSize);
            if (results) {
                return results;
            }
        }
        return null;
    };

    fuzzyset.__get = function(value, gramSize) {
        var normalizedValue = this._normalizeStr(value),
            matches = {},
            gramCounts = _gramCounter(normalizedValue, gramSize),
            items = this.items[gramSize],
            sumOfSquareGramCounts = 0,
            gram,
            gramCount,
            i,
            index,
            otherGramCount;

        for (gram in gramCounts) {
            gramCount = gramCounts[gram];
            sumOfSquareGramCounts += Math.pow(gramCount, 2);
            if (gram in this.matchDict) {
                for (i = 0; i < this.matchDict[gram].length; ++i) {
                    index = this.matchDict[gram][i][0];
                    otherGramCount = this.matchDict[gram][i][1];
                    if (index in matches) {
                        matches[index] += gramCount * otherGramCount;
                    } else {
                        matches[index] = gramCount * otherGramCount;
                    }
                }
            }
        }

        function isEmptyObject(obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }
            return true;
        }

        if (isEmptyObject(matches)) {
            return null;
        }

        var vectorNormal = Math.sqrt(sumOfSquareGramCounts),
            results = [],
            matchScore;
        // build a results list of [score, str]
        for (var matchIndex in matches) {
            matchScore = matches[matchIndex];
            results.push([matchScore / (vectorNormal * items[matchIndex][0]), items[matchIndex][1]]);
        }
        var sortDescending = function(a, b) {
            if (a[0] < b[0]) {
                return 1;
            } else if (a[0] > b[0]) {
                return -1;
            } else {
                return 0;
            }
        };
        results.sort(sortDescending);
        if (this.useLevenshtein) {
            var newResults = [],
                endIndex = Math.min(50, results.length);
            // truncate somewhat arbitrarily to 50
            for (var i = 0; i < endIndex; ++i) {
                newResults.push([_distance(results[i][1], normalizedValue), results[i][1]]);
            }
            results = newResults;
            results.sort(sortDescending);
        }
        var newResults = [];
        for (var i = 0; i < results.length; ++i) {
            if (results[i][0] == results[0][0]) {
                newResults.push([results[i][0], this.exactSet[results[i][1]]]);
            }
        }
        return newResults;
    };

    fuzzyset.add = function(value) {
        var normalizedValue = this._normalizeStr(value);
        if (normalizedValue in this.exactSet) {
            return false;
        }

        var i = this.gramSizeLower;
        for (i; i < this.gramSizeUpper + 1; ++i) {
            this._add(value, i);
        }
    };

    fuzzyset._add = function(value, gramSize) {
        var normalizedValue = this._normalizeStr(value),
            items = this.items[gramSize] || [],
            index = items.length;

        items.push(0);
        var gramCounts = _gramCounter(normalizedValue, gramSize),
            sumOfSquareGramCounts = 0,
            gram, gramCount;
        for (gram in gramCounts) {
            gramCount = gramCounts[gram];
            sumOfSquareGramCounts += Math.pow(gramCount, 2);
            if (gram in this.matchDict) {
                this.matchDict[gram].push([index, gramCount]);
            } else {
                this.matchDict[gram] = [[index, gramCount]];
            }
        }
        var vectorNormal = Math.sqrt(sumOfSquareGramCounts);
        items[index] = [vectorNormal, normalizedValue];
        this.items[gramSize] = items;
        this.exactSet[normalizedValue] = value;
    };

    fuzzyset._normalizeStr = function(str) {
        if (Object.prototype.toString.call(str) !== '[object String]') throw 'Must use a string as argument to FuzzySet functions';
        return str.toLowerCase();
    };

    // return length of items in set
    fuzzyset.length = function() {
        var count = 0,
            prop;
        for (prop in this.exactSet) {
            if (this.exactSet.hasOwnProperty(prop)) {
                count += 1;
            }
        }
        return count;
    };

    // return is set is empty
    fuzzyset.isEmpty = function() {
        for (var prop in this.exactSet) {
            if (this.exactSet.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    };

    // return list of values loaded into set
    fuzzyset.values = function() {
        var values = [],
            prop;
        for (prop in this.exactSet) {
            if (this.exactSet.hasOwnProperty(prop)) {
                values.push(this.exactSet[prop]);
            }
        }
        return values;
    };


    // initialization
    var i = fuzzyset.gramSizeLower;
    for (i; i < fuzzyset.gramSizeUpper + 1; ++i) {
        fuzzyset.items[i] = [];
    }
    // add all the items to the set
    for (i = 0; i < arr.length; ++i) {
        fuzzyset.add(arr[i]);
    }

    return fuzzyset;
};
var DecatIndex = function(options) {
		var decatIndex = {};
		var ref = options.ref;
		var integerFieldsToIndex = integerFieldsToIndex || options.fieldsToIndex
			.filter(function(field){if(field.type == 'integer') return true})
			.map(function(field){return field.name});
		var stringFieldsToIndex = stringFieldsToIndex || options.fieldsToIndex
			.filter(function(field){if(field.type == 'string') return true})
			.map(function(field){return field.name});
		var fieldsToStore = options.fieldsToStore;
		var index = options.index || {};
		var store = options.store || {};
		var dictionary = new Set();
		var fuzzySet = (options.dictionary && options.dictionary.length > 0) ?
				FuzzySet(options.dictionary) : FuzzySet([]);

	decatIndex.getFromIndex = function(term){
		return index[term]
	};
	
	decatIndex.getFromFuzzy = function(term){
		return fuzzySet.get(term)
	};

	decatIndex.indexDoc = function(doc) {
		for (var key in doc) {
			if (doc.hasOwnProperty(key)) {
				var fieldName = key;
				var fieldValue = doc[key];
			} else {
				continue;
			}

			if(fieldName == ref) continue;

			if (integerFieldsToIndex.indexOf(fieldName) != -1) {
				fieldValue = parseInt(fieldValue);
				var lowerBound = Math.floor(fieldValue / 10) * 10;
				var upperBound = Math.ceil(fieldValue / 10)  * 10;
				var token = fieldName + "x" + lowerBound + "x" + upperBound;
				var documentId = parseInt(doc[ref]);
				var docsId = index[token];
				if(docsId === undefined){
					index[token] = [documentId];
				}else {
					var newCompressedList = addTermToCompressedArray(docsId,documentId);
					index[token] = newCompressedList;	
				}
			}

			if (stringFieldsToIndex.indexOf(fieldName) != -1) {
				var tokens = fieldValue.split(" ").map(function(token){
					return token.toLowerCase();
				});
				tokens.forEach(function(token){
					dictionary.add(token);
					fuzzySet.add(token);
					var documentId = parseInt(doc[ref]);
					var docsId = index[token];
					if(docsId === undefined){
						index[token] = [documentId];
						return;
					}
					var newCompressedList = addTermToCompressedArray(docsId,documentId);
					index[token] = newCompressedList;
				});
			}

			if (fieldsToStore.indexOf(fieldName) != -1) {
				if(!store[doc[ref]]) store[doc[ref]] = {}
				store[doc[ref]][fieldName] =  doc[fieldName]
			}
		}
	};

	decatIndex.search = function(str){
		var documentsByToken = [];
		var tokens = str.trim().split(" ").map(function(element){
			return element;
		});
		var integerStoreFiltering = [];
		tokens.forEach(function(token){
			var isNumericRangeQuery = token.match(/.*\[.*:.*\]/);
			if(isNumericRangeQuery){
				var queryElement = token.match(/(.*):\[(.*):(.*)\]$/);
				var searchedField = queryElement[1];
				var from = queryElement[2];
				var to = queryElement[3];
				integerStoreFiltering.push({name : searchedField,lowerBound : from,upperBound : to});
				var lowerBound = Math.floor(parseInt(from) / 10) * 10;
				var upperBound = Math.ceil(parseInt(to) / 10)  * 10;
				var rangesToSearch = [];
				while(lowerBound < upperBound){
					rangesToSearch.push(searchedField + "x" + lowerBound + "x" + (lowerBound + 10));
					lowerBound = lowerBound + 10;
				}
				var results = [];
				for(var i = 0;i<rangesToSearch.length;i++){
					results = results.concat(unCompressed(index[rangesToSearch[i]]));
				}
				documentsByToken.push(results);
			} else {
				token = token.toLowerCase(); //TO-DO : apply normalization here
				var fuzzySetResults = fuzzySet.get(token);
				if(fuzzySetResults !== null) {
					documentsByToken.push(unCompressed(index[fuzzySetResults[0][1]]));
				} else {
					documentsByToken.push([]);
				}
			}
		});

		var finalResult = documentsByToken.reduce(function(previous,current){
				return previous.filter(function(e){
					if(current.indexOf(e) != -1) return true;
				});
		});

		finalResult = finalResult.map(function(id) {
			var doc = store[id];
			doc[ref] = id;

		  return doc;
		});

		if(integerStoreFiltering.length == 0) return finalResult;

		for(var i = 0;i<integerStoreFiltering.length;i++){
			for(var j = 0;j<finalResult.length;j++){
				var fieldValue = finalResult[j][integerStoreFiltering[i].name];
				if(fieldValue < integerStoreFiltering[i].lowerBound || fieldValue > integerStoreFiltering[i].upperBound){
					finalResult.splice(j,1);
				}
			}
		}
		return finalResult;
	};

	decatIndex.toJson = function(){
		return {
			ref : ref,
			index : index,
			store : store,
			integerFieldsToIndex : integerFieldsToIndex,
			stringFieldsToIndex : stringFieldsToIndex,
			fieldsToStore : fieldsToStore,
			dictionary :  Array.from(dictionary)
		}
	};

	var addTermToCompressedArray = function(oldList,id){
			var unCompressedArray = unCompressed(oldList)
			unCompressedArray.push(id)
			var newCompressedArray = [unCompressedArray[0]]
			for(var j = 1;j <unCompressedArray.length;j++){
					newCompressedArray[j] = unCompressedArray[j] - unCompressedArray[j-1]
			}
			return newCompressedArray
	};

	var unCompressed = function(oldArray){
		var unCompressedArray = [oldArray[0]];
			for(var i = 1; i<oldArray.length; i++){
				unCompressedArray[i] = oldArray[i] + unCompressedArray[i-1]
			}
		return unCompressedArray
	}

	return decatIndex;
};

	var root = this;
	if (typeof module !== 'undefined' && module.exports) {
	    module.exports = DecatIndex;
	    root.DecatIndex = DecatIndex;
	} else {
	    root.DecatIndex = DecatIndex;
	}

})();
