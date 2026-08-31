/**
 * Resolve canonical Backend text without consulting a local tour catalogue.
 *
 * The customer application may still receive translation keys from legacy
 * records, so the i18n resolver is retained. Static tour/program title maps
 * are intentionally not used at runtime: the API response is authoritative.
 */
export function resolveLocalizedText(val, t = (key) => key, lang = 'en') {
  if (!val) return '';

  if (typeof val === 'object' && val !== null) {
    return val[lang] || val.en || val.ar || val.es || Object.values(val)[0] || '';
  }

  if (typeof val !== 'string') return String(val);

  const cleanVal = val.trim();
  const safeT = typeof t === 'function' ? t : (k) => k;

  const direct = safeT(cleanVal);
  if (direct && direct !== cleanVal) return direct;

  if (!cleanVal.startsWith('data.')) {
    const dataPrefixed = safeT(`data.${cleanVal}`);
    if (dataPrefixed && dataPrefixed !== `data.${cleanVal}`) return dataPrefixed;
  }

  if (cleanVal.startsWith('data.')) {
    const stripped = cleanVal.replace(/^data\./, '');
    const translatedStripped = safeT(stripped);
    if (translatedStripped && translatedStripped !== stripped) return translatedStripped;
  }

  return cleanVal.startsWith('data.') ? cleanVal.replace(/^data\./, '') : cleanVal;
}

export function resolveTourTitle(tour, t, lang = 'en') {
  if (!tour) return '';
  const safeT = typeof t === 'function' ? t : (k) => k;
  if (tour.titleKey) {
    const translated = safeT(tour.titleKey);
    if (translated && translated !== tour.titleKey) return translated;
  }
  return resolveLocalizedText(tour.title || tour.name || tour.slug, safeT, lang);
}

export function resolveTourOverview(tour, t, lang = 'en') {
  if (!tour) return '';
  const safeT = typeof t === 'function' ? t : (k) => k;
  const val = tour.overview || tour.description || tour.desc || tour.overviewKey;
  return resolveLocalizedText(val, safeT, lang);
}

export function resolveTourDuration(tour, t, lang = 'en') {
  if (!tour) return '';
  const safeT = typeof t === 'function' ? t : (k) => k;
  const val = tour.duration || tour.durationKey;
  return resolveLocalizedText(val, safeT, lang);
}

const ITINERARY_DAY_DICTIONARY = {
  "cairo": { ar: "القاهرة", en: "Cairo", es: "El Cairo", pt: "Cairo", it: "Il Cairo" },
  "the cairo": { ar: "القاهرة", en: "Cairo", es: "El Cairo", pt: "Cairo", it: "Il Cairo" },
  "giza": { ar: "الجيزة", en: "Giza", es: "Giza", pt: "Gizé", it: "Giza" },
  "luxor": { ar: "الأقصر", en: "Luxor", es: "Luxor", pt: "Luxor", it: "Luxor" },
  "aswan": { ar: "أسوان", en: "Aswan", es: "Asuán", pt: "Aswan", it: "Aswan" },
  "alexandria": { ar: "الإسكندرية", en: "Alexandria", es: "Alejandría", pt: "Alexandria", it: "Alessandria" },
  "hurghada": { ar: "الغردقة", en: "Hurghada", es: "Hurghada", pt: "Hurghada", it: "Hurghada" },
  "sharm": { ar: "شرم الشيخ", en: "Sharm El Sheikh", es: "Sharm El Sheikh", pt: "Sharm El Sheikh", it: "Sharm El Sheikh" },
  "sharm el sheikh": { ar: "شرم الشيخ", en: "Sharm El Sheikh", es: "Sharm El Sheikh", pt: "Sharm El Sheikh", it: "Sharm El Sheikh" },
  "edfu": { ar: "إدفو", en: "Edfu", es: "Edfu", pt: "Edfu", it: "Edfu" },
  "kom ombo": { ar: "كوم أمبو", en: "Kom Ombo", es: "Kom Ombo", pt: "Kom Ombo", it: "Kom Ombo" },
  "abu simbel": { ar: "أبو سمبل", en: "Abu Simbel", es: "Abu Simbel", pt: "Abu Simbel", it: "Abu Simbel" },
  "siwa": { ar: "سيوة", en: "Siwa", es: "Siwa", pt: "Siwa", it: "Siwa" },
  "desert": { ar: "الصحراء الكبرى", en: "The Great Sahara Desert", es: "El Gran Desierto", pt: "O Grande Deserto", it: "Il Grande Deserto" },
  "marsa": { ar: "مرسى مطروح", en: "Marsa Matruh", es: "Marsa Matruh", pt: "Marsa Matruh", it: "Marsa Matruh" },
  "el minya": { ar: "المنيا", en: "El Minya", es: "El Minya", pt: "El Minya", it: "El Minya" },
  "asiut": { ar: "أسيوط", en: "Asiut", es: "Asiut", pt: "Asiut", it: "Asiut" },
  "wadi el natroun": { ar: "وادي النطرون", en: "Wadi El Natrun", es: "Wadi El Natrun", pt: "Wadi El Natrun", it: "Wadi El Natrun" },
  "wadi natrun": { ar: "وادي النطرون", en: "Wadi El Natrun", es: "Wadi El Natrun", pt: "Wadi El Natrun", it: "Wadi El Natrun" },
  "istanbul": { ar: "إسطنبول", en: "Istanbul", es: "Estambul", pt: "Istambul", it: "Istanbul" },
  "cappadocia": { ar: "كابادوكيا", en: "Cappadocia", es: "Capadocia", pt: "Capadócia", it: "Cappadocia" },
  "ankara": { ar: "أنقرة", en: "Ankara", es: "Ankara", pt: "Ancara", it: "Ankara" },
  "pamukkale": { ar: "باموكالي", en: "Pamukkale", es: "Pamukkale", pt: "Pamukkale", it: "Pamukkale" },
  "ephesus": { ar: "أفسس", en: "Ephesus", es: "Éfeso", pt: "Éfeso", it: "Efeso" },
  "bursa": { ar: "بورصة", en: "Bursa", es: "Bursa", pt: "Bursa", it: "Bursa" },
  "izmir": { ar: "إزمير", en: "Izmir", es: "Esmirna", pt: "Izmir", it: "Smirne" },
  "izmir zone": { ar: "منطقة إزمير", en: "Izmir Region", es: "Zona de Esmirna", pt: "Região de Izmir", it: "Area di Smirne" },
  "konya": { ar: "قونية", en: "Konya", es: "Konya", pt: "Konya", it: "Konya" },
  "dubai": { ar: "دبي", en: "Dubai", es: "Dubái", pt: "Dubai", it: "Dubai" },
  "abu dhabi": { ar: "أبو ظبي", en: "Abu Dhabi", es: "Abu Dabi", pt: "Abu Dhabi", it: "Abu Dhabi" },
  "sharjah": { ar: "الشارقة", en: "Sharjah", es: "Sharjah", pt: "Sharjah", it: "Sharjah" },
  "amman": { ar: "عمّان", en: "Amman", es: "Ammán", pt: "Amã", it: "Amman" },
  "petra": { ar: "البتراء", en: "Petra", es: "Petra", pt: "Petra", it: "Petra" },
  "little petra": { ar: "البتراء الصغيرة", en: "Little Petra", es: "Pequeña Petra", pt: "Pequena Petra", it: "Piccola Petra" },
  "wadi rum": { ar: "وادي رم", en: "Wadi Rum", es: "Wadi Rum", pt: "Wadi Rum", it: "Wadi Rum" },
  "madaba": { ar: "مأدبا", en: "Madaba", es: "Mádaba", pt: "Madaba", it: "Madaba" },
  "mount nebo": { ar: "جبل نيبو", en: "Mount Nebo", es: "Monte Nebo", pt: "Monte Nebo", it: "Monte Nebo" },
  "nebo": { ar: "نيبو", en: "Nebo", es: "Nebo", pt: "Nebo", it: "Nebo" },
  "shoubak": { ar: "قلعة الشوبك", en: "Shobak Castle", es: "Castillo de Shobak", pt: "Castelo de Shobak", it: "Castello di Shobak" },
  "shoubak castle": { ar: "قلعة الشوبك", en: "Shobak Castle", es: "Castillo de Shobak", pt: "Castelo de Shobak", it: "Castello di Shobak" },
  "shobak": { ar: "الشوبك", en: "Shobak", es: "Shobak", pt: "Shobak", it: "Shobak" },
  "tunis": { ar: "تونس العاصمة", en: "Tunis", es: "Túnez", pt: "Túnis", it: "Tunisi" },
  "carthage": { ar: "قرطاج", en: "Carthage", es: "Cartago", pt: "Cartago", it: "Cartagine" },
  "sidi bou said": { ar: "سيدي بو سعيد", en: "Sidi Bou Said", es: "Sidi Bou Said", pt: "Sidi Bou Said", it: "Sidi Bou Said" },
  "medina": { ar: "المدينة العتيقة", en: "The Medina", es: "La Medina", pt: "A Medina", it: "La Medina" },
  "hammamet": { ar: "الحمامات", en: "Hammamet", es: "Hammamet", pt: "Hammamet", it: "Hammamet" },
  "hammamet beach zone": { ar: "شواطئ ومنتجعات الحمامات", en: "Hammamet Beach Resorts", es: "Zona de Playas de Hammamet", pt: "Praias de Hammamet", it: "Spiagge di Hammamet" },
  "kairouan": { ar: "القيروان", en: "Kairouan", es: "Kairuán", pt: "Kairouan", it: "Kairouan" },
  "tozeur": { ar: "توزر", en: "Tozeur", es: "Tozeur", pt: "Tozeur", it: "Tozeur" },
  "douz": { ar: "دوز", en: "Douz", es: "Douz", pt: "Douz", it: "Douz" },
  "matmata": { ar: "مطماطة", en: "Matmata", es: "Matmata", pt: "Matmata", it: "Matmata" },
  "el jem": { ar: "الجم", en: "El Jem", es: "El Djem", pt: "El Jem", it: "El Jem" },
  "chott el jerid": { ar: "شط الجريد", en: "Chott el Djerid", es: "Chott el Djerid", pt: "Chott el Djerid", it: "Chott el Djerid" },
  "chebika": { ar: "الشبيكة", en: "Chebika", es: "Chebika", pt: "Chebika", it: "Chebika" },
  "ong jmel": { ar: "عنق الجمل", en: "Ong Jmal", es: "Ong Jmel", pt: "Ong Jmel", it: "Ong Jmel" },
  "testour": { ar: "تستور", en: "Testour", es: "Testour", pt: "Testour", it: "Testour" },
  "dougga": { ar: "دقة الأثرية", en: "Dougga", es: "Dougga", pt: "Dougga", it: "Dougga" },
  "athens": { ar: "أثينا", en: "Athens", es: "Atenas", pt: "Atenas", it: "Atene" },
  "santorini": { ar: "سانتوريني", en: "Santorini", es: "Santorini", pt: "Santorini", it: "Santorini" },
  "mykonos": { ar: "ميكونوس", en: "Mykonos", es: "Mikonos", pt: "Mykonos", it: "Mykonos" },
  "crete": { ar: "جزيرة كريت", en: "Crete", es: "Isla de Creta", pt: "Ilha de Creta", it: "Isola di Creta" },
  "heraklion": { ar: "هيراكليون", en: "Heraklion", es: "Heraclión", pt: "Heraklion", it: "Heraklion" },
  "piraeus": { ar: "بيرايوس", en: "Piraeus", es: "El Pireo", pt: "Pireu", it: "Pireo" },
  "marrakech": { ar: "مراكش", en: "Marrakech", es: "Marrakech", pt: "Marrakech", it: "Marrakech" },
  "casablanca": { ar: "الدار البيضاء", en: "Casablanca", es: "Casablanca", pt: "Casablanca", it: "Casablanca" },
  "rabat": { ar: "الرباط", en: "Rabat", es: "Rabat", pt: "Rabat", it: "Rabat" },
  "fez": { ar: "فاس", en: "Fez", es: "Fez", pt: "Fez", it: "Fez" },
  "tangier": { ar: "طنجة", en: "Tangier", es: "Tánger", pt: "Tânger", it: "Tangeri" },
  "meknes": { ar: "مكناس", en: "Meknes", es: "Mequinez", pt: "Meknes", it: "Meknes" },
  "tarifa": { ar: "طريفة", en: "Tarifa", es: "Tarifa", pt: "Tarifa", it: "Tarifa" },
  "costa del sol": { ar: "كوستا ديل سول", en: "Costa del Sol", es: "Costa del Sol", pt: "Costa del Sol", it: "Costa del Sol" },
  "madrid": { ar: "مدريد", en: "Madrid", es: "Madrid", pt: "Madri", it: "Madrid" },
  "barcelona": { ar: "برشلونة", en: "Barcelona", es: "Barcelona", pt: "Barcelona", it: "Barcellona" },
  "brazil": { ar: "البرازيل", en: "Brazil", es: "Brasil", pt: "Brasil", it: "Brasile" },
  "airport": { ar: "المطار الدولي", en: "International Airport", es: "Aeropuerto Internacional", pt: "Aeroporto Internacional", it: "Aeroporto Internazionale" },
  "aeroporto": { ar: "المطار الدولي", en: "International Airport", es: "Aeropuerto Internacional", pt: "Aeroporto Internacional", it: "Aeroporto Internazionale" },
  "destination": { ar: "وجهة الوصول", en: "Destination", es: "Destino", pt: "Destino", it: "Destinazione" },
  "city of origin": { ar: "مدينة المغادرة", en: "City of Origin", es: "Ciudad de Origen", pt: "Cidade de Origem", it: "Città di Origine" },
  "parent country": { ar: "بلد المغادرة", en: "Country of Origin", es: "País de Origen", pt: "País de Origem", it: "Paese d'Origine" },
  "country of origin": { ar: "بلد المغادرة", en: "Country of Origin", es: "País de Origen", pt: "País de Origem", it: "Paese d'Origine" }
};

export function resolveItineraryDayTitle(day, t = (k) => k, lang = 'en') {
  if (!day) return '';
  const val = day.titleJsonb || day.title || day.dayLabel || day.label || (typeof day === 'string' ? day : '');
  
  if (typeof val === 'object' && val !== null) {
    const directObj = val[lang] || val.en || val.ar || val.es || Object.values(val)[0] || '';
    if (directObj) return directObj;
  }

  let str = String(val).trim();
  if (!str) return '';

  // Clean prefix
  str = str.replace(/^(sun|mon|tue|wed|thu|fri|sat)\s*-\s*\d+(st|nd|rd|th)?\s*day[:.]?\s*/i, '');
  str = str.replace(/^\d+(st|nd|rd|th)\s*day[:.]?\s*/i, '');
  str = str.replace(/^day\s*\d+[:.]?\s*/i, '');
  str = str.replace(/^dia\s*\d+[:.]?\s*/i, '');
  str = str.replace(/^giorno\s*\d+[:.]?\s*/i, '');
  str = str.replace(/^اليوم\s*\d+[:.]?\s*/i, '');
  str = str.replace(/\.$/, '').trim();

  if (!str || /^(day|dia|giorno|اليوم)\s*\d*$/i.test(str)) {
    return '';
  }

  const lower = str.toLowerCase();

  // Arrival
  if (/^(arrival|international arrival|arrival in|arrival at)/i.test(lower)) {
    if (lower.includes('cairo')) {
      return lang === 'ar' ? 'الوصول إلى مطار القاهرة الدولي والاستقبال' : lang === 'es' ? 'Llegada al Aeropuerto de El Cairo y Bienvenida VIP' : lang === 'pt' ? 'Chegada ao Aeroporto do Cairo e Boas-Vindas VIP' : lang === 'it' ? 'Arrivo all\'Aeroporto del Cairo e Benvenuto VIP' : 'Arrival at Cairo International Airport & VIP Welcome';
    }
    if (lower.includes('istanbul')) {
      return lang === 'ar' ? 'الوصول إلى مطار إسطنبول الدولي والاستقبال' : lang === 'es' ? 'Llegada a Estambul y Traslado al Hotel' : lang === 'pt' ? 'Chegada a Istambul e Traslado ao Hotel' : lang === 'it' ? 'Arrivo a Istanbul e Trasferimento in Hotel' : 'Arrival in Istanbul & Transfer to Hotel';
    }
    if (lower.includes('athens')) {
      return lang === 'ar' ? 'الوصول إلى مطار أثينا الدولي والاستقبال' : lang === 'es' ? 'Llegada a Atenas y Traslado al Hotel' : lang === 'pt' ? 'Chegada a Atenas e Traslado ao Hotel' : lang === 'it' ? 'Arrivo ad Atene e Trasferimento in Hotel' : 'Arrival in Athens & Transfer to Hotel';
    }
    if (lower.includes('amman')) {
      return lang === 'ar' ? 'الوصول إلى مطار عمّان الدولي والاستقبال' : lang === 'es' ? 'Llegada a Ammán y Traslado VIP' : lang === 'pt' ? 'Chegada a Amã e Traslado VIP' : lang === 'it' ? 'Arrivo ad Amman e Trasferimento VIP' : 'Arrival in Amman & VIP Transfer';
    }
    return lang === 'ar' ? 'الوصول الدولي والاستقبال والترحاب' : lang === 'es' ? 'Llegada Internacional y Traslado VIP' : lang === 'pt' ? 'Chegada Internacional e Traslado VIP' : lang === 'it' ? 'Arrivo Internazionale e Trasferimento VIP' : 'International Arrival & VIP Welcome';
  }

  // Pyramids, Sphinx, Saqqara, Memphis
  if (lower.includes('pyramid') || lower.includes('sphinx') || lower.includes('giza')) {
    if (lower.includes('memphis') || lower.includes('saqqara') || lower.includes('sakkara') || lower.includes('papyrus')) {
      return lang === 'ar' ? 'أهرامات الجيزة، تمثال أبو الهول، مصنع البردي، ممفيس وسقارة' : lang === 'es' ? 'Pirámides de Giza, Esfinge, Menfis y Sakkara' : lang === 'pt' ? 'Pirâmides de Gizé, Esfinge, Memphis e Sakkara' : lang === 'it' ? 'Piramidi di Giza, Sfinge, Menfi e Saqqara' : 'Giza Pyramids, Sphinx, Papyrus Factory, Memphis & Saqqara';
    }
    if (lower.includes('grand egyptian') || lower.includes('gem') || lower.includes('new museum')) {
      return lang === 'ar' ? 'أهرامات الجيزة، أبو الهول والمتحف المصري الكبير (GEM)' : lang === 'es' ? 'Pirámides de Giza, Esfinge y Gran Museo Egipcio (GEM)' : lang === 'pt' ? 'Pirâmides de Gizé, Esfinge e Grande Museu Egípcio (GEM)' : lang === 'it' ? 'Piramidi di Giza, Sfinge e Grande Museo Egizio (GEM)' : 'Pyramids of Giza, Sphinx & Grand Egyptian Museum';
    }
    return lang === 'ar' ? 'أهرامات الجيزة الخالدة وتمثال أبو الهول ومصنع أوراق البردي' : lang === 'es' ? 'Pirámides de Giza, Esfinge y Fábrica de Papiros' : lang === 'pt' ? 'Pirâmides de Gizé, Esfinge e Fábrica de Papiros' : lang === 'it' ? 'Piramidi di Giza, Sfinge e Fabbrica di Papiri' : 'Giza Pyramids, Sphinx & Papyrus Institute';
  }

  // GEM, Citadel, Khan el-Khalili
  if (lower.includes('museum') && (lower.includes('alabaster') || lower.includes('mosque') || lower.includes('khan') || lower.includes('coptic'))) {
    return lang === 'ar' ? 'المتحف الكبير، جامع محمد علي بقلعة صلاح الدين وخان الخليلي' : lang === 'es' ? 'Gran Museo Egipcio, Ciudadela y Bazar de Jan el-Jalili' : lang === 'pt' ? 'Grande Museu Egípcio, Cidadela e Bazar Khan El-Khalili' : lang === 'it' ? 'Grande Museo Egizio, Cittadella e Bazar Khan El-Khalili' : 'Grand Egyptian Museum, Citadel & Khan El-Khalili';
  }

  // Nile Cruise
  if (lower.includes('nile cruise')) {
    return lang === 'ar' ? 'الإبحار على متن باخرة النايل كروز الفاخرة (إقامة كاملة)' : lang === 'es' ? 'Navegación en Crucero de Lujo por el Nilo (Pensión Completa)' : lang === 'pt' ? 'Navegação em Cruzeiro de Luxo pelo Nilo (Pensão Completa)' : lang === 'it' ? 'Navigazione in Crociera di Lusso sul Nilo (Pensione Completa)' : 'Luxury Nile Cruise Sailing (Full Board)';
  }

  // Luxor, Karnak, Valley of Kings
  if (lower.includes('luxor') && (lower.includes('karnak') || lower.includes('valley of the kings') || lower.includes('memnon') || lower.includes('hatshepsut'))) {
    return lang === 'ar' ? 'الأقصر: وادي الملوك، تمثالا ممنون، معبد حتشبسوت ومعابد الكرنك' : lang === 'es' ? 'Luxor: Valle de los Reyes, Colosos de Memnón, Hatshepsut y Karnak' : lang === 'pt' ? 'Luxor: Vale dos Reis, Colossos de Memnon, Hatshepsut e Karnak' : lang === 'it' ? 'Luxor: Valle dei Re, Colossi di Memnone, Hatshepsut e Karnak' : 'Luxor: Valley of the Kings, Colossi of Memnon & Karnak Temples';
  }

  if (lower.includes('valley of the kings') || (lower.includes('karnak') && lower.includes('luxor'))) {
    return lang === 'ar' ? 'الأقصر: وادي الملوك، تمثالا ممنون ومعابد الكرنك' : lang === 'es' ? 'Luxor: Valle de los Reyes, Colosos de Memnón y Karnak' : lang === 'pt' ? 'Luxor: Vale dos Reis, Colossos de Memnon e Karnak' : lang === 'it' ? 'Luxor: Valle dei Re, Colossi di Memnone e Karnak' : 'Luxor: Valley of the Kings, Colossi of Memnon & Karnak';
  }

  // Edfu & Kom Ombo
  if (lower.includes('edfu') && lower.includes('kom ombo')) {
    return lang === 'ar' ? 'الإبحار وزيارة معبد إدفو (حورس) ومعبد كوم أمبو (سوبيك)' : lang === 'es' ? 'Navegación y Visita a los Templos de Edfu y Kom Ombo' : lang === 'pt' ? 'Navegação e Visita aos Templos de Edfu e Kom Ombo' : lang === 'it' ? 'Navigazione e Visita ai Templi di Edfu e Kom Ombo' : 'Sailing & Visit to Edfu and Kom Ombo Temples';
  }

  // Aswan High Dam & Philae
  if (lower.includes('aswan') && (lower.includes('high dam') || lower.includes('philae') || lower.includes('obelisk'))) {
    return lang === 'ar' ? 'أسوان: السد العالي، معبد فيلة الرائع والمسلة الناقصة' : lang === 'es' ? 'Asuán: Presa Alta, Templo de Filae y Obelisco Inacabado' : lang === 'pt' ? 'Aswan: Represa Alta, Templo de Philae e Obelisco Inacabado' : lang === 'it' ? 'Aswan: Grande Diga, Tempio di File e Obelisco Incompiuto' : 'Aswan: High Dam, Philae Temple & Unfinished Obelisk';
  }

  // Abu Simbel
  if (lower.includes('abu simbel')) {
    return lang === 'ar' ? 'رحلة معبدي أبو سمبل الخالدين للملك رمسيس الثاني ونفرتاري' : lang === 'es' ? 'Excursión a los Templos de Abu Simbel' : lang === 'pt' ? 'Excursão aos Templos de Abu Simbel' : lang === 'it' ? 'Escursione ai Templi di Abu Simbel' : 'Abu Simbel Grand Temples Excursion';
  }

  // Red Sea / Hurghada / Sharm
  if (lower.includes('beach') || lower.includes('hurghada') || (lower.includes('sharm') && !lower.includes('airport') && !lower.includes('cairo'))) {
    const isHurghada = lower.includes('hurghada');
    return lang === 'ar' ? (isHurghada ? 'الغردقة: الاسترخاء في منتجع البحر الأحمر الفاخر (إقامة شاملة)' : 'شرم الشيخ: الاسترخاء على شواطئ البحر الأحمر الفاخرة (إقامة شاملة)')
      : lang === 'es' ? (isHurghada ? 'Hurghada: Relax en Resort de Lujo en el Mar Rojo (Todo Incluido)' : 'Sharm El Sheikh: Estancia de Lujo en la Playa (Todo Incluido)')
      : lang === 'pt' ? (isHurghada ? 'Hurghada: Relaxamento em Resort de Luxo no Mar Vermelho (Tudo Incluído)' : 'Sharm El Sheikh: Resort de Luxo na Praia (Tudo Incluído)')
      : lang === 'it' ? (isHurghada ? 'Hurghada: Relax in Resort di Lusso sul Mar Rosso (All-Inclusive)' : 'Sharm El Sheikh: Soggiorno di Lusso sul Mar Rosso (All-Inclusive)')
      : (isHurghada ? 'Hurghada: Luxury Red Sea Resort Relaxation (All-Inclusive)' : 'Sharm El Sheikh: Red Sea Luxury Beach Stay (All-Inclusive)');
  }

  // Departure & Airport
  if (lower.includes('disembarkation') || lower.includes('return flight') || lower.includes('departure') || lower.includes('country of origin') || (lower.includes('airport') && !lower.includes('arrival'))) {
    return lang === 'ar' ? 'الإفطار والانتقال إلى المطار لرحلة العودة الدولية' : lang === 'es' ? 'Desayuno y Traslado al Aeropuerto para Vuelo de Regreso' : lang === 'pt' ? 'Café da Manhã e Traslado ao Aeroporto para Voo de Retorno' : lang === 'it' ? 'Colazione e Trasferimento in Aeroporto per il Volo di Ritorno' : 'Breakfast & Transfer to Airport for Return Flight';
  }

  // Multi-City Slash resolution
  const splitDelim = str.includes('/') ? '/' : str.includes('–') ? '–' : str.includes('-') ? '-' : null;
  if (splitDelim) {
    const parts = str.split(splitDelim).map(p => p.trim().toLowerCase());
    const translatedParts = parts.map(p => {
      const entry = ITINERARY_DAY_DICTIONARY[p];
      return entry ? entry[lang] || entry.en || p : p.charAt(0).toUpperCase() + p.slice(1);
    });
    return translatedParts.join(' / ');
  }

  // Single city
  const cityEntry = ITINERARY_DAY_DICTIONARY[lower];
  if (cityEntry) {
    return cityEntry[lang] || cityEntry.en || str;
  }

  return resolveLocalizedText(str, t, lang);
}

export default {
  resolveLocalizedText,
  resolveTourTitle,
  resolveTourOverview,
  resolveTourDuration,
  resolveItineraryDayTitle,
};
