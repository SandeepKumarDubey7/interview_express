import { Question } from "@/data/aptitudeQuestions";

type Subject = "quantitative" | "logical" | "verbal";

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

// Quantitative generators
function genPercentage(id: string): Question {
  const base = randInt(100, 900);
  const percent = randInt(5, 35);
  const discount = Math.round((percent / 100) * base);
  const selling = base - discount;
  const options = shuffle([
    `${selling}`,
    `${base - Math.round(((percent - 5) / 100) * base)}`,
    `${base - Math.round(((percent + 5) / 100) * base)}`,
    `${base - Math.round(((percent + 10) / 100) * base)}`
  ]);
  return {
    id,
    question: `A product is marked at ${base}. After a ${percent}% discount, what is the selling price?`,
    options,
    correctAnswer: `${selling}`,
    explanation: `Discount = ${percent}% of ${base} = ${discount}. Selling price = ${base} - ${discount} = ${selling}.`
  };
}

function genProfitLoss(id: string): Question {
  const cp = randInt(200, 1200);
  const p = randInt(5, 30);
  const sp = Math.round(cp * (1 + p / 100));
  const options = shuffle([
    `${sp}`,
    `${Math.round(cp * (1 + (p - 5) / 100))}`,
    `${Math.round(cp * (1 + (p + 5) / 100))}`,
    `${Math.round(cp * (1 + (p + 10) / 100))}`
  ]);
  return {
    id,
    question: `A shopkeeper bought an item for ${cp} and sold it at a profit of ${p}%. What is the selling price?`,
    options,
    correctAnswer: `${sp}`,
    explanation: `SP = CP × (1 + profit%) = ${cp} × (1 + ${p}/100) = ${sp}.`
  };
}

function genRatioProportion(id: string): Question {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const total = randInt(100, 500);
  const partA = Math.round((a / (a + b)) * total);
  const options = shuffle([
    `${partA}`,
    `${Math.round((b / (a + b)) * total)}`,
    `${Math.round((a / (a + b)) * (total + 20))}`,
    `${Math.round((a / (a + b)) * (total - 20))}`
  ]);
  return {
    id,
    question: `Divide ${total} in the ratio ${a}:${b}. What is the share of the first part?`,
    options,
    correctAnswer: `${partA}`,
    explanation: `Share A = (A/(A+B)) × total = (${a}/(${a}+${b})) × ${total} = ${partA}.`
  };
}

function genTimeWork(id: string): Question {
  const peopleA = randInt(4, 12);
  const daysA = randInt(8, 20);
  const peopleB = randInt(6, 16);
  const daysB = Math.round((peopleA * daysA) / peopleB);
  const options = shuffle([
    `${daysB}`,
    `${daysB + 2}`,
    `${Math.max(daysB - 2, 1)}`,
    `${daysB + 4}`
  ]);
  return {
    id,
    question: `${peopleA} people can complete a work in ${daysA} days. In how many days will ${peopleB} people complete the same work (same efficiency)?`,
    options,
    correctAnswer: `${daysB}`,
    explanation: `Work = people × days. So daysB = (peopleA × daysA)/peopleB = (${peopleA}×${daysA})/${peopleB} = ${daysB}.`
  };
}

function genTSD(id: string): Question {
  const speed = randInt(20, 90);
  const time = randInt(2, 7);
  const distance = speed * time;
  const options = shuffle([
    `${distance}`,
    `${distance + randInt(10, 50)}`,
    `${distance - randInt(10, 50)}`,
    `${distance + randInt(60, 120)}`
  ]);
  return {
    id,
    question: `A vehicle moves at ${speed} km/h for ${time} hours. What is the distance covered?`,
    options,
    correctAnswer: `${distance}`,
    explanation: `Distance = Speed × Time = ${speed} × ${time} = ${distance} km.`
  };
}

function genSI(id: string): Question {
  const P = randInt(500, 3000);
  const R = randInt(4, 12);
  const T = randInt(1, 5);
  const SI = Math.round((P * R * T) / 100);
  const options = shuffle([
    `${SI}`,
    `${SI + randInt(20, 80)}`,
    `${Math.max(SI - randInt(20, 80), 0)}`,
    `${SI + randInt(90, 150)}`
  ]);
  return {
    id,
    question: `Find Simple Interest on principal ${P} at rate ${R}% per annum for ${T} years.`,
    options,
    correctAnswer: `${SI}`,
    explanation: `SI = (P×R×T)/100 = (${P}×${R}×${T})/100 = ${SI}.`
  };
}

function genCI(id: string): Question {
  const P = randInt(500, 3000);
  const R = randInt(4, 12);
  const T = randInt(2, 4);
  const amount = Math.round(P * Math.pow(1 + R / 100, T));
  const CI = amount - P;
  const options = shuffle([
    `${CI}`,
    `${CI + randInt(20, 80)}`,
    `${Math.max(CI - randInt(20, 80), 0)}`,
    `${CI + randInt(90, 150)}`
  ]);
  return {
    id,
    question: `Find Compound Interest on principal ${P} at ${R}% compounded annually for ${T} years.`,
    options,
    correctAnswer: `${CI}`,
    explanation: `Amount = P(1+R/100)^T. CI = Amount - P = ${amount} - ${P} = ${CI}.`
  };
}

function genAverage(id: string): Question {
  const n = randInt(4, 7);
  const nums = Array.from({ length: n }, () => randInt(10, 50));
  const avg = Math.round(nums.reduce((a, b) => a + b, 0) / n);
  const options = shuffle([
    `${avg}`,
    `${avg + 2}`,
    `${avg - 2}`,
    `${avg + 4}`
  ]);
  return {
    id,
    question: `Find the average of the numbers ${nums.join(", ")}.`,
    options,
    correctAnswer: `${avg}`,
    explanation: `Average = Sum/n. Sum = ${nums.reduce((a, b) => a + b, 0)}, n=${n}, avg=${avg}.`
  };
}

function genPermutation(id: string): Question {
  const n = randInt(5, 8);
  const r = randInt(2, Math.min(4, n - 1));
  const fact = (x: number) => (x <= 1 ? 1 : x * fact(x - 1));
  const Pnr = Math.round(fact(n) / fact(n - r));
  const options = shuffle([
    `${Pnr}`,
    `${Pnr + randInt(10, 50)}`,
    `${Math.max(Pnr - randInt(10, 50), 1)}`,
    `${Pnr + randInt(60, 120)}`
  ]);
  return {
    id,
    question: `How many permutations are possible for selecting ${r} items from ${n} distinct items?`,
    options,
    correctAnswer: `${Pnr}`,
    explanation: `P(n,r) = n!/(n-r)! = ${Pnr}.`
  };
}

function genProbability(id: string): Question {
  const red = randInt(3, 7);
  const blue = randInt(2, 6);
  const total = red + blue;
  const prob = `${red}/${total}`;
  const options = shuffle([prob, `${blue}/${total}`, `${red}/${total + 2}`, `${red - 1}/${total}`]);
  return {
    id,
    question: `A bag has ${red} red and ${blue} blue balls. If one ball is drawn at random, what is the probability that it is red?`,
    options,
    correctAnswer: prob,
    explanation: `P(red) = favorable/total = ${red}/${total}.`
  };
}

function genSimplification(id: string): Question {
  const a = randInt(10, 50);
  const b = randInt(5, 30);
  const c = randInt(2, 20);
  const expr = a + b * c;
  const options = shuffle([`${expr}`, `${expr + 5}`, `${expr - 5}`, `${expr + 10}`]);
  return {
    id,
    question: `Simplify: ${a} + ${b} × ${c} = ?`,
    options,
    correctAnswer: `${expr}`,
    explanation: `Apply BODMAS: ${b}×${c}=${b * c}, then add ${a} to get ${expr}.`
  };
}

// Logical generators
function genCodingDecoding(id: string): Question {
  const word = ["CAT", "DOG", "BIRD", "FISH", "LION"][randInt(0, 4)];
  const shift = randInt(1, 3);
  const encode = (w: string) =>
    w
      .split("")
      .map((ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65))
      .join("");
  const encoded = encode(word);
  const options = shuffle([encoded, encode("BEAR"), encode("GOAT"), encode("MOUSE")]);
  return {
    id,
    question: `In a coding scheme, each letter is shifted forward by ${shift}. What is the code for ${word}?`,
    options,
    correctAnswer: encoded,
    explanation: `Shift each letter by ${shift}. ${word} → ${encoded}.`
  };
}

function genBloodRelations(id: string): Question {
  const relations = [
    { q: "A is the son of B. B is the daughter of C. How is A related to C?", ans: "Grandson" },
    { q: "P is the father of Q. Q is the mother of R. How is P related to R?", ans: "Grandfather" },
    { q: "X is the brother of Y. Y is the mother of Z. How is X related to Z?", ans: "Maternal Uncle" }
  ];
  const { q, ans } = relations[randInt(0, relations.length - 1)];
  const options = shuffle([ans, "Granddaughter", "Aunt", "Nephew"]);
  return { id, question: q, options, correctAnswer: ans, explanation: `Trace the family tree to determine the relation.` };
}

function genDirectionSense(id: string): Question {
  const north = randInt(2, 6);
  const east = randInt(2, 6);
  const displacement = Math.round(Math.sqrt(north * north + east * east));
  const options = shuffle([`${displacement}`, `${displacement + 2}`, `${Math.max(displacement - 2, 1)}`, `${displacement + 4}`]);
  return {
    id,
    question: `A person walks ${north} km north and ${east} km east. What is the straight-line distance from the starting point?`,
    options,
    correctAnswer: `${displacement}`,
    explanation: `Use Pythagoras: √(${north}²+${east}²) ≈ ${displacement} km.`
  };
}

function genSyllogism(id: string): Question {
  const q = "All roses are flowers. Some flowers are red. Which statement is definitely true?";
  const ans = "Some roses are flowers.";
  const options = shuffle([ans, "All flowers are roses.", "Some red things are roses.", "No roses are red."]);
  return { id, question: q, options, correctAnswer: ans, explanation: `From premises, 'All roses are flowers' implies 'Some roses are flowers' is true.` };
}

function genSeatingArrangement(id: string): Question {
  const names = ["A", "B", "C", "D", "E", "F"];
  const seat = randInt(0, names.length - 2);
  const neighbor = `${names[seat + 1]}`;
  const options = shuffle([neighbor, names[seat], names[(seat + 2) % names.length], names[(seat + 3) % names.length]]);
  return {
    id,
    question: `Six people A-F sit in a row. If ${names[seat]} sits next to ?, who is on immediate right of ${names[seat]}?`,
    options,
    correctAnswer: neighbor,
    explanation: `In a linear arrangement, immediate right is the next position.`
  };
}

function genPuzzles(id: string): Question {
  const next = randInt(3, 9);
  const seq = [2, 4, 8, 16].map((x) => x * (next - 2));
  const correct = seq[seq.length - 1] * 2;
  const options = shuffle([`${correct}`, `${correct - 4}`, `${correct + 4}`, `${correct + 8}`]);
  return { id, question: `Find the next number in series ${seq.join(", ")}.`, options, correctAnswer: `${correct}`, explanation: `Pattern doubles each term.` };
}

function genSeries(id: string): Question {
  const start = randInt(1, 9);
  const diff = randInt(2, 9);
  const series = [start, start + diff, start + 2 * diff, start + 3 * diff, start + 4 * diff];
  const next = start + 5 * diff;
  const options = shuffle([`${next}`, `${next - diff}`, `${next + diff}`, `${next + 2}`]);
  return { id, question: `Find the next number: ${series.join(", ")}.`, options, correctAnswer: `${next}`, explanation: `Arithmetic progression with common difference ${diff}.` };
}

function genStatementConclusion(id: string): Question {
  const q = "Statement: All engineers are problem solvers. Conclusion: Some problem solvers are engineers.";
  const ans = "True";
  const options = shuffle([ans, "False", "Cannot be determined", "Only if some engineers are problem solvers"]);
  return { id, question: q, options, correctAnswer: ans, explanation: `From 'All engineers are problem solvers', 'Some problem solvers are engineers' holds.` };
}

function genClockCalendar(id: string): Question {
  const h = randInt(1, 12);
  const m = randInt(0, 59);
  const angle = Math.abs(30 * h - 5.5 * m);
  const minAngle = Math.round(Math.min(angle, 360 - angle));
  const options = shuffle([`${minAngle}°`, `${minAngle + 6}°`, `${Math.max(minAngle - 6, 0)}°`, `${minAngle + 12}°`]);
  return {
    id,
    question: `Find the angle between clock hands at ${h}:${m < 10 ? "0" + m : m}.`,
    options,
    correctAnswer: `${minAngle}°`,
    explanation: `Angle = |30h - 5.5m|; minimal angle considered.`
  };
}

// Verbal generators
const synonymPairs = [
  ["Happy", "Joyful"],
  ["Quick", "Rapid"],
  ["Smart", "Intelligent"],
  ["Sad", "Unhappy"],
  ["Brave", "Courageous"]
];

const antonymPairs = [
  ["Increase", "Decrease"],
  ["Honest", "Dishonest"],
  ["Expand", "Shrink"],
  ["Visible", "Invisible"],
  ["Agree", "Disagree"]
];

function genSynonyms(id: string): Question {
  const pair = synonymPairs[randInt(0, synonymPairs.length - 1)];
  const [word, syn] = pair;
  const options = shuffle([syn, "Slow", "Small", "Dull"]);
  return { id, question: `Choose the synonym of '${word}'.`, options, correctAnswer: syn, explanation: `The correct synonym of '${word}' is '${syn}'.` };
}

function genAntonyms(id: string): Question {
  const pair = antonymPairs[randInt(0, antonymPairs.length - 1)];
  const [word, ant] = pair;
  const options = shuffle([ant, "Increase", "Bright", "Strong"]);
  return { id, question: `Choose the antonym of '${word}'.`, options, correctAnswer: ant, explanation: `The correct antonym of '${word}' is '${ant}'.` };
}

function genFillBlank(id: string): Question {
  const sentences = [
    { s: "She was ____ to help her friend.", ans: "eager", opts: ["eager", "lazy", "slow", "doubtful"] },
    { s: "The project was completed ____ time.", ans: "on", opts: ["on", "at", "in", "for"] },
    { s: "He has a good ____ of humor.", ans: "sense", opts: ["sense", "scent", "scene", "seen"] }
  ];
  const pick = sentences[randInt(0, sentences.length - 1)];
  return { id, question: `Fill in the blank: ${pick.s}`, options: shuffle(pick.opts), correctAnswer: pick.ans, explanation: `Contextual usage indicates '${pick.ans}'.` };
}

function genErrorDetection(id: string): Question {
  const q = "Identify the error: 'She don't like apples.'";
  const options = shuffle(["'don't' should be 'doesn't'", "No error", "'like' should be 'likes'", "'She' should be 'Her'"]);
  return { id, question: q, options, correctAnswer: "'don't' should be 'doesn't'", explanation: "Singular subject uses 'doesn't'." };
}

function genSentenceImprovement(id: string): Question {
  const q = "Choose the best improvement: 'He did not knew the answer.'";
  const options = shuffle(["He did not know the answer.", "He didn't knew the answer.", "He do not knew the answer.", "He have not knew the answer."]);
  return { id, question: q, options, correctAnswer: "He did not know the answer.", explanation: "Auxiliary 'did' takes base form 'know'." };
}

function genParaJumbles(id: string): Question {
  const sentences = ["A. It began to rain.", "B. We went for a walk.", "C. We took umbrellas.", "D. We enjoyed it."];
  const correctOrder = "B C A D";
  const options = shuffle([correctOrder, "A B C D", "C B A D", "B A C D"]);
  return { id, question: "Choose the correct order of sentences:", options, correctAnswer: correctOrder, explanation: "Logical flow: plan → prepare → rain → enjoy." };
}

function genActivePassive(id: string): Question {
  const q = "Choose the passive voice: 'The chef cooks the meal.'";
  const options = shuffle(["The meal is cooked by the chef.", "The meal was cook by chef.", "The chef is cooking the meal.", "Cooking of meal by the chef is done."]);
  return { id, question: q, options, correctAnswer: "The meal is cooked by the chef.", explanation: "Present simple passive: 'is cooked'." };
}

function genReadingComprehension(id: string): Question {
  const passage = "The city park was renovated last year to include more walking paths and a children's playground. Attendance has increased since.";
  const q = "Why did park attendance likely increase?";
  const options = shuffle(["New facilities attract visitors.", "Tickets became cheaper.", "Weather improved.", "Parking fees were removed."]);
  return { id, question: `${passage}\n\n${q}`, options, correctAnswer: "New facilities attract visitors.", explanation: "Passage states renovations including new facilities." };
}

export function generateSubjectQuestions(subject: Subject, count: number): Question[] {
  const generatorsQuant = [genPercentage, genProfitLoss, genRatioProportion, genTimeWork, genTSD, genSI, genCI, genAverage, genPermutation, genProbability, genSimplification];
  const generatorsLogical = [genCodingDecoding, genBloodRelations, genDirectionSense, genSyllogism, genSeatingArrangement, genPuzzles, genSeries, genStatementConclusion, genClockCalendar];
  const generatorsVerbal = [genSynonyms, genAntonyms, genFillBlank, genErrorDetection, genSentenceImprovement, genParaJumbles, genActivePassive, genReadingComprehension];

  const gens = subject === "quantitative" ? generatorsQuant : subject === "logical" ? generatorsLogical : generatorsVerbal;

  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const gen = gens[i % gens.length];
    const id = `${subject}-${i + 1}`;
    questions.push(gen(id));
  }
  return questions;
}

export const quantitativeGeneratedQuestions: Question[] = generateSubjectQuestions("quantitative", 120);
export const logicalGeneratedQuestions: Question[] = generateSubjectQuestions("logical", 120);
export const verbalGeneratedQuestions: Question[] = generateSubjectQuestions("verbal", 120);

