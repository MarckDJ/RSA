const BigInteger = require("big-integer");

var generarPrimos = () => {
    do {
        var p = BigInteger.randBetween(BigInteger(1), BigInteger(100));
    } while (!p.isPrime());
    do {
        do {
            var q = BigInteger.randBetween(BigInteger(1), BigInteger(100));
        } while (!q.isPrime());
    } while (q.compare(p) == 0);
    return { q, p };
};

var generarClaves = (q, p) => {
    //n = p * q
    var n = p.multiply(q);
    //phi = (p-1)*(q-1)
    var phi = p.subtract(BigInteger(1)).multiply(q.subtract(BigInteger(1)));

    //calcular el primo relativo o coprimo e y menor que n
    do {
        var e = BigInteger.randBetween(BigInteger(1), BigInteger(phi));
    } while (!(e.isOdd() && BigInteger.gcd(e, phi) == 1)); //calcular el mcd e
    return { e, n };
};

var recuperarClaves = (e, q, p) => {
    //n = p * q
    var n = p.multiply(q);
    //phi = (p-1)*(q-1)
    var phi = p.subtract(BigInteger(1));
    phi = phi.multiply(q.subtract(BigInteger(1)));
    var d = e.modInv(phi);

    return { d, n };
};

var encryp = (msg, e, n) => {
    var i;
    var temp;
    var digitos = msg;
    var bigDigitos = Array(digitos.length);
    for (i = 0; i < bigDigitos.length; i++) {
        temp = digitos[i];
        bigDigitos[i] = BigInteger(temp);
    }
    var cifrado = Array(digitos.length);
    for (i = 0; i < bigDigitos.length; i++) {
        //aplico el modulo para el cifrado
        cifrado[i] = bigDigitos[i].pow(e).mod(n);
    }
    return cifrado;
};

var decrypt = (cifrado, d, n) => {
    var descifrado = Array(cifrado.length);
    //descifrar
    for (i = 0; i < descifrado.length; i++) {
        //aplico
        descifrado[i] = BigInteger(cifrado[i]).pow(d).mod(n);
    }
    var chain = Array(cifrado.length);
    for (i = 0; i < chain.length; i++) {
        chain[i] = descifrado[i].toJSNumber();
    }
    return chain;
};

module.exports = {
    encriptar: (msg) => {
        var primos = generarPrimos();
        var keys = generarClaves(primos.q, primos.p);
        return {
            q: primos.q,
            p: primos.p,
            e: keys.e,
            mensaje: encryp(msg, keys.e, keys.n),
        };
    },
    desencriptar: (e, q, p, msg) => {
        e = BigInteger(e);
        q = BigInteger(q);
        p = BigInteger(p);
        var keys = recuperarClaves(e, q, p);
        return decrypt(msg, keys.d, keys.n);
    },
};
