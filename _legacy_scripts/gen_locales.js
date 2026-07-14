import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');

const en = {
  "nav": {
    "home": "Home",
    "destinations": "Destinations",
    "tours": "Tours",
    "services": "Services",
    "blogs": "Journal",
    "about": "About",
    "contact": "Contact",
    "egypt": "Egypt",
    "jordan": "Jordan",
    "turkey": "Turkey",
    "hotels": "Luxury Hotels",
    "safari": "Desert Safari",
    "camping": "Glamping",
    "cruises": "Nile Cruises",
    "bookNow": "Book Now",
    "login": "Login",
    "profile": "My Profile",
    "bookings": "My Bookings",
    "logout": "Logout"
  },
  "home": {
    "award": "Award-Winning Experiences",
    "heroTitle": "Journey Beyond \n the Ordinary",
    "heroDesc": "Curating ultra-luxury, personalized itineraries through the timeless wonders of Egypt, Jordan, and Turkey. Experience the world's most captivating destinations in unparalleled style.",
    "exploreDest": "Explore Destinations",
    "bookJourney": "Book Your Journey",
    "scroll": "Scroll to discover",
    "discoverMagic": "Discover The Magic",
    "destTitle": "Destinations & Their Tours",
    "toursAvailable": "Tours Available",
    "optionsAvailable": "Options Available",
    "premiumSelection": "Premium Selection",
    "exclusiveServices": "Exclusive Services",
    "featuredHotels": "Featured Hotels",
    "perNight": "Per Night",
    "viewHotel": "View Hotel",
    "availableSafaris": "Available Safaris",
    "duration": "Duration",
    "viewSafari": "View Safari",
    "viewAll": "View All Services",
    "explore": "Explore"
  },
  "tourCard": {
    "reviews": "reviews",
    "from": "From",
    "book": "Book →",
    "viewDetails": "View Details"
  },
  "booking": {
    "inquiryTitle": "Plan Your Journey",
    "inquiryDesc": "Share your travel dreams with our luxury concierges.",
    "fullName": "Full Name",
    "email": "Email Address",
    "phone": "Phone Number",
    "travelDates": "Expected Travel Dates",
    "guests": "Number of Guests",
    "message": "Special Requests or Interests",
    "submit": "Submit Inquiry"
  },
  "data": {
    "Egypt": "Egypt",
    "Jordan": "Jordan",
    "Turkey": "Turkey",
    "Luxury Hotels": "Luxury Hotels",
    "Desert Safari": "Desert Safari",
    "Glamping": "Glamping",
    "Nile Cruises": "Nile Cruises",
    "Hand-picked 5-star accommodations offering unparalleled views and comfort.": "Hand-picked 5-star accommodations offering unparalleled views and comfort.",
    "Thrilling off-road adventures with premium SUVs and expert drivers.": "Thrilling off-road adventures with premium SUVs and expert drivers.",
    "Luxury tented camps under the stars with private chefs and amenities.": "Luxury tented camps under the stars with private chefs and amenities.",
    "Boutique Dahabiyas and luxury ships sailing the timeless river.": "Boutique Dahabiyas and luxury ships sailing the timeless river.",
    "The Land of Pharaohs": "The Land of Pharaohs",
    "The Hashemite Kingdom": "The Hashemite Kingdom",
    "Where Continents Meet": "Where Continents Meet"
  }
};

const ar = {
  "nav": {
    "home": "الرئيسية",
    "destinations": "الوجهات",
    "tours": "الجولات",
    "services": "الخدمات",
    "blogs": "المجلة",
    "about": "من نحن",
    "contact": "اتصل بنا",
    "egypt": "مصر",
    "jordan": "الأردن",
    "turkey": "تركيا",
    "hotels": "فنادق فاخرة",
    "safari": "رحلات السفاري",
    "camping": "التخييم الفاخر",
    "cruises": "رحلات النيل",
    "bookNow": "احجز الآن",
    "login": "تسجيل الدخول",
    "profile": "ملفي الشخصي",
    "bookings": "حجوزاتي",
    "logout": "تسجيل الخروج"
  },
  "home": {
    "award": "تجارب حائزة على جوائز",
    "heroTitle": "رحلة تتجاوز \n المألوف",
    "heroDesc": "ننسق لك مسارات سفر شخصية فائقة الفخامة عبر عجائب مصر والأردن وتركيا الخالدة. اختبر أروع وجهات العالم بأسلوب لا مثيل له.",
    "exploreDest": "استكشف الوجهات",
    "bookJourney": "احجز رحلتك",
    "scroll": "مرر للاستكشاف",
    "discoverMagic": "اكتشف السحر",
    "destTitle": "الوجهات وجولاتها",
    "toursAvailable": "جولات متاحة",
    "optionsAvailable": "خيارات متاحة",
    "premiumSelection": "اختيار النخبة",
    "exclusiveServices": "خدمات حصرية",
    "featuredHotels": "فنادق مميزة",
    "perNight": "في الليلة",
    "viewHotel": "عرض الفندق",
    "availableSafaris": "رحلات السفاري المتاحة",
    "duration": "المدة",
    "viewSafari": "عرض السفاري",
    "viewAll": "عرض جميع الخدمات",
    "explore": "استكشف"
  },
  "tourCard": {
    "reviews": "تقييمات",
    "from": "تبدأ من",
    "book": "احجز ←",
    "viewDetails": "عرض التفاصيل"
  },
  "booking": {
    "inquiryTitle": "خطط لرحلتك",
    "inquiryDesc": "شارك أحلام سفرك مع خبرائنا.",
    "fullName": "الاسم الكامل",
    "email": "البريد الإلكتروني",
    "phone": "رقم الهاتف",
    "travelDates": "تواريخ السفر المتوقعة",
    "guests": "عدد الضيوف",
    "message": "طلبات خاصة أو اهتمامات",
    "submit": "إرسال الطلب"
  },
  "data": {
    "Egypt": "مصر",
    "Jordan": "الأردن",
    "Turkey": "تركيا",
    "Luxury Hotels": "فنادق فاخرة",
    "Desert Safari": "رحلات السفاري",
    "Glamping": "تخييم فاخر",
    "Nile Cruises": "رحلات النيل",
    "Hand-picked 5-star accommodations offering unparalleled views and comfort.": "أماكن إقامة مختارة من فئة 5 نجوم توفر إطلالات وراحة لا مثيل لها.",
    "Thrilling off-road adventures with premium SUVs and expert drivers.": "مغامرات مثيرة على الطرق الوعرة مع سيارات الدفع الرباعي الفاخرة وسائقين خبراء.",
    "Luxury tented camps under the stars with private chefs and amenities.": "مخيمات فاخرة تحت النجوم مع طهاة خاصين ووسائل راحة.",
    "Boutique Dahabiyas and luxury ships sailing the timeless river.": "سفن فاخرة وذهبيات تبحر في النهر الخالد.",
    "The Land of Pharaohs": "أرض الفراعنة",
    "The Hashemite Kingdom": "المملكة الهاشمية",
    "Where Continents Meet": "ملتقى القارات"
  }
};

const es = {
  "nav": {
    "home": "Inicio",
    "destinations": "Destinos",
    "tours": "Tours",
    "services": "Servicios",
    "blogs": "Diario",
    "about": "Nosotros",
    "contact": "Contacto",
    "egypt": "Egipto",
    "jordan": "Jordania",
    "turkey": "Turquía",
    "hotels": "Hoteles de Lujo",
    "safari": "Safari en el Desierto",
    "camping": "Glamping",
    "cruises": "Cruceros por el Nilo",
    "bookNow": "Reservar Ahora",
    "login": "Iniciar Sesión",
    "profile": "Mi Perfil",
    "bookings": "Mis Reservas",
    "logout": "Cerrar Sesión"
  },
  "home": {
    "award": "Experiencias Galardonadas",
    "heroTitle": "Un Viaje Más Allá \n de lo Extraordinario",
    "heroDesc": "Curando itinerarios ultra lujosos y personalizados a través de las maravillas eternas de Egipto, Jordania y Turquía. Experimente los destinos más cautivadores del mundo con un estilo incomparable.",
    "exploreDest": "Explorar Destinos",
    "bookJourney": "Reserve su Viaje",
    "scroll": "Desplácese para descubrir",
    "discoverMagic": "Descubra la Magia",
    "destTitle": "Destinos y sus Tours",
    "toursAvailable": "Tours Disponibles",
    "optionsAvailable": "Opciones Disponibles",
    "premiumSelection": "Selección Premium",
    "exclusiveServices": "Servicios Exclusivos",
    "featuredHotels": "Hoteles Destacados",
    "perNight": "Por Noche",
    "viewHotel": "Ver Hotel",
    "availableSafaris": "Safaris Disponibles",
    "duration": "Duración",
    "viewSafari": "Ver Safari",
    "viewAll": "Ver Todos los Servicios",
    "explore": "Explorar"
  },
  "tourCard": {
    "reviews": "reseñas",
    "from": "Desde",
    "book": "Reservar →",
    "viewDetails": "Ver Detalles"
  },
  "booking": {
    "inquiryTitle": "Planifique su Viaje",
    "inquiryDesc": "Comparta sus sueños de viaje con nuestros conserjes de lujo.",
    "fullName": "Nombre Completo",
    "email": "Correo Electrónico",
    "phone": "Número de Teléfono",
    "travelDates": "Fechas de Viaje Esperadas",
    "guests": "Número de Huéspedes",
    "message": "Solicitudes o Intereses Especiales",
    "submit": "Enviar Consulta"
  },
  "data": {
    "Egypt": "Egipto",
    "Jordan": "Jordania",
    "Turkey": "Turquía",
    "Luxury Hotels": "Hoteles de Lujo",
    "Desert Safari": "Safari en el Desierto",
    "Glamping": "Glamping",
    "Nile Cruises": "Cruceros por el Nilo",
    "Hand-picked 5-star accommodations offering unparalleled views and comfort.": "Alojamientos de 5 estrellas seleccionados que ofrecen vistas y comodidad incomparables.",
    "Thrilling off-road adventures with premium SUVs and expert drivers.": "Emocionantes aventuras todoterreno con SUV premium y conductores expertos.",
    "Luxury tented camps under the stars with private chefs and amenities.": "Campamentos de lujo bajo las estrellas con chefs privados y comodidades.",
    "Boutique Dahabiyas and luxury ships sailing the timeless river.": "Dahabiyas boutique y barcos de lujo navegando por el río atemporal.",
    "The Land of Pharaohs": "La Tierra de los Faraones",
    "The Hashemite Kingdom": "El Reino Hachemita",
    "Where Continents Meet": "Donde los Continentes se Encuentran"
  }
};

const pt = {
  "nav": {
    "home": "Início",
    "destinations": "Destinos",
    "tours": "Passeios",
    "services": "Serviços",
    "blogs": "Diário",
    "about": "Sobre",
    "contact": "Contato",
    "egypt": "Egito",
    "jordan": "Jordânia",
    "turkey": "Turquia",
    "hotels": "Hotéis de Luxo",
    "safari": "Safári no Deserto",
    "camping": "Glamping",
    "cruises": "Cruzeiros no Nilo",
    "bookNow": "Reserve Agora",
    "login": "Entrar",
    "profile": "Meu Perfil",
    "bookings": "Minhas Reservas",
    "logout": "Sair"
  },
  "home": {
    "award": "Experiências Premiadas",
    "heroTitle": "Uma Jornada Além \n do Extraordinário",
    "heroDesc": "Curadoria de roteiros ultraluxuosos e personalizados pelas maravilhas atemporais do Egito, Jordânia e Turquia. Experimente os destinos mais cativantes do mundo com um estilo inigualável.",
    "exploreDest": "Explorar Destinos",
    "bookJourney": "Reserve sua Jornada",
    "scroll": "Role para descobrir",
    "discoverMagic": "Descubra a Magia",
    "destTitle": "Destinos e seus Passeios",
    "toursAvailable": "Passeios Disponíveis",
    "optionsAvailable": "Opções Disponíveis",
    "premiumSelection": "Seleção Premium",
    "exclusiveServices": "Serviços Exclusivos",
    "featuredHotels": "Hotéis em Destaque",
    "perNight": "Por Noite",
    "viewHotel": "Ver Hotel",
    "availableSafaris": "Safáris Disponíveis",
    "duration": "Duração",
    "viewSafari": "Ver Safári",
    "viewAll": "Ver Todos os Serviços",
    "explore": "Explorar"
  },
  "tourCard": {
    "reviews": "avaliações",
    "from": "A partir de",
    "book": "Reservar →",
    "viewDetails": "Ver Detalhes"
  },
  "booking": {
    "inquiryTitle": "Planeje sua Jornada",
    "inquiryDesc": "Compartilhe seus sonhos de viagem com nossos concierges de luxo.",
    "fullName": "Nome Completo",
    "email": "Endereço de E-mail",
    "phone": "Número de Telefone",
    "travelDates": "Datas de Viagem Esperadas",
    "guests": "Número de Hóspedes",
    "message": "Pedidos Especiais ou Interesses",
    "submit": "Enviar Consulta"
  },
  "data": {
    "Egypt": "Egito",
    "Jordan": "Jordânia",
    "Turkey": "Turquia",
    "Luxury Hotels": "Hotéis de Luxo",
    "Desert Safari": "Safári no Deserto",
    "Glamping": "Glamping",
    "Nile Cruises": "Cruzeiros no Nilo",
    "Hand-picked 5-star accommodations offering unparalleled views and comfort.": "Acomodações 5 estrelas escolhidas a dedo, oferecendo vistas e conforto inigualáveis.",
    "Thrilling off-road adventures with premium SUVs and expert drivers.": "Aventuras off-road emocionantes com SUVs premium e motoristas experientes.",
    "Luxury tented camps under the stars with private chefs and amenities.": "Acampamentos de luxo sob as estrelas com chefs particulares e comodidades.",
    "Boutique Dahabiyas and luxury ships sailing the timeless river.": "Dahabiyas boutique e navios de luxo navegando pelo rio atemporal.",
    "The Land of Pharaohs": "A Terra dos Faraós",
    "The Hashemite Kingdom": "O Reino Hachemita",
    "Where Continents Meet": "Onde os Continentes se Encontram"
  }
};

fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(localesDir, 'ar.json'), JSON.stringify(ar, null, 2));
fs.writeFileSync(path.join(localesDir, 'es.json'), JSON.stringify(es, null, 2));
fs.writeFileSync(path.join(localesDir, 'pt.json'), JSON.stringify(pt, null, 2));

console.log('Locales generated.');
