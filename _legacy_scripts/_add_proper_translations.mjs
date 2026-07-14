import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { blogs } = await import('./src/data/blogs.js');

const templates = {};

function add(en, ar, es, it, pt) {
  templates[en] = { ar, es, it, pt };
}

// ===== HEADINGS =====
add("## What is Included in This Journey",
  "## ما يشمل هذه الرحلة", "## Qué está incluido en este viaje", "## Cosa include questo viaggio", "## O que está incluído nesta viagem");
add("## Day-by-Day Highlights & Key Experiences",
  "## أبرز النقاط والتجارب الرئيسية يومًا بيوم", "## Destacados día a día y experiencias clave", "## Punti salienti giornalieri ed esperienze chiave", "## Destaques diários e experiências-chave");
add("## Book Your Experience",
  "## احجز تجربتك", "## Reserva tu experiencia", "## Prenota la tua esperienza", "## Reserve sua experiência");
add("## Why Visit Egypt",
  "## لماذا تزور مصر", "## Por qué visitar Egipto", "## Perché visitare l'Egitto", "## Por que visitar o Egito");
add("## Why Visit Turkey",
  "## لماذا تزور تركيا", "## Por qué visitar Turquía", "## Perché visitare la Turchia", "## Por que visitar a Turquia");
add("## Why Visit Greece",
  "## لماذا تزور اليونان", "## Por qué visitar Grecia", "## Perché visitare la Grecia", "## Por que visitar a Grécia");
add("## Why Visit Tunisia",
  "## لماذا تزور تونس", "## Por qué visitar Túnez", "## Perché visitare la Tunisia", "## Por que visitar a Tunísia");
add("## Why Visit Jordan",
  "## لماذا تزور الأردن", "## Por qué visitar Jordania", "## Perché visitare la Giordania", "## Por que visitar a Jordânia");
add("## Why Visit Dubai",
  "## لماذا تزور دبي", "## Por qué visitar Dubái", "## Perché visitare Dubai", "## Por que visitar Dubai");
add("## Why Visit Morocco",
  "## لماذا تزور المغرب", "## Por qué visitar Marruecos", "## Perché visitare il Marocco", "## Por que visitar Marrocos");
add("## Why Visit Multi-country",
  "## لماذا تزور عدة بلدان", "## Por qué visitar varios países", "## Perché visitare più paesi", "## Por que visitar vários países");
add("## Practical Tips for Your Egypt Adventure",
  "## نصائح عملية لمغامرتك في مصر", "## Consejos prácticos para tu aventura en Egipto", "## Consigli pratici per la tua avventura in Egitto", "## Dicas práticas para sua aventura no Egito");
add("## Practical Tips for Your Turkey Adventure",
  "## نصائح عملية لمغامرتك في تركيا", "## Consejos prácticos para tu aventura en Turquía", "## Consigli pratici per la tua avventura in Turchia", "## Dicas práticas para sua aventura na Turquia");
add("## Practical Tips for Your Greece Adventure",
  "## نصائح عملية لمغامرتك في اليونان", "## Consejos prácticos para tu aventura en Grecia", "## Consigli pratici per la tua avventura in Grecia", "## Dicas práticas para sua aventura na Grécia");
add("## Practical Tips for Your Tunisia Adventure",
  "## نصائح عملية لمغامرتك في تونس", "## Consejos prácticos para tu aventura en Túnez", "## Consigli pratici per la tua avventura in Tunisia", "## Dicas práticas para sua aventura na Tunísia");
add("## Practical Tips for Your Multi-country Adventure",
  "## نصائح عملية لمغامرتك متعددة البلدان", "## Consejos prácticos para tu aventura en varios países", "## Consigli pratici per la tua avventura in più paesi", "## Dicas práticas para sua aventura em vários países");

// ===== EGYPT TEMPLATES =====
add("Few places on earth capture the imagination quite like Egypt. From the towering heights of the Great Pyramid of Giza to the serene flow of the Nile River, this ancient land is a living testament to human history and architectural grandeur. The \"@PACKAGE\" package by Dunas Travel offers a carefully curated @DAYS itinerary designed to immerse you in the magic of the pharaohs. Whether you are gazing at the Sphinx, exploring the subterranean tombs in the Valley of the Kings, or relaxing by the crystal-clear waters of the Red Sea, every moment of this journey promises to be extraordinary. Written in a captivating storytelling tone, this travel guide will walk you through the key experiences that make this trip a must-book experience.",
  "قلة من الأماكن على الأرض تخطف الخيال مثل مصر. من ارتفاع هرم الجيزة الأكبر إلى التدفق الهادئ لنهر النيل، هذه الأرض القديمة هي شهادة حية على التاريخ البشري والعظمة المعمارية. تقدم باقة \"@PACKAGE\" من دوناس ترافيل رحلة @DAYS مصممة بعناية لتغمرك في سحر الفراعنة. سواء كنت تتأمل أبو الهول، أو تستكشف المقابر تحت الأرض في وادي الملوك، أو تسترخي على المياه الصافية للبحر الأحمر، فإن كل لحظة في هذه الرحلة تعد بأن تكون استثنائية. مكتوب بأسلوب سردي آسر، سيرشدك هذا الدليل السياحي خلال التجارب الرئيسية التي تجعل هذه الرحلة تجربة لا تُفوّت.",
  "Pocos lugares en el mundo capturan la imaginación como Egipto. Desde las imponentes alturas de la Gran Pirámide de Giza hasta el sereno fluir del río Nilo, esta tierra antigua es un testimonio vivo de la historia humana y la grandeza arquitectónica. El paquete \"@PACKAGE\" de Dunas Travel ofrece un itinerario de @DAYS cuidadosamente seleccionado para sumergirte en la magia de los faraones. Ya sea contemplando la Esfinge, explorando las tumbas subterráneas del Valle de los Reyes o relajándote en las cristalinas aguas del Mar Rojo, cada momento de este viaje promete ser extraordinario. Escrito en un tono narrativo cautivador, esta guía te llevará a través de las experiencias clave que hacen de este viaje una experiencia imprescindible.",
  "Pochi luoghi sulla terra catturano l'immaginazione come l'Egitto. Dalle imponenti altezze della Grande Piramide di Giza al sereno scorrere del fiume Nilo, questa terra antica è una testimonianza vivente della storia umana e della grandezza architettonica. Il pacchetto \"@PACKAGE\" di Dunas Travel offre un itinerario di @DAYS accuratamente curato per immergerti nella magia dei faraoni. Che tu stia ammirando la Sfinge, esplorando le tombe sotterranee nella Valle dei Re o rilassandoti nelle acque cristalline del Mar Rosso, ogni momento di questo viaggio promette di essere straordinario. Scritto in uno stile narrativo accattivante, questa guida ti accompagnerà attraverso le esperienze chiave che rendono questo viaggio imperdibile.",
  "Poucos lugares na terra capturam a imaginação como o Egito. Das imponentes alturas da Grande Pirâmide de Gizé ao sereno fluxo do Rio Nilo, esta terra antiga é um testemunho vivo da história humana e da grandeza arquitetônica. O pacote \"@PACKAGE\" da Dunas Travel oferece um itinerário de @DAYS cuidadosamente selecionado para mergulhá-lo na magia dos faraós. Quer você esteja contemplando a Esfinge, explorando os túmulos subterrâneos no Vale dos Reis ou relaxando nas águas cristalinas do Mar Vermelho, cada momento desta jornada promete ser extraordinário. Escrito em um tom narrativo cativante, este guia de viagem o levará através das experiências-chave que tornam esta viagem imperdível.");

add("Egypt is a destination that transcends time. Standing before the Great Pyramid of Giza—the only surviving wonder of the ancient world—is a humbling experience that connects you directly to the dawn of civilization. Beyond the pyramids, Egypt offers a rich tapestry of history, from the temple complexes of Luxor and Karnak to the beautiful tombs of the Valley of the Kings. Traveling along the Nile on a luxury river cruise allows you to witness rural life that has remained unchanged for millennia, while the vibrant streets of Cairo offer an exciting mix of historic mosques, Coptic churches, and bustling bazaars. For those seeking relaxation, the pristine coral reefs and luxury resorts of Sharm El Sheikh and Hurghada provide world-class diving and seaside comfort. Egypt is not just a place to visit; it is a journey into the history of humanity itself.",
  "مصر هي وجهة تتجاوز الزمن. الوقوف أمام الهرم الأكبر بالجيزة—الأعجوبة الوحيدة الباقية من العالم القديم—هي تجربة متواضعة تربطك مباشرة بفجر الحضارة. إلى جانب الأهرامات، تقدم مصر نسيجًا غنيًا من التاريخ، من مجمعات معابد الأقصر والكرنك إلى المقابر الجميلة في وادي الملوك. السفر على طول النيل في رحلة نهرية فاخرة يتيح لك مشاهدة الحياة الريفية التي لم تتغير لآلاف السنين، بينما تقدم شوارع القاهرة النابضة بالحياة مزيجًا مثيرًا من المساجد التاريخية والكنائس القبطية والأسواق الصاخبة. لمن يبحثون عن الاسترخاء، توفر الشعاب المرجانية البكر ومنتجعات شرم الشيخ والغردقة الفاخرة غوصًا عالمي المستوى وراحة على الشاطئ. مصر ليست مجرد مكان للزيارة؛ إنها رحلة في تاريخ الإنسانية نفسه.",
  "Egipto es un destino que trasciende el tiempo. Estar frente a la Gran Pirámide de Giza, la única maravilla sobreviviente del mundo antiguo, es una experiencia humilde que te conecta directamente con los albores de la civilización. Más allá de las pirámides, Egipto ofrece un rico tapiz histórico, desde los complejos de templos de Luxor y Karnak hasta las hermosas tumbas del Valle de los Reyes. Viajar por el Nilo en un crucero de lujo te permite presenciar la vida rural que ha permanecido inmutable durante milenios, mientras que las vibrantes calles de El Cairo ofrecen una emocionante mezcla de mezquitas históricas, iglesias coptas y bulliciosos bazares. Para quienes buscan relajación, los prístinos arrecifes de coral y los resorts de lujo de Sharm El Sheikh y Hurghada ofrecen buceo de clase mundial y confort junto al mar. Egipto no es solo un lugar para visitar; es un viaje a la historia de la humanidad misma.",
  "L'Egitto è una destinazione che trascende il tempo. Trovarsi di fronte alla Grande Piramide di Giza—l'unica meraviglia sopravvissuta del mondo antico—è un'esperienza umile che ti connette direttamente all'alba della civiltà. Oltre le piramidi, l'Egitto offre un ricco arazzo di storia, dai complessi templari di Luxor e Karnak alle belle tombe della Valle dei Re. Viaggiare lungo il Nilo su una crociera di lusso ti permette di assistere alla vita rurale rimasta immutata per millenni, mentre le vibranti strade del Cairo offrono un'entusiasmante miscela di moschee storiche, chiese copte e vivaci bazar. Per chi cerca relax, le incontaminate barriere coralline e i resort di lusso di Sharm El Sheikh e Hurghada offrono immersioni di livello mondiale e comfort marino. L'Egitto non è solo un posto da visitare; è un viaggio nella storia dell'umanità stessa.",
  "O Egito é um destino que transcende o tempo. Estar diante da Grande Pirâmide de Gizé—a única maravilha sobrevivente do mundo antigo—é uma experiência humilde que o conecta diretamente ao amanhecer da civilização. Além das pirâmides, o Egito oferece uma rica tapeçaria de história, dos complexos de templos de Luxor e Karnak aos belos túmulos do Vale dos Reis. Viajar ao longo do Nilo em um cruzeiro de luxo permite testemunhar a vida rural que permaneceu inalterada por milênios, enquanto as vibrantes ruas do Cairo oferecem uma mistura emocionante de mesquitas históricas, igrejas copta e bazares movimentados. Para quem busca relaxamento, os recifes de corais intocados e os resorts de luxo de Sharm El Sheikh e Hurghada oferecem mergulho de classe mundial e conforto à beira-mar. O Egito não é apenas um lugar para visitar; é uma viagem à própria história da humanidade.");

add("The \"@PACKAGE\" package is designed to offer a complete, worry-free luxury travel experience. Over the course of this @DAYS journey, Dunas Travel takes care of every logistical detail. Guests will enjoy handpicked accommodation in premium 5-star hotels and luxury desert camps, private airport transfers in modern executive vehicles, and domestic flights within the destinations. Daily breakfast is included, along with select lunches and dinners featuring authentic local cuisine. Sightseeing is conducted in private or small-group settings, led by professional, certified bilingual guides who bring the history and culture of each site to life. Additionally, all entrance fees to the attractions listed in the itinerary are fully covered, and our 24/7 concierge support is always available to assist with any personal requests, reservations, or recommendations.",
  "باقة \"@PACKAGE\" مصممة لتقديم تجربة سفر فاخرة خالية من القلق. على مدار رحلة @DAYS، تتولى دوناس ترافيل كل التفاصيل اللوجستية. سيستمتع الضيوف بإقامة مختارة في فنادق 5 نجوم فاخرة ومخيمات صحراوية راقية، وانتقالات خاصة من المطار بسيارات تنفيذية حديثة، و رحلات طيران داخلية بين الوجهات. يتم تضمين الإفطار اليومي، بالإضافة إلى وجبات غداء وعشاء مختارة من المأكولات المحلية الأصيلة. تتم الجولات السياحية بإعدادات خاصة أو بمجموعات صغيرة، بقيادة مرشدين محترفين معتمدين ثنائيي اللغة يجعلون تاريخ وثقافة كل موقع تنبض بالحياة. بالإضافة إلى ذلك، جميع رسوم الدخول للمعالم المدرجة في مسار الرحلة مغطاة بالكامل، وخدمة الكونسيرج على مدار الساعة متاحة دائمًا للمساعدة في أي طلبات شخصية أو حجوزات أو توصيات.",
  "El paquete \"@PACKAGE\" está diseñado para ofrecer una experiencia de viaje de lujo completa y sin preocupaciones. Durante este viaje de @DAYS, Dunas Travel se encarga de cada detalle logístico. Los huéspedes disfrutarán de alojamiento seleccionado en hoteles premium de 5 estrellas y campamentos de lujo en el desierto, traslados privados desde el aeropuerto en vehículos ejecutivos modernos y vuelos nacionales dentro de los destinos. Se incluye desayuno diario, junto con almuerzos y cenas seleccionados con auténtica cocina local. Las visitas turísticas se realizan en entornos privados o en grupos pequeños, guiados por profesionales bilingües certificados que dan vida a la historia y cultura de cada sitio. Además, todas las tarifas de entrada a las atracciones enumeradas en el itinerario están completamente cubiertas, y nuestro servicio de conserjería 24/7 está siempre disponible para ayudar con cualquier solicitud personal, reserva o recomendación.",
  "Il pacchetto \"@PACKAGE\" è progettato per offrire un'esperienza di viaggio di lusso completa e senza preoccupazioni. Nel corso di questo viaggio di @DAYS, Dunas Travel si occupa di ogni dettaglio logistico. Gli ospiti godranno di alloggi selezionati in hotel premium a 5 stelle e lussuosi campi nel deserto, trasferimenti privati dall'aeroporto in moderni veicoli executive e voli domestici tra le destinazioni. È inclusa la colazione quotidiana, insieme a pranzi e cene selezionati con autentica cucina locale. Le visite turistiche si svolgono in contesti privati o in piccoli gruppi, guidati da guide professioniste certificate bilingue che danno vita alla storia e alla cultura di ogni sito. Inoltre, tutte le quote d'ingresso alle attrazioni elencate nell'itinerario sono completamente coperte e il nostro servizio di concierge 24/7 è sempre disponibile per assistere con richieste personali, prenotazioni o raccomandazioni.",
  "O pacote \"@PACKAGE\" é projetado para oferecer uma experiência de viagem de luxo completa e sem preocupações. Ao longo desta jornada de @DAYS, a Dunas Travel cuida de cada detalhe logístico. Os hóspedes desfrutarão de acomodações selecionadas em hotéis premium 5 estrelas e acampamentos de luxo no deserto, traslados privados do aeroporto em veículos executivos modernos e voos domésticos entre os destinos. O café da manhã diário está incluído, juntamente com almoços e jantares selecionados com autêntica culinária local. Os passeios turísticos são realizados em ambientes privados ou em pequenos grupos, guiados por profissionais certificados bilíngues que dão vida à história e cultura de cada local. Além disso, todas as taxas de entrada para as atrações listadas no itinerário são totalmente cobertas, e nosso serviço de concierge 24/7 está sempre disponível para ajudar com quaisquer solicitações pessoais, reservas ou recomendações.");

add("While the detailed day-by-day itinerary is fully customized to your travel dates and preferences, this program is anchored by several signature experiences that form the core of your journey:\n\n• **@HL1**: Explore this remarkable highlight in detail, experiencing its historical importance and scenic beauty.\n\n• **@HL2**: Explore this remarkable highlight in detail, experiencing its historical importance and scenic beauty.\n\n• **@HL3**: Explore this remarkable highlight in detail, experiencing its historical importance and scenic beauty.\n\n• **@HL4**: Explore this remarkable highlight in detail, experiencing its historical importance and scenic beauty.\n\nEach of these experiences has been selected to provide an authentic and immersive connection to the destination, ensuring that you see both the iconic sights and the hidden gems in comfort and style.",
  "بينما يتم تخصيص مسار الرحلة التفصيلي يومًا بيوم بالكامل وفقًا لتواريخ سفرك وتفضيلاتك، فإن هذا البرنامج يستند إلى عدة تجارب مميزة تشكل جوهر رحلتك:\n\n• **@HL1**: استكشف هذا المعلم البارز بالتفصيل، واستمتع بأهميته التاريخية وجماله الخلاب.\n\n• **@HL2**: استكشف هذا المعلم البارز بالتفصيل، واستمتع بأهميته التاريخية وجماله الخلاب.\n\n• **@HL3**: استكشف هذا المعلم البارز بالتفصيل، واستمتع بأهميته التاريخية وجماله الخلاب.\n\n• **@HL4**: استكشف هذا المعلم البارز بالتفصيل، واستمتع بأهميته التاريخية وجماله الخلاب.\n\nتم اختيار كل من هذه التجارب لتوفير اتصال أصيل وعميق بالوجهة، مما يضمن لك رؤية كل من المعالم الشهيرة والجواهر الخفية براحة وأناقة.",
  "Si bien el itinerario detallado día a día está completamente personalizado según tus fechas de viaje y preferencias, este programa se basa en varias experiencias emblemáticas que forman el núcleo de tu viaje:\n\n• **@HL1**: Explora este destacado en detalle, experimentando su importancia histórica y belleza escénica.\n\n• **@HL2**: Explora este destacado en detalle, experimentando su importancia histórica y belleza escénica.\n\n• **@HL3**: Explora este destacado en detalle, experimentando su importancia histórica y belleza escénica.\n\n• **@HL4**: Explora este destacado en detalle, experimentando su importancia histórica y belleza escénica.\n\nCada una de estas experiencias ha sido seleccionada para proporcionar una conexión auténtica e inmersiva con el destino, asegurando que veas tanto los lugares emblemáticos como las joyas ocultas con comodidad y estilo.",
  "Sebbene l'itinerario dettagliato giorno per giorno sia completamente personalizzato in base alle tue date di viaggio e preferenze, questo programma è ancorato a diverse esperienze distintive che formano il cuore del tuo viaggio:\n\n• **@HL1**: Esplora questo punto saliente in dettaglio, sperimentando la sua importanza storica e bellezza paesaggistica.\n\n• **@HL2**: Esplora questo punto saliente in dettaglio, sperimentando la sua importanza storica e bellezza paesaggistica.\n\n• **@HL3**: Esplora questo punto saliente in dettaglio, sperimentando la sua importanza storica e bellezza paesaggistica.\n\n• **@HL4**: Esplora questo punto saliente in dettaglio, sperimentando la sua importanza storica e bellezza paesaggistica.\n\nOgnuna di queste esperienze è stata selezionata per fornire una connessione autentica e coinvolgente con la destinazione, assicurandoti di vedere sia i luoghi iconici che i tesori nascosti in comfort e stile.",
  "Embora o itinerário detalhado dia a dia seja totalmente personalizado de acordo com suas datas de viagem e preferências, este programa é ancorado por várias experiências marcantes que formam o núcleo da sua jornada:\n\n• **@HL1**: Explore este destaque em detalhes, experimentando sua importância histórica e beleza cênica.\n\n• **@HL2**: Explore este destaque em detalhes, experimentando sua importância histórica e beleza cênica.\n\n• **@HL3**: Explore este destaque em detalhes, experimentando sua importância histórica e beleza cênica.\n\n• **@HL4**: Explore este destaque em detalhes, experimentando sua importância histórica e beleza cênica.\n\nCada uma dessas experiências foi selecionada para fornecer uma conexão autêntica e imersiva com o destino, garantindo que você veja tanto os pontos turísticos icônicos quanto as joias escondidas com conforto e estilo.");

add("Are you ready to witness the eternal wonders of Egypt? The \"@PACKAGE\" package is the perfect blend of ancient history, cultural immersion, and modern luxury. Contact the travel designers at Dunas Travel today to book your private tour or customize this itinerary to match your specific dates and preferences. Let our expert guides show you the magic of the Nile.",
  "هل أنت مستعد لمشاهدة عجائب مصر الخالدة؟ باقة \"@PACKAGE\" هي المزيج المثالي من التاريخ القديم والانغماس الثقافي والفخامة العصرية. اتصل بمصممي الرحلات في دوناس ترافيل اليوم لحجز جولتك الخاصة أو تخصيص مسار الرحلة ليتناسب مع تواريخك وتفضيلاتك. دع خبراء مرشدينا يظهرون لك سحر النيل.",
  "¿Estás listo para presenciar las maravillas eternas de Egipto? El paquete \"@PACKAGE\" es la combinación perfecta de historia antigua, inmersión cultural y lujo moderno. Contacta a los diseñadores de viajes de Dunas Travel hoy para reservar tu tour privado o personalizar este itinerario según tus fechas y preferencias. Deja que nuestros guías expertos te muestren la magia del Nilo.",
  "Sei pronto a testimoniare le meraviglie eterne dell'Egitto? Il pacchetto \"@PACKAGE\" è la miscela perfetta di storia antica, immersione culturale e lusso moderno. Contatta i designer di viaggi di Dunas Travel oggi per prenotare il tuo tour privato o personalizzare questo itinerario in base alle tue date e preferenze. Lascia che le nostre guide esperte ti mostrino la magia del Nilo.",
  "Você está pronto para testemunhar as maravilhas eternas do Egito? O pacote \"@PACKAGE\" é a combinação perfeita de história antiga, imersão cultural e luxo moderno. Entre em contato com os designers de viagens da Dunas Travel hoje para reservar seu tour privado ou personalizar este itinerário de acordo com suas datas e preferências. Deixe nossos guias especializados mostrarem a magia do Nilo.");

add("To ensure a comfortable journey through Egypt, it is best to plan your visit between October and April, when the weather is cooler and perfect for outdoor sightseeing. Pack lightweight, breathable cotton clothing to stay cool, a wide-brimmed hat, sunglasses, and high-SPF sunscreen to protect against the desert sun. Sturdy, comfortable walking shoes are essential for exploring temple ruins and dusty archaeological sites. While beach resorts are very relaxed, it is recommended to dress modestly when exploring historic Cairo or local towns (covering shoulders and knees). Always drink bottled water, carry some local currency (Egyptian Pounds) for small tips, and keep your camera charged for the incredible sights.",
  "لضمان رحلة مريحة عبر مصر، من الأفضل التخطيط لزيارتك بين أكتوبر وأبريل، عندما يكون الطقس أكثر برودة ومثاليًا لمشاهدة المعالم السياحية في الهواء الطلق. احزم ملابس قطنية خفيفة وقابلة للتنفس للبقاء منتعشًا، وقبعة واسعة الحواف، ونظارات شمسية، وواقي شمسي عالي الحماية للحماية من شمس الصحراء. أحذية متينة ومريحة ضرورية لاستكشاف أطلال المعابد والمواقع الأثرية المتربة. بينما تكون منتجعات الشاطئ مريحة للغاية، يُنصح بارتداء ملابس محتشمة عند استكشاف القاهرة التاريخية أو المدن المحلية (تغطية الكتفين والركبتين). اشرب دائمًا المياه المعبأة، واحمل بعض العملات المحلية (الجنيه المصري) للإكراميات الصغيرة، وحافظ على شحن كاميرتك للمناظر المذهلة.",
  "Para garantizar un viaje cómodo por Egipto, es mejor planificar tu visita entre octubre y abril, cuando el clima es más fresco y perfecto para hacer turismo al aire libre. Empaca ropa de algodón ligera y transpirable para mantenerte fresco, un sombrero de ala ancha, gafas de sol y protector solar de alto FPS para protegerte del sol del desierto. Se necesitan zapatos resistentes y cómodos para explorar las ruinas de templos y sitios arqueológicos polvorientos. Si bien los resorts de playa son muy relajados, se recomienda vestir modestamente al explorar El Cairo histórico o pueblos locales (cubriendo hombros y rodillas). Bebe siempre agua embotellada, lleva algo de moneda local (libras egipcias) para pequeñas propinas y mantén tu cámara cargada para las vistas increíbles.",
  "Per garantire un viaggio confortevole attraverso l'Egitto, è meglio pianificare la visita tra ottobre e aprile, quando il clima è più fresco e perfetto per le visite turistiche all'aperto. Prepara abiti di cotone leggeri e traspiranti per stare fresco, un cappello a tesa larga, occhiali da sole e crema solare ad alta protezione per proteggerti dal sole del deserto. Scarpe robuste e comode sono essenziali per esplorare le rovine dei templi e i siti archeologici polverosi. Mentre i resort balneari sono molto rilassati, si consiglia di vestirsi in modo modesto quando si esplora il Cairo storico o le città locali (coprendo spalle e ginocchia). Bevi sempre acqua in bottiglia, porta della valuta locale (sterline egiziane) per piccole mance e tieni la fotocamera carica per le viste incredibili.",
  "Para garantir uma viagem confortável pelo Egito, é melhor planejar sua visita entre outubro e abril, quando o clima é mais fresco e perfeito para passeios ao ar livre. Leve roupas de algodão leves e respiráveis para se manter fresco, um chapéu de aba larga, óculos de sol e protetor solar FPS alto para se proteger do sol do deserto. Sapatos resistentes e confortáveis são essenciais para explorar ruínas de templos e locais arqueológicos empoeirados. Embora os resorts de praia sejam muito relaxados, é recomendável vestir-se modestamente ao explorar o Cairo histórico ou cidades locais (cobrindo ombros e joelhos). Beba sempre água engarrafada, leve alguma moeda local (libras egípcias) para pequenas gorjetas e mantenha sua câmera carregada para as vistas incríveis.");

// ===== HELPER: find pattern match =====
function findTemplate(actualText) {
  if (templates[actualText]) return { template: actualText, vars: {} };
  for (const [templateEn] of Object.entries(templates)) {
    if (templateEn.includes('@PACKAGE') || templateEn.includes('@DAYS') || templateEn.includes('@HL')) {
      let regexStr = templateEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/@PACKAGE/g, '(?<package>.+?)')
        .replace(/@DAYS/g, '(?<days>.+?)')
        .replace(/@HL1/g, '(?<hl1>.+?)')
        .replace(/@HL2/g, '(?<hl2>.+?)')
        .replace(/@HL3/g, '(?<hl3>.+?)')
        .replace(/@HL4/g, '(?<hl4>.+?)');
      const regex = new RegExp('^' + regexStr + '$', 's');
      const match = actualText.match(regex);
      if (match) {
        return { template: templateEn, vars: match.groups || {} };
      }
    }
  }
  return null;
}

// ===== GENERATE TRANSLATIONS =====
const locales = ['ar', 'es', 'it', 'pt'];
const localesDir = join(__dirname, 'src', 'i18n', 'locales');

locales.forEach(locale => {
  const filePath = join(localesDir, `${locale}.json`);
  const json = JSON.parse(readFileSync(filePath, 'utf-8'));
  let added = 0;

  const allParagraphs = new Set();
  blogs.forEach(b => b.content.forEach(p => allParagraphs.add(p)));

  allParagraphs.forEach(actualText => {
    const prefixedKey = 'blogs.' + actualText;
    if (json[prefixedKey]) return;

    const match = findTemplate(actualText);
    if (!match) return;

    const templateTranslations = templates[match.template];
    if (!templateTranslations) return;

    let translated = templateTranslations[locale];
    if (!translated) return;

    const vars = match.vars;
    if (vars.package) translated = translated.replace(/@PACKAGE/g, vars.package);
    if (vars.days) translated = translated.replace(/@DAYS/g, vars.days);
    if (vars.hl1) translated = translated.replace(/@HL1/g, vars.hl1);
    if (vars.hl2) translated = translated.replace(/@HL2/g, vars.hl2);
    if (vars.hl3) translated = translated.replace(/@HL3/g, vars.hl3);
    if (vars.hl4) translated = translated.replace(/@HL4/g, vars.hl4);

    json[prefixedKey] = translated;
    added++;
  });

  writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
  console.log(`${locale}.json: added ${added} translations`);
});

console.log('Done!');
