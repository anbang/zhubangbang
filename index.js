var Czr = require('./lib/czr');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Czr === 'undefined') {
    window.Czr = Czr;
}

module.exports = Czr;
