// Shared helpers for GTU Hero study calculators (2026-11-10). Pure functions, tested in test.js.
const F = {
  steam: {
    // wet steam enthalpy h = hf + x hfg (kJ/kg); values hf, hfg read from YOUR steam table
    h: (hf, hfg, x) => hf + x * hfg,
    // dryness fraction from a known enthalpy
    xFromH: (h, hf, hfg) => (h - hf) / hfg,
    // specific volume of wet steam (ignoring liquid volume) v = x vg
    v: (x, vg) => x * vg,
    // separating calorimeter: xs = m / (m + M) (m = dry steam mass, M = water separated)
    xSeparating: (m, M) => m / (m + M),
    // combined separating + throttling: x = xs * xt
    xCombined: (xs, xt) => xs * xt,
  },
  cycles: {
    otto: (r, g = 1.4) => 1 - 1 / Math.pow(r, g - 1),
    diesel: (r, rho, g = 1.4) => 1 - (1 / Math.pow(r, g - 1)) * (Math.pow(rho, g) - 1) / (g * (rho - 1)),
  },
  matrix: {
    // characteristic polynomial coefficients of a 2x2 or 3x3 matrix, highest power first
    charPoly(A) {
      if (A.length === 2) {
        const [[a, b], [c, d]] = A;
        return [1, -(a + d), a * d - b * c];
      }
      const [[a, b, c], [d, e, f], [g, h, i]] = A;
      const tr = a + e + i;
      const m2 = (e * i - f * h) + (a * i - c * g) + (a * e - b * d);
      const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
      return [1, -tr, m2, -det];
    },
    // Durand-Kerner roots of a monic polynomial; returns [re, im] pairs
    roots(p) {
      const n = p.length - 1;
      const mul = (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
      const sub = (x, y) => [x[0] - y[0], x[1] - y[1]];
      const div = (x, y) => { const d = y[0] * y[0] + y[1] * y[1]; return [(x[0] * y[0] + x[1] * y[1]) / d, (x[1] * y[0] - x[0] * y[1]) / d]; };
      const evalp = (z) => p.reduce((acc, c) => [acc[0] * z[0] - acc[1] * z[1] + c, acc[0] * z[1] + acc[1] * z[0]], [0, 0]);
      let z = Array.from({ length: n }, (_, k) => { const s = [0.4, 0.9]; let r = [1, 0]; for (let j = 0; j < k; j++) r = mul(r, s); return r; });
      for (let it = 0; it < 2000; it++) {
        z = z.map((zi, i) => {
          let den = [1, 0];
          z.forEach((zj, j) => { if (i !== j) den = mul(den, sub(zi, zj)); });
          return sub(zi, div(evalp(zi), den));
        });
      }
      return z.map(([re, im]) => [Math.abs(re) < 1e-7 ? 0 : re, Math.abs(im) < 1e-6 ? 0 : im]);
    },
    eigenvalues(A) { return F.matrix.roots(F.matrix.charPoly(A)); },
    mul(A, B) { return A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0))); },
    // Cayley-Hamilton check for 2x2: A^2 - tr(A) A + det(A) I = 0
    cayley2(A) {
      const [, p1, p0] = F.matrix.charPoly(A);
      const A2 = F.matrix.mul(A, A);
      return A2.map((r, i) => r.map((v, j) => v + p1 * A[i][j] + (i === j ? p0 : 0)));
    },
  },
  arc: {
    // arc length of y = f(x) on [a, b] by composite Simpson on sqrt(1 + f'(x)^2)
    length(f, a, b, n = 2000) {
      const h0 = 1e-5;
      const d = (x) => (f(x + h0) - f(x - h0)) / (2 * h0);
      const g = (x) => Math.sqrt(1 + d(x) ** 2);
      if (n % 2) n++;
      const h = (b - a) / n;
      let s = g(a) + g(b);
      for (let k = 1; k < n; k++) s += (k % 2 ? 4 : 2) * g(a + k * h);
      return s * h / 3;
    },
  },
};
if (typeof module !== 'undefined') module.exports = F;
