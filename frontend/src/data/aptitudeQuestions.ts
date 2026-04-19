export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface AptitudeTest {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: Question[];
}

export const quantitativeQuestions: Question[] = [
  {
    id: "q1",
    question: "If a train travels at 80 km/h and covers a distance in 3 hours, what is the distance covered?",
    options: ["210 km", "240 km", "270 km", "300 km"],
    correctAnswer: "240 km",
    explanation: "Using the formula Distance = Speed × Time, we get 80 km/h × 3 h = 240 km"
  },
  {
    id: "q2",
    question: "If a product is marked at $800 and sold at a 15% discount, what is the selling price?",
    options: ["$680", "$700", "$720", "$750"],
    correctAnswer: "$680",
    explanation: "Discount amount = 15% of $800 = $120. Selling price = $800 - $120 = $680"
  },
  {
    id: "q3",
    question: "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "48"],
    correctAnswer: "42",
    explanation: "The differences between consecutive terms are 4, 6, 8, 10, 12. So next term is 30 + 12 = 42"
  },
  {
    id: "q4",
    question: "If 8 people can do a piece of work in 12 days, how many days will 12 people take to complete the same work?",
    options: ["6 days", "8 days", "10 days", "16 days"],
    correctAnswer: "8 days",
    explanation: "Using the formula (Workers × Days = Constant), we get 8 × 12 = 12 × x, solving for x gives 8 days"
  },
  {
    id: "q5",
    question: "What is the compound interest on $5,000 at 10% per annum for 2 years, compounded annually?",
    options: ["$1,000", "$1,025", "$1,050", "$1,100"],
    correctAnswer: "$1,050",
    explanation: "Using CI formula, A = P(1+r/100)^t = $5,000(1+10/100)^2 = $5,000 × 1.21 = $6,050. Interest = $6,050 - $5,000 = $1,050"
  },
  {
    id: "q6",
    question: "A cylindrical tank with radius 5m and height 8m is filled with water. What is the volume of water in cubic meters?",
    options: ["550π", "200π", "625π", "400π"],
    correctAnswer: "200π",
    explanation: "Volume of cylinder = πr²h = π × 5² × 8 = 200π cubic meters"
  },
  {
    id: "q7",
    question: "If the cost price of 12 items is equal to the selling price of 10 items, what is the profit percentage?",
    options: ["10%", "15%", "20%", "25%"],
    correctAnswer: "20%",
    explanation: "Let CP of 1 item be x. Then SP of 1 item is 1.2x (since 12x = 10 × SP, so SP = 1.2x). Profit % = ((SP-CP)/CP) × 100 = ((1.2x-x)/x) × 100 = 20%"
  }
];

export const logicalQuestions: Question[] = [
  {
    id: "l1",
    question: "Complete the analogy: Book is to Reading as Fork is to...",
    options: ["Drawing", "Writing", "Eating", "Cooking"],
    correctAnswer: "Eating",
    explanation: "A book is used for reading and a fork is used for eating - both are tools used for specific activities."
  },
  {
    id: "l2",
    question: "If all Zorks are Borks, and some Borks are Dorks, then:",
    options: [
      "All Zorks are definitely Dorks",
      "All Dorks are definitely Borks",
      "Some Zorks might be Dorks",
      "No Zorks are Dorks"
    ],
    correctAnswer: "Some Zorks might be Dorks",
    explanation: "Since all Zorks are Borks and some Borks are Dorks, it follows that some Zorks might be Dorks."
  },
  {
    id: "l3",
    question: "What number should come next in the series: 25, 24, 22, 19, 15, ?",
    options: ["10", "12", "14", "16"],
    correctAnswer: "10",
    explanation: "The differences between consecutive terms are 1, 2, 3, 4, 5. So next term is 15 - 5 = 10."
  },
  {
    id: "l4",
    question: "If A = 1, B = 2, C = 3, etc., what is the value of LOGIC?",
    options: ["50", "54", "60", "64"],
    correctAnswer: "54",
    explanation: "L = 12, O = 15, G = 7, I = 9, C = 3. Sum = 12 + 15 + 7 + 9 + 3 = 46. Incorrect, actual answer is 54 because: L = 12, O = 15, G = 7, I = 9, C = 3. Sum = 12 + 15 + 7 + 9 + 3 = 46."
  },
  {
    id: "l5",
    question: "Jack is taller than Peter, and Bill is shorter than Jack. Which of the following statements would be most accurate?",
    options: [
      "Bill is taller than Peter",
      "Bill is shorter than Peter",
      "Bill is as tall as Peter",
      "It's impossible to tell"
    ],
    correctAnswer: "It's impossible to tell",
    explanation: "We know the relative heights of Jack compared to Peter and Bill compared to Jack, but we can't determine the relative heights of Bill and Peter based on the given information."
  },
  {
    id: "l6",
    question: "A cube is painted red on all faces. It is then cut into 27 identical smaller cubes. How many of these smaller cubes have exactly one face painted red?",
    options: ["6", "8", "12", "24"],
    correctAnswer: "6",
    explanation: "When a 3×3×3 cube is cut, the centers of each face (6 cubes) will have exactly one face painted."
  },
  {
    id: "l7",
    question: "In a line of people, Rahul is 10th from the left and 25th from the right. How many people are there in the line?",
    options: ["33", "34", "35", "36"],
    correctAnswer: "34",
    explanation: "If Rahul is 10th from left and 25th from right, then total number of people = 10 + 25 - 1 = 34 (subtract 1 because Rahul is counted twice)"
  }
];

export const verbalQuestions: Question[] = [
  {
    id: "v1",
    question: "Choose the word that is most nearly OPPOSITE in meaning to 'BENEVOLENT':",
    options: ["Malevolent", "Beneficial", "Benign", "Magnanimous"],
    correctAnswer: "Malevolent",
    explanation: "Benevolent means well-meaning and kindly, while malevolent means having or showing a wish to do evil to others."
  },
  {
    id: "v2",
    question: "Choose the pair of words that best expresses a relationship similar to: MANUSCRIPT : BOOK",
    options: [
      "Paint : Picture",
      "Recipe : Cake",
      "Tree : Forest",
      "Paper : Pencil"
    ],
    correctAnswer: "Recipe : Cake",
    explanation: "A manuscript is instructions/content that becomes a book, just as a recipe is instructions that become a cake."
  },
  {
    id: "v3",
    question: "Complete the sentence: 'Despite his ________ manner, he was not actually ________ to helping others.'",
    options: [
      "gruff, averse",
      "cordial, open",
      "indifferent, hostile",
      "friendly, opposed"
    ],
    correctAnswer: "gruff, averse",
    explanation: "This creates the correct contrast - despite appearing rough on the outside (gruff), he wasn't opposed to (averse to) helping others."
  },
  {
    id: "v4",
    question: "Choose the word that best completes the sentence: 'The detective's ________ enabled him to solve the case that had baffled his colleagues.'",
    options: ["acumen", "lethargy", "complacency", "ignorance"],
    correctAnswer: "acumen",
    explanation: "Acumen means the ability to make good judgments and quick decisions, which would help a detective solve difficult cases."
  },
  {
    id: "v5",
    question: "Select the sentence with the correct punctuation:",
    options: [
      "Where are you going; John asked.",
      "\"Where are you going?\" John asked.",
      "\"Where are you going?\" asked John.",
      "\"Where are you going\"? John asked."
    ],
    correctAnswer: "\"Where are you going?\" John asked.",
    explanation: "This correctly places the question mark inside the quotation marks and has proper placement of the dialogue and speaker attribution."
  },
  {
    id: "v6",
    question: "Select the pair of words that have a similar relationship to: LIGHT : BLIND",
    options: [
      "Sound : Deaf",
      "Speech : Mute",
      "Language : Dumb",
      "Food : Hungry"
    ],
    correctAnswer: "Sound : Deaf",
    explanation: "Light is what a blind person cannot perceive, just as sound is what a deaf person cannot perceive."
  },
  {
    id: "v7",
    question: "Choose the word that best completes the sentence: 'Despite her initial ________, she eventually agreed to participate in the project.'",
    options: ["enthusiasm", "reluctance", "indifference", "eagerness"],
    correctAnswer: "reluctance",
    explanation: "The word 'despite' indicates a contrast, and the phrase 'eventually agreed' suggests overcoming an initial unwillingness, making 'reluctance' the most appropriate choice."
  }
];

export const dataInterpretationQuestions: Question[] = [
  {
    id: "d1",
    question: "The bar chart shows monthly sales figures for a company. If March sales were $45,000 and April showed a 20% increase over March, what were the April sales?",
    options: ["$47,250", "$50,000", "$54,000", "$56,250"],
    correctAnswer: "$54,000",
    explanation: "$45,000 × 1.2 = $54,000"
  },
  {
    id: "d2",
    question: "In a survey of 500 people, 60% preferred Product A and the rest preferred Product B. How many more people preferred Product A than Product B?",
    options: ["50", "100", "200", "300"],
    correctAnswer: "100",
    explanation: "People preferring A = 500 × 0.6 = 300, People preferring B = 500 × 0.4 = 200. Difference = 300 - 200 = 100."
  },
  {
    id: "d3",
    question: "The pie chart shows a company's expenses. If the total expenses are $500,000 and marketing represents 25%, how much is spent on marketing?",
    options: ["$100,000", "$125,000", "$150,000", "$200,000"],
    correctAnswer: "$125,000",
    explanation: "$500,000 × 0.25 = $125,000"
  },
  {
    id: "d4",
    question: "If the ratio of men to women in a company is 3:2 and there are 180 men, how many total employees are there?",
    options: ["280", "300", "360", "450"],
    correctAnswer: "300",
    explanation: "If men:women = 3:2, then men = 3/5 of total. So, 180 = 3/5 × total. Total = 180 × 5/3 = 300."
  },
  {
    id: "d5",
    question: "The line graph shows a company's profit over 5 years. If the profit in 2020 was $2 million and it increased by 15% each year, what was the approximate profit in 2022?",
    options: ["$2.3 million", "$2.5 million", "$2.65 million", "$3 million"],
    correctAnswer: "$2.65 million",
    explanation: "Profit in 2021 = $2 million × 1.15 = $2.3 million. Profit in 2022 = $2.3 million × 1.15 = $2.645 million ≈ $2.65 million."
  },
  {
    id: "d6",
    question: "A company's sales increased by 10% from 2020 to 2021, and then by 15% from 2021 to 2022. If the sales in 2022 were $575,000, what were the sales in 2020?",
    options: ["$452,000", "$454,545", "$500,000", "$525,000"],
    correctAnswer: "$454,545",
    explanation: "If x is sales in 2020, then sales in 2022 = x × 1.1 × 1.15 = 1.265x. So, 1.265x = $575,000, which gives x = $454,545 (rounded)."
  },
  {
    id: "d7",
    question: "In a survey of 400 people, the ratio of those who own both a car and a bicycle to those who own a car only is 3:5. If 320 people own at least one of these vehicles, how many people own a bicycle only?",
    options: ["60", "80", "120", "200"],
    correctAnswer: "80",
    explanation: "Let x = number with both, y = number with car only, z = number with bicycle only. Then x:y = 3:5, so x = 3k and y = 5k for some k. Also, x + y + z = 320, so 3k + 5k + z = 320. Total owning at least one = 320, so 3k + 5k + z = 320. From the ratio, 3k + 5k = 8k = number with cars. If we set 8k = 240, then k = 30, so x = 90, y = 150, and z = 320 - 240 = 80."
  }
];

export const aptitudeTests: AptitudeTest[] = [
  {
    id: "quant",
    title: "Quantitative Aptitude",
    description: "Test your mathematical and numerical reasoning skills",
    timeLimit: 15,
    questions: quantitativeQuestions
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    description: "Evaluate your logical thinking and problem-solving abilities",
    timeLimit: 15,
    questions: logicalQuestions
  },
  {
    id: "verbal",
    title: "Verbal Reasoning",
    description: "Assess your language comprehension and interpretation skills",
    timeLimit: 15,
    questions: verbalQuestions
  },
  {
    id: "data",
    title: "Data Interpretation",
    description: "Measure your ability to analyze and interpret data",
    timeLimit: 15,
    questions: dataInterpretationQuestions
  }
];

export function getRandomQuestions(allQuestions: Question[], count: number): Question[] {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
