// "standard" decides which class can see and take each test.
// Ids 1 and 2 are unchanged so older saved results still match.
export const tests = [
  {
    id: 1, standard: 11, subject: 'Physics', title: 'Physics: Motion Basics', course: 'JEE Physics Mastery', duration: 5,
    questions: [
      { q: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], answer: 1 },
      { q: 'Acceleration is the rate of change of:', options: ['Distance', 'Mass', 'Velocity', 'Energy'], answer: 2 },
      { q: 'A body at rest stays at rest unless acted on by a force. This is:', options: ["Newton's 1st law", "Newton's 2nd law", "Newton's 3rd law", "Ohm's law"], answer: 0 },
      { q: 'Which quantity is a vector?', options: ['Speed', 'Mass', 'Time', 'Displacement'], answer: 3 },
    ],
  },
  {
    id: 2, standard: 11, subject: 'Biology', title: 'Biology: Cell Structure', course: 'NEET Biology Crash Course', duration: 5,
    questions: [
      { q: 'Which organelle is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], answer: 1 },
      { q: 'Which organelle makes proteins?', options: ['Ribosome', 'Lysosome', 'Vacuole', 'Centriole'], answer: 0 },
      { q: 'Plant cells have a cell wall made of:', options: ['Protein', 'Chitin', 'Cellulose', 'Starch'], answer: 2 },
      { q: 'Who discovered the cell?', options: ['Darwin', 'Mendel', 'Pasteur', 'Robert Hooke'], answer: 3 },
    ],
  },
  {
    id: 3, standard: 9, subject: 'Maths', title: 'Maths: Number Systems', course: 'Foundation Maths', duration: 5,
    questions: [
      { q: 'Which of these is an irrational number?', options: ['1/2', '√2', '0.75', '4'], answer: 1 },
      { q: 'The decimal expansion of a rational number is:', options: ['Non-terminating and non-repeating', 'Always terminating', 'Either terminating or repeating', 'Always repeating'], answer: 2 },
      { q: 'What is the value of (√3)²?', options: ['6', '9', '√3', '3'], answer: 3 },
    ],
  },
  {
    id: 4, standard: 9, subject: 'Science', title: 'Science: Matter Around Us', course: 'Foundation Science', duration: 5,
    questions: [
      { q: 'Which state of matter has a fixed shape and a fixed volume?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], answer: 0 },
      { q: 'The process of a solid changing directly into a gas is called:', options: ['Evaporation', 'Condensation', 'Sublimation', 'Fusion'], answer: 2 },
      { q: 'The boiling point of water in kelvin is:', options: ['273 K', '373 K', '100 K', '473 K'], answer: 1 },
    ],
  },
  {
    id: 5, standard: 10, subject: 'Maths', title: 'Maths: Quadratic Equations', course: 'Foundation Maths', duration: 5,
    questions: [
      { q: 'Which is the standard form of a quadratic equation?', options: ['ax + b = 0', 'ax² + bx + c = 0', 'ax³ + bx = 0', 'a/x + b = 0'], answer: 1 },
      { q: 'The discriminant of ax² + bx + c = 0 is:', options: ['b² + 4ac', 'b − 4ac', '4ac − b²', 'b² − 4ac'], answer: 3 },
      { q: 'What are the roots of x² − 5x + 6 = 0?', options: ['2 and 3', '1 and 6', '−2 and −3', '5 and 1'], answer: 0 },
    ],
  },
  {
    id: 6, standard: 10, subject: 'Science', title: 'Science: Chemical Reactions', course: 'Foundation Science', duration: 5,
    questions: [
      { q: 'Rusting of iron is an example of:', options: ['Neutralisation', 'Oxidation', 'Decomposition', 'Photosynthesis'], answer: 1 },
      { q: 'A balanced chemical equation obeys the law of conservation of:', options: ['Volume', 'Colour', 'Mass', 'Density'], answer: 2 },
      { q: 'H₂ + Cl₂ → 2HCl is which type of reaction?', options: ['Decomposition', 'Displacement', 'Double displacement', 'Combination'], answer: 3 },
    ],
  },
  {
    id: 7, standard: 12, subject: 'Maths', title: 'Maths: Derivatives and Integrals', course: 'JEE Maths Complete', duration: 5,
    questions: [
      { q: 'What is d/dx of x²?', options: ['x', '2x', 'x²', '2'], answer: 1 },
      { q: 'What is d/dx of sin x?', options: ['−cos x', 'tan x', 'cos x', '−sin x'], answer: 2 },
      { q: 'What is ∫ 2x dx?', options: ['x² + C', '2 + C', 'x + C', '2x² + C'], answer: 0 },
      { q: 'What is d/dx of ln x?', options: ['x', 'ln x / x', '1/x', 'eˣ'], answer: 2 },
    ],
  },
  {
    id: 8, standard: 12, subject: 'Biology', title: 'Biology: Genetics and Heredity', course: 'NEET Biology Crash Course', duration: 5,
    questions: [
      { q: 'Who is known as the father of genetics?', options: ['Darwin', 'Mendel', 'Hooke', 'Pasteur'], answer: 1 },
      { q: 'DNA stands for:', options: ['Deoxyribonucleic acid', 'Dinitro acid', 'Dextro nucleic acid', 'Diribonucleic acid'], answer: 0 },
      { q: 'How many chromosomes does a normal human cell have?', options: ['23', '44', '46', '48'], answer: 2 },
      { q: 'A cross between two heterozygous tall plants (Tt × Tt) gives a phenotypic ratio of:', options: ['1:1', '3:1', '9:3:3:1', '1:2:1'], answer: 1 },
    ],
  },
]
