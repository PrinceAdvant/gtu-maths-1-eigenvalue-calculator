const F = require('./calc.js');
const a = (x, y, tol = 1e-6) => { if (Math.abs(x - y) > tol * Math.max(1, Math.abs(y))) throw Error(x + ' vs ' + y); };

// Steam (illustrative table-style numbers, not from a GTU paper)
a(F.steam.h(762.6, 2013.6, 0.9), 762.6 + 0.9 * 2013.6);
a(F.steam.h(762.6, 2013.6, 1), 2776.2);
a(F.steam.xFromH(2575, 762.6, 2013.6), (2575 - 762.6) / 2013.6);
a(F.steam.xFromH(F.steam.h(500, 2000, 0.85), 500, 2000), 0.85);
a(F.steam.v(0.9, 0.194), 0.1746);
a(F.steam.xSeparating(9, 1), 0.9);
a(F.steam.xCombined(0.9, 0.95), 0.855);

// Otto and Diesel
a(F.cycles.otto(8), 1 - Math.pow(8, -0.4));
a(F.cycles.otto(8), 0.5647, 1e-4);
a(F.cycles.diesel(16, 2), 0.6138, 1e-4);
if (!(F.cycles.diesel(16, 2) < F.cycles.otto(16))) throw Error('same r: Otto > Diesel');
a(F.cycles.diesel(16, 1.000001), F.cycles.otto(16), 1e-5); // cut-off ratio -> 1 gives Otto

// Matrices: GTU 3110014 repeat matrices (from GTU Hero's Maths 1 count)
const ev = (A) => F.matrix.eigenvalues(A).map(([re]) => +re.toFixed(6)).sort((x, y) => x - y);
const M3 = [[1, -6, -4], [0, 4, 2], [0, -6, -3]];
const p = F.matrix.charPoly(M3);
if (JSON.stringify(p) !== JSON.stringify([1, -2, 1, 0])) throw Error('charpoly ' + p);
if (JSON.stringify(ev(M3)) !== JSON.stringify([0, 1, 1])) throw Error('eig M3 ' + ev(M3));
const M2 = [[1, 4], [2, 3]];
if (JSON.stringify(F.matrix.charPoly(M2)) !== JSON.stringify([1, -4, -5])) throw Error('charpoly M2');
if (JSON.stringify(ev(M2)) !== JSON.stringify([-1, 5])) throw Error('eig M2 ' + ev(M2));
F.matrix.cayley2(M2).flat().forEach((v) => a(v, 0));
// complex case: rotation-like matrix [[0,-1],[1,0]] -> +-i
const c = F.matrix.eigenvalues([[0, -1], [1, 0]]);
c.forEach(([re, im]) => { a(re, 0); a(Math.abs(im), 1); });

// Arc length: y = x^3/12 + 1/x on [1, 4] (3110014 S2022 Q.1(c), W2025 Q.1(c)) exact = 6
a(F.arc.length((x) => x ** 3 / 12 + 1 / x, 1, 4), 6, 1e-6);
// straight line y = x on [0, 1] -> sqrt(2)
a(F.arc.length((x) => x, 0, 1), Math.SQRT2, 1e-8);

console.log('All checks passed');
