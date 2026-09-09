/**
 * Lightweight curated preview data for the Home experience section.
 * Contains only the essential fields needed for the landing page marquee and showcase cards.
 * Prevents bundling multi-megabyte itinerary catalogs into the initial Home page JavaScript chunk.
 */

export const homeTurkeyPreviewTours = [
  {
    id: "REG-01",
    slug: "reg-01-legendary-turkey",
    name: {
      en: "Legendary Turkey",
      es: "Turquía Legendaria",
      pt: "Turquia Lendária",
      it: "Turchia Leggendaria",
      ar: "تركيا الأسطورية",
    },
    duration: {
      en: "11 days / 10 nights",
      es: "11 días / 10 noches",
      pt: "11 dias / 10 noites",
      it: "11 giorni / 10 notti",
      ar: "11 أيام / 10 ليالٍ",
    },
    overview: {
      en: "Discover the grandeur of Turkey on an 11-day journey combining history, culture, and unique landscapes.",
      es: "Descubra la grandeza de Turquía en un recorrido de 11 días que combina historia, cultura y paisajes únicos.",
      pt: "Descubra a grandeza da Turquia em um percurso de 11 dias que combina história, cultura e paisagens únicas.",
      it: "Scopri la grandiosità della Turchia in un itinerario di 11 giorni che unisce storia, cultura e paesaggi unici.",
      ar: "اكتشف عظمة تركيا في رحلة مدتها 11 يومًا تجمع بين التاريخ والثقافة والمناظر الطبيعية الفريدة.",
    },
    price: 1190,
    images: ["https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=500&q=75&fm=webp"],
  },
  {
    id: "REG-04",
    slug: "reg-04-legendary-cappadocia",
    name: {
      en: "Legendary Turkey & Cappadocia",
      es: "Turquía Legendaria y Capadocia",
      pt: "Turquia Lendária e Capadócia",
      it: "Turchia Leggendaria e Cappadocia",
      ar: "تركيا الأسطورية وكابادوكيا",
    },
    duration: {
      en: "8 days / 7 nights",
      es: "8 días / 7 noches",
      pt: "8 dias / 7 noites",
      it: "8 giorni / 7 notti",
      ar: "8 أيام / 7 ليالٍ",
    },
    overview: {
      en: "Explore the magical fairy chimneys of Cappadocia, ancient Istanbul, and the Aegean coast.",
      es: "Explore las mágicas chimeneas de hadas de Capadocia, la antigua Estambul y la costa del Egeo.",
      pt: "Explore as chaminés de fadas mágicas da Capadócia, a antiga Istambul e a costa do Egeu.",
      it: "Esplora i magici camini delle fate della Cappadocia, l'antica Istanbul e la costa egea.",
      ar: "استكشف مداخن الجنيات الساحرة في كابادوكيا وإسطنبول التاريخية وساحل إيجه.",
    },
    price: 980,
    images: ["https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=500&q=75&fm=webp"],
  },
  {
    id: "REG-07",
    slug: "reg-07-splendors-of-turkey",
    name: {
      en: "Splendors of Turkey & Pamukkale",
      es: "Esplendores de Turquía y Pamukkale",
      pt: "Esplendores da Turquia e Pamukkale",
      it: "Splendori della Turchia e Pamukkale",
      ar: "روائع تركيا وباموكالي",
    },
    duration: {
      en: "10 days / 9 nights",
      es: "10 días / 9 noches",
      pt: "10 dias / 9 noites",
      it: "10 giorni / 9 notti",
      ar: "10 أيام / 9 ليالٍ",
    },
    overview: {
      en: "Marvel at the thermal terraces of Pamukkale, Roman ruins of Ephesus, and Ottoman palaces.",
      es: "Maravíllese con las terrazas termales de Pamukkale, las ruinas romanas de Éfeso y los palacios otomanos.",
      pt: "Maravilhe-se com os terraços termais de Pamukkale, as ruínas romanas de Éfeso e os palácios otomanos.",
      it: "Ammira le terrazze termali di Pamukkale, le rovine romane di Efeso e i palazzi ottomani.",
      ar: "انغمس في روعة مدرجات باموكالي الحرارية وأطلال أفسس الرومانية وقصور العثمانيين.",
    },
    price: 1090,
    images: ["https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=500&q=75&fm=webp"],
  },
];

export const homeJordanPreviewTours = [
  {
    id: "JOR-01",
    slug: "jor-01-classical-jordan",
    name: {
      en: "Classical Jordan & Petra Wonders",
      es: "Jordania Clásica y Maravillas de Petra",
      pt: "Jordânia Clássica e Maravilhas de Petra",
      it: "Giordania Classica e Meraviglie di Petra",
      ar: "الأردن الكلاسيكي وعجائب البتراء",
    },
    duration: {
      en: "8 days / 7 nights",
      es: "8 días / 7 noches",
      pt: "8 dias / 7 noites",
      it: "8 giorni / 7 notti",
      ar: "8 أيام / 7 ليالٍ",
    },
    overview: {
      en: "From the rose-red stone carvings of Petra to the starry silence of Wadi Rum and floating in the Dead Sea.",
      es: "Desde los templos tallados de Petra hasta el silencio estrellado de Wadi Rum y el Mar Muerto.",
      pt: "Dos templos esculpidos de Petra ao silêncio estrelado de Wadi Rum e o Mar Morto.",
      it: "Dalle sculture di pietra rosa di Petra al silenzio stellato del Wadi Rum e il Mar Morto.",
      ar: "من روعة البتراء المنحوتة في الصخر إلى هدوء وادي رم الساحر وسحر البحر الميت.",
    },
    price: 1350,
    images: ["/images/jordan-petra.webp"],
  },
  {
    id: "JOR-02",
    slug: "jor-02-highlights-of-jordan",
    name: {
      en: "Highlights of Jordan & Wadi Rum Eco-Camp",
      es: "Lo Mejor de Jordania y Eco-Campamento Wadi Rum",
      pt: "Destaques da Jordânia e Eco-Campamento Wadi Rum",
      it: "Il Meglio della Giordania e Wadi Rum",
      ar: "أبرز معالم الأردن ومخيم وادي رم البيئي",
    },
    duration: {
      en: "6 days / 5 nights",
      es: "6 días / 5 noches",
      pt: "6 dias / 5 noites",
      it: "6 giorni / 5 notti",
      ar: "6 أيام / 5 ليالٍ",
    },
    overview: {
      en: "A condensed journey featuring the Treasury of Petra, Bedouin desert hospitality, and Roman Jerash.",
      es: "Un viaje selecto que incluye el Tesoro de Petra, la hospitalidad beduina en el desierto y Jerash romana.",
      pt: "Uma viagem selecionada incluindo o Tesouro de Petra, a hospitalidade beduína no deserto e Jerash romana.",
      it: "Un viaggio selezionato tra il Tesoro di Petra, l'ospitalità beduina nel deserto e Jerash romana.",
      ar: "رحلة منتقاة تشمل خزنة البتراء والضيافة البدوية في الصحراء وجرش الرومانية.",
    },
    price: 1150,
    images: ["https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=500&q=75&fm=webp"],
  },
];

export const homeDubaiPreviewTours = [
  {
    id: "REG-22",
    slug: "reg-22-dubai-desert-safari",
    name: {
      en: "Dubai Stopover & Desert Safari",
      es: "Escala en Dubái y Safari por el Desierto",
      pt: "Escala em Dubai e Safari no Deserto",
      it: "Scalo a Dubai e Safari nel Deserto",
      ar: "استراحة دبي وسفاري الصحراء",
    },
    duration: {
      en: "3 days / 2 nights",
      es: "3 días / 2 noches",
      pt: "3 dias / 2 noites",
      it: "3 giorni / 2 notti",
      ar: "3 أيام / 2 ليالٍ",
    },
    overview: {
      en: "Ultra-luxury modern Dubai escape featuring 4x4 dune bashing, oriental camp banquet, and skyline views.",
      es: "Escapada de lujo en Dubái con safari 4x4 por las dunas, cena oriental en el campamento y vistas al skyline.",
      pt: "Escapadela de luxo em Dubai com safari 4x4 nas dunas, jantar oriental e vistas para a cidade.",
      it: "Fuga di lusso a Dubai con safari 4x4 tra le dune, cena orientale nel deserto e viste panoramiche.",
      ar: "إقامة فاخرة في دبي تشمل سفاري بسيارات 4x4 في الكثبان الرملية وعشاء شرقي وإطلالات مذهلة.",
    },
    price: 490,
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=75&fm=webp"],
  },
  {
    id: "REG-23",
    slug: "reg-23-dubai-city-of-the-future",
    name: {
      en: "Dubai, City of the Future",
      es: "Dubái, Ciudad del Futuro",
      pt: "Dubai, Cidade do Futuro",
      it: "Dubai, Città del Futuro",
      ar: "دبي، مدينة المستقبل",
    },
    duration: {
      en: "4 days / 3 nights",
      es: "4 días / 3 noches",
      pt: "4 dias / 3 noites",
      it: "4 giorni / 3 notti",
      ar: "4 أيام / 3 ليالٍ",
    },
    overview: {
      en: "Explore Museum of the Future, historical Bastakiya gold & spice souks, and evening desert safari.",
      es: "Explore el Museo del Futuro, los zocos históricos de oro y especias de Bastakiya y el safari nocturno.",
      pt: "Explore o Museu do Futuro, os mercados históricos de ouro e especiarias de Bastakiya e safari noturno.",
      it: "Esplora il Museo del Futuro, gli storici souk di Bastakiya e il safari serale nel deserto.",
      ar: "استكشف متحف المستقبل وأسواق الذهب والتوابل التاريخية في البستكية وسفاري صحراوي ساحر.",
    },
    price: 690,
    images: ["https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=500&q=75&fm=webp"],
  },
];
