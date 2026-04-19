export const aptitudeNotes = {
  quantitative: [
    {
      title: "Number System",
      points: [
        "Integers, natural numbers, whole numbers, rational & irrational.",
        "Divisibility rules for 2,3,4,5,6,8,9,11.",
        "LCM/GCD tricks: prime factorization and Euclid's algorithm.",
        "Short trick: For trailing zeros, count powers of 5 in factorial."
      ],
      example: "Find LCM of 24 and 90 → 2^3×3×(2×3^2×5) ⇒ LCM=2^3×3^2×5=360"
    },
    {
      title: "Percentage",
      points: [
        "x% of y = (x/100)×y.",
        "Successive percentage change: a% then b% ⇒ net ≈ a+b+(ab/100)%.",
        "Discount and mark-up problems: SP=MP×(1−d%)."
      ],
      example: "Increase 20% then decrease 10% ⇒ net = 20−10+(−2)=8%."
    },
    {
      title: "Profit & Loss",
      points: [
        "Profit% = (SP−CP)/CP×100.",
        "Loss% = (CP−SP)/CP×100.",
        "Successive discounts multiply factors: (1−d1)(1−d2)."
      ],
      example: "CP=100, profit 25% ⇒ SP=125."
    },
    {
      title: "Ratio & Proportion",
      points: [
        "If A:B = m:n then A = mk, B = nk for some k.",
        "Mixing problems use weighted averages.",
        "Inverse proportion: x∝1/y ⇒ xy=k."
      ],
      example: "Divide 300 in 2:3 ⇒ parts = 120 and 180."
    },
    {
      title: "Time & Work",
      points: [
        "Work=W, rate=r, time=t ⇒ W=rt.",
        "Combined work: r_total = r1 + r2.",
        "If A finishes in a days and B in b days ⇒ together in (ab)/(a+b)."
      ],
      example: "A in 6 days, B in 8 ⇒ together 48/14 ≈ 3.43 days."
    },
    {
      title: "Time, Speed & Distance",
      points: [
        "Distance = Speed × Time.",
        "Relative speed for opposite direction: v1+v2.",
        "Average speed ≠ average of speeds; use total distance/time."
      ],
      example: "Upstream/downstream boat: effective speed v±u."
    },
    {
      title: "Simple & Compound Interest",
      points: [
        "SI = (P×R×T)/100.",
        "Amount (CI yearly) = P(1+R/100)^T.",
        "Difference CI−SI grows with time and rate."
      ],
      example: "P=1000, R=10%, T=2 ⇒ SI=200; CI amount=1210 ⇒ CI=210."
    },
    {
      title: "Averages",
      points: [
        "Average = sum/n.",
        "Replacing items changes average by Δ= (new−old)/n.",
        "Weighted average for combined groups."
      ],
      example: "Average of [3,5,7] is 5."
    },
    {
      title: "Mixtures & Allegations",
      points: [
        "Use cross rule: difference from mean gives ratio.",
        "For repeated replacement, use exponential decay model."
      ],
      example: "Mix 20% and 40% to get 30% in 1:1."
    },
    {
      title: "Permutation & Combination",
      points: [
        "Permutations: P(n,r)=n!/(n−r)!.",
        "Combinations: C(n,r)=n!/(r!(n−r)!).",
        "With repetition: n^r for arrangements."
      ],
      example: "Ways to choose 2 from 5: C(5,2)=10."
    },
    {
      title: "Probability",
      points: [
        "P(E) = favorable/total (equally likely).",
        "Independent events multiply probabilities.",
        "Complement rule: P(A) = 1−P(A')."
      ],
      example: "Fair die: P(odd)=3/6=1/2."
    },
    {
      title: "Data Interpretation",
      points: [
        "Read scales carefully and convert units.",
        "Use percentage change formula.",
        "Check totals and consistency."
      ],
      example: "If sales rise from 100 to 120 ⇒ +20%."
    },
    {
      title: "Simplification",
      points: [
        "Follow BODMAS.",
        "Break complex expressions using identities.",
        "Estimate to verify options."
      ],
      example: "Compute 12+3×4=24."
    }
  ],
  logical: [
    {
      title: "Coding-Decoding",
      points: ["Letter shifts, reverse, position sums", "Pattern recognition in word transformations"],
      example: "Shift by 2: CAT→ECV"
    },
    {
      title: "Blood Relations",
      points: ["Build family trees", "Watch for gender cues and sides (maternal/paternal)"],
      example: "Mother's brother ⇒ maternal uncle"
    },
    {
      title: "Direction Sense",
      points: ["Use vectors or coordinate grid", "Apply Pythagoras for displacement"],
      example: "3N,4E ⇒ distance 5"
    },
    {
      title: "Syllogism",
      points: ["Standard forms (All/Some/No)", "Venn diagram approach for certainty"],
      example: "All A are B ⇒ Some A are B"
    },
    {
      title: "Seating Arrangement",
      points: ["Draw positions", "Apply constraints sequentially"],
      example: "Immediate left/right depend on direction"
    },
    {
      title: "Puzzles",
      points: ["Break into smaller constraints", "Check consistency frequently"],
      example: "Number grid patterns"
    },
    {
      title: "Series",
      points: ["Find difference/ratio", "Alternate patterns or composite"],
      example: "AP with d=3 ⇒ next adds 3"
    },
    {
      title: "Statement & Conclusion",
      points: ["Only necessary conclusions", "Beware of overgeneralization"],
      example: "All engineers are PS ⇒ Some PS are engineers"
    },
    {
      title: "Clocks & Calendars",
      points: ["Angle formula: |30h−5.5m|", "Modulo arithmetic for weekdays"],
      example: "At 3:30 ⇒ angle 75°"
    }
  ],
  verbal: [
    {
      title: "Reading Comprehension",
      points: ["Locate explicit information", "Infer carefully with textual evidence"],
      example: "Why did attendance rise? ⇒ new facilities"
    },
    {
      title: "Error Detection",
      points: ["Subject-verb agreement", "Tense consistency", "Pronoun case"],
      example: "She doesn't like apples (not 'don't')"
    },
    {
      title: "Sentence Improvement",
      points: ["Prefer concise and correct grammar", "Avoid redundancy and awkward phrasing"],
      example: "He did not know the answer."
    },
    {
      title: "Para Jumbles",
      points: ["Identify opening sentence", "Use connectors and chronology"],
      example: "Plan → prepare → event → reaction"
    },
    {
      title: "Synonyms & Antonyms",
      points: ["Match precise meaning, avoid near-synonyms", "Consider context"],
      example: "Quick ⇔ Rapid"
    },
    {
      title: "Fill in the Blanks",
      points: ["Grammatical collocations", "Contextual cues"],
      example: "Completed 'on' time"
    },
    {
      title: "Active & Passive Voice",
      points: ["Use correct tense form", "Object becomes subject in passive"],
      example: "The meal is cooked by the chef."
    }
  ]
};

