export const aptitudeFormulas = {
  quantitative: [
    {
      heading: "Percentage",
      formulas: [
        "Percentage of y: (x/100) × y",
        "Net change: a% then b% ⇒ a + b + (ab/100)%",
        "Discounted price: SP = MP × (1 − d/100)"
      ]
    },
    {
      heading: "Profit & Loss",
      formulas: [
        "Profit% = ((SP − CP)/CP) × 100",
        "Loss% = ((CP − SP)/CP) × 100",
        "Successive discounts: SP = MP × (1 − d1/100) × (1 − d2/100)"
      ]
    },
    {
      heading: "Simple Interest",
      formulas: [
        "SI = (P × R × T)/100",
        "Amount (SI) = P + SI"
      ]
    },
    {
      heading: "Compound Interest",
      formulas: [
        "Amount (yearly) = P(1 + R/100)^T",
        "CI = Amount − P"
      ]
    },
    {
      heading: "Time & Work",
      formulas: [
        "Work = Rate × Time",
        "Combined rate: r_total = r1 + r2",
        "Together time: (ab)/(a + b) when A in a days, B in b days"
      ]
    },
    {
      heading: "Time, Speed & Distance",
      formulas: [
        "Distance = Speed × Time",
        "Relative speed (opposite) = v1 + v2",
        "Average speed = Total distance / Total time"
      ]
    },
    {
      heading: "Averages",
      formulas: [
        "Average = Sum / n",
        "Weighted average = (Σ w_i x_i) / (Σ w_i)"
      ]
    },
    {
      heading: "Mixtures & Allegations",
      formulas: [
        "Mean concentration via weighted average",
        "Allegation rule: ratio = (high − mean):(mean − low)"
      ]
    },
    {
      heading: "Permutation & Combination",
      formulas: [
        "P(n, r) = n! / (n − r)!",
        "C(n, r) = n! / (r!(n − r)!)",
        "With repetition: n^r"
      ]
    },
    {
      heading: "Probability",
      formulas: [
        "P(E) = favorable / total (equally likely)",
        "Independent: P(A∩B) = P(A) × P(B)",
        "Complement: P(A) = 1 − P(A')"
      ]
    },
    {
      heading: "Number System",
      formulas: [
        "LCM×GCD = product (for two numbers)",
        "Trailing zeros in n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ..."
      ]
    },
    {
      heading: "Simplification",
      formulas: [
        "BODMAS: Brackets, Orders, Division, Multiplication, Addition, Subtraction",
        "Identities: (a+b)^2, (a−b)^2, a^2−b^2 = (a−b)(a+b)"
      ]
    }
  ]
};

