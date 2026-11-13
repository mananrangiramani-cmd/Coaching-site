// "standards" lists the classes that can see each course.
// JEE and NEET are for 11th and 12th. Foundation is for 9th and 10th.
export const courses = [
  { id: 1, title: 'JEE Physics Mastery', category: 'JEE', standards: [11, 12], teacher: 'Dr. R. Verma', lessons: 48, hours: 60, level: 'Advanced', progress: 65, description: 'Mechanics, electricity and modern physics with weekly problem sets.' },
  { id: 2, title: 'JEE Maths Complete', category: 'JEE', standards: [11, 12], teacher: 'Prof. S. Kulkarni', lessons: 52, hours: 70, level: 'Advanced', progress: 40, description: 'Calculus, algebra and coordinate geometry from basics to advanced.' },
  { id: 3, title: 'NEET Biology Crash Course', category: 'NEET', standards: [11, 12], teacher: 'Dr. P. Menon', lessons: 40, hours: 45, level: 'Intermediate', progress: 80, description: 'NCERT-focused biology with diagrams and quick revision notes.' },
  { id: 4, title: 'NEET Chemistry Essentials', category: 'NEET', standards: [11, 12], teacher: 'Ms. A. Desai', lessons: 36, hours: 40, level: 'Intermediate', progress: 25, description: 'Organic, inorganic and physical chemistry made simple.' },
  { id: 5, title: 'Foundation Science', category: 'Foundation', standards: [9, 10], teacher: 'Mr. K. Joshi', lessons: 30, hours: 30, level: 'Beginner', progress: 90, description: 'Board-exam focused science with activities and practice papers.' },
  { id: 6, title: 'Foundation Maths', category: 'Foundation', standards: [9, 10], teacher: 'Ms. N. Rao', lessons: 28, hours: 28, level: 'Beginner', progress: 55, description: 'Step-by-step maths with plenty of solved examples.' },
]
