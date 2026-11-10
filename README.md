# GTU Maths 1 (3110014) eigenvalue and Cayley-Hamilton checker

Eigenvalues and eigenvectors came in all 9 official GTU Mathematics-1 (3110014) papers in GTU Hero's count (Summer 2022 to Summer 2026), usually 4 or 7 marks. Cayley-Hamilton came in 6 of 9. Note: the new codes BE01000041 and BE01R00041 dropped the matrix unit. Ye page 2x2 ya 3x3 matrix ka characteristic polynomial aur eigenvalues deta hai, so you can check your hand answer.

Live page: https://princeadvant.github.io/gtu-maths-1-eigenvalue-calculator/

## Formulas

- 2x2: λ² − tr(A) λ + det(A) = 0
- 3x3: λ³ − tr(A) λ² + (sum of principal 2x2 minors) λ − det(A) = 0
- Cayley-Hamilton: every matrix satisfies its own characteristic equation

## Test

`node test.js` checks the formulas against hand-worked values and prints `All checks passed`.

## Tips

- Default matrix [1 −6 −4; 0 4 2; 0 −6 −3] appeared in 3110014 W2022 Q.2(b) OR and W2025 Q.5(c) OR (per GTU Hero's Maths 1 count). Characteristic polynomial λ³ − 2λ² + λ, eigenvalues 0, 1, 1.
- Verify Cayley-Hamilton for [1 4; 2 3] came in W2025 Q.5(a) and S2026 Q.5(a) OR. Its equation is λ² − 4λ − 5 = 0.
- Self-check every eigenvector by plugging back into Av = λv. Calculator sirf eigenvalues check karta hai, steps tujhe likhne hai.

Old papers and repeat counts: [gtuhero.com/gtu-papers](https://gtuhero.com/gtu-papers) (GTU Hero is my project).
