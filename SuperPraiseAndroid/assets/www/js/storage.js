
var SQ_FT_KEY = "SQ_FT_KEY";

var APPRAISAL_ID_KEY = "APPRAISAL_ID_KEY";

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key, defaultValue) {
    var value = this.getItem(key);
    if ( null === value ) {
    	return defaultValue;
    }
    return JSON.parse(value);
};

function getSqFt() {
    return localStorage.getItem(SQ_FT_KEY);
}

function setSqFt(newValue) {
    return localStorage.setItem(SQ_FT_KEY, newValue);
}

function getAppraisalIdKey() {
    return localStorage.getItem(APPRAISAL_ID_KEY);
}

function setAppraisalIdKey(newValue) {
    return localStorage.setItem(APPRAISAL_ID_KEY, newValue);
}
