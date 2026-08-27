import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamic import for ES module blogs.js
const { blogs } = await import('./src/data/blogs.js');

// ===== TRANSLATIONS MAP =====
const translations = {};

function add(en, ar, es, it, pt) {
  translations[en] = { ar, es, it, pt };
}

// ===== SHARED / TEMPLATE CONTENT =====

// Headings
add("## What is Included in This Journey",
  "## ما يشمل هذه الرحلة",
  "## Qué está incluido en este viaje",
  "## Cosa include questo viaggio",
  "## O que está incluído nesta viagem");

add("## Day-by-Day Highlights & Key Experiences",
  "## أبرز النقاط والتجارب الرئيسية يومًا بيوم",
  "## Destacados día a día y experiencias clave",
  "## Punti salienti giornalieri ed esperienze chiave",
  "## Destaques diários e experiências-chave");

add("## Book Your Experience",
  "## احجز تجربتك",
  "## Reserva tu experiencia",
  "## Prenota la tua esperienza",
  "## Reserve sua experiência");

add("## Practical Tips for Your Egypt Adventure",
  "## نصائح عملية لمغامرتك في مصر",
  "## Consejos prácticos para tu aventura en Egipto",
  "## Consigli pratici per la tua avventura in Egitto",
  "## Dicas práticas para sua aventura no Egito");

add("## Practical Tips for Your Turkey Adventure",
  "## نصائح عملية لمغامرتك في تركيا",
  "## Consejos prácticos para tu aventura en Turquía",
  "## Consigli pratici per la tua avventura in Turchia",
  "## Dicas práticas para sua aventura na Turquia");

add("## Practical Tips for Your Multi-country Adventure",
  "## نصائح عملية لمغامرتك متعددة البلدان",
  "## Consejos prácticos para tu aventura en varios países",
  "## Consigli pratici per la tua avventura in più paesi",
  "## Dicas práticas para sua aventura em vários países");

add("## Practical Tips for Your Greece Adventure",
  "## نصائح عملية لمغامرتك في اليونان",
  "## Consejos prácticos para tu aventura en Grecia",
  "## Consigli pratici per la tua avventura in Grecia",
  "## Dicas práticas para sua aventura na Grécia");

add("## Practical Tips for Your Tunisia Adventure",
  "## نصائح عملية لمغامرتك في تونس",
  "## Consejos prácticos para tu aventura en Túnez",
  "## Consigli pratici per la tua avventura in Tunisia",
  "## Dicas práticas para sua aventura na Tunísia");

add("## Why Visit Egypt",
  "## لماذا تزور مصر",
  "## Por qué visitar Egipto",
  "## Perché visitare l'Egitto",
  "## Por que visitar o Egito");

add("## Why Visit Turkey",
  "## لماذا تزور تركيا",
  "## Por qué visitar Turquía",
  "## Perché visitare la Turchia",
  "## Por que visitar a Turquia");

add("## Why Visit Multi-country",
  "## لماذا تزور عدة بلدان",
  "## Por qué visitar varios países",
  "## Perché visitare più paesi",
  "## Por que visitar vários países");

add("## Why Visit Greece",
  "## لماذا تزور اليونان",
  "## Por qué visitar Grecia",
  "## Perché visitare la Grecia",
  "## Por que visitar a Grécia");

add("## Why Visit Tunisia",
  "## لماذا تزور تونس",
  "## Por qué visitar Túnez",
  "## Perché visitare la Tunisia",
  "## Por que visitar a Tunísia");

// Shared paragraph: Egypt intro
add("Few places on earth capture the imagination quite like Egypt. From the towering heights of the Great Pyramid of Giza to the serene flow of the Nile River, this ancient land is a living testament to human history and architectural grandeur. The \"@PACKAGE\" package by Dunas Travel offers a carefully curated @DAYS itinerary designed to immerse you in the magic of the pharaohs. Whether you are gazing at the Sphinx, exploring the subterranean tombs in the Valley of the Kings, or relaxing by the crystal-clear waters of the Red Sea, every moment of this journey promises to be extraordinary. Written in a captivating storytelling tone, this travel guide will walk you through the key experiences that make this trip a must-book experience.",
  "قلة من الأماكن على الأرض تخطف الخيال مثل مصر. من ارتفاع هرم الجيزة الأكبر إلى التدفق الهادئ لنهر النيل، هذه الأرض القديمة هي شهادة حية على التاريخ البشري والعظمة المعمارية. تقدم باقة \"@PACKAGE\" من دوناس ترافيل رحلة @DAYS مصممة بعناية لتغمرك في سحر الفراعنة. سواء كنت تتأمل أبو الهول، أو تستكشف المقابر تحت الأرض في وادي الملوك، أو تسترخي على المياه الصافية للبحر الأحمر، فإن كل لحظة في هذه الرحلة تعد بأن تكون استثنائية. مكتوب بأسلوب سردي آسر، سيرشدك هذا الدليل السياحي خلال التجارب الرئيسية التي تجعل هذه الرحلة تجربة لا تُفوّت.",
  "Pocos lugares en el mundo capturan la imaginación como Egipto. Desde las imponentes alturas de la Gran Pirámide de Giza hasta el sereno fluir del río Nilo, esta tierra antigua es un testimonio vivo de la historia humana y la grandeza arquitectónica. El paquete \"@PACKAGE\" de Dunas Travel ofrece un itinerario de @DAYS cuidadosamente seleccionado para sumergirte en la magia de los faraones. Ya sea contemplando la Esfinge, explorando las tumbas subterráneas del Valle de los Reyes o relajándote en las cristalinas aguas del Mar Rojo, cada momento de este viaje promete ser extraordinario. Escrito en un tono narrativo cautivador, esta guía te llevará a través de las experiencias clave que hacen de este viaje una experiencia imprescindible.",
  "Pochi luoghi sulla terra catturano l'immaginazione come l'Egitto. Dalle imponenti altezze della Grande Piramide di Giza al sereno scorrere del fiume Nilo, questa terra antica è una testimonianza vivente della storia umana e della grandezza architettonica. Il pacchetto \"@PACKAGE\" di Dunas Travel offre un itinerario di @DAYS accuratamente curato per immergerti nella magia dei faraoni. Che tu stia ammirando la Sfinge, esplorando le tombe sotterranee nella Valle dei Re o rilassandoti nelle acque cristalline del Mar Rosso, ogni momento di questo viaggio promette di essere straordinario. Scritto in uno stile narrativo accattivante, questa guida ti accompagnerà attraverso le esperienze chiave che rendono questo viaggio imperdibile.",
  "Poucos lugares na terra capturam a imaginação como o Egito. Das imponentes alturas da Grande Pirâmide de Gizé ao sereno fluxo do Rio Nilo, esta terra antiga é um testemunho vivo da história humana e da grandeza arquitetônica. O pacote \"@PACKAGE\" da Dunas Travel oferece um itinerário de @DAYS cuidadosamente selecionado para mergulhá-lo na magia dos faraós. Quer você esteja contemplando a Esfinge, explorando os túmulos subterrâneos no Vale dos Reis ou relaxando nas águas cristalinas do Mar Vermelho, cada momento desta jornada promete ser extraordinário. Escrito em um tom narrativo cativante, este guia de viagem o levará através das experiências-chave que tornam esta viagem imperdível.");

// Shared Egypt paragraph
add("Egypt is a destination that transcends time. Standing before the Great Pyramid of Giza—the only surviving wonder of the ancient world—is a humbling experience that connects you directly to the dawn of civilization. Beyond the pyramids, Egypt offers a rich tapestry of history, from the temple complexes of Luxor and Karnak to the beautiful tombs of the Valley of the Kings. Traveling along the Nile on a luxury river cruise allows you to witness rural life that has remained unchanged for millennia, while the vibrant streets of Cairo offer an exciting mix of historic mosques, Coptic churches, and bustling bazaars. For those seeking relaxation, the pristine coral reefs and luxury resorts of Sharm El Sheikh and Hurghada provide world-class diving and seaside comfort. Egypt is not just a place to visit; it is a journey into the history of humanity itself.",
  "مصر هي وجهة تتجاوز الزمن. الوقوف أمام الهرم الأكبر بالجيزة—الأعجوبة الوحيدة الباقية من العالم القديم—هي تجربة متواضعة تربطك مباشرة بفجر الحضارة. إلى جانب الأهرامات، تقدم مصر نسيجًا غنيًا من التاريخ، من مجمعات معابد الأقصر والكرنك إلى المقابر الجميلة في وادي الملوك. السفر على طول النيل في رحلة نهرية فاخرة يتيح لك مشاهدة الحياة الريفية التي لم تتغير لآلاف السنين، بينما تقدم شوارع القاهرة النابضة بالحياة مزيجًا مثيرًا من المساجد التاريخية والكنائس القبطية والأسواق الصاخبة. لمن يبحثون عن الاسترخاء، توفر الشعاب المرجانية البكر ومنتجعات شرم الشيخ والغردقة الفاخرة غوصًا عالمي المستوى وراحة على الشاطئ. مصر ليست مجرد مكان للزيارة؛ إنها رحلة في تاريخ الإنسانية نفسه.",
  "Egipto es un destino que trasciende el tiempo. Estar frente a la Gran Pirámide de Giza, la única maravilla sobreviviente del mundo antiguo, es una experiencia humilde que te conecta directamente con los albores de la civilización. Más allá de las pirámides, Egipto ofrece un rico tapiz histórico, desde los complejos de templos de Luxor y Karnak hasta las hermosas tumbas del Valle de los Reyes. Viajar por el Nilo en un crucero de lujo te permite presenciar la vida rural que ha permanecido inmutable durante milenios, mientras que las vibrantes calles de El Cairo ofrecen una emocionante mezcla de mezquitas históricas, iglesias coptas y bulliciosos bazares. Para quienes buscan relajación, los prístinos arrecifes de coral y los resorts de lujo de Sharm El Sheikh y Hurghada ofrecen buceo de clase mundial y confort junto al mar. Egipto no es solo un lugar para visitar; es un viaje a la historia de la humanidad misma.",
  "L'Egitto è una destinazione che trascende il tempo. Trovarsi di fronte alla Grande Piramide di Giza—l'unica meraviglia sopravvissuta del mondo antico—è un'esperienza umile che ti connette direttamente all'alba della civiltà. Oltre le piramidi, l'Egitto offre un ricco arazzo di storia, dai complessi templari di Luxor e Karnak alle belle tombe della Valle dei Re. Viaggiare lungo il Nilo su una crociera di lusso ti permette di assistere alla vita rurale rimasta immutata per millenni, mentre le vibranti strade del Cairo offrono un'entusiasmante miscela di moschee storiche, chiese copte e vivaci bazar. Per chi cerca relax, le incontaminate barriere coralline e i resort di lusso di Sharm El Sheikh e Hurghada offrono immersioni di livello mondiale e comfort marino. L'Egitto non è solo un posto da visitare; è un viaggio nella storia dell'umanità stessa.",
  "O Egito é um destino que transcende o tempo. Estar diante da Grande Pirâmide de Gizé—a única maravilha sobrevivente do mundo antigo—é uma experiência humilde que o conecta diretamente ao amanhecer da civilização. Além das pirâmides, o Egito oferece uma rica tapeçaria de história, dos complexos de templos de Luxor e Karnak aos belos túmulos do Vale dos Reis. Viajar ao longo do Nilo em um cruzeiro de luxo permite testemunhar a vida rural que permaneceu inalterada por milênios, enquanto as vibrantes ruas do Cairo oferecem uma mistura emocionante de mesquitas históricas, igrejas copta e bazares movimentados. Para quem busca relaxamento, os recifes de corais intocados e os resorts de luxo de Sharm El Sheikh e Hurghada oferecem mergulho de classe mundial e conforto à beira-mar. O Egito não é apenas um lugar para visitar; é uma viagem à própria história da humanidade.");

// Shared "What is Included" paragraph
add("The \"@PACKAGE\" package is designed to offer a complete, worry-free luxury travel experience. Over the course of this @DAYS journey, Dunas Travel takes care of every logistical detail. Guests will enjoy handpicked accommodation in premium 5-star hotels and luxury desert camps, private airport transfers in modern executive vehicles, and domestic flights within the destinations. Daily breakfast is included, along with select lunches and dinners featuring authentic local cuisine. Sightseeing is conducted in private or small-group settings, led by professional, certified bilingual guides who bring the history and culture of each site to life. Additionally, all entrance fees to the attractions listed in the itinerary are fully covered, and our 24/7 concierge support is always available to assist with any personal requests, reservations, or recommendations.",
  "باقة \"@PACKAGE\" مصممة لتقديم تجربة سفر فاخرة خالية من القلق. على مدار رحلة @DAYS، تتولى دوناس ترافيل كل التفاصيل اللوجستية. سيستمتع الضيوف بإقامة مختارة في فنادق 5 نجوم فاخرة ومخيمات صحراوية راقية، وانتقالات خاصة من المطار بسيارات تنفيذية حديثة، و رحلات طيران داخلية بين الوجهات. يتم تضمين الإفطار اليومي، بالإضافة إلى وجبات غداء وعشاء مختارة من المأكولات المحلية الأصيلة. تتم الجولات السياحية بإعدادات خاصة أو بمجموعات صغيرة، بقيادة مرشدين محترفين معتمدين ثنائيي اللغة يجعلون تاريخ وثقافة كل موقع تنبض بالحياة. بالإضافة إلى ذلك، جميع رسوم الدخول للمعالم المدرجة في مسار الرحلة مغطاة بالكامل، وخدمة الكونسيرج على مدار الساعة متاحة دائمًا للمساعدة في أي طلبات شخصية أو حجوزات أو توصيات.",
  "El paquete \"@PACKAGE\" está diseñado para ofrecer una experiencia de viaje de lujo completa y sin preocupaciones. Durante este viaje de @DAYS, Dunas Travel se encarga de cada detalle logístico. Los huéspedes disfrutarán de alojamiento seleccionado en hoteles premium de 5 estrellas y campamentos de lujo en el desierto, traslados privados desde el aeropuerto en vehículos ejecutivos modernos y vuelos nacionales dentro de los destinos. Se incluye desayuno diario, junto con almuerzos y cenas seleccionados con auténtica cocina local. Las visitas turísticas se realizan en entornos privados o en grupos pequeños, guiados por profesionales bilingües certificados que dan vida a la historia y cultura de cada sitio. Además, todas las tarifas de entrada a las atracciones enumeradas en el itinerario están completamente cubiertas, y nuestro servicio de conserjería 24/7 está siempre disponible para ayudar con cualquier solicitud personal, reserva o recomendación.",
  "Il pacchetto \"@PACKAGE\" è progettato per offrire un'esperienza di viaggio di lusso completa e senza preoccupazioni. Nel corso di questo viaggio di @DAYS, Dunas Travel si occupa di ogni dettaglio logistico. Gli ospiti godranno di alloggi selezionati in hotel premium a 5 stelle e lussuosi campi nel deserto, trasferimenti privati dall'aeroporto in moderni veicoli executive e voli domestici tra le destinazioni. È inclusa la colazione quotidiana, insieme a pranzi e cene selezionati con autentica cucina locale. Le visite turistiche si svolgono in contesti privati o in piccoli gruppi, guidati da guide professioniste certificate bilingue che danno vita alla storia e alla cultura di ogni sito. Inoltre, tutte le quote d'ingresso alle attrazioni elencate nell'itinerario sono completamente coperte e il nostro servizio di concierge 24/7 è sempre disponibile per assistere con richieste personali, prenotazioni o raccomandazioni.",
  "O pacote \"@PACKAGE\" é projetado para oferecer uma experiência de viagem de luxo completa e sem preocupações. Ao longo desta jornada de @DAYS, a Dunas Travel cuida de cada detalhe logístico. Os hóspedes desfrutarão de acomodações selecionadas em hotéis premium 5 estrelas e acampamentos de luxo no deserto, traslados privados do aeroporto em veículos executivos modernos e voos domésticos entre os destinos. O café da manhã diário está incluído, juntamente com almoços e jantares selecionados com autêntica culinária local. Os passeios turísticos são realizados em ambientes privados ou em pequenos grupos, guiados por profissionais certificados bilíngues que dão vida à história e cultura de cada local. Além disso, todas as taxas de entrada para as atrações listadas no itinerário são totalmente cobertas, e nosso serviço de concierge 24/7 está sempre disponível para ajudar com quaisquer solicitações pessoais, reservas ou recomendações.");

// Shared "Day-by-Day" template
add("While the detailed day-by-day itinerary is fully customized to your travel dates and preferences, this program is anchored by several signature experiences that form the core of your journey:\n\n• **@HL1**: Explore this remarkable highlight in detail, experiencing its historical importance and scenic beauty.\n\n• **@HL2**: Explore this remarkable highlight in detail, experiencing its historical importance and scenic beauty.\n\n• **@HL3**: Explore this remarkable highlight in detail, experiencing its historical importance and scenic beauty.\n\n• **@HL4**: Explore this remarkable highlight in detail, experiencing its historical importance and scenic beauty.\n\nEach of these experiences has been selected to provide an authentic and immersive connection to the destination, ensuring that you see both the iconic sights and the hidden gems in comfort and style.",
  "بينما يتم تخصيص مسار الرحلة التفصيلي يومًا بيوم بالكامل وفقًا لتواريخ سفرك وتفضيلاتك، فإن هذا البرنامج يستند إلى عدة تجارب مميزة تشكل جوهر رحلتك:\n\n• **@HL1**: استكشف هذا المعلم البارز بالتفصيل، واستمتع بأهميته التاريخية وجماله الخلاب.\n\n• **@HL2**: استكشف هذا المعلم البارز بالتفصيل، واستمتع بأهميته التاريخية وجماله الخلاب.\n\n• **@HL3**: استكشف هذا المعلم البارز بالتفصيل، واستمتع بأهميته التاريخية وجماله الخلاب.\n\n• **@HL4**: استكشف هذا المعلم البارز بالتفصيل، واستمتع بأهميته التاريخية وجماله الخلاب.\n\nتم اختيار كل من هذه التجارب لتوفير اتصال أصيل وعميق بالوجهة، مما يضمن لك رؤية كل من المعالم الشهيرة والجواهر الخفية براحة وأناقة.",
  "Si bien el itinerario detallado día a día está completamente personalizado según tus fechas de viaje y preferencias, este programa se basa en varias experiencias emblemáticas que forman el núcleo de tu viaje:\n\n• **@HL1**: Explora este destacado en detalle, experimentando su importancia histórica y belleza escénica.\n\n• **@HL2**: Explora este destacado en detalle, experimentando su importancia histórica y belleza escénica.\n\n• **@HL3**: Explora este destacado en detalle, experimentando su importancia histórica y belleza escénica.\n\n• **@HL4**: Explora este destacado en detalle, experimentando su importancia histórica y belleza escénica.\n\nCada una de estas experiencias ha sido seleccionada para proporcionar una conexión auténtica e inmersiva con el destino, asegurando que veas tanto los lugares emblemáticos como las joyas ocultas con comodidad y estilo.",
  "Sebbene l'itinerario dettagliato giorno per giorno sia completamente personalizzato in base alle tue date di viaggio e preferenze, questo programma è ancorato a diverse esperienze distintive che formano il cuore del tuo viaggio:\n\n• **@HL1**: Esplora questo punto saliente in dettaglio, sperimentando la sua importanza storica e bellezza paesaggistica.\n\n• **@HL2**: Esplora questo punto saliente in dettaglio, sperimentando la sua importanza storica e bellezza paesaggistica.\n\n• **@HL3**: Esplora questo punto saliente in dettaglio, sperimentando la sua importanza storica e bellezza paesaggistica.\n\n• **@HL4**: Esplora questo punto saliente in dettaglio, sperimentando la sua importanza storica e bellezza paesaggistica.\n\nOgnuna di queste esperienze è stata selezionata per fornire una connessione autentica e coinvolgente con la destinazione, assicurandoti di vedere sia i luoghi iconici che i tesori nascosti in comfort e stile.",
  "Embora o itinerário detalhado dia a dia seja totalmente personalizado de acordo com suas datas de viagem e preferências, este programa é ancorado por várias experiências marcantes que formam o núcleo da sua jornada:\n\n• **@HL1**: Explore este destaque em detalhes, experimentando sua importância histórica e beleza cênica.\n\n• **@HL2**: Explore este destaque em detalhes, experimentando sua importância histórica e beleza cênica.\n\n• **@HL3**: Explore este destaque em detalhes, experimentando sua importância histórica e beleza cênica.\n\n• **@HL4**: Explore este destaque em detalhes, experimentando sua importância histórica e beleza cênica.\n\nCada uma dessas experiências foi selecionada para fornecer uma conexão autêntica e imersiva com o destino, garantindo que você veja tanto os pontos turísticos icônicos quanto as joias escondidas com conforto e estilo.");

// Shared closing paragraph for Egypt tours
add("Are you ready to witness the eternal wonders of Egypt? The \"@PACKAGE\" package is the perfect blend of ancient history, cultural immersion, and modern luxury. Contact the travel designers at Dunas Travel today to book your private tour or customize this itinerary to match your specific dates and preferences. Let our expert guides show you the magic of the Nile.",
  "هل أنت مستعد لمشاهدة عجائب مصر الخالدة؟ باقة \"@PACKAGE\" هي المزيج المثالي من التاريخ القديم والانغماس الثقافي والفخامة العصرية. اتصل بمصممي الرحلات في دوناس ترافيل اليوم لحجز جولتك الخاصة أو تخصيص مسار الرحلة ليتناسب مع تواريخك وتفضيلاتك. دع خبراء مرشدينا يظهرون لك سحر النيل.",
  "¿Estás listo para presenciar las maravillas eternas de Egipto? El paquete \"@PACKAGE\" es la combinación perfecta de historia antigua, inmersión cultural y lujo moderno. Contacta a los diseñadores de viajes de Dunas Travel hoy para reservar tu tour privado o personalizar este itinerario según tus fechas y preferencias. Deja que nuestros guías expertos te muestren la magia del Nilo.",
  "Sei pronto a testimoniare le meraviglie eterne dell'Egitto? Il pacchetto \"@PACKAGE\" è la miscela perfetta di storia antica, immersione culturale e lusso moderno. Contatta i designer di viaggi di Dunas Travel oggi per prenotare il tuo tour privato o personalizzare questo itinerario in base alle tue date e preferenze. Lascia che le nostre guide esperte ti mostrino la magia del Nilo.",
  "Você está pronto para testemunhar as maravilhas eternas do Egito? O pacote \"@PACKAGE\" é a combinação perfeita de história antiga, imersão cultural e luxo moderno. Entre em contato com os designers de viagens da Dunas Travel hoje para reservar seu tour privado ou personalizar este itinerário de acordo com suas datas e preferências. Deixe nossos guias especializados mostrarem a magia do Nilo.");

// Egypt practical tips paragraph
add("To ensure a comfortable journey through Egypt, it is best to plan your visit between October and April, when the weather is cooler and perfect for outdoor sightseeing. Pack lightweight, breathable cotton clothing to stay cool, a wide-brimmed hat, sunglasses, and high-SPF sunscreen to protect against the desert sun. Sturdy, comfortable walking shoes are essential for exploring temple ruins and dusty archaeological sites. While beach resorts are very relaxed, it is recommended to dress modestly when exploring historic Cairo or local towns (covering shoulders and knees). Always drink bottled water, carry some local currency (Egyptian Pounds) for small tips, and keep your camera charged for the incredible sights.",
  "لضمان رحلة مريحة عبر مصر، من الأفضل التخطيط لزيارتك بين أكتوبر وأبريل، عندما يكون الطقس أكثر برودة ومثاليًا لمشاهدة المعالم السياحية في الهواء الطلق. احزم ملابس قطنية خفيفة وقابلة للتنفس للبقاء منتعشًا، وقبعة واسعة الحواف، ونظارات شمسية، وواقي شمسي عالي الحماية للحماية من شمس الصحراء. أحذية متينة ومريحة ضرورية لاستكشاف أطلال المعابد والمواقع الأثرية المتربة. بينما تكون منتجعات الشاطئ مريحة للغاية، يُنصح بارتداء ملابس محتشمة عند استكشاف القاهرة التاريخية أو المدن المحلية (تغطية الكتفين والركبتين). اشرب دائمًا المياه المعبأة، واحمل بعض العملات المحلية (الجنيه المصري) للإكراميات الصغيرة، وحافظ على شحن كاميرتك للمناظر المذهلة.",
  "Para garantizar un viaje cómodo por Egipto, es mejor planificar tu visita entre octubre y abril, cuando el clima es más fresco y perfecto para hacer turismo al aire libre. Empaca ropa de algodón ligera y transpirable para mantenerte fresco, un sombrero de ala ancha, gafas de sol y protector solar de alto FPS para protegerte del sol del desierto. Se necesitan zapatos resistentes y cómodos para explorar las ruinas de templos y sitios arqueológicos polvorientos. Si bien los resorts de playa son muy relajados, se recomienda vestir modestamente al explorar El Cairo histórico o pueblos locales (cubriendo hombros y rodillas). Bebe siempre agua embotellada, lleva algo de moneda local (libras egipcias) para pequeñas propinas y mantén tu cámara cargada para las vistas increíbles.",
  "Per garantire un viaggio confortevole attraverso l'Egitto, è meglio pianificare la visita tra ottobre e aprile, quando il clima è più fresco e perfetto per le visite turistiche all'aperto. Prepara abiti di cotone leggeri e traspiranti per stare fresco, un cappello a tesa larga, occhiali da sole e crema solare ad alta protezione per proteggerti dal sole del deserto. Scarpe robuste e comode sono essenziali per esplorare le rovine dei templi e i siti archeologici polverosi. Mentre i resort balneari sono molto rilassati, si consiglia di vestirsi in modo modesto quando si esplora il Cairo storico o le città locali (coprendo spalle e ginocchia). Bevi sempre acqua in bottiglia, porta della valuta locale (sterline egiziane) per piccole mance e tieni la fotocamera carica per le viste incredibili.",
  "Para garantir uma viagem confortável pelo Egito, é melhor planejar sua visita entre outubro e abril, quando o clima é mais fresco e perfeito para passeios ao ar livre. Leve roupas de algodão leves e respiráveis para se manter fresco, um chapéu de aba larga, óculos de sol e protetor solar FPS alto para se proteger do sol do deserto. Sapatos resistentes e confortáveis são essenciais para explorar ruínas de templos e locais arqueológicos empoeirados. Embora os resorts de praia sejam muito relaxados, é recomendável vestir-se modestamente ao explorar o Cairo histórico ou cidades locais (cobrindo ombros e joelhos). Beba sempre água engarrafada, leve alguma moeda local (libras egípcias) para pequenas gorjetas e mantenha sua câmera carregada para as vistas incríveis.");

// ===== BLOG TITLES & EXCERPTS =====
const titleExcerptTranslations = {
  "b-001": {
    title: { ar: "معابد الأقصر الخفية", es: "Los Templos Ocultos de Luxor", it: "I Templi Nascosti di Luxor", pt: "Os Templos Escondidos de Luxor" },
    excerpt: { ar: "بعيدًا عن الكرنك ووادي الملوك توجد معابد لا تصدق وأقل شهرة في انتظار من يستكشفها. اكتشف أسرار طيبة القديمة بدون حشود.", es: "Más allá de Karnak y el Valle de los Reyes se encuentran templos increíbles y menos conocidos esperando ser explorados. Descubre los secretos de la antigua Tebas sin las multitudes.", it: "Oltre Karnak e la Valle dei Re giacciono templi incredibili e meno conosciuti in attesa di essere esplorati. Scopri i segreti dell'antica Tebe senza la folla.", pt: "Para além de Karnak e do Vale dos Reis encontram-se templos incríveis e menos conhecidos à espera de serem explorados. Descubra os segredos da antiga Tebas sem as multidões." }
  },
  "b-002": {
    title: { ar: "البتراء ليلاً", es: "Petra de Noche", it: "Petra di Notte", pt: "Petra à Noite" },
    excerpt: { ar: "تجربة المدينة الوردية المضاءة بآلاف الشموع هي حدث لا يُفوّت. إليك كل ما تحتاج معرفته لتخطيط أمسيتك السحرية.", es: "Experimentar la ciudad rosa iluminada por miles de velas es una experiencia única. Aquí tienes todo lo que necesitas saber para planificar tu mágica velada.", it: "Vivere la città rosa illuminata da migliaia di candele è un'esperienza imperdibile. Ecco tutto ciò che devi sapere per pianificare la tua serata magica.", pt: "Experienciar a cidade rosa iluminada por milhares de velas é uma experiência imperdível. Aqui está tudo o que precisa saber para planear a sua noite mágica." }
  },
  "b-003": {
    title: { ar: "البازار الكبير في إسطنبول", es: "El Gran Bazar de Estambul", it: "Il Gran Bazar di Istanbul", pt: "O Grande Bazar de Istambul" },
    excerpt: { ar: "تجول في أروقة أحد أقدم وأكبر الأسواق المغطاة في العالم. من البقلاوة إلى السجاد العتيق، إليك دليل التسوق النهائي.", es: "Navega por los laberínticos callejones de uno de los mercados cubiertos más grandes y antiguos del mundo. Desde el deleite turco hasta las alfombras antiguas, aquí tienes tu guía de compras definitiva.", it: "Naviga tra i vicoli labirintici di uno dei mercati coperti più grandi e antichi del mondo. Dal delizia turca ai kilim antichi, ecco la tua guida allo shopping definitiva.", pt: "Navegue pelos becos labirínticos de um dos maiores e mais antigos mercados cobertos do mundo. Da delícia turca aos tapetes antigos, aqui está o seu guia de compras definitivo." }
  },
  "b-004": {
    title: { ar: "الإبحار في النيل", es: "Navegando por el Nilo", it: "Navigando il Nilo", pt: "Navegando pelo Nilo" },
    excerpt: { ar: "ابتعد عن سفن الرحلات البحرية الضخمة واختبر شريان حياة مصر على متن فلوكة خشبية تقليدية. رحلة هادئة وأصيلة في انتظارك.", es: "Aléjate de los enormes cruceros y experimenta la línea vital de Egipto en una tradicional faluca de madera. Un viaje pacífico y auténtico te espera.", it: "Allontanati dalle enormi navi da crociera e sperimenta la linfa vitale dell'Egitto su una tradizionale feluca di legno. Un viaggio pacifico e autentico ti aspetta.", pt: "Afaste-se dos enormes navios de cruzeiro e experimente a força vital do Egito numa tradicional feluca de madeira. Uma viagem pacífica e autêntica espera por si." }
  },
  "b-005": {
    title: { ar: "صحراء وادي رم", es: "Desierto de Wadi Rum", it: "Deserto del Wadi Rum", pt: "Deserto de Wadi Rum" },
    excerpt: { ar: "جبال رملية شامخة، رمال قرمزية، وسماء مليئة بالنجوم. اكتشف لماذا التخييم في وادي القمر هو ملاذ الصحراء الأقصى.", es: "Imponentes montañas de arenisca, arenas carmesí y un cielo repleto de estrellas. Descubre por qué acampar en el Valle de la Luna es la escapada desértica definitiva.", it: "Imponenti montagne di arenaria, sabbie cremisi e un cielo stellato. Scopri perché il campeggio nella Valle della Luna è la fuga nel deserto per eccellenza.", pt: "Imponentes montanhas de arenito, areias carmesim e um céu repleto de estrelas. Descubra por que acampar no Vale da Lua é a escapada definitiva no deserto." }
  },
  "b-006": {
    title: { ar: "المطبخ التركي", es: "Cocina Turca", it: "Cucina Turca", pt: "Culinária Turca" },
    excerpt: { ar: "الطعام التركي هو مزيج غني من نكهات آسيا الوسطى والشرق الأوسط والبحر المتوسط. إليك الأطباق الأيقونية التي يجب تذوقها.", es: "La comida turca es una rica fusión de sabores de Asia Central, Oriente Medio y el Mediterráneo. Estos son los platos icónicos que debes probar durante tu visita.", it: "Il cibo turco è una ricca fusione di sapori dell'Asia centrale, del Medio Oriente e del Mediterraneo. Ecco i piatti iconici che devi assolutamente assaggiare durante la tua visita.", pt: "A comida turca é uma rica fusão de sabores da Ásia Central, Oriente Médio e Mediterrâneo. Aqui estão os pratos icônicos que você deve provar durante sua visita." }
  },
  "b-007": {
    title: { ar: "أفضل وقت لزيارة مصر", es: "Mejor Época para Visitar Egipto", it: "Periodo Migliore per Visitare l'Egitto", pt: "Melhor Época para Visitar o Egito" },
    excerpt: { ar: "تخطط لرحلتك الأحلام إلى الأهرامات؟ الطقس يلعب دورًا حاسمًا. اقرأ دليلنا الشامل شهرًا بشهر لاختيار الموسم المثالي.", es: "¿Planeando tu viaje de ensueño a las Pirámides? El clima juega un papel crucial. Lee nuestra guía completa mes a mes para elegir la temporada perfecta.", it: "Stai pianificando il tuo viaggio da sogno alle Piramidi? Il clima gioca un ruolo cruciale. Leggi la nostra guida completa mese per mese per scegliere la stagione perfetta.", pt: "A planear a sua viagem de sonho às Pirâmides? O clima desempenha um papel crucial. Leia o nosso guia completo mês a mês para escolher a estação perfeita." }
  },
  "b-008": {
    title: { ar: "تجربة البحر الميت", es: "Experiencia en el Mar Muerto", it: "Esperienza al Mar Morto", pt: "Experiência no Mar Morto" },
    excerpt: { ar: "إنها أخفض نقطة على الأرض وأكبر منتجع صحي طبيعي في العالم. اكتشف الفوائد الصحية المذهلة للطفو في البحيرة فائقة الملوحة.", es: "Es el punto más bajo de la tierra y el spa natural más grande del mundo. Descubre los increíbles beneficios para la salud de flotar en el lago hipersalino de Jordania.", it: "È il punto più basso della terra e la più grande spa naturale del mondo. Scopri gli incredibili benefici per la salute di galleggiare nel lago ipersalino della Giordania.", pt: "É o ponto mais baixo da terra e o maior spa natural do mundo. Descubra os incríveis benefícios para a saúde de flutuar no lago hipersalino da Jordânia." }
  },
  "b-009": {
    title: { ar: "مناطيد كابادوكيا الهوائية", es: "Globos Aerostáticos de Capadocia", it: "Mongolfiere della Cappadocia", pt: "Balões de Ar Quente da Capadócia" },
    excerpt: { ar: "التحليق بصمت فوق مداخن الجنيات عند شروق الشمس هو تجربة سامية. إليك كل ما تحتاج معرفته عن حجز رحلة بالون في تركيا.", es: "Volar silenciosamente sobre las chimeneas de hadas al amanecer es una experiencia trascendental. Aquí tienes todo lo que necesitas saber sobre reservar un vuelo en globo en Turquía.", it: "Planare silenziosamente sopra i camini delle fate all'alba è un'esperienza trascendentale. Ecco tutto ciò che devi sapere sulla prenotazione di un volo in mongolfiera in Turchia.", pt: "Planar silenciosamente sobre as chaminés de fadas ao nascer do sol é uma experiência transcendental. Aqui está tudo o que precisa saber sobre reservar um voo de balão na Turquia." }
  },
  "b-010": {
    title: { ar: "الدليل الشامل لرحلة كايرو إكسبرس: أجندة سفر فاخرة", es: "La Guía Definitiva de Cairo Express: Un Itinerario de Viaje de Lujo", it: "La Guida Definitiva a Cairo Express: Un Itinerario di Viaggio di Lusso", pt: "O Guia Definitivo do Cairo Express: Um Roteiro de Viagem de Luxo" },
    excerpt: { ar: "استكشف فخامة برنامج كايرو إكسبرس المخصص في مصر. اكتشف لماذا هذه الرحلة التي مدتها 4 أيام / 3 ليالٍ مثالية لأحلام سفرك مع دوناس ترافيل.", es: "Explora el lujo de nuestro programa personalizado Cairo Express en Egipto. Descubre por qué este itinerario de 4 Días / 3 Noches es perfecto para tus sueños de viaje con Dunas Travel.", it: "Esplora il lusso del nostro programma personalizzato Cairo Express in Egitto. Scopri perché questo itinerario di 4 Giorni / 3 Notti è perfetto per i tuoi sogni di viaggio con Dunas Travel.", pt: "Explore o luxo do nosso programa personalizado Cairo Express no Egito. Descubra por que este roteiro de 4 Dias / 3 Noites é perfeito para seus sonhos de viagem com a Dunas Travel." }
  },
  "b-011": {
    title: { ar: "الدليل الشامل لرحلة كايرو إكسبرس مع الإسكندرية: أجندة سفر فاخرة", es: "La Guía Definitiva de Cairo Express con Alejandría: Un Itinerario de Viaje de Lujo", it: "La Guida Definitiva a Cairo Express con Alessandria: Un Itinerario di Viaggio di Lusso", pt: "O Guia Definitivo do Cairo Express com Alexandria: Um Roteiro de Viagem de Luxo" },
    excerpt: { ar: "استكشف فخامة برنامج كايرو إكسبرس مع الإسكندرية في مصر. اكتشف لماذا هذه الرحلة التي مدتها 5 أيام / 4 ليالٍ مثالية لأحلام سفرك.", es: "Explora el lujo de nuestro programa Cairo Express con Alejandría en Egipto. Descubre por qué este itinerario de 5 Días / 4 Noches es perfecto para tus sueños de viaje.", it: "Esplora il lusso del nostro programma Cairo Express con Alessandria in Egitto. Scopri perché questo itinerario di 5 Giorni / 4 Notti è perfetto per i tuoi sogni di viaggio.", pt: "Explore o luxo do nosso programa Cairo Express com Alexandria no Egito. Descubra por que este roteiro de 5 Dias / 4 Noites é perfeito para seus sonhos de viagem." }
  },
  "b-012": {
    title: { ar: "الدليل الشامل لرحلة إيجيتو كلاسيكو: القاهرة + رحلة نيلية: أجندة سفر فاخرة", es: "La Guía Definitiva de Egito Clássico: El Cairo + Crucero por el Nilo: Un Itinerario de Viaje de Lujo", it: "La Guida Definitiva a Egito Clássico: Il Cairo + Crociera sul Nilo: Un Itinerario di Viaggio di Lusso", pt: "O Guia Definitivo do Egito Clássico: Cairo + Cruzeiro no Nilo: Um Roteiro de Viagem de Luxo" },
    excerpt: { ar: "استكشف فخامة برنامج إيجيتو كلاسيكو: القاهرة + رحلة نيلية في مصر. اكتشف لماذا هذه الرحلة التي مدتها 8 أيام / 7 ليالٍ مثالية لأحلام سفرك.", es: "Explora el lujo de nuestro programa Egito Clássico: El Cairo + Crucero por el Nilo en Egipto. Descubre por qué este itinerario de 8 Días / 7 Noches es perfecto para tus sueños de viaje.", it: "Esplora il lusso del nostro programma Egito Clássico: Il Cairo + Crociera sul Nilo in Egitto. Scopri perché questo itinerario di 8 Giorni / 7 Notti è perfetto per i tuoi sogni di viaggio.", pt: "Explore o luxo do nosso programa Egito Clássico: Cairo + Cruzeiro no Nilo no Egito. Descubra por que este roteiro de 8 Dias / 7 Noites é perfeito para seus sonhos de viagem." }
  },
  "b-013": {
    title: { ar: "الدليل الشامل لرحلة إيجيتو كلاسيكو II: القاهرة + رحلة نيلية: أجندة سفر فاخرة", es: "La Guía Definitiva de Egito Clássico II: El Cairo + Crucero por el Nilo: Un Itinerario de Viaje de Lujo", it: "La Guida Definitiva a Egito Clássico II: Il Cairo + Crociera sul Nilo: Un Itinerario di Viaggio di Lusso", pt: "O Guia Definitivo do Egito Clássico II: Cairo + Cruzeiro no Nilo: Um Roteiro de Viagem de Luxo" },
    excerpt: { ar: "استكشف فخامة برنامج إيجيتو كلاسيكو II: القاهرة + رحلة نيلية في مصر. اكتشف لماذا هذه الرحلة التي مدتها 9 أيام / 8 ليالٍ مثالية.", es: "Explora el lujo de nuestro programa Egito Clássico II: El Cairo + Crucero por el Nilo en Egipto. Descubre por qué este itinerario de 9 Días / 8 Noches es perfecto.", it: "Esplora il lusso del nostro programma Egito Clássico II: Il Cairo + Crociera sul Nilo in Egitto. Scopri perché questo itinerario di 9 Giorni / 8 Notti è perfetto.", pt: "Explore o luxo do nosso programa Egito Clássico II: Cairo + Cruzeiro no Nilo no Egito. Descubra por que este roteiro de 9 Dias / 8 Noites é perfeito." }
  },
  "b-014": {
    title: { ar: "الدليل الشامل لرحلة إيجيتو هيستوريكو: القاهرة + رحلة نيلية + البحر الأحمر", es: "La Guía Definitiva de Egito Histórico: El Cairo + Crucero + Mar Rojo", it: "La Guida Definitiva a Egito Histórico: Il Cairo + Crociera + Mar Rosso", pt: "O Guia Definitivo do Egito Histórico: Cairo + Cruzeiro + Mar Vermelho" },
    excerpt: { ar: "استكشف فخامة برنامج إيجيتو هيستوريكو: القاهرة + رحلة نيلية + البحر الأحمر في مصر. 10 أيام / 9 ليالٍ.", es: "Explora el lujo de nuestro programa Egito Histórico: El Cairo + Crucero + Mar Rojo en Egipto. 10 Días / 9 Noches.", it: "Esplora il lusso del nostro programma Egito Histórico: Il Cairo + Crociera + Mar Rosso in Egitto. 10 Giorni / 9 Notti.", pt: "Explore o luxo do nosso programa Egito Histórico: Cairo + Cruzeiro + Mar Vermelho no Egito. 10 Dias / 9 Noites." }
  },
  "b-015": {
    title: { ar: "الدليل الشامل: القاهرة مع رحلة نيلية + شرم الشيخ", es: "La Guía Definitiva: El Cairo con Crucero + Sharm El Sheikh", it: "La Guida Definitiva: Il Cairo con Crociera + Sharm El Sheikh", pt: "O Guia Definitivo: Cairo com Cruzeiro + Sharm El Sheikh" },
    excerpt: { ar: "استكشف برنامج القاهرة مع رحلة نيلية + شرم الشيخ في مصر. 11 يومًا / 10 ليالٍ.", es: "Explora el programa El Cairo con Crucero + Sharm El Sheikh en Egipto. 11 Días / 10 Noches.", it: "Esplora il programma Il Cairo con Crociera + Sharm El Sheikh in Egitto. 11 Giorni / 10 Notti.", pt: "Explore o programa Cairo com Cruzeiro + Sharm El Sheikh no Egito. 11 Dias / 10 Noites." }
  },
  "b-016": {
    title: { ar: "الدليل الشامل: رمسيس العظيم - وصف كامل (9 ليالٍ / 10 أيام)", es: "La Guía Definitiva: El Gran Ramsés - Descripción Completa (09 Noches / 10 Días)", it: "La Guida Definitiva: Il Grande Ramses - Descrizione Completa (09 Notti / 10 Giorni)", pt: "O Guia Definitivo: O Grande Ramsés - Descrição Completa (09 Noites / 10 Dias)" },
    excerpt: { ar: "استكشف برنامج رمسيس العظيم الفاخر في مصر. 10 أيام / 9 ليالٍ من التاريخ والرفاهية.", es: "Explora el lujoso programa El Gran Ramsés en Egipto. 10 Días / 9 Noches de historia y lujo.", it: "Esplora il lussuoso programma Il Grande Ramses in Egitto. 10 Giorni / 9 Notti di storia e lusso.", pt: "Explore o luxuoso programa O Grande Ramsés no Egito. 10 Dias / 9 Noites de história e luxo." }
  },
  "b-017": {
    title: { ar: "الدليل الشامل: كنوز مصر مع الإسكندرية", es: "La Guía Definitiva: Tesoros de Egipto con Alejandría", it: "La Guida Definitiva: Tesori d'Egitto con Alessandria", pt: "O Guia Definitivo: Tesouros do Egito com Alexandria" },
    excerpt: { ar: "استكشف برنامج كنوز مصر مع الإسكندرية الفاخر. 9 أيام / 8 ليالٍ من الاكتشاف.", es: "Explora el lujoso programa Tesoros de Egipto con Alejandría. 9 Días / 8 Noches de descubrimiento.", it: "Esplora il lussuoso programma Tesori d'Egitto con Alessandria. 9 Giorni / 8 Notti di scoperta.", pt: "Explore o luxuoso programa Tesouros do Egito com Alexandria. 9 Dias / 8 Noites de descoberta." }
  },
  "b-018": {
    title: { ar: "الدليل الشامل: أفضل ما في اليونان – 09 أيام", es: "La Guía Definitiva: Lo Mejor de Grecia – 09 Días", it: "La Guida Definitiva: Il Meglio della Grecia – 09 Giorni", pt: "O Guia Definitivo: O Melhor da Grécia – 09 Dias" },
    excerpt: { ar: "استكشف برنامج أفضل ما في اليونان مع دوناس ترافيل. 9 أيام / 8 ليالٍ من سحر البحر المتوسط.", es: "Explora el programa Lo Mejor de Grecia con Dunas Travel. 9 Días / 8 Noches de magia mediterránea.", it: "Esplora il programma Il Meglio della Grecia con Dunas Travel. 9 Giorni / 8 Notti di magia mediterranea.", pt: "Explore o programa O Melhor da Grécia com a Dunas Travel. 9 Dias / 8 Noites de magia mediterrânea." }
  },
  "b-019": {
    title: { ar: "الدليل الشامل: رحلة مصر الكاملة الفاخرة", es: "La Guía Definitiva: Tour Completo de Egipto de Lujo", it: "La Guida Definitiva: Tour Completo dell'Egitto di Lusso", pt: "O Guia Definitivo: Tour Completo do Egito de Luxo" },
    excerpt: { ar: "استكشف برنامج رحلة مصر الكاملة الفاخر. اكتشف عجائب مصر القديمة برفقة دوناس ترافيل.", es: "Explora el lujoso programa Tour Completo de Egipto. Descubre las maravillas del antiguo Egipto con Dunas Travel.", it: "Esplora il lussuoso programma Tour Completo dell'Egitto. Scopri le meraviglie dell'antico Egitto con Dunas Travel.", pt: "Explore o luxuoso programa Tour Completo do Egito. Descubra as maravilhas do antigo Egito com a Dunas Travel." }
  },
  "b-020": {
    title: { ar: "الدليل الشامل: تونس 8 أيام صحراء وبحر", es: "La Guía Definitiva: Túnez 8 Días Desierto y Mar", it: "La Guida Definitiva: Tunisia 8 Giorni Deserto e Mare", pt: "O Guia Definitivo: Tunísia 8 Dias Deserto e Mar" },
    excerpt: { ar: "استكشف برنامج تونس 8 أيام صحراء وبحر. جنة شمال أفريقيا بين التاريخ والبحر.", es: "Explora el programa Túnez 8 Días Desierto y Mar. La joya del norte de África entre historia y mar.", it: "Esplora il programma Tunisia 8 Giorni Deserto e Mare. La gemma del Nord Africa tra storia e mare.", pt: "Explore o programa Tunísia 8 Dias Deserto e Mar. A joia do Norte de África entre história e mar." }
  },
  "b-021": {
    title: { ar: "الدليل الشامل: تركيا الأسطورية بقطار فائق السرعة", es: "La Guía Definitiva: Turquía Legendaria en Tren de Alta Velocidad", it: "La Guida Definitiva: Turchia Leggendaria in Treno ad Alta Velocità", pt: "O Guia Definitivo: Turquia Lendária em Trem de Alta Velocidade" },
    excerpt: { ar: "استكشف برنامج تركيا الأسطورية بقطار فائق السرعة. 11 يومًا / 10 ليالٍ من التاريخ والجمال.", es: "Explora el programa Turquía Legendaria en Tren de Alta Velocidad. 11 Días / 10 Noches de historia y belleza.", it: "Esplora il programma Turchia Leggendaria in Treno ad Alta Velocità. 11 Giorni / 10 Notti di storia e bellezza.", pt: "Explore o programa Turquia Lendária em Trem de Alta Velocidade. 11 Dias / 10 Noites de história e beleza." }
  },
  "b-022": {
    title: { ar: "الدليل الشامل: نجوم الشرق الأوسط", es: "La Guía Definitiva: Estrellas del Medio Oriente", it: "La Guida Definitiva: Stelle del Medio Oriente", pt: "O Guia Definitivo: Estrelas do Oriente Médio" },
    excerpt: { ar: "استكشف برنامج نجوم الشرق الأوسط متعدد البلدان. 19 يومًا / 18 ليلة عبر مصر والأردن وتركيا ودبي.", es: "Explora el programa multi-país Estrellas del Medio Oriente. 19 Días / 18 Noches por Egipto, Jordania, Turquía y Dubái.", it: "Esplora il programma multi-paese Stelle del Medio Oriente. 19 Giorni / 18 Notti attraverso Egitto, Giordania, Turchia e Dubai.", pt: "Explore o programa multi-país Estrelas do Oriente Médio. 19 Dias / 18 Noites pelo Egito, Jordânia, Turquia e Dubai." }
  },
  "b-023": {
    title: { ar: "الدليل الشامل: القاهرة وأثينا 11 يومًا", es: "La Guía Definitiva: El Cairo y Atenas 11 Días", it: "La Guida Definitiva: Il Cairo e Atene 11 Giorni", pt: "O Guia Definitivo: Cairo e Atenas 11 Dias" },
    excerpt: { ar: "استكشف برنامج القاهرة وأثينا متعدد البلدان. 11 يومًا / 10 ليالٍ من عجائب البحر المتوسط.", es: "Explora el programa multi-país El Cairo y Atenas. 11 Días / 10 Noches de maravillas mediterráneas.", it: "Esplora il programma multi-paese Il Cairo e Atene. 11 Giorni / 10 Notti di meraviglie mediterranee.", pt: "Explore o programa multi-país Cairo e Atenas. 11 Dias / 10 Noites de maravilhas mediterrâneas." }
  },
  "b-024": {
    title: { ar: "الدليل الشامل: جوهر مصر وتركيا 15 يومًا", es: "La Guía Definitiva: Esencias de Egipto y Turquía 15 Días", it: "La Guida Definitiva: Essenze di Egitto e Turchia 15 Giorni", pt: "O Guia Definitivo: Essências do Egito e Turquia 15 Dias" },
    excerpt: { ar: "استكشف برنامج جوهر مصر وتركيا متعدد البلدان. 15 يومًا / 14 ليلة من السفر الفاخر.", es: "Explora el programa multi-país Esencias de Egipto y Turquía. 15 Días / 14 Noches de viaje de lujo.", it: "Esplora il programma multi-paese Essenze di Egitto e Turchia. 15 Giorni / 14 Notti di viaggio di lusso.", pt: "Explore o programa multi-país Essências do Egito e Turquia. 15 Dias / 14 Noites de viagem de luxo." }
  },
  "b-025": {
    title: { ar: "الدليل الشامل: روائع دبي وتركيا 14 يومًا", es: "La Guía Definitiva: Maravillas de Dubái y Turquía", it: "La Guida Definitiva: Meraviglie di Dubai e Turchia", pt: "O Guia Definitivo: Maravilhas de Dubai e Turquia" },
    excerpt: { ar: "استكشف برنامج روائع دبي وتركيا متعدد البلدان. 14 يومًا / 13 ليلة من الفخامة والمغامرة.", es: "Explora el programa multi-país Maravillas de Dubái y Turquía. 14 Días / 13 Noches de lujo y aventura.", it: "Esplora il programma multi-paese Meraviglie di Dubai e Turchia. 14 Giorni / 13 Notti di lusso e avventura.", pt: "Explore o programa multi-país Maravilhas de Dubai e Turquia. 14 Dias / 13 Noites de luxo e aventura." }
  }
};

// ===== ADD TRANSLATIONS =====
add("The Hidden Temples of Luxor", "معابد الأقصر الخفية", "Los Templos Ocultos de Luxor", "I Templi Nascosti di Luxor", "Os Templos Escondidos de Luxor");
add("Petra by Night", "البتراء ليلاً", "Petra de Noche", "Petra di Notte", "Petra à Noite");
add("Istanbul's Grand Bazaar", "البازار الكبير في إسطنبول", "El Gran Bazar de Estambul", "Il Gran Bazar di Istanbul", "O Grande Bazar de Istambul");
add("Sailing the Nile", "الإبحار في النيل", "Navegando por el Nilo", "Navigando il Nilo", "Navegando pelo Nilo");
add("Wadi Rum Desert", "صحراء وادي رم", "Desierto de Wadi Rum", "Deserto del Wadi Rum", "Deserto de Wadi Rum");
add("Turkish Cuisine", "المطبخ التركي", "Cocina Turca", "Cucina Turca", "Culinária Turca");
add("Best Time to Visit Egypt", "أفضل وقت لزيارة مصر", "Mejor Época para Visitar Egipto", "Periodo Migliore per Visitare l'Egitto", "Melhor Época para Visitar o Egito");
add("Dead Sea Experience", "تجربة البحر الميت", "Experiencia en el Mar Muerto", "Esperienza al Mar Morto", "Experiência no Mar Morto");
add("Cappadocia Hot Air Balloons", "مناطيد كابادوكيا الهوائية", "Globos Aerostáticos de Capadocia", "Mongolfiere della Cappadocia", "Balões de Ar Quente da Capadócia");

// Read each locale file, modify, and save
const locales = ['ar', 'es', 'it', 'pt'];
const localesDir = join(__dirname, 'src', 'i18n', 'locales');

locales.forEach(locale => {
  const filePath = join(localesDir, `${locale}.json`);
  let json = JSON.parse(readFileSync(filePath, 'utf-8'));

  let added = 0;

  // Add shared content translations
  Object.entries(translations).forEach(([enText, trans]) => {
    const key = enText;
    const val = trans[locale];
    if (!json[key]) {
      json[key] = val;
      added++;
    }
  });

  // Add blog-specific title + excerpt
  Object.entries(titleExcerptTranslations).forEach(([blogId, fields]) => {
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) return;

    // Title
    const titleKey = blog.title;
    if (!json[titleKey] && fields.title) {
      json[titleKey] = fields.title[locale];
      added++;
    }

    // Excerpt
    const excerptKey = blog.excerpt;
    if (!json[excerptKey] && fields.excerpt) {
      json[excerptKey] = fields.excerpt[locale];
      added++;
    }
  });

  writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
  console.log(`${locale}.json: added ${added} translations`);
});

console.log('Done!');
