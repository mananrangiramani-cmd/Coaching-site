export const initialPayments = [
  {
    studentId: 1, totalFee: 60000,
    installments: [
      { id: 1, label: 'Instalment 1', amount: 20000, dueDate: '10 Jun 2026', status: 'Paid', paidOn: '09 Jun 2026', mode: 'UPI' },
      { id: 2, label: 'Instalment 2', amount: 20000, dueDate: '10 Sep 2026', status: 'Paid', paidOn: '12 Sep 2026', mode: 'UPI' },
      { id: 3, label: 'Instalment 3', amount: 20000, dueDate: '10 Dec 2026', status: 'Pending' },
    ],
  },
  {
    studentId: 2, totalFee: 55000,
    installments: [
      { id: 1, label: 'Instalment 1', amount: 27500, dueDate: '15 May 2026', status: 'Paid', paidOn: '15 May 2026', mode: 'Card' },
      { id: 2, label: 'Instalment 2', amount: 27500, dueDate: '15 Aug 2026', status: 'Paid', paidOn: '14 Aug 2026', mode: 'Card' },
    ],
  },
  {
    studentId: 3, totalFee: 60000,
    installments: [
      { id: 1, label: 'Instalment 1', amount: 20000, dueDate: '10 Jul 2026', status: 'Paid', paidOn: '11 Jul 2026', mode: 'Cash' },
      { id: 2, label: 'Instalment 2', amount: 20000, dueDate: '10 Oct 2026', status: 'Pending' },
      { id: 3, label: 'Instalment 3', amount: 20000, dueDate: '10 Jan 2027', status: 'Pending' },
    ],
  },
  {
    studentId: 4, totalFee: 55000,
    installments: [
      { id: 1, label: 'Full payment', amount: 55000, dueDate: '01 Mar 2026', status: 'Paid', paidOn: '28 Feb 2026', mode: 'Bank transfer' },
    ],
  },
  {
    studentId: 5, totalFee: 30000,
    installments: [
      { id: 1, label: 'Instalment 1', amount: 15000, dueDate: '05 Aug 2026', status: 'Paid', paidOn: '05 Aug 2026', mode: 'UPI' },
      { id: 2, label: 'Instalment 2', amount: 15000, dueDate: '15 Nov 2026', status: 'Pending' },
    ],
  },
  {
    studentId: 6, totalFee: 30000,
    installments: [
      { id: 1, label: 'Instalment 1', amount: 15000, dueDate: '01 Apr 2026', status: 'Paid', paidOn: '01 Apr 2026', mode: 'UPI' },
      { id: 2, label: 'Instalment 2', amount: 15000, dueDate: '01 Jul 2026', status: 'Paid', paidOn: '30 Jun 2026', mode: 'UPI' },
    ],
  },
]