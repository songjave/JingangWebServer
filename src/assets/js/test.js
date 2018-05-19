/**
 * Created by pengfeixiang on 18/1/9.
 */

var Queue = function (length) {
    this.MAX_LEN = length;
    this.cache = new Array(length);
    this.index = 0;
    this.len = 0;
};

Queue.prototype.add = function (data) {
    this.cache[this.index] = data;
    this.index = (this.index + 1) % this.MAX_LEN;
    this.len = (this.len + 1 > this.MAX_LEN) ? this.MAX_LEN : (this.len + 1);
};

Queue.prototype.get = function () {
    //console.log(this.len, this.cache);
    if (this.len < this.MAX_LEN) {
        return this.cache.slice(0, this.len);
    }

    var arr1 = this.cache.slice(this.index);
    var arr2 = this.cache.slice(0, this.index);

    return arr1.concat(arr2);
};
