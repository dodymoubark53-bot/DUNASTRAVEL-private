import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');

const updateLocale = (file, newKeys) => {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  for (const [section, keys] of Object.entries(newKeys)) {
    if (!data[section]) data[section] = {};
    Object.assign(data[section], keys);
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const arNew = {
  "footer": {
    "desc": "ننسق لك تجارب سفر فاخرة حائزة على جوائز عبر مصر والأردن وتركيا منذ 2010.",
    "quickLinks": "روابط سريعة",
    "address": "123 شارع الرفاهية، القاهرة، مصر",
    "newsletter": "اشترك في نشرتنا البريدية",
    "join": "انضم",
    "rights": "جميع الحقوق محفوظة.",
    "created": "تم الإنشاء بواسطة دينا حفني"
  },
  "contact": {
    "title": "اتصل بنا | السياحة الفاخرة",
    "seoDesc": "تواصل مع خبراء السفر الفاخر لدينا لبدء رحلتك المخصصة إلى مصر والأردن وتركيا.",
    "getInTouch": "تواصل معنا",
    "office": "مكتب القاهرة",
    "address1": "123 شارع الرفاهية، الزمالك",
    "address2": "القاهرة، مصر",
    "details": "تفاصيل الاتصال",
    "email": "البريد:",
    "phone": "الهاتف:",
    "map": "خريطة تفاعلية (عنصر نائب)",
    "sendMessage": "أرسل لنا رسالة",
    "firstName": "الاسم الأول",
    "lastName": "اسم العائلة",
    "emailPlaceholder": "البريد الإلكتروني",
    "phonePlaceholder": "رقم الهاتف",
    "messagePlaceholder": "كيف يمكننا مساعدتك في تصميم رحلتك المثالية؟",
    "sendBtn": "إرسال الرسالة"
  }
};

const esNew = {
  "footer": {
    "desc": "Curando experiencias de viaje de lujo galardonadas en Egipto, Jordania y Turquía desde 2010.",
    "quickLinks": "Enlaces Rápidos",
    "address": "123 Avenida de Lujo, El Cairo, Egipto",
    "newsletter": "Suscríbete al boletín",
    "join": "Unirse",
    "rights": "Todos los derechos reservados.",
    "created": "Creado por Dina Hefny"
  },
  "contact": {
    "title": "Contáctenos | Viajes de Lujo",
    "seoDesc": "Póngase en contacto con nuestros conserjes de viajes de lujo para comenzar a diseñar su viaje a medida a Egipto, Jordania y Turquía.",
    "getInTouch": "Ponte en Contacto",
    "office": "Oficina del Cairo",
    "address1": "123 Avenida de Lujo, Zamalek",
    "address2": "El Cairo, Egipto",
    "details": "Detalles de Contacto",
    "email": "Correo:",
    "phone": "Teléfono:",
    "map": "Mapa Interactivo",
    "sendMessage": "Envíanos un mensaje",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "emailPlaceholder": "Correo Electrónico",
    "phonePlaceholder": "Número de Teléfono",
    "messagePlaceholder": "¿Cómo podemos ayudarte a crear tu viaje perfecto?",
    "sendBtn": "Enviar Mensaje"
  }
};

const ptNew = {
  "footer": {
    "desc": "Curadoria de experiências de viagens de luxo premiadas no Egito, Jordânia e Turquia desde 2010.",
    "quickLinks": "Links Rápidos",
    "address": "123 Avenida de Luxo, Cairo, Egito",
    "newsletter": "Assine nossa newsletter",
    "join": "Juntar-se",
    "rights": "Todos os direitos reservados.",
    "created": "Criado por Dina Hefny"
  },
  "contact": {
    "title": "Contate-nos | Viagens de Luxo",
    "seoDesc": "Entre em contato com nossos concierges de viagens de luxo para começar a elaborar sua jornada sob medida para o Egito, Jordânia e Turquia.",
    "getInTouch": "Entrar em Contato",
    "office": "Escritório no Cairo",
    "address1": "123 Avenida de Luxo, Zamalek",
    "address2": "Cairo, Egito",
    "details": "Detalhes de Contato",
    "email": "E-mail:",
    "phone": "Telefone:",
    "map": "Mapa Interativo",
    "sendMessage": "Envie-nos uma mensagem",
    "firstName": "Primeiro Nome",
    "lastName": "Último Nome",
    "emailPlaceholder": "Endereço de E-mail",
    "phonePlaceholder": "Número de Telefone",
    "messagePlaceholder": "Como podemos ajudar a criar sua jornada perfeita?",
    "sendBtn": "Enviar Mensagem"
  }
};

updateLocale('ar.json', arNew);
updateLocale('es.json', esNew);
updateLocale('pt.json', ptNew);

console.log('Missing locales added.');
