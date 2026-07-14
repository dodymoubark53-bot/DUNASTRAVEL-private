const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/programs.json');
const raw = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(raw);

const reg10 = {
  "id": "REG-10",
  "name": {
    "ar": "الريفيرا التركية مع فتحية",
    "en": "Turkish Riviera with Fethiye",
    "es": "Riviera Turca con Fethiye",
    "it": "Riviera Turca con Fethiye",
    "pt": "Riviera Turca com Fethiye"
  },
  "duration": {
    "ar": "13 يوماً / 12 ليلة",
    "en": "13 Days / 12 Nights",
    "es": "13 Días / 12 Noches",
    "it": "13 Giorni / 12 Notti",
    "pt": "13 Dias / 12 Noites"
  },
  "highlights": {
    "ar": "إسطنبول | كابادوكيا | باموكالي | أفسس | بودروم | فتحية",
    "en": "Istanbul | Cappadocia | Pamukkale | Ephesus | Bodrum | Fethiye",
    "es": "Estambul | Capadocia | Pamukkale | Éfeso | Bodrum | Fethiye",
    "it": "Istanbul | Cappadocia | Pamukkale | Efeso | Bodrum | Fethiye",
    "pt": "Istambul | Capadócia | Pamukkale | Éfeso | Bodrum | Fethiye"
  },
  "overview": {
    "ar": "رحلة شاملة تمتد على 13 يوماً تجمع بين تاريخ إسطنبول، سحر كابادوكيا، جمال باموكالي الأبيض، عظمة أفسس، واسترخاء بودروم وفتحية على ساحل البحر الأبيض المتوسط.",
    "en": "A comprehensive 13-day journey combining the history of Istanbul, the magic of Cappadocia, the white beauty of Pamukkale, the grandeur of Ephesus, and relaxation in Bodrum and Fethiye on the Mediterranean coast.",
    "es": "Un completo viaje de 13 días que combina la historia de Estambul, la magia de Capadocia, la belleza blanca de Pamukkale, la grandeza de Éfeso y la relajación en Bodrum y Fethiye en la costa mediterránea.",
    "it": "Un completo viaggio di 13 giorni che combina la storia di Istanbul, la magia della Cappadocia, la bellezza bianca di Pamukkale, la grandiosità di Efeso e il relax a Bodrum e Fethiye sulla costa mediterranea.",
    "pt": "Uma viagem abrangente de 13 dias combinando a história de Istambul, a magia da Capadócia, a beleza branca de Pamukkale, a grandeza de Éfeso e relaxamento em Bodrum e Fethiye na costa do Mediterrâneo."
  },
  "code": {
    "ar": "REG-10",
    "en": "REG-10",
    "es": "REG-10",
    "it": "REG-10",
    "pt": "REG-10"
  },
  "minPax": {
    "ar": "2 شخص",
    "en": "2 pax",
    "es": "2 pax",
    "it": "2 pax",
    "pt": "2 pax"
  },
  "slug": "reg-10-turkish-riviera-with-fethiye",
  "days": [
    {
      "day": "1",
      "meals": {
        "pt": "Refeições no hotel",
        "it": "Pasti in hotel",
        "en": "Meals at hotel",
        "ar": "وجبات بالفندق",
        "es": "Comidas en el hotel"
      },
      "description": {
        "ar": "اليوم الأول — الوصول إلى إسطنبول\nالوصول والمساعدة. النقل إلى الفندق. الإقامة في الفندق.",
        "en": "Day 1 — Arrival in Istanbul\nArrival and assistance. Transfer to the hotel. Accommodation at the hotel.",
        "es": "1 Día — Llegada a Estambul\nLlegada y asistencia. Traslado al hotel. Alojamiento en el hotel.",
        "it": "1° Giorno — Arrivo a Istanbul\nArrivo e assistenza. Trasferimento in hotel. Sistemazione in hotel.",
        "pt": "1º Dia — Chegada a Istambul\nChegada e assistência. Transfer para o hotel. Hospedagem no hotel."
      }
    },
    {
      "day": "2",
      "meals": {
        "pt": "Café da manhã",
        "it": "Colazione",
        "en": "Breakfast",
        "ar": "إفطار",
        "es": "Desayuno"
      },
      "description": {
        "ar": "اليوم الثاني — إسطنبول (أسوار القسطنطينية، مسجد رستم باشا، بازار التوابل)\nإفطار في الفندق. صباحاً، الانطلاق لرؤية أسوار القسطنطينية القديمة، زيارة مسجد رستم باشا الذي صممه المهندس المعماري الإمبراطوري سنان آغا للصدر الأعظم رستم باشا (زوج إحدى بنات سليمان القانوني، السلطانة مهرماه). زيارة البازار المصري أو بازار التوابل الذي بُني في القرن السابع عشر في حي أمنونو التاريخي القديم في إسطنبول. ثم إمكانية القيام برحلة اختيارية \"لآلئ إسطنبول\". العودة إلى الفندق على نفقة العميل.\nالوجبات: إفطار",
        "en": "Day 2 — Istanbul (Ancient Walls, Rüstem Pasha Mosque, Spice Bazaar)\nBreakfast at the hotel. Morning departure to see the ancient Walls of Constantinople, visit to Rüstem Pasha Mosque. The mosque was designed by the imperial architect Mimar Sinan for the Grand Vizier Damat Rüstem Pasha (husband of one of Suleiman the Magnificent's daughters, Sultan Mihrimah). Visit to the Egyptian Bazaar or Spice Bazaar built in the 17th century and located in the old historic district of Eminönü in Istanbul. Then possibility of an optional excursion \"Pearls of Istanbul\". Return to the hotel at the client's own expense.\nMeals: Breakfast",
        "es": "2 Día — Estambul (Murallas Antiguas, Mezquita de Rüstem Pasha, Bazar de las Especias)\nDesayuno en el hotel. Por la mañana salida para contemplar las antiguas Murallas de Constantinopla, visita a la Mezquita de Rüstem Pasha. La mezquita fue diseñada por el arquitecto imperial Mimar Sinan para el Gran Visir Damat Rüstem Pasha (marido de una de las hijas de Suleiman el Magnífico, la Sultana Mihrimah). Visita al Bazar Egipcio o Bazar de las Especias construido en el siglo XVII y situado en el antiguo barrio histórico de Eminönü en Estambul. Luego posibilidad de tener una excursión opcional \"Perlas de Estambul\". Regreso al hotel por cuenta del cliente.\nComidas: Desayuno",
        "it": "2° Giorno — Istanbul (Mura Antiche, Moschea di Rüstem Pasha, Bazar delle Spezie)\nColazione in hotel. Partenza mattutina per ammirare le antiche Mura di Costantinopoli, visita alla Moschea di Rüstem Pasha. La moschea fu progettata dall'architetto imperiale Mimar Sinan per il Gran Visir Damat Rüstem Pasha (marito di una delle figlie di Solimano il Magnifico, la Sultana Mihrimah). Visita al Bazar Egiziano o Bazar delle Spezie costruito nel XVII secolo e situato nel vecchio quartiere storico di Eminönü a Istanbul. Poi possibilità di un'escursione opzionale \"Perle di Istanbul\". Rientro in hotel a proprie spese.\nPasti: Colazione",
        "pt": "2º Dia — Istambul (Muralhas Antigas, Mesquita de Rüstem Pasha, Bazar das Especiarias)\nCafé da manhã no hotel. Saída pela manhã para contemplar as antigas Muralhas de Constantinopla, visita à Mesquita de Rüstem Pasha. A mesquita foi projetada pelo arquiteto imperial Mimar Sinan para o Grão-Vizir Damat Rüstem Pasha (marido de uma das filhas de Suleiman, o Magnífico, a Sultana Mihrimah). Visita ao Bazar Egípcio ou Bazar das Especiarias construído no século XVII e situado no antigo bairro histórico de Eminönü em Istambul. Depois possibilidade de uma excursão opcional \"Pérolas de Istambul\". Retorno ao hotel por conta do cliente.\nRefeições: Café da manhã"
      }
    },
    {
      "day": "3",
      "meals": {
        "pt": "Café da manhã",
        "it": "Colazione",
        "en": "Breakfast",
        "ar": "إفطار",
        "es": "Desayuno"
      },
      "description": {
        "ar": "اليوم الثالث — إسطنبول (يوم حر)\nإفطار ويوم حر، أو إمكانية القيام بجولة كلاسيكية في المدينة.\nالوجبات: إفطار",
        "en": "Day 3 — Istanbul (Free Day)\nBreakfast and free day, or possibility of taking a classic tour of the city.\nMeals: Breakfast",
        "es": "3 Día — Estambul (Día Libre)\nDesayuno y día libre, o posibilidad de tomar un tour clásico por la ciudad.\nComidas: Desayuno",
        "it": "3° Giorno — Istanbul (Giorno Libero)\nColazione e giorno libero, o possibilità di fare un tour classico della città.\nPasti: Colazione",
        "pt": "3º Dia — Istambul (Dia Livre)\nCafé da manhã e dia livre, ou possibilidade de fazer um tour clássico pela cidade.\nRefeições: Café da manhã"
      }
    },
    {
      "day": "4",
      "meals": {
        "pt": "Café da manhã (breakfast box) + Jantar",
        "it": "Colazione (breakfast box) + Cena",
        "en": "Breakfast (breakfast box) + Dinner",
        "ar": "إفطار (بوكس) + عشاء",
        "es": "Desayuno (breakfast box) + Cena"
      },
      "description": {
        "ar": "اليوم الرابع — إسطنبول ← كابادوكيا\nالانطلاق إلى المطار لاستقلال الرحلة الجوية إلى كابادوكيا. الوصول والنقل إلى كابادوكيا. في الطريق، زيارة إحدى المدن تحت الأرض العديدة في كابادوكيا التي بنتها المجتمعات المسيحية للحماية من الهجمات العربية. تحتفظ المدينة تحت الأرض بالإسطبلات والقاعات المشتركة وقاعة الاجتماعات والغرف الصغيرة للعائلات. الوصول إلى فندق كابادوكيا. زيارة ورشة فخار. وقت حر بعد الظهر. العشاء والإقامة في الفندق.\nالوجبات: إفطار (بوكس) وعشاء",
        "en": "Day 4 — Istanbul → Cappadocia\nDeparture to the airport to take your flight to Cappadocia. Arrival and transfer to Cappadocia. On the way, visit to one of the numerous underground cities of Cappadocia built by Christian communities to protect themselves from Arab attacks. The underground city preserves stables, common rooms, meeting room and small rooms for families. Arrival at the Cappadocia hotel. Visit to a pottery workshop. Free afternoon. Dinner and accommodation at the hotel.\nMeals: Breakfast box and dinner",
        "es": "4 Día — Estambul → Capadocia\nSalida al aeropuerto para tomar su vuelo con destino a Capadocia. Llegada y traslado a Capadocia. En el camino, visita a una de las innumerables ciudades subterráneas de Capadocia, construidas por las comunidades cristianas para protegerse de los ataques árabes. La ciudad subterránea conserva los establos, salas comunes, sala de reuniones y pequeñas habitaciones para las familias. Llegada al hotel de Capadocia. Visita a un taller de cerámica. Tarde libre. Cena y alojamiento en el hotel.\nComidas: Desayuno (breakfast box) y cena",
        "it": "4° Giorno — Istanbul → Cappadocia\nPartenza per l'aeroporto per prendere il volo per la Cappadocia. Arrivo e trasferimento in Cappadocia. Durante il percorso, visita a una delle numerose città sotterranee della Cappadocia costruite dalle comunità cristiane per proteggersi dagli attacchi arabi. La città sotterranea conserva stalle, sale comuni, sala riunioni e piccole stanze per le famiglie. Arrivo all'hotel in Cappadocia. Visita a un laboratorio di ceramica. Pomeriggio libero. Cena e sistemazione in hotel.\nPasti: Colazione (breakfast box) e cena",
        "pt": "4º Dia — Istambul → Capadócia\nSaída para o aeroporto para pegar seu voo para a Capadócia. Chegada e transfer para a Capadócia. No caminho, visita a uma das inúmeras cidades subterrâneas da Capadócia construídas pelas comunidades cristãs para se protegerem dos ataques árabes. A cidade subterrânea preserva estábulos, salas comuns, sala de reuniões e pequenos cômodos para as famílias. Chegada ao hotel da Capadócia. Visita a uma oficina de cerâmica. Tarde livre. Jantar e hospedagem no hotel.\nRefeições: Café da manhã (breakfast box) e jantar"
      }
    },
    {
      "day": "5",
      "meals": {
        "pt": "Café da manhã + Jantar",
        "it": "Colazione + Cena",
        "en": "Breakfast + Dinner",
        "ar": "إفطار + عشاء",
        "es": "Desayuno + Cena"
      },
      "description": {
        "ar": "اليوم الخامس — كابادوكيا\nرحلة اختيارية بالمنطاد. عند الفجر، إمكانية المشاركة في رحلة اختيارية بالمنطاد، تجربة فريدة فوق التكوينات الصخرية ومداخن الجن والتكوينات الطبيعية والمناظر القمرية. إفطار في الفندق. يوم مخصص لزيارة هذه المنطقة الرائعة الفريدة في العالم: وادي غوريم مع كنائسه المنحوتة في الصخر برسومات من القرنين العاشر والحادي عشر؛ زيارة قرية أوتشيسار الكهفية، وادي الحب، وادي ديفرنت بتكويناته الطبيعية الغريبة، وادي أفسيلار أو وادي الصيادين، وادي الحمام ووقت لورش الحرف اليدوية مثل العقيق والأحجار شبه الكريمة. ليلاً، رحلة اختيارية لحضور عرض رقصات تقليدية من المنطقة. العودة والإقامة في الفندق.\nالوجبات: إفطار وعشاء",
        "en": "Day 5 — Cappadocia\nOPTIONAL BALLOON EXCURSION. At dawn, possibility to participate in an optional hot air balloon excursion, a unique experience over the rock formations, fairy chimneys, natural formations and lunar landscapes. Breakfast at the hotel. Day dedicated to visiting this fantastic region, unique in the world: Göreme Valley with its rock-hewn churches with paintings from the 10th and 11th centuries; visit to the troglodyte village of Uçhisar, Love Valley, Devrent Valley with its curious natural formations, Avcılar Valley or Valley of the Hunters, Pigeon Valley and time for artisan workshops such as onyx and semi-precious stones. In the evening, an optional excursion is offered to attend a show of typical dances of the region. Return and accommodation at the hotel.\nMeals: Breakfast and dinner",
        "es": "5 Día — Capadocia\nEXCURSIÓN OPCIONAL EN GLOBO. Al amanecer, posibilidad de participar en una excursión opcional en globo aerostático, una experiencia única sobre las formaciones rocosas, chimeneas de hadas, formaciones naturales y paisajes lunares. Desayuno en el hotel. Día dedicado a la visita de esta fantástica región, única en el mundo: Valle de Göreme con sus iglesias rupestres con pinturas de los siglos X y XI; visita al pueblo troglodita de Uçhisar, Valle del Amor, Valle de Devrent con sus curiosas formaciones naturales, Valle de Avcılar o Valle de los Cazadores, Valle de las Palomas y tiempo para talleres artesanales como ónix y piedras semipreciosas. Por la noche se ofrece una excursión opcional para asistir a ver un show de danzas típicas de la región. Regreso y alojamiento en el hotel.\nComidas: Desayuno y cena",
        "it": "5° Giorno — Cappadocia\nGIRO IN MONGOLFIERA OPZIONALE. All'alba, possibilità di partecipare a un'escursione opzionale in mongolfiera, un'esperienza unica sulle formazioni rocciose, camini delle fate, formazioni naturali e paesaggi lunari. Colazione in hotel. Giornata dedicata alla visita di questa fantastica regione, unica al mondo: Valle di Göreme con le sue chiese rupestri con affreschi dei secoli X e XI; visita al villaggio troglodita di Uçhisar, Valle dell'Amore, Valle di Devrent con le sue curiose formazioni naturali, Valle di Avcılar o Valle dei Cacciatori, Valle dei Piccioni e tempo per laboratori artigianali come onice e pietre semipreziose. Alla sera, escursione opzionale per assistere a uno spettacolo di danze tipiche della regione. Rientro e sistemazione in hotel.\nPasti: Colazione e cena",
        "pt": "5º Dia — Capadócia\nEXCURSÃO OPCIONAL DE BALÃO. Ao amanhecer, possibilidade de participar de uma excursão opcional de balão de ar quente, uma experiência única sobre as formações rochosas, chaminés de fadas, formações naturais e paisagens lunares. Café da manhã no hotel. Dia dedicado a visitar esta fantástica região, única no mundo: Vale de Göreme com suas igrejas rupestres com pinturas dos séculos X e XI; visita à vila troglodita de Uçhisar, Vale do Amor, Vale de Devrent com suas curiosas formações naturais, Vale de Avcılar ou Vale dos Caçadores, Vale dos Pombos e tempo para oficinas artesanais como ônix e pedras semipreciosas. À noite, oferece-se uma excursão opcional para assistir a um espetáculo de danças típicas da região. Retorno e hospedagem no hotel.\nRefeições: Café da manhã e jantar"
      }
    },
    {
      "day": "6",
      "meals": {
        "pt": "Café da manhã + Jantar",
        "it": "Colazione + Cena",
        "en": "Breakfast + Dinner",
        "ar": "إفطار + عشاء",
        "es": "Desayuno + Cena"
      },
      "description": {
        "ar": "اليوم السادس — كابادوكيا ← باموكالي (حوالي 8 ساعات)\nإفطار وانطلاق نحو باموكالي. نقوم بزيارة خان القوافل ثم الانطلاق إلى باموكالي ووقت حر في \"قلعة القطن\"، الفريدة في العالم مع المسابح الحرارية من أصل كلسي والشلالات المتحجرة. هيرابوليس هي إحدى المواقع الأثرية الكبرى في الأناضول، والتي تجعل المكان، إلى جانب جاذبية مسابح القطن، نقطة اهتمام كبير. حالياً تقع باموكالي بجوار مدينة هيرابوليس القديمة. تم إعلان الموقع كموقع تراث عالمي من قبل اليونسكو واعترف به كأحد أهم وأجذب المراكز السياحية في العالم. مدينة باموكالي تستمد اسمها الذي يعني \"قلعة القطن\" من تكوينات طبقات الحجر الجيري البيضاء. هيرابوليس تسمى أيضاً \"المدينة المقدسة\" بسبب المعابد والمباني الدينية العديدة. ما سيجذبنا بلا شك هو جمال الحجارة البيضاء (الترافرتين) التي تغطي جميع المسابح الطبيعية التي تشكلت بالمياه الحرارية أيضاً. زيارة قصيرة لمتجر منافذ. عند الانتهاء، النقل إلى الفندق. العشاء والإقامة.\nالوجبات: إفطار وعشاء",
        "en": "Day 6 — Cappadocia → Pamukkale (approx. 8 hours)\nBreakfast and departure to Pamukkale. We visit a Kervansaray and departure to Pamukkale and free time at the \"Cotton Castle\", unique in the world with its thermal pools of calcareous origin and petrified waterfalls. Hierapolis is one of the great archaeological sites of Anatolia, which, together with the attraction of the cotton pools, makes the place a point of great interest. Currently Pamukkale is located right next to the Ancient City of Hierapolis. The site was declared a UNESCO World Heritage Site and recognized as one of the most relevant and attractive tourist centers in the world. The city of Pamukkale gets its name meaning \"Cotton Castle\" from the formations of white limestone layers. Hierapolis is also called \"the Holy City\" due to numerous temples and religious buildings. What will undoubtedly attract us is the beauty of the white stones (travertines) that cover all the natural pools formed by the thermal water as well. Brief visit to an outlet. At the end, transfer to the hotel. Dinner and accommodation.\nMeals: Breakfast and dinner",
        "es": "6 Día — Capadocia → Pamukkale (Aprox 8 horas)\nDesayuno y salida hacia Pamukkale. Hacemos una visita a Kervansaray y salida a Pamukkale y tiempo libre en el \"Castillo de Algodón\", único en el mundo con las piscinas termales de origen calcárea y las cascadas petrificadas. Hierápolis es uno de los grandes yacimientos de Anatolia, que, junto a la atracción de las piscinas de algodón, hacen del lugar un punto de gran interés. En la actualidad Pamukkale se encuentra ubicada justo al lado de la Antigua Ciudad de Hierápolis. La localidad fue declarada Patrimonio de la Humanidad por la UNESCO y reconocida como uno de los más relevantes y atractivos centros turísticos del mundo. La ciudad de Pamukkale recibe su nombre que significa \"Castillo de Algodón\" de las formaciones de capas blancas de piedra caliza. Hierápolis se llama también \"la Ciudad Sagrada\" debido a numerosos templos y edificios religiosos. Lo que nos atraerá sin duda la belleza de las piedras blancas (travertinos) que cubren todas las piscinas naturales que se formaron por el agua termal también. Breve visita a un outlet. Al término, traslado al hotel. Cena y alojamiento.\nComidas: Desayuno y cena",
        "it": "6° Giorno — Cappadocia → Pamukkale (circa 8 ore)\nColazione e partenza per Pamukkale. Visitiamo un Kervansaray e partenza per Pamukkale e tempo libero al \"Castello di Cotone\", unico al mondo con le sue piscine termali di origine calcarea e le cascate pietrificate. Hierapolis è uno dei grandi siti archeologici dell'Anatolia che, insieme all'attrazione delle piscine di cotone, rendono il luogo di grande interesse. Oggi Pamukkale si trova proprio accanto all'Antica Città di Hierapolis. È stata dichiarata Patrimonio dell'Umanità dall'UNESCO e riconosciuta come uno dei centri turistici più rilevanti e attraenti del mondo. La città di Pamukkale prende il nome che significa \"Castello di Cotone\" dalle formazioni di strati bianchi di calcare. Hierapolis è anche chiamata \"la Città Santa\" per i suoi numerosi templi ed edifici religiosi. La bellezza delle pietre bianche (travertini) che ricoprono tutte le piscine naturali formate dall'acqua termale ci attrarrà senza dubbio. Breve visita a un outlet. Al termine, trasferimento in hotel. Cena e sistemazione.\nPasti: Colazione e cena",
        "pt": "6º Dia — Capadócia → Pamukkale (Aprox 8 horas)\nCafé da manhã e partida para Pamukkale. Fazemos uma visita a um Kervansaray e partida para Pamukkale e tempo livre no \"Castelo de Algodão\", único no mundo com suas piscinas termais de origem calcária e cachoeiras petrificadas. Hierápolis é um dos grandes sítios arqueológicos da Anatólia que, junto com a atração das piscinas de algodão, tornam o local de grande interesse. Atualmente, Pamukkale está localizada ao lado da Antiga Cidade de Hierápolis. Foi declarada Patrimônio Mundial pela UNESCO e reconhecida como um dos centros turísticos mais relevantes e atraentes do mundo. A cidade de Pamukkale recebe seu nome que significa \"Castelo de Algodão\" das formações de camadas brancas de calcário. Hierápolis também é chamada de \"Cidade Sagrada\" devido aos seus numerosos templos e edifícios religiosos. A beleza das pedras brancas (travertinos) que cobrem todas as piscinas naturais formadas pela água termal nos atrairá sem dúvida. Breve visita a um outlet. Ao final, transfer para o hotel. Jantar e hospedagem.\nRefeições: Café da manhã e jantar"
      }
    },
    {
      "day": "7",
      "meals": {
        "pt": "Café da manhã + Jantar",
        "it": "Colazione + Cena",
        "en": "Breakfast + Dinner",
        "ar": "إفطار + عشاء",
        "es": "Desayuno + Cena"
      },
      "description": {
        "ar": "اليوم السابع — باموكالي ← أفسس ← إزمير أو كوشاداسي (حوالي 3 ساعات)\nإفطار في الفندق. الانطلاق لزيارة أطلال أفسس، التي كانت خامس أكبر مدينة في العصر الروماني. خلال زيارتنا سنستمتع بمشاهدة مكتبة سيلسوس الشهيرة بعد الإسكندرية، والمسرح وبعض المعابد الرومانية والهلنستية، والأوديون، ومعبد هادريان، وبيت الحب، والأغورا، وشارع الرخام والمسرح أيضاً. بعد ذلك، سنزور منزل السيدة مريم العذراء حيث يُعتقد أن مريم وصلت إلى أفسس مع القديس يوحنا وعاشت هناك حتى انتقالها (حسب العقيدة الكاثوليكية) أو رقادها (حسب المعتقدات الأرثوذكسية). نظراً لأن هذا البيت هو مكان حج، يزوره العديد من السياح المسيحيين غالباً على مدار العام. بعد الظهر، نتوقف في مركز لإنتاج الجلود. نظراً لأن أفسس كانت مركزاً للدباغة منذ العصور القديمة، ستتاح لنا فرصة شراء بعض الملابس الجلدية بأفضل الأسعار. سنشاهد أيضاً عرض أزياء حيث سيتم عرض بعض من أكثر الجواكيت أناقة في البلاد. ثم إلى الفندق. العشاء والإقامة في الفندق.\nالوجبات: إفطار وعشاء",
        "en": "Day 7 — Pamukkale → Ephesus → Izmir or Kusadasi (approx. 3 hours)\nBreakfast at the hotel. Departure to visit the ruins of Ephesus, which was the fifth great city of the Roman era. During our visit we will appreciate the famous Library of Celsus after Alexandria, the theater and some Roman and Hellenic temples, the Odeon, the Temple of Hadrian, the House of Love, the Agora, Marble Street and the Theater as well. Next, we will visit the House of the Virgin Mary where it is supposed that Mary came to Ephesus together with Saint John and lived there until her Assumption (according to Catholic doctrine) or Dormition (according to Orthodox beliefs). As this house is a place of pilgrimage, it is visited by numerous Christian tourists often throughout the year. In the afternoon we stop at a leather production center. Since Ephesus has been a leather tanning center since ancient times, we will have the opportunity to buy some leather clothes at the most reasonable price. We will also see a fashion show in which some of the most elegant jackets in the country will be displayed. Then to your hotel. Dinner and accommodation at the hotel.\nMeals: Breakfast and dinner",
        "es": "7 Día — Pamukkale → Éfeso → Esmirna o Kusadasi (Aprox 3 horas)\nDesayuno en el hotel. Salida para visitar las ruinas de Éfeso, fue la quinta gran ciudad de la época Romana. Durante nuestra visita apreciaremos la famosa biblioteca de Celso después de Alejandría, el teatro y algunos templos romanos y helenos, el Odeón, el Templo de Adriano, la Casa de Amor, el Ágora, la calle de Mármol y el Teatro también. A continuación, visitaremos la casa de la Virgen María donde se supone que María llegó a Éfeso junto con San Juan y vivió allí hasta su Asunción (según la doctrina católica) o Dormición (según las creencias ortodoxas). Como esta casa es un lugar de peregrinación se visita por numerosos turistas cristianos a menudo durante el año. Por la tarde paramos en un centro de producción de cuero. Como Éfeso es un centro de piel de curtiduría desde la época antigua tendremos posibilidad de comprar algunas ropas de cuero con el precio más razonable. También veremos un desfile de moda en el que nos expondrán unas de las chaquetas más elegantes del país. A continuación, a su hotel. Cena y alojamiento en el hotel.\nComidas: Desayuno y cena",
        "it": "7° Giorno — Pamukkale → Efeso → Smirne o Kusadasi (circa 3 ore)\nColazione in hotel. Partenza per visitare le rovine di Efeso, che fu la quinta città più grande dell'epoca romana. Durante la nostra visita apprezzeremo la famosa Biblioteca di Celso dopo Alessandria, il teatro e alcuni templi romani ed ellenici, l'Odeon, il Tempio di Adriano, la Casa dell'Amore, l'Agorà, la Via del Marmo e anche il Teatro. Successivamente, visiteremo la Casa della Vergine Maria, dove si ritiene che Maria sia giunta a Efeso insieme a San Giovanni e vi abbia vissuto fino alla sua Assunzione (secondo la dottrina cattolica) o Dormizione (secondo le credenze ortodosse). Poiché questa casa è un luogo di pellegrinaggio, è visitata da numerosi turisti cristiani durante tutto l'anno. Nel pomeriggio, sosta in un centro di produzione di pelletteria. Poiché Efeso è un centro di concia delle pelli fin dall'antichità, avremo l'opportunità di acquistare abbigliamento in pelle al prezzo più ragionevole. Assisteremo anche a una sfilata di moda in cui verranno esposte alcune delle giacche più eleganti del paese. Successivamente, al vostro hotel. Cena e sistemazione in hotel.\nPasti: Colazione e cena",
        "pt": "7º Dia — Pamukkale → Éfeso → Esmirna ou Kusadasi (Aprox 3 horas)\nCafé da manhã no hotel. Saída para visitar as ruínas de Éfeso, que foi a quinta grande cidade da época romana. Durante nossa visita apreciaremos a famosa Biblioteca de Celso depois de Alexandria, o teatro e alguns templos romanos e helênicos, o Odeão, o Templo de Adriano, a Casa do Amor, a Ágora, a Rua de Mármore e também o Teatro. Em seguida, visitaremos a Casa da Virgem Maria, onde se supõe que Maria chegou a Éfeso junto com São João e ali viveu até sua Assunção (segundo a doutrina católica) ou Dormição (segundo as crenças ortodoxas). Como esta casa é um local de peregrinação, é visitada por numerosos turistas cristãos frequentemente durante o ano. À tarde, paramos em um centro de produção de couro. Como Éfeso é um centro de curtume desde a antiguidade, teremos a oportunidade de comprar algumas roupas de couro com o preço mais razoável. Também veremos um desfile de moda no qual serão exibidas algumas das jaquetas mais elegantes do país. Em seguida, ao seu hotel. Jantar e hospedagem no hotel.\nRefeições: Café da manhã e jantar"
      }
    },
    {
      "day": "8",
      "meals": {
        "pt": "Café da manhã + Jantar",
        "it": "Colazione + Cena",
        "en": "Breakfast + Dinner",
        "ar": "إفطار + عشاء",
        "es": "Desayuno + Cena"
      },
      "description": {
        "ar": "اليوم الثامن — إزمير أو كوشاداسي ← بودروم (حوالي ساعتين ونصف)\nإفطار ونقل إلى بودروم (سائق فقط). وقت حر بعد الظهر.\nالوجبات: إفطار وعشاء",
        "en": "Day 8 — Izmir or Kusadasi → Bodrum (approx. 2h30min)\nBreakfast and transfer to Bodrum (driver only). Free afternoon.\nMeals: Breakfast and dinner",
        "es": "8 Día — Esmirna o Kusadasi → Bodrum (Aprox 2h30min)\nDesayuno y traslado a Bodrum (solo con conductor). Tarde libre.\nComidas: Desayuno y cena",
        "it": "8° Giorno — Smirne o Kusadasi → Bodrum (circa 2h30min)\nColazione e trasferimento a Bodrum (solo autista). Pomeriggio libero.\nPasti: Colazione e cena",
        "pt": "8º Dia — Esmirna ou Kusadasi → Bodrum (Aprox 2h30min)\nCafé da manhã e transfer para Bodrum (apenas motorista). Tarde livre.\nRefeições: Café da manhã e jantar"
      }
    },
    {
      "day": "9",
      "meals": {
        "pt": "Café da manhã + Jantar",
        "it": "Colazione + Cena",
        "en": "Breakfast + Dinner",
        "ar": "إفطار + عشاء",
        "es": "Desayuno + Cena"
      },
      "description": {
        "ar": "اليوم التاسع — بودروم (يوم حر)\nيوم حر، إقامة وعشاء.\nالوجبات: إفطار وعشاء",
        "en": "Day 9 — Bodrum (Free Day)\nFree day, accommodation and dinner.\nMeals: Breakfast and dinner",
        "es": "9 Dia — Bodrum (Día Libre)\nDía libre, alojamiento y cena.\nComidas: Desayuno y cena",
        "it": "9° Giorno — Bodrum (Giorno Libero)\nGiorno libero, sistemazione e cena.\nPasti: Colazione e cena",
        "pt": "9º Dia — Bodrum (Dia Livre)\nDia livre, hospedagem e jantar.\nRefeições: Café da manhã e jantar"
      }
    },
    {
      "day": "10",
      "meals": {
        "pt": "Café da manhã + Jantar",
        "it": "Colazione + Cena",
        "en": "Breakfast + Dinner",
        "ar": "إفطار + عشاء",
        "es": "Desayuno + Cena"
      },
      "description": {
        "ar": "اليوم العاشر — بودروم ← فتحية\nإفطار. في الوقت المتفق عليه، الانطلاق إلى فتحية (سائق فقط يتحدث القليل من الإنجليزية). إقامة وعشاء.\nالوجبات: إفطار وعشاء",
        "en": "Day 10 — Bodrum → Fethiye\nBreakfast. At the agreed time, departure to Fethiye (driver only who speaks little English). Accommodation and dinner.\nMeals: Breakfast and dinner",
        "es": "10 Dia — Bodrum → Fethiye\nDesayuno. A la hora acordada salida a Fethiye (únicamente con conductor que habla poco inglés). Alojamiento y cena.\nComidas: Desayuno y cena",
        "it": "10° Giorno — Bodrum → Fethiye\nColazione. All'orario concordato partenza per Fethiye (solo autista che parla poco inglese). Sistemazione e cena.\nPasti: Colazione e cena",
        "pt": "10º Dia — Bodrum → Fethiye\nCafé da manhã. No horário combinado, saída para Fethiye (apenas motorista que fala pouco inglês). Hospedagem e jantar.\nRefeições: Café da manhã e jantar"
      }
    },
    {
      "day": "11",
      "meals": {
        "pt": "Café da manhã + Jantar",
        "it": "Colazione + Cena",
        "en": "Breakfast + Dinner",
        "ar": "إفطار + عشاء",
        "es": "Desayuno + Cena"
      },
      "description": {
        "ar": "اليوم الحادي عشر — فتحية (يوم حر)\nيوم حر، إقامة وعشاء.\nالوجبات: إفطار وعشاء",
        "en": "Day 11 — Fethiye (Free Day)\nFree day, accommodation and dinner.\nMeals: Breakfast and dinner",
        "es": "11 Fethiye (Día Libre)\nDía libre, alojamiento y cena.\nComidas: Desayuno y cena",
        "it": "11° Giorno — Fethiye (Giorno Libero)\nGiorno libero, sistemazione e cena.\nPasti: Colazione e cena",
        "pt": "11º Dia — Fethiye (Dia Livre)\nDia livre, hospedagem e jantar.\nRefeições: Café da manhã e jantar"
      }
    },
    {
      "day": "12",
      "meals": {
        "pt": "Café da manhã",
        "it": "Colazione",
        "en": "Breakfast",
        "ar": "إفطار",
        "es": "Desayuno"
      },
      "description": {
        "ar": "اليوم الثاني عشر — فتحية ← إسطنبول\nالنقل إلى المطار لاستقلال الرحلة الجوية إلى إسطنبول. الوصول والنقل إلى الفندق المقرر. الإقامة.\nالوجبات: إفطار",
        "en": "Day 12 — Fethiye → Istanbul\nTransfer to the airport to take the flight to Istanbul. Arrival and transfer to the designated hotel. Accommodation.\nMeals: Breakfast",
        "es": "12 Día — Fethiye → Estambul\nTraslado al aeropuerto para tomar vuelo con destino a Estambul. Llegada y traslado al hotel previsto. Alojamiento.\nComidas: Desayuno",
        "it": "12° Giorno — Fethiye → Istanbul\nTrasferimento in aeroporto per prendere il volo per Istanbul. Arrivo e trasferimento all'hotel previsto. Sistemazione.\nPasti: Colazione",
        "pt": "12º Dia — Fethiye → Istambul\nTransfer para o aeroporto para pegar voo com destino a Istambul. Chegada e transfer para o hotel previsto. Hospedagem.\nRefeições: Café da manhã"
      }
    },
    {
      "day": "13",
      "meals": {
        "pt": "Café da manhã",
        "it": "Colazione",
        "en": "Breakfast",
        "ar": "إفطار",
        "es": "Desayuno"
      },
      "description": {
        "ar": "اليوم الثالث عشر — المغادرة من إسطنبول\nإفطار في الفندق. في الوقت المتفق عليه، النقل إلى المطار.\nالوجبات: إفطار (طالما أن موعد النقل يسمح بذلك)\nنهاية خدماتنا.",
        "en": "Day 13 — Departure from Istanbul\nBreakfast at the hotel. At the agreed time, transfer to the airport.\nMeals: Breakfast (provided the transfer schedule allows it)\nEND OF OUR SERVICES.",
        "es": "13 Día — Salida de Estambul\nDesayuno en el hotel. En la hora combinada, traslado al aeropuerto.\nComidas: Desayuno (siempre y cuando el horario de traslado lo permita)\nFIN DE NUESTROS SERVICIOS.",
        "it": "13° Giorno — Partenza da Istanbul\nColazione in hotel. All'orario concordato, trasferimento in aeroporto.\nPasti: Colazione (sempre che l'orario del trasferimento lo permetta)\nFINE DEI NOSTRI SERVIZI.",
        "pt": "13º Dia — Partida de Istambul\nCafé da manhã no hotel. No horário combinado, transfer para o aeroporto.\nRefeições: Café da manhã (desde que o horário do transfer permita)\nFIM DOS NOSSOS SERVIÇOS."
      }
    }
  ]
};

data.programs.push(reg10);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('REG-10 added successfully.');
