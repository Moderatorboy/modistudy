export const batches = [
  {
    id: 'b1',
    name: 'Batch A - 2025',
    image: '/images/batchA.jpg',
    class: '12th',
    sir: 'Mr. Sharma',
    subjects: [
      {
        id: 's1',
        name: 'Physics',
        chapters: [
          {
            id: 'c1',
            name: 'Mechanics',
            notes: ['notes_mech_1.pdf'],
            dpp: ['dpp_mech_1.pdf'],
            lectures: [
              { id: 'l1', title: 'Projectile Motion', url: 'https://rumble.com/embed/v4i7lnc/?pub=4' },
              { id: 'l2', title: 'Newton Laws', url: 'https://rumble.com/embed/v4i7lnc/?pub=4' }
            ]
          }
        ]
      },
      {
        id: 's2',
        name: 'Maths',
        chapters: [
          {
            id: 'c2',
            name: 'Calculus',
            notes: ['calc_notes.pdf'],
            dpp: ['calc_dpp.pdf'],
            lectures: [
              { id: 'l3', title: 'Derivatives', url: 'https://rumble.com/embed/v4i7lnc/?pub=4' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'b2',
    name: 'Batch B - 2024',
    image: '/images/batchB.jpg',
    class: '11th',
    sir: 'Ms. Verma',
    subjects: [
      {
        id: 's3',
        name: 'Chemistry',
        chapters: [
          {
            id: 'c3',
            name: 'Organic Chemistry',
            notes: [],
            dpp: [],
            lectures: []
          }
        ]
      }
    ]
  }
];
