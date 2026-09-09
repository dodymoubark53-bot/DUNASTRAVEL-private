import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaClock, FaTag, FaUsers, FaChevronRight, FaCheck, FaTimes, FaCheckCircle
} from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';
import SuggestedTours from '../../components/tour/SuggestedTours';
import tours from '../../data/tours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const CLASSIC_IMAGES = [
  'https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg',
  'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1572252821143-035a024856f2?auto=format&fit=crop&w=1200&q=80'
];

const CLASSIC_PROGRAM_LANGS = {
  ar: {
    title: 'برنامج مصر الكلاسيكي',
    duration: '8 أيام',
    type: 'الكلاسيكية',
    groupSize: '2-16',
    overview: 'رحلة لا تُنسى عبر عجائب مصر العريقة. من غموض أهرامات الجيزة إلى سحر النيل، ومن مقابر الفراعنة إلى أجواء القاهرة التاريخية النابضة بالحياة — هذا البرنامج الكلاسيكي مصمم لمن يريد اكتشاف مصر بشكل كامل ومريح وأصيل.',
    highlights: [
      'زيارة الأهرامات الشهيرة في الجيزة وأبو الهول',
      'رحلة نيلية بإقامة كاملة من أسوان إلى الأقصر',
      'معابد فيلة وكوم أمبو وإدفو والكرنك والأقصر',
      'جولة اختيارية إلى أبو سمبل',
      'استكشاف القاهرة التاريخية: القلعة، مسجد الألباستر، خان الخليلي، الحي القبطي، والمتحف المصري'
    ],
    included: [
      'جميع وسائل النقل من البداية إلى النهاية.',
      'المساعدة في المطارات.',
      'مرشد سياحي يتحدث لغتك خلال الزيارات.',
      'الزيارات والتذاكر والنقل حسب البرنامج.',
      '04 ليالٍ في القاهرة مع الإقامة والإفطار بالإضافة إلى 03 ليالٍ رحلة نيلية بإقامة كاملة.'
    ],
    excluded: [
      'إكراميات السفر العامة 45 يورو للبالغ أو القاصر (إكراميات المرشد غير مشمولة).',
      'الوجبات والمشروبات أو أي مصاريف أخرى غير مذكورة ضمن المشمولات.',
      'الرحلات الجوية الداخلية والدولية.',
      'التأشيرة 25 يورو للبالغ/القاصر.'
    ],
    itinerary: [
      { day: 1, title: 'اليوم 1: مدينة المنشأ – القاهرة', description: 'في اليوم الأول، سننتظرك في مطار القاهرة لمنحك تأشيرتك ومساعدتك في إجراءات الهجرة وإيصالك إلى فندقك.' },
      { day: 2, title: 'اليوم 2: القاهرة', description: 'بعد الإفطار في الفندق والمغادرة لزيارة أهرامات الجيزة: خوفو وخفرع ومنقرع. ثم التوقف عند النقطة البانورامية للأهرامات لالتقاط صور رائعة، ثم زيارة أبو الهول، رأس الفرعون وجسم الأسد، حارس الأهرامات. زيارة اختيارية لمنف وسقارة، أطلال القاهرة الأصلية.' },
      { day: 3, title: 'اليوم 3: القاهرة / أسوان', description: 'بعد تناول الطعام سنتوجه إلى المطار للقيام برحلة جوية إلى أسوان، وسنستقبلك في مطار أسوان. ثم سنأخذك إلى السفينة السياحية حيث تنتظرك الإقامة الكاملة مع الوجبات. سنزور معبد فيلة: البداية المثالية!' },
      { day: 4, title: 'اليوم 4: رحلة نيلية (إقامة كاملة)', description: 'بعد الإفطار، زيارة اختيارية لمعابد أبو سمبل والتي تحظى بتقدير كبير ويُنصح بها بشدة. ثم نعود إلى السفينة ونتناول الطعام ونبدأ الإبحار على طول النيل وصولاً إلى كوم أمبو. بعد زيارة المعبد، نواصل الإبحار نحو إدفو حيث نرسو لتناول العشاء والمبيت.' },
      { day: 5, title: 'اليوم 5: رحلة نيلية (إقامة كاملة)', description: 'بعد تناول الطعام، نزور معبد إدفو المكرس للإله حورس. تواصل الرحلة النيلية إبحارها نحو الأقصر. عند وصولنا إلى مدينة الأقصر المهيبة نزور اثنين من أكثر المعابد إثارة للإعجاب في البلاد، معبدا الأقصر والكرنك. كانت هذه المعابد مفصولة في العصور القديمة بطريق الكباش الذي يمتد لـ 3 كيلومترات. نتناول الطعام ونقضي الليلة راسين في الأقصر.' },
      { day: 6, title: 'اليوم 6: الأقصر – القاهرة', description: 'الإفطار في الفندق. في الوقت المتفق عليه التوجه إلى المطار للقيام بالرحلة الداخلية إلى القاهرة. مساعدتنا ونقلك إلى الفندق.' },
      { day: 7, title: 'اليوم 7: القاهرة', description: 'الإفطار ويوم حر. من المقرر جولة اختيارية إلى أبرز المعالم في وسط المدينة. سنرى القلعة، نزور مسجد الألباستر، نستكشف خان الخليلي، نعبر الحي القبطي، نتناول الغداء ونُعجب بروائع المتحف المصري. ثم في المساء نتعشى في مطعم محلي.' },
      { day: 8, title: 'اليوم 8: القاهرة – مدينة المنشأ', description: 'بعد الإفطار نسجل المغادرة من الغرف، ثم نأخذك إلى المطار ونساعدك في أخذ رحلتك الجوية الدولية.' }
    ]
  },
  en: {
    title: 'Classic Egypt Program',
    duration: '8 Days',
    type: 'Classic',
    groupSize: '2-16',
    overview: "An unforgettable journey through Egypt's millennia-old wonders. From the mystery of the Pyramids of Giza to the magic of the Nile, from the tombs of the Pharaohs to the vibrant atmosphere of historic Cairo — this classic programme is designed for those who want to experience Egypt in a complete, comfortable and authentic way.",
    highlights: [
      'Visit to the iconic Pyramids of Giza and the Sphinx',
      'Nile cruise with full board from Aswan to Luxor',
      'Temples of Philae, Kom Ombo, Edfu, Karnak and Luxor',
      'Optional excursion to Abu Simbel',
      'Exploration of historic Cairo: the Citadel, the Alabaster Mosque, Khan el Khalili, the Coptic Quarter and the Egyptian Museum'
    ],
    included: [
      'All transport from start to finish.',
      'Assistance at airports.',
      'English speaking tour guide during visits.',
      'Visits, entrance tickets and transport as per programme.',
      '04 nights in Cairo on B&B basis plus 03 nights Nile Cruise on full board basis.'
    ],
    excluded: [
      'General travel gratuities €45 per adult or minor (guide tips excluded).',
      'Meals, drinks or any other expense not mentioned in inclusions.',
      'Domestic and international flights.',
      'Visa €25 per adult/minor.'
    ],
    itinerary: [
      { day: 1, title: 'Day 1: City of Origin – Cairo', description: 'On the first day, we will be waiting for you at Cairo airport to give you your visa, help you with immigration checks and take you to your hotel.' },
      { day: 2, title: 'Day 2: Cairo', description: 'After breakfast at the hotel, departure to visit the Pyramids of Giza: Cheops, Chephren and Mycerinus. Then, stop at the panoramic viewpoint of the pyramids for beautiful photos and then visit the Sphinx, head of the Pharaoh and body of the Lion, guardian of the Pyramids. Optional visit to Memphis and Saqqara, the ruins of the original Cairo.' },
      { day: 3, title: 'Day 3: Cairo / Aswan', description: 'After eating we will head to the airport to take a flight to Aswan, we will pick you up at Aswan airport. Then we will take you to the cruise ship, where full board accommodation awaits you. We will visit the Temple of Philae: the perfect beginning!' },
      { day: 4, title: 'Day 4: Nile Cruise (full board)', description: 'After breakfast, optional visit to the temples of Abu Simbel, which is very much appreciated and recommended. Then, back on the boat, we will eat and begin to sail along the Nile, arriving at Kom Ombo. Then, after visiting the temple, we will continue sailing towards Edfu, where we will anchor for dinner and overnight stay.' },
      { day: 5, title: 'Day 5: Nile Cruise (full board)', description: 'After eating, we will visit the Temple of Edfu, dedicated to the god Horus. The cruise will then continue towards Luxor. Upon arriving in the majestic city of Luxor we will visit two of the most spectacular temples in the country, the temples of Luxor and Karnak. These temples were separated in antiquity by the Avenue of the Sphinxes, 3 kilometres long. We will eat and spend the night anchored in Luxor.' },
      { day: 6, title: 'Day 6: Luxor – Cairo', description: 'Breakfast at the hotel. At the agreed time, transfer to Hurghada airport to take the domestic flight to Cairo. Our assistance and transfer to hotel.' },
      { day: 7, title: 'Day 7: Cairo', description: 'Breakfast and free day. An optional scheduled excursion is planned to the most emblematic places in the city centre. We will see the Citadel, visit the Alabaster Mosque, explore Khan el Khalili, cross the Coptic Quarter, have lunch and admire the masterpieces of the Egyptian Museum. Then in the evening we will have dinner at a local restaurant.' },
      { day: 8, title: 'Day 8: Cairo – City of Origin', description: 'After breakfast we will check out of the rooms, take you to the airport and assist you in taking your international flight.' }
    ]
  },
  es: {
    title: 'Programa Egipto Clásico',
    duration: '8 Días',
    type: 'Clásico',
    groupSize: '2-16',
    overview: 'Un viaje inolvidable a través de las maravillas milenarias de Egipto. Desde el misterio de las Pirámides de Guiza hasta la magia del Nilo, desde las tumbas de los Faraones hasta el ambiente vibrante del Cairo histórico — este programa clásico está diseñado para quienes desean vivir Egipto de manera completa, cómoda y auténtica.',
    highlights: [
      'Visita a las icónicas Pirámides de Guiza y la Esfinge',
      'Crucero por el Nilo con pensión completa desde Asuán hasta Luxor',
      'Templos de Philae, Kom Ombo, Edfu, Karnak y Luxor',
      'Excursión opcional a Abu Simbel',
      'Exploración del Cairo histórico: la Ciudadela, la Mezquita de Alabastro, Khan el Khalili, el barrio copto y el Museo Egipcio'
    ],
    included: [
      'Todos los transportes de principio a fin.',
      'Asistencia en los aeropuertos.',
      'Guía oficial durante las visitas.',
      'Visitas, entradas y traslados según el itinerario.',
      '04 noches en El Cairo en alojamiento y desayuno más 03 noches de crucero por el Nilo en pensión completa.'
    ],
    excluded: [
      'Propinas generales de viaje 45€ por adulto o menor (propinas de la guía no incluidas).',
      'Comidas, bebidas o cualquier otro gasto no mencionado como incluido.',
      'Vuelos nacionales e internacionales.',
      'Visado 25€ por adulto/menor.'
    ],
    itinerary: [
      { day: 1, title: 'Día 1: Ciudad de Origen – El Cairo', description: 'El primer día, te esperaremos en el aeropuerto de El Cairo para darte tu visado, ayudarte con los controles de inmigración y llevarte a tu hotel.' },
      { day: 2, title: 'Día 2: El Cairo', description: 'Después del desayuno en el hotel, salida para visitar las pirámides de Guiza: Keops, Kefrén y Micerinos. Luego, parada en el punto panorámico de las pirámides para bellísimas fotos y después visita a la Esfinge, cabeza del Faraón y cuerpo del León, guardiana de las Pirámides. Visita opcional a Menfis y Sakkara, las ruinas del Cairo original.' },
      { day: 3, title: 'Día 3: El Cairo / Asuán', description: 'Después de comer nos dirigiremos al aeropuerto para tomar un vuelo a Asuán, iremos a recogerte al aeropuerto de Asuán. Luego te llevaremos al crucero, donde te esperan alojamiento y comidas completas. Visitaremos el Templo de Philae: ¡el comienzo perfecto!' },
      { day: 4, title: 'Día 4: Crucero por el Nilo (pensión completa)', description: 'Después del desayuno, visita opcional a los templos de Abu Simbel, muy apreciada y recomendada. Luego, de vuelta al barco, comeremos y comenzaremos a navegar a lo largo del Nilo, llegando a Kom Ombo. Después de visitar el templo, continuaremos navegando hacia Edfu, donde anclaremos para cenar y pernoctar.' },
      { day: 5, title: 'Día 5: Crucero por el Nilo (pensión completa)', description: 'Después de comer, visitaremos el Templo de Edfu, dedicado al dios Horus. El crucero proseguirá luego hacia Luxor. Al llegar a la majestuosa ciudad de Luxor visitaremos dos de los más espectaculares templos del país, los templos de Luxor y Karnak. Estos templos estaban separados en la antigüedad por la Avenida de las Esfinges de 3 kilómetros de longitud. Comeremos y pasaremos la noche anclados en Luxor.' },
      { day: 6, title: 'Día 6: Luxor – El Cairo', description: 'Desayuno en el hotel. A la hora acordada traslado al aeropuerto de Hurghada para tomar el vuelo doméstico a El Cairo. Asistencia por nuestra parte y traslado al hotel.' },
      { day: 7, title: 'Día 7: El Cairo', description: 'Desayuno y día libre. Está prevista una excursión opcional programada a los lugares más emblemáticos del centro de la ciudad. Veremos la Ciudadela, visiteremos la Mezquita de Alabastro, exploraremos el Khan el Khalili, atravesaremos el barrio copto, almorzaremos y admiraremos las obras maestras del Museo Egipcio. Luego por la noche cenaremos en un restaurante local.' },
      { day: 8, title: 'Día 8: El Cairo – Ciudad de Origen', description: 'Después del desayuno haremos el check out de las habitaciones, te llevaremos al aeropuerto y te daremos asistencia para tomar tu vuelo internacional.' }
    ]
  },
  it: {
    title: 'Egitto Classico',
    duration: '8 Giorni',
    type: 'Classico',
    groupSize: '2-16',
    overview: "Un viaggio indimenticabile attraverso le meraviglie millenarie dell'Egitto. Dal mistero delle Piramidi di Giza alla magia del Nilo, dalle tombe dei Faraoni all'atmosfera vivace del Cairo storico — questo programma classico è pensato per chi vuole vivere l'Egitto in modo completo, confortevole e autentico.",
    highlights: [
      'Visita delle iconiche Piramidi di Giza e della Sfinge',
      'Crociera sul Nilo con pensione completa da Aswan a Luxor',
      'Templi di Philae, Kom Ombo, Edfu, Karnak e Luxor',
      'Escursione facoltativa ad Abu Simbel',
      'Esplorazione del Cairo storico: Cittadella, Moschea di Alabastro, Khan el Khalili, quartiere copto e Museo Egizio'
    ],
    included: [
      'Tutti i trasporti dall\'inizio alla fine.',
      'Assistenza negli aeroporti.',
      'Guida parlante italiano durante le visite.',
      'Visite, biglietti e trasferimenti secondo l\'itinerario.',
      '04 notti al Cairo in pernottamento e colazione più 03 notti di crociera sul Nilo in pensione completa.'
    ],
    excluded: [
      'Mance generali di viaggio 45€ per adulto o minore (mance della guida non comprese).',
      'Pasti, bevande o qualsiasi altra spesa non menzionata come inclusa.',
      'Voli nazionali e internazionali.',
      'Visto 25€ per adulto/minore.'
    ],
    itinerary: [
      { day: 1, title: 'Giorno 1: Città d\'Origine – Cairo', description: 'Il primo giorno, ti aspetteremo all\'aeroporto di Cairo per darti il tuo visto, aiutarti con i controlli sull\'immigrazione e portarti al tuo hotel.' },
      { day: 2, title: 'Giorno 2: Cairo', description: 'Dopo la colazione in hotel, partenza per la visita delle piramidi di Giza: Cheope, Chefren e Mequerinos. Quindi, sosta al punto panoramico delle piramidi per bellissime foto e poi visita la Sfinge, testa del Faraone e corpo del Leone, guardiano delle Piramidi. Visita facoltativa a Memphis e Sakkara, le rovine del Cairo originale.' },
      { day: 3, title: 'Giorno 3: Cairo / Aswan', description: 'Dopo aver mangiato ci dirigeremo all\'aeroporto per prendere un volo per Aswan, vi verremo a prendere all\'aeroporto di Aswan. Poi vi porteremo alla nave da crociera, dove ti aspettano vitto e alloggio completi. Visiteremo il Tempio di Philae: l\'inizio perfetto!' },
      { day: 4, title: 'Giorno 4: Crociera sul Nilo (pensione completa)', description: 'Dopo la colazione, visita facoltativa ai templi di Abu Simbel, che viene molto apprezzata e raccomandata. Poi, risaliti sulla barca, mangeremo e inizieremo a navigare lungo il Nilo, arrivando a Kom Ombo. Quindi, dopo aver visitato il tempio, continueremo a navigare verso Edfu, dove ancoreremo per cenare e pernottare.' },
      { day: 5, title: 'Giorno 5: Crociera sul Nilo (pensione completa)', description: 'Dopo aver mangiato, visiteremo il Tempio di Edfu, dedicato al dio Horus. La crociera proseguirà poi verso Luxor. Giunti nella maestosa città di Luxor visiteremo due tra i più spettacolari templi del paese, i templi di Luxor e Karnak. Questi templi erano separati nell\'antichità dal Viale delle Sfingi lungo 3 chilometri. Mangeremo e passeremo la notte all\'ancora a Luxor.' },
      { day: 6, title: 'Giorno 6: Luxor – Cairo', description: 'Colazione in albergo. All\'orario concordato trasferimento all\'aeroporto di Hurghada per prendere il volo interno per Il Cairo. Assistenza da parte nostra e trasferimento in hotel.' },
      { day: 7, title: 'Giorno 7: Cairo', description: 'Colazione e giornata libera. È prevista un\'escursione programmata facoltativa ai luoghi più emblematici del centro della città. Vedremo la Cittadella, visiteremo la Moschea di Alabastro, esploreremo il Khan el Khalili, attraverseremo il quartiere copto, pranzeremo e ammireremo i capolavori del Museo Egizio. Poi la sera ceneremo in un ristorante locale.' },
      { day: 8, title: 'Giorno 8: Cairo – Città d\'Origine', description: 'Dopo la colazione faremo il check out delle camere, vi porteremo all\'aeroporto e vi daremo assistenza per prendere il volo internazionale.' }
    ]
  },
  pt: {
    title: 'Programa Egito Clássico',
    duration: '8 Dias',
    type: 'Clássico',
    groupSize: '2-16',
    overview: 'Uma viagem inesquecível pelas maravilhas milenares do Egito. Do mistério das Pirâmides de Gizé à magia do Nilo, das tumbas dos Faraós à atmosfera vibrante do Cairo histórico — este programa clássico é pensado para quem quer viver o Egito de forma completa, confortável e autêntica.',
    highlights: [
      'Visita às icónicas Pirâmides de Gizé e à Esfinge',
      'Cruzeiro no Nilo com pensão completa de Assuã a Luxor',
      'Templos de Philae, Kom Ombo, Edfu, Karnak e Luxor',
      'Excursão opcional a Abu Simbel',
      'Exploração do Cairo histórico: a Cidadela, a Mesquita de Alabastro, Khan el Khalili, o Bairro Copta e o Museu Egípcio'
    ],
    included: [
      'Todos os transportes do início ao fim.',
      'Assistência nos aeroportos.',
      'Guia oficial durante as visitas.',
      'Visitas, bilhetes e transferências de acordo com o itinerário.',
      '04 noites no Cairo com alojamento e pequeno-almoço mais 03 noites de cruzeiro no Nilo com pensão completa.'
    ],
    excluded: [
      'Gorjetas gerais de viagem 45€ por adulto ou menor (gorjetas do guia não incluídas).',
      'Refeições, bebidas ou qualquer outra despesa não mencionada como incluída.',
      'Voos domésticos e internacionais.',
      'Visto 25€ por adulto/menor.'
    ],
    itinerary: [
      { day: 1, title: 'Dia 1: Cidade de Origem – Cairo', description: 'No primeiro dia, estaremos à sua espera no aeroporto do Cairo para lhe dar o seu visto, ajudá-lo com os controlos de imigração e levá-lo ao seu hotel.' },
      { day: 2, title: 'Dia 2: Cairo', description: 'Após o pequeno-almoço no hotel, partida para visitar as pirâmides de Gizé: Quéops, Quéfren e Miquerinos. De seguida, paragem no miradouro panorâmico das pirâmides para fotografias maravilhosas e depois visita à Esfinge, cabeça do Faraó e corpo do Leão, guardiã das Pirâmides. Visita opcional a Mênfis e Sacará, as ruínas do Cairo original.' },
      { day: 3, title: 'Dia 3: Cairo / Assuã', description: 'Depois de comer dirigir-nos-emos ao aeroporto para apanhar um voo para Assuã, iremos buscá-lo ao aeroporto de Assuã. Depois levá-lo-emos ao navio de cruzeiro, onde o espera alojamento e refeições completas. Visitaremos o Templo de Philae: o começo perfeito!' },
      { day: 4, title: 'Dia 4: Cruzeiro no Nilo (pensão completa)', description: 'Após o pequeno-almoço, visita opcional aos templos de Abu Simbel, muito apreciada e recomendada. Depois, de volta ao barco, comeremos e começaremos a navegar ao longo do Nilo, chegando a Kom Ombo. Depois de visitar o templo, continuaremos a navegar em direção a Edfu, onde ancoramos para jantar e pernoitar.' },
      { day: 5, title: 'Dia 5: Cruzeiro no Nilo (pensão completa)', description: 'Depois de comer, visitaremos o Templo de Edfu, dedicado ao deus Horus. O cruzeiro prosseguirá depois em direção a Luxor. Chegados à majestosa cidade de Luxor visitaremos dois dos mais espetaculares templos do país, os templos de Luxor e Karnak. Estes templos eram separados na Antiguidade pela Avenida das Esfinges com 3 quilómetros de comprimento. Comeremos e passaremos a noite ancorados em Luxor.' },
      { day: 6, title: 'Dia 6: Luxor – Cairo', description: 'Pequeno-almoço no hotel. À hora acordada, transferência para o aeroporto de Hurghada para apanhar o voo doméstico para o Cairo. Assistência da nossa parte e transferência para o hotel.' },
      { day: 7, title: 'Dia 7: Cairo', description: 'Pequeno-almoço e dia livre. Está prevista uma excursão opcional programada aos lugares mais emblemáticos do centro da cidade. Veremos a Cidadela, visitaremos a Mesquita de Alabastro, exploraremos o Khan el Khalili, atravessaremos o bairro copta, almoçaremos e admiraremos as obras-primas do Museu Egípcio. Depois à noite jantaremos num restaurante local.' },
      { day: 8, title: 'Dia 8: Cairo – Cidade de Origem', description: 'Após o pequeno-almoço faremos o check out dos quartos, levá-lo-emos ao aeroporto e daremos assistência para apanhar o voo internacional.' }
    ]
  }
};

export default function ClassicProgramDetails() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en').substring(0, 2);
  const currentLangData = CLASSIC_PROGRAM_LANGS[lang] || CLASSIC_PROGRAM_LANGS.en;

  const { title, duration, type: tourType, groupSize, overview, highlights, included, excluded, itinerary } = currentLangData;

  const shuffledTours = useMemo(() => [...tours].reverse(), []);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      requestAnimationFrame(() => {
        const item = el.querySelector('.related-carousel-item');
        const step = (item ? item.offsetWidth : 300) + 24;
        const currentScroll = el.scrollLeft;
        const visibleWidth = el.clientWidth;
        const totalWidth = el.scrollWidth;
        const isEnd = currentScroll + visibleWidth >= totalWidth - 10;

        if (isEnd) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: step, behavior: 'smooth' });
        }
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content={overview.substring(0, 150) + '...'} />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('programs.classicBadge', '👑 برنامج مصر الكلاسيكي الملكي')}
        title={title}
        subtitle={duration}
        description={overview}
        highlights={[
          t('programs.classicTag1', '🐪 الأهرامات وأبو الهول والجيزة'),
          t('programs.classicTag2', '🚢 رحلة نيلية ديلوكس 5 نجوم (أسوان - الأقصر)'),
          t('programs.classicTag3', '🏛️ معابد فيلة وكوم أمبو وإدفو والكرنك'),
          t('programs.classicTag4', '🕌 القاهرة التاريخية وخان الخليلي')
        ]}
        primaryCta={{
          text: t('programs.bookNow', 'احجز هذا البرنامج الآن ←'),
          link: '#booking-section'
        }}
        secondaryCta={{
          text: t('programs.viewGallery', 'عرض البوم الصور'),
          onClick: () => setIsLightboxOpen(true)
        }}
        bgImage={CLASSIC_IMAGES[0]}
      />

      {/* Hero Lightbox Gallery */}
      <section
        className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <motion.img
          src={CLASSIC_IMAGES[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-6 right-6 bg-obsidian-900/80 backdrop-blur-md px-4 py-2 rounded-full text-ivory-50 text-caption border border-gold-500/20 text-xs">
          {t('tour.clickGallery', 'Click to open gallery')}
        </div>
      </section>

      {/* Quick Info Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-ivory-50 rounded-2xl shadow-card overflow-hidden border border-obsidian-200">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x rtl:divide-x-reverse divide-gray-100 bg-obsidian-50">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{duration}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs">{t('tour.tourType', 'Tour Type')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{tourType}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs">{t('tour.groupSize', 'Group Size')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{groupSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content & Sidebar Grid */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-600 leading-relaxed">{overview}</p>
            </motion.div>

            {/* Highlights */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.highlights', 'Key Highlights')}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gold-500/10">
                    <FaCheck className="text-gold-500 mt-1 shrink-0" />
                    <span className="text-body-sm text-obsidian-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Day-by-Day Itinerary */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mb-10 text-center">
                <span className="text-caption text-gold-500 uppercase tracking-[4px] font-semibold block mb-3 text-xs">
                  {t('tour.journeyDayByDay', 'YOUR JOURNEY DAY BY DAY')}
                </span>
                <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.itinerary', 'Itinerary')}
                </h2>
                <div className="w-24 h-1 bg-gold-500 mx-auto mt-3" />
              </div>

              <div className="relative max-w-full">
                <div className="absolute left-[1.1rem] rtl:left-auto rtl:right-[1.1rem] top-0 bottom-0 w-1 bg-gold-400" />
                <div className="space-y-6">
                  {itinerary.map((day) => (
                    <div key={day.day} className="relative pl-10 rtl:pl-0 rtl:pr-10 md:pl-12 md:rtl:pr-12">
                      <div className="absolute left-[0.1rem] rtl:left-auto rtl:right-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {day.day}
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gold-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-obsidian-900">
                            {day.title}
                          </span>
                        </div>

                        <p className="text-body-sm text-obsidian-600 leading-relaxed">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Included & Excluded */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/60">
                <h3 className="text-body-lg font-bold text-emerald-950 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-600" />
                  {t('tourDetail.included', 'What is Included')}
                </h3>
                <ul className="space-y-3">
                  {included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-emerald-900">
                      <FaCheck className="text-emerald-600 mt-1 shrink-0 text-xs" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200/60">
                <h3 className="text-body-lg font-bold text-rose-950 mb-4 flex items-center gap-2">
                  <FaTimes className="text-rose-600" />
                  {t('tourDetail.excluded', 'What is Excluded')}
                </h3>
                <ul className="space-y-3">
                  {excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-rose-900">
                      <FaTimes className="text-rose-500 mt-1 shrink-0 text-xs" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Route Map */}
            <RouteMap itinerary={itinerary} />
          </div>

          {/* Sticky Sidebar Booking Column */}
          <div className="lg:col-span-1 sticky top-24 self-start z-40">
            <div>
              <AdvancedBooking tourTitle={title} />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Map */}
      <ReviewsMap tourId="classic-program" />

      {/* Related Tours Carousel */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('tourDetail.relatedTitle', 'You May Also Like')}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-4" />
        </div>

        <div className="related-carousel" ref={carouselRef}>
          {shuffledTours.slice(0, 8).map((tItem) => (
            <div key={tItem.id} className="related-carousel-item">
              <TourCard tour={tItem} linkBase="/tours" />
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .related-carousel {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          gap: 24px;
          padding-top: 12px;
          padding-bottom: 24px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .related-carousel-item {
          flex: 0 0 auto;
          width: 300px;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .related-carousel-item { width: 330px; }
        }
      `}</style>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 text-ivory-50 hover:text-gold-500 z-[101] text-2xl font-bold">
              ✕
            </button>
            <img
              src={CLASSIC_IMAGES[0]}
              alt={title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Tours Strip */}
      <SuggestedTours currentDestination="egypt" currentSlug="classic-program" />
    </div>
  );
}
