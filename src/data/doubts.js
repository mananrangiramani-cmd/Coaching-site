export const subjects = ['Physics', 'Maths', 'Chemistry', 'Biology', 'Other']

export const initialDoubts = [
  {
    id: 1, author: 'Aarav Sharma', subject: 'Physics', time: '2h ago', upvotes: 5,
    text: 'Why does a heavier object not fall faster than a lighter one in a vacuum?',
    replies: [
      { id: 1, author: 'Meera Nair', accepted: true, text: 'Gravitational force grows with mass, but so does inertia. They cancel out, so acceleration stays the same.' },
    ],
  },
  {
    id: 2, author: 'Rohan Mehta', subject: 'Maths', time: '5h ago', upvotes: 3,
    text: 'How do I decide when to use integration by parts versus substitution?',
    replies: [],
  },
  {
    id: 3, author: 'Diya Patel', subject: 'Biology', time: '1d ago', upvotes: 8,
    text: 'What is the easiest way to remember the stages of mitosis?',
    replies: [
      { id: 1, author: 'Ananya Iyer', accepted: true, text: 'PMAT: Prophase, Metaphase, Anaphase, Telophase.' },
    ],
  },
  {
    id: 4, author: 'Kabir Singh', subject: 'Chemistry', time: '1d ago', upvotes: 4,
    text: 'What is the difference between ionic and covalent bonds?',
    replies: [
      { id: 1, author: 'Diya Patel', accepted: false, text: 'Ionic bonds transfer electrons, covalent bonds share them.' },
      { id: 2, author: 'Meera Nair', accepted: true, text: 'Adding to that: ionic compounds usually form between a metal and a non-metal, and covalent ones between two non-metals.' },
    ],
  },
  {
    id: 5, author: 'Ananya Iyer', subject: 'Maths', time: '2d ago', upvotes: 6,
    text: 'Is there a quick way to find the sum of an AP without memorising the formula?',
    replies: [
      { id: 1, author: 'Aarav Sharma', accepted: true, text: 'Average of first and last term, multiplied by the number of terms.' },
    ],
  },
]