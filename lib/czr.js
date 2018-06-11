var BigNumber = require('bignumber.js');


function Czr(provider) {
    this.eth = 'eth';
}
Czr.prototype.BigNumber = BigNumber;

module.exports = Czr;
