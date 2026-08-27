// تغيير اسم الـ Array ليعبر عن الهوية الجديدة للموقع
export const services = [
  // 1. CLASSIC PROGRAMS
  {
    id: 'prog-cls-3',
    category: 'classic',
    slug: 'classic-program',
    title: 'classic.title',
    location: 'classic.location',
    price: 1890,
    rating: 4.8,
    reviewCount: 402,
    images: ['/imgs/italy/Classic Program.jpg'],
    shortDesc: 'classic.shortDesc',
    overview: [
      'classic.overview'
    ],
    highlights: [
      'classic.highlight.1',
      'classic.highlight.2',
      'classic.highlight.3',
      'classic.highlight.4',
      'classic.highlight.5'
    ],
    included: [
      'classic.included.1',
      'classic.included.2',
      'classic.included.3',
      'classic.included.4',
      'classic.included.5'
    ],
    excluded: [
      'classic.excluded.1',
      'classic.excluded.2',
      'classic.excluded.3',
      'classic.excluded.4'
    ],
    itinerary: [
      { day: 1, title: 'classic.day1.title', body: 'classic.day1.body' },
      { day: 2, title: 'classic.day2.title', body: 'classic.day2.body' },
      { day: 3, title: 'classic.day3.title', body: 'classic.day3.body' },
      { day: 4, title: 'classic.day4.title', body: 'classic.day4.body' },
      { day: 5, title: 'classic.day5.title', body: 'classic.day5.body' },
      { day: 6, title: 'classic.day6.title', body: 'classic.day6.body' },
      { day: 7, title: 'classic.day7.title', body: 'classic.day7.body' },
      { day: 8, title: 'classic.day8.title', body: 'classic.day8.body' }
    ]
  },

  // 4. HONEYMOONERS PACKAGE
  {
    id: 'prog-hon-1',
    category: 'honeymooners',
    slug: 'romantic-arabian-nights',
    title: 'Romantic Arabian Nights Package',
    location: 'Cairo, Nile Cruise & Sea',
    price: 2400,
    rating: 5.0,
    images: ['/imgs/gallery/15.jpeg', '/imgs/gallery/16.jpeg'],
    shortDesc: 'Celebrate your love with intimate candlelit dinners, private yacht cruises, and unmatched romantic luxury.',
    overview: [
      "Designed exclusively for newlyweds, our Honeymooners Package curates unforgettable, romantic moments amidst the majestic landscapes of the Middle East.",
      "Enjoy premium suites featuring private plunge pools, private candlelit dinners on a traditional Nile Dahabiya yacht, and couples' spa treatments utilizing authentic local essential oils.",
      "From complimentary champagne upon arrival to tailored private photography sessions by the monuments, we ensure your romantic milestone is genuinely magical."
    ],
    highlights: ['Guaranteed premium honeymoon suites upgrade', 'Private candlelit dinner under the stars', 'Couples massage and wellness packages', 'Private professional photography session'],
    included: ['Full board luxury cruise & resort stays', 'Welcome gifts & champagne', 'All private transfers', 'Special romantic setups'],
    excluded: ['Historical site entry fees', 'Extra spa treatments']
  },

  // 6. PROGRAMAS RELIGIOSOS
  {
    id: 'prog-rel-egypt-jordan',
    category: 'religious',
    slug: 'egypt-jordan-combined-14d',
    title: 'tour_jordan_title',
    location: 'Egypt & Jordan',
    price: 2490,
    rating: 5.0,
    reviewCount: 128,
    images: [
      'https://sft-nationaltours.com/wp-content/uploads/2024/11/holy-family-egypt_tg_1397-870x555.jpg',
      'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1200,c_fill/v1783024062/071f261a-2ab6-48b5-a370-c47ad7889be3_immde1.jpg',
      'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1200,c_fill/v1783024072/400a841d-18b7-4915-8483-f9a3346651cf_ocdouu.jpg',
      'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1200,c_fill/v1783024090/9788c6d2-7046-4ce0-aa64-a0adcbe1a54d_omcrnc.jpg'
    ],
    shortDesc: 'tour_jordan_shortDesc',
    overview: [
      'tour_jordan_overview_1',
      'tour_jordan_overview_2',
      'tour_jordan_overview_3'
    ],
    highlights: [
      'tour_jordan_highlight_1',
      'tour_jordan_highlight_2',
      'tour_jordan_highlight_3',
      'tour_jordan_highlight_4',
      'tour_jordan_highlight_5',
      'tour_jordan_highlight_6',
      'tour_jordan_highlight_7'
    ],
    itinerary: [
      {
        day: 1,
        title: 'tour_jordan_day1_title',
        body: 'tour_jordan_day1_body'
      },
      {
        day: 2,
        title: 'tour_jordan_day2_title',
        body: 'tour_jordan_day2_body'
      },
      {
        day: 3,
        title: 'tour_jordan_day3_title',
        body: 'tour_jordan_day3_body'
      },
      {
        day: 4,
        title: 'tour_jordan_day4_title',
        body: 'tour_jordan_day4_body'
      },
      {
        day: 5,
        title: 'tour_jordan_day5_title',
        body: 'tour_jordan_day5_body'
      },
      {
        day: 6,
        title: 'tour_jordan_day6_title',
        body: 'tour_jordan_day6_body'
      },
      {
        day: 7,
        title: 'tour_jordan_day7_title',
        body: 'tour_jordan_day7_body'
      },
      {
        day: 8,
        title: 'tour_jordan_day8_title',
        body: 'tour_jordan_day8_body'
      },
      {
        day: 9,
        title: 'tour_jordan_day9_title',
        body: 'tour_jordan_day9_body'
      },
      {
        day: 10,
        title: 'tour_jordan_day10_title',
        body: 'tour_jordan_day10_body'
      }
    ]
  },

  // 8. NEW HOTELS SECTION - SOL PYRAMID HOTEL
  {
    id: 'prog-hot-1',
    category: 'hotels',
    slug: 'sol-pyramid-hotel',
    title: 'Sol Pyramid Hotel',
    location: 'Giza, Egypt',
    price: 85,
    rating: 5.0,
    reviewCount: 1,
    images: ['https://www.solpyramid-egypt.com/wp-content/uploads/2022/08/Hotel.jpg'],
    shortDesc: 'Solpyramid Hotel is a modern 3-star establishment designed for travellers who want to explore Egypt\'s major sights. Combining elegant room design with a family atmosphere, it offers complete, modern facilities steps away from the Pyramids.',
    overview: [
      'Solpyramid Hotel is a modern 3-star establishment designed for travellers who want to explore Egypt\'s major sights. Combining elegant room design with a family atmosphere, it offers complete, modern facilities with personal and qualified service — all located steps away from the Pyramids of Giza.'
    ],
    highlights: [
      'Elegant room design with a family atmosphere',
      'Steps away from the Pyramids of Giza',
      'Complete, modern facilities',
      'Personal and qualified service'
    ],
    included: [
      'Free Wi-Fi',
      'Air conditioning (cold & heat)',
      'Private bathroom with amenities',
      'In-room safe box'
    ],
    excluded: [
      'Mini bar refrigerated stocked items (against charge)',
      'Room service extra charges'
    ]
  },


  // 10. HURGHADA EXTENSION
  {
    id: 'hurghada-4d3n',
    category: 'extension',
    slug: 'hurghada-4d3n',
    title: 'trip.hurghada.title',
    location: 'trip.hurghada.title',
    price: 0,
    rating: 5.0,
    images: ['https://1.bp.blogspot.com/-HqmKDzZ73hY/XgSOtrhSAOI/AAAAAAAARdc/cxtywSwZxLIaZPfw98FzQHYtiPblmzg2gCLcBGAsYHQ/w1200-h630-p-k-no-nu/%D8%A3%D9%81%D8%B6%D9%84-%D8%A7%D9%84%D8%A3%D9%86%D8%B4%D8%B7%D8%A9-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A%D8%A9-%D9%81%D9%89-%D8%A7%D9%84%D8%BA%D8%B1%D8%AF%D9%82%D8%A9-825x510.jpg'],
    shortDesc: 'trip.hurghada.day1.desc',
    overview: [
      'trip.hurghada.day1.desc',
      'trip.hurghada.day2.desc',
      'trip.hurghada.day3.desc'
    ],
    highlights: [
      'trip.hurghada.day2.optional.title',
      'trip.hurghada.day3.optional.title'
    ],
    included: [
      'trip.hurghada.includes.item1',
      'trip.hurghada.includes.item2'
    ],
    excluded: [
      'trip.hurghada.excludes.item1'
    ],
    itinerary: [
      {
        day: 1,
        title: 'trip.hurghada.day1.title',
        morning: 'trip.hurghada.day1.desc',
        afternoon: '',
        evening: ''
      },
      {
        day: 2,
        title: 'trip.hurghada.day2.title',
        morning: 'trip.hurghada.day2.desc',
        afternoon: 'trip.hurghada.day2.optional.title',
        evening: 'trip.hurghada.day2.optional.desc'
      },
      {
        day: 3,
        title: 'trip.hurghada.day3.title',
        morning: 'trip.hurghada.day3.desc',
        afternoon: 'trip.hurghada.day3.optional.title',
        evening: 'trip.hurghada.day3.optional.desc'
      },
      {
        day: 4,
        title: 'trip.hurghada.day4.title',
        morning: 'trip.hurghada.day4.desc',
        afternoon: '',
        evening: ''
      }
    ]
  },

  // 11. SHARM EL SHEIKH EXTENSION (LOCALIZED)
  {
    id: 'sharm-4d3n',
    category: 'extension',
    slug: 'sharm-4d3n',
    title: 'trip.sharm.title',
    location: 'trip.sharm.title',
    price: 0,
    rating: 5.0,
    images: ['https://nileholiday.com/wp-content/uploads/2019/10/sharm-el-sheikh-top-attractions-1-1920x750.jpg'],
    shortDesc: 'trip.sharm.day1.desc',
    overview: [
      'trip.sharm.day1.desc',
      'trip.sharm.day2.desc',
      'trip.sharm.day3.desc'
    ],
    highlights: [
      'trip.sharm.day2.optional.title',
      'trip.sharm.day3.optional.title'
    ],
    included: [
      'trip.sharm.includes.item1',
      'trip.sharm.includes.item2'
    ],
    excluded: [
      'trip.sharm.excludes.item1'
    ],
    itinerary: [
      {
        day: 1,
        title: 'trip.sharm.day1.title',
        morning: 'trip.sharm.day1.desc',
        afternoon: '',
        evening: ''
      },
      {
        day: 2,
        title: 'trip.sharm.day2.title',
        morning: 'trip.sharm.day2.desc',
        afternoon: 'trip.sharm.day2.optional.title',
        evening: 'trip.sharm.day2.optional.desc'
      },
      {
        day: 3,
        title: 'trip.sharm.day3.title',
        morning: 'trip.sharm.day3.desc',
        afternoon: 'trip.sharm.day3.optional.title',
        evening: 'trip.sharm.day3.optional.desc'
      },
      {
        day: 4,
        title: 'trip.sharm.day4.title',
        morning: 'trip.sharm.day4.desc',
        afternoon: '',
        evening: ''
      }
    ]
  },

  // 12. SIWA OASIS + ALEXANDRIA EXTENSION (LOCALIZED)
  {
    id: 'siwa-oasis-alexandria',
    category: 'extension',
    slug: 'siwa-oasis-alexandria',
    title: 'tour_siwa_title',
    location: 'tour_siwa_destination',
    price: 0,
    rating: 5.0,
    images: ['/imgs/services/service-317.webp'],
    shortDesc: 'tour_siwa_summary',
    overview: [
      'tour_siwa_summary'
    ],
    highlights: [],
    included: [
      'tour_siwa_includes_1',
      'tour_siwa_includes_2',
      'tour_siwa_includes_3',
      'tour_siwa_includes_4',
      'tour_siwa_includes_5',
      'tour_siwa_includes_6',
      'tour_siwa_includes_7',
      'tour_siwa_includes_8'
    ],
    excluded: [],
    itinerary: [
      {
        day: 1,
        title: 'tour_siwa_day1_title',
        body: 'tour_siwa_day1_body'
      },
      {
        day: 2,
        title: 'tour_siwa_day2_title',
        body: 'tour_siwa_day2_body'
      },
      {
        day: 3,
        title: 'tour_siwa_day3_title',
        body: 'tour_siwa_day3_body'
      },
      {
        day: 4,
        title: 'tour_siwa_day4_title',
        body: 'tour_siwa_day4_body'
      },
      {
        day: 5,
        title: 'tour_siwa_day5_title',
        body: 'tour_siwa_day5_body'
      }
    ]
  }
];