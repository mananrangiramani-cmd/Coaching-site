export const subjects = ['Physics', 'Maths', 'Chemistry', 'Biology', 'Other']

// Every doubt belongs to one standard. Only that class can see and answer it.
export const initialDoubts = [
  {
    id: 1, standard: 11, author: 'Aarav Sharma', subject: 'Physics', time: '2h ago', upvotes: 5,
    text: 'Why does a heavier object not fall faster than a lighter one in a vacuum?',
    replies: [
      { id: 1, author: 'Diya Patel', accepted: true, text: 'Gravitational force grows with mass, but so does inertia. They cancel out, so acceleration stays the same.' },
    ],
  },
  {
    id: 2, standard: 12, author: 'Rohan Mehta', subject: 'Maths', time: '5h ago', upvotes: 3,
    text: 'How do I decide when to use integration by parts versus substitution?',
    replies: [],
  },
  {
    id: 3, standard: 11, author: 'Diya Patel', subject: 'Biology', time: '1d ago', upvotes: 8,
    text: 'What is the easiest way to remember the stages of mitosis?',
    replies: [
      { id: 1, author: 'Aarav Sharma', accepted: true, text: 'PMAT: Prophase, Metaphase, Anaphase, Telophase.' },
    ],
  },
  {
    id: 4, standard: 10, author: 'Kabir Singh', subject: 'Chemistry', time: '1d ago', upvotes: 4,
    text: 'What is the difference between ionic and covalent bonds?',
    replies: [
      { id: 1, author: 'Meera Nair', accepted: true, text: 'Ionic bonds transfer electrons, covalent bonds share them. Ionic compounds usually form between a metal and a non-metal.' },
    ],
  },
  {
    id: 5, standard: 12, author: 'Ananya Iyer', subject: 'Maths', time: '2d ago', upvotes: 6,
    text: 'Is there a quick way to remember the standard derivatives?',
    replies: [
      { id: 1, author: 'Rohan Mehta', accepted: true, text: 'Practise them as flashcards and notice the patterns: sin goes to cos, cos goes to minus sin.' },
    ],
  },
  {
    id: 6, standard: 9, author: 'Ishaan Kapoor', subject: 'Maths', time: '3h ago', upvotes: 2,
    text: 'How do I find the square root of a number without a calculator?',
    replies: [
      { id: 1, author: 'Saanvi Reddy', accepted: true, text: 'Use prime factorisation: pair up equal factors and take one from each pair.' },
    ],
  },
  {
    id: 7, standard: 10, author: 'Meera Nair', subject: 'Maths', time: '6h ago', upvotes: 3,
    text: 'Why is the discriminant useful in quadratic equations?',
    replies: [
      { id: 1, author: 'Kabir Singh', accepted: false, text: 'It tells you how many real roots there are without solving the equation.' },
    ],
  },
]
