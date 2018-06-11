#!/usr/bin/env node
var Czr = require('../index.js');
var czr = new Czr();

// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var coinbase = czr.eth;
console.log(coinbase);

// var balance = web3.eth.getBalance(coinbase);
console.log(coinbase.toString(10));