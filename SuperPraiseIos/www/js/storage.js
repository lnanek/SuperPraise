
var SQ_FT_KEY = "SQ_FT_KEY";

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
