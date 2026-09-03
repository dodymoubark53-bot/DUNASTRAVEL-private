import { useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const COORDINATES_DATABASE = {
  // Egypt
  "cairo": [30.0444, 31.2357],
  "giza": [29.9792, 31.1342],
  "pyramids": [29.9792, 31.1342],
  "sphinx": [29.9753, 31.1376],
  "luxor": [25.6872, 32.6396],
  "aswan": [24.0889, 32.8998],
  "alexandria": [31.2001, 29.9187],
  "hurghada": [27.2579, 33.8116],
  "sharm": [27.9158, 34.3299],
  "siwa": [29.2032, 25.5189],
  "abu simbel": [22.3372, 31.6258],
  "kom ombo": [24.4711, 32.9469],
  "edfu": [24.9781, 32.8789],
  "philae": [24.0250, 32.8844],
  "karnak": [25.7188, 32.6573],
  "valley of the kings": [25.7402, 32.6014],

  // Turkey
  "istanbul": [41.0082, 28.9784],
  "cappadocia": [38.6431, 34.8281],
  "pamukkale": [37.9221, 29.1212],
  "ephesus": [37.9394, 27.3410],
  "antalya": [36.8969, 30.7133],
  "ankara": [39.9334, 32.8597],
  "konya": [37.8714, 32.4988],
  "bursa": [40.1885, 29.0610],
  "canakkale": [40.1450, 26.4064],
  "troy": [39.9575, 26.2386],
  "kusadasi": [37.8596, 27.2590],
  "pergamum": [39.1325, 27.1842],
  "izmir": [38.4192, 27.1287],

  // Jordan
  "amman": [31.9454, 35.9284],
  "petra": [30.3285, 35.4444],
  "wadi rum": [29.5781, 35.4206],
  "dead sea": [31.5590, 35.4732],
  "jerash": [32.2723, 35.8914],
  "aqaba": [29.5321, 35.0063],
  "madaba": [31.7174, 35.7937],
  "mount nebo": [31.7683, 35.7253],

  // UAE / Dubai
  "dubai": [25.2048, 55.2708],
  "abu dhabi": [24.4539, 54.3773],
  "sharjah": [25.3463, 55.4209],
  "dubai airport": [25.2532, 55.3657],
  "old dubai": [25.2632, 55.2972],
  "jumeirah": [25.1124, 55.1390],
  "burj khalifa": [25.1972, 55.2744],
  "dubai marina": [25.0805, 55.1403],
  "dubai desert": [24.9744, 55.5926],
  "yas island": [24.4970, 54.6063],

  // Morocco
  "marrakech": [31.6295, -7.9811],
  "casablanca": [33.5731, -7.5898],
  "fes": [34.0181, -5.0078],
  "fez": [34.0181, -5.0078],
  "rabat": [34.0209, -6.8416],
  "chefchaouen": [35.1688, -5.2636],
  "tangier": [35.7595, -5.8340],
  "ouarzazate": [30.9189, -6.8931],
  "meknes": [33.8938, -5.5547],
  "essaouira": [31.5085, -9.7595],
  "ait benhaddou": [31.0470, -7.1306],

  // Holy Land
  "jerusalem": [31.7683, 35.2137],
  "bethlehem": [31.7058, 35.2007],
  "nazareth": [32.6996, 35.3035],
  "tel aviv": [32.0853, 34.7818],
  "galilee": [32.8155, 35.5908],
  "jericho": [31.8560, 35.4443],
  "haifa": [32.7940, 34.9896],
  "jaffa": [32.0518, 34.7522],
  "tiberias": [32.7922, 35.5312],
  "cana": [32.7471, 35.3789],

  // Greece
  "athens": [37.9838, 23.7275],
  "mykonos": [37.4467, 25.3289],
  "santorini": [36.3932, 25.4615],
  "delphi": [38.4800, 22.4939],
  "meteora": [39.7135, 21.6253],
  "olympia": [37.6437, 21.6244],
  "thessaloniki": [40.6401, 22.9444],
  "crete": [35.2401, 24.8093],

  // Tunisia
  "tunis": [36.8065, 10.1815],
  "carthage": [36.8578, 10.3276],
  "sidi bou said": [36.8702, 10.3411],
  "hammamet": [36.4000, 10.6167],
  "testour": [36.5510, 9.4447],
  "dougga": [36.4222, 9.2201],
  "el jem": [35.2964, 10.7092],
  "matmata": [33.5424, 9.9674],
  "douz": [33.4667, 9.0167],
  "chott el jerid": [33.7222, 8.4111],
  "tozeur": [33.9198, 8.1335],
  "kairouan": [35.6781, 10.0963]
};

const KEYWORDS_MAP = {
  // Egypt - Cairo
  "cairo": "cairo",
  "القاهرة": "cairo",
  "قاهرة": "cairo",

  // Egypt - Giza/Pyramids/Sphinx
  "giza": "giza",
  "guiza": "giza",
  "الجيزة": "giza",
  "جيزة": "giza",
  "pirâmide": "pyramids",
  "pirámide": "pyramids",
  "pyramid": "pyramids",
  "piramide": "pyramids",
  "piramidi": "pyramids",
  "الأهرامات": "pyramids",
  "أهرامات": "pyramids",
  "الاهرامات": "pyramids",
  "اهرامات": "pyramids",
  "esfinge": "sphinx",
  "sphinx": "sphinx",
  "أبو الهول": "sphinx",
  "ابو الهول": "sphinx",

  // Egypt - Luxor
  "luxor": "luxor",
  "lúxor": "luxor",
  "الأقصر": "luxor",

  // Egypt - Aswan
  "aswan": "aswan",
  "assuã": "aswan",
  "aswán": "aswan",
  "assuan": "aswan",
  "أسوان": "aswan",
  "اسوان": "aswan",

  // Egypt - Alexandria
  "alexandria": "alexandria",
  "alejandría": "alexandria",
  "alessandria": "alexandria",
  "الإسكندرية": "alexandria",
  "الاسكندرية": "alexandria",
  "إسكندرية": "alexandria",
  "اسكندرية": "alexandria",

  // Egypt - Hurghada
  "hurghada": "hurghada",
  "الغردقة": "hurghada",
  "غردقة": "hurghada",

  // Egypt - Sharm El Sheikh
  "sharm": "sharm",
  "شرم الشيخ": "sharm",
  "شرم": "sharm",

  // Egypt - Siwa
  "siwa": "siwa",
  "سيوة": "siwa",
  "واحة سيوة": "siwa",

  // Egypt - Abu Simbel
  "abu simbel": "abu simbel",
  "abú simbel": "abu simbel",
  "أبو سمبل": "abu simbel",
  "ابو سمبل": "abu simbel",

  // Egypt - Kom Ombo
  "kom ombo": "kom ombo",
  "كوم أمبو": "kom ombo",
  "كوم امبو": "kom ombo",

  // Egypt - Edfu
  "edfu": "edfu",
  "إدفو": "edfu",
  "ادفو": "edfu",

  // Egypt - Philae
  "philae": "philae",
  "filae": "philae",
  "فيلة": "philae",
  "معبد فيلة": "philae",

  // Egypt - Valley of the Kings
  "vales dos reis": "valley of the kings",
  "valle de los reyes": "valley of the kings",
  "valley of the kings": "valley of the kings",
  "valle dei re": "valley of the kings",

  // Turkey - Istanbul
  "istanbul": "istanbul",
  "istambul": "istanbul",
  "إسطنبول": "istanbul",
  "اسطنبول": "istanbul",

  // Turkey - Cappadocia
  "cappadocia": "cappadocia",
  "capadócia": "cappadocia",
  "capadocia": "cappadocia",
  "كبادوكيا": "cappadocia",
  "كابادوكيا": "cappadocia",

  // Turkey - Pamukkale
  "pamukkale": "pamukkale",
  "باموكالي": "pamukkale",
  "باموق قلعة": "pamukkale",

  // Turkey - Ephesus
  "ephesus": "ephesus",
  "éfeso": "ephesus",
  "efeso": "ephesus",
  "أفسس": "ephesus",
  "افسس": "ephesus",

  // Turkey - Antalya
  "antalya": "antalya",
  "antália": "antalya",
  "أنطاليا": "antalya",
  "انطاليا": "antalya",

  // Turkey - Ankara
  "ankara": "ankara",
  "ancara": "ankara",
  "أنقرة": "ankara",
  "انقرة": "ankara",

  // Turkey - Konya
  "konya": "konya",
  "قونية": "konya",

  // Turkey - Bursa
  "bursa": "bursa",
  "بورصة": "bursa",

  // Turkey - Izmir
  "izmir": "izmir",
  "esmirna": "izmir",
  "إزمير": "izmir",
  "ازمير": "izmir",

  // Turkey - Kusadasi
  "kusadasi": "kusadasi",
  "kuşadası": "kusadasi",
  "كوشاداسي": "kusadasi",

  // Turkey - Canakkale
  "canakkale": "canakkale",
  "çanakkale": "canakkale",
  "جناق قلعة": "canakkale",

  // Turkey - Troy
  "troy": "troy",
  "troya": "troy",
  "طروادة": "troy",

  // Jordan - Amman
  "amman": "amman",
  "amã": "amman",
  "عمان": "amman",
  "عمّان": "amman",

  // Jordan - Petra
  "petra": "petra",
  "البتراء": "petra",
  "البترا": "petra",

  // Jordan - Wadi Rum
  "wadi rum": "wadi rum",
  "وادي رم": "wadi rum",

  // Jordan - Dead Sea
  "dead sea": "dead sea",
  "mar morto": "dead sea",
  "mar muerto": "dead sea",
  "البحر الميت": "dead sea",

  // Jordan - Jerash
  "jerash": "jerash",
  "gerasa": "jerash",
  "جرش": "jerash",

  // Jordan - Aqaba
  "aqaba": "aqaba",
  "العقبة": "aqaba",
  "عقبة": "aqaba",

  // UAE - Dubai
  "dubai": "dubai",
  "dubái": "dubai",
  "دبي": "dubai",
  "دبى": "dubai",

  // UAE - Dubai Airport
  "aeropuerto de dubái": "dubai airport",
  "aeropuerto de dubai": "dubai airport",
  "aeroporto de dubai": "dubai airport",
  "dubai airport": "dubai airport",
  "dubai international airport": "dubai airport",

  // UAE - Old Dubai
  "dubái antiguo": "old dubai",
  "dubai antigo": "old dubai",
  "old dubai": "old dubai",
  "bastakiya": "old dubai",
  "bur dubai": "old dubai",
  "deira": "old dubai",

  // UAE - Jumeirah
  "jumeirah": "jumeirah",
  "jumeira": "jumeirah",
  "palm jumeirah": "jumeirah",
  "palmera jumeirah": "jumeirah",
  "burj al arab": "jumeirah",

  // UAE - Burj Khalifa
  "burj khalifa": "burj khalifa",
  "khalifa": "burj khalifa",
  "dubai mall": "burj khalifa",
  "downtown dubai": "burj khalifa",
  "centro de dubái": "burj khalifa",

  // UAE - Dubai Marina
  "dubai marina": "dubai marina",
  "marina de dubái": "dubai marina",
  "marina de dubai": "dubai marina",

  // UAE - Dubai Desert
  "safari": "dubai desert",
  "desierto de dubái": "dubai desert",
  "desierto de dubai": "dubai desert",
  "deserto de dubai": "dubai desert",
  "dubai desert": "dubai desert",
  "dunas": "dubai desert",

  // UAE - Yas Island / Abu Dhabi attractions
  "yas island": "yas island",
  "ferrari world": "yas island",
  "louvre": "yas island",
  "sheikh zayed": "yas island",

  // UAE - Abu Dhabi
  "abu dhabi": "abu dhabi",
  "أبوظبي": "abu dhabi",
  "أبو ظبي": "abu dhabi",
  "ابوظبي": "abu dhabi",
  "ابو ظبي": "abu dhabi",

  // Morocco - Marrakech
  "marrakech": "marrakech",
  "marraquexe": "marrakech",
  "marrakesh": "marrakech",
  "مراكش": "marrakech",

  // Morocco - Casablanca
  "casablanca": "casablanca",
  "الدار البيضاء": "casablanca",

  // Morocco - Fes
  "fes": "fes",
  "fez": "fes",
  "فاس": "fes",

  // Morocco - Rabat
  "rabat": "rabat",
  "الرباط": "rabat",

  // Holy Land - Jerusalem
  "jerusalem": "jerusalem",
  "jerusalém": "jerusalem",
  "jerusaleme": "jerusalem",
  "gerusalemme": "jerusalem",
  "القدس": "jerusalem",
  "أورشليم": "jerusalem",

  // Holy Land - Bethlehem
  "bethlehem": "bethlehem",
  "belém": "bethlehem",
  "betlemme": "bethlehem",
  "بيت لحم": "bethlehem",

  // Holy Land - Nazareth
  "nazareth": "nazareth",
  "nazaré": "nazareth",
  "nazaret": "nazareth",
  "الناصرة": "nazareth",

  // Holy Land - Tel Aviv
  "tel aviv": "tel aviv",
  "تل أبيب": "tel aviv",

  // Holy Land - Galilee
  "galilee": "galilee",
  "galileia": "galilee",
  "galilea": "galilee",
  "الجليل": "galilee",

  // Greece - Athens
  "athens": "athens",
  "atenas": "athens",
  "atene": "athens",
  "أثينا": "athens",
  "اثينا": "athens",

  // Greece - Mykonos
  "mykonos": "mykonos",
  "miconos": "mykonos",
  "ميكونوس": "mykonos",

  // Greece - Santorini
  "santorini": "santorini",
  "سانتوريني": "santorini",

  // Greece - Crete
  "crete": "crete",
  "creta": "crete",
  "heraklion": "crete",
  "كريت": "crete",

  // Tunisia - Tunis
  "tunis": "tunis",
  "tunes": "tunis",
  "tunisia": "tunis",
  "تونس": "tunis",

  // Tunisia - Carthage
  "carthage": "carthage",
  "cartago": "carthage",
  "قرطاج": "carthage",

  // Tunisia - Sidi Bou Said
  "sidi bou said": "sidi bou said",
  "سيدي بوسعيد": "sidi bou said",
  "سيدي بو سعيد": "sidi bou said",

  // Tunisia - Hammamet
  "hammamet": "hammamet",
  "الحمامات": "hammamet",

  // Tunisia - Testour
  "testour": "testour",
  "تستور": "testour",

  // Tunisia - Dougga
  "dougga": "dougga",
  "دقة": "dougga",

  // Tunisia - El Jem
  "el jem": "el jem",
  "el djem": "el jem",
  "الجم": "el jem",

  // Tunisia - Matmata
  "matmata": "matmata",
  "مطماطة": "matmata",

  // Tunisia - Douz
  "douz": "douz",
  "دوز": "douz",

  // Tunisia - Chott el Jerid
  "chott el jerid": "chott el jerid",
  "شط الجريد": "chott el jerid",

  // Tunisia - Tozeur
  "tozeur": "tozeur",
  "توزر": "tozeur",

  // Tunisia - Kairouan
  "kairouan": "kairouan",
  "القيروان": "kairouan"
};

const getCurvePoints = (from, to, numPoints = 50) => {
  const points = [];
  const lat1 = from[0];
  const lng1 = from[1];
  const lat2 = to[0];
  const lng2 = to[1];

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  // Curvature amount: scale perpendicular vector by distance
  const curvature = 0.15;
  const pLat = -dLng * curvature;
  const pLng = dLat * curvature;

  const cLat = midLat + pLat;
  const cLng = midLng + pLng;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * cLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * cLng + t * t * lng2;
    points.push([lat, lng]);
  }
  return points;
};

const CITY_TRANSLATIONS = {
  ar: {
    "cairo": "القاهرة",
    "giza": "الجيزة",
    "pyramids": "الأهرامات",
    "sphinx": "أبو الهول",
    "luxor": "الأقصر",
    "aswan": "أسوان",
    "alexandria": "الإسكندرية",
    "hurghada": "الغردقة",
    "sharm": "شرم الشيخ",
    "siwa": "سيوة",
    "abu simbel": "أبو سمبل",
    "kom ombo": "كوم أمبو",
    "edfu": "إدفو",
    "philae": "فيلة",
    "valley of the kings": "وادي الملوك",
    "istanbul": "إسطنبول",
    "cappadocia": "كبادوكيا",
    "pamukkale": "باموكالي",
    "ephesus": "أفسس",
    "antalya": "أنطاليا",
    "ankara": "أنقرة",
    "konya": "قونية",
    "bursa": "بورصة",
    "izmir": "إزمير",
    "kusadasi": "كوشاداسي",
    "canakkale": "جناق قلعة",
    "troy": "طروادة",
    "amman": "عمان",
    "petra": "البتراء",
    "wadi rum": "وادي رم",
    "dead sea": "البحر الميت",
    "jerash": "جرش",
    "aqaba": "العقبة",
    "dubai": "دبي",
    "dubai airport": "مطار دبي",
    "old dubai": "دبي القديمة",
    "jumeirah": "جميرا",
    "burj khalifa": "برج خليفة",
    "dubai marina": "مرسى دبي",
    "dubai desert": "صحراء دبي",
    "yas island": "جزيرة ياس",
    "abu dhabi": "أبوظبي",
    "marrakech": "مراكش",
    "casablanca": "الدار البيضاء",
    "fes": "فاس",
    "rabat": "الرباط",
    "jerusalem": "القدس",
    "bethlehem": "بيت لحم",
    "nazareth": "الناصرة",
    "tel aviv": "تل أبيب",
    "galilee": "الجليل",
    "athens": "أثينا",
    "mykonos": "ميكونوس",
    "santorini": "سانتوريني",
    "crete": "كريت",
    "tunis": "تونس",
    "carthage": "قرطاج",
    "sidi bou said": "سيدي بوسعيد",
    "hammamet": "الحمامات",
    "testour": "تستور",
    "dougga": "دقة",
    "el jem": "الجم",
    "matmata": "مطماطة",
    "douz": "دوز",
    "chott el jerid": "شط الجريد",
    "tozeur": "توزر",
    "kairouan": "القيروان"
  },
  es: {
    "cairo": "El Cairo",
    "giza": "Giza",
    "pyramids": "Pirámides",
    "sphinx": "Esfinge",
    "luxor": "Lúxor",
    "aswan": "Aswán",
    "alexandria": "Alejandría",
    "hurghada": "Hurghada",
    "sharm": "Sharm El Sheikh",
    "siwa": "Siwa",
    "abu simbel": "Abu Simbel",
    "kom ombo": "Kom Ombo",
    "edfu": "Edfu",
    "philae": "Philae",
    "valley of the kings": "Valle de los Reyes",
    "istanbul": "Estambul",
    "cappadocia": "Capadocia",
    "pamukkale": "Pamukkale",
    "ephesus": "Éfeso",
    "antalya": "Antalya",
    "ankara": "Ankara",
    "konya": "Konya",
    "bursa": "Bursa",
    "izmir": "Esmirna",
    "kusadasi": "Kusadasi",
    "canakkale": "Canakkale",
    "troy": "Troya",
    "amman": "Amán",
    "petra": "Petra",
    "wadi rum": "Wadi Rum",
    "dead sea": "Mar Muerto",
    "jerash": "Jerash",
    "aqaba": "Áqaba",
    "dubai": "Dubái",
    "dubai airport": "Aeropuerto de Dubái",
    "old dubai": "Dubái Antiguo",
    "jumeirah": "Jumeirah",
    "burj khalifa": "Burj Khalifa",
    "dubai marina": "Marina de Dubái",
    "dubai desert": "Desierto de Dubái",
    "yas island": "Isla de Yas",
    "abu dhabi": "Abu Dabi",
    "marrakech": "Marrakech",
    "casablanca": "Casablanca",
    "fes": "Fez",
    "rabat": "Rabat",
    "jerusalem": "Jerusalén",
    "bethlehem": "Belén",
    "nazareth": "Nazaret",
    "tel aviv": "Tel Aviv",
    "galilee": "Galilea",
    "athens": "Atenas",
    "mykonos": "Miconos",
    "santorini": "Santorini",
    "crete": "Creta",
    "tunis": "Túnez",
    "carthage": "Cartago",
    "sidi bou said": "Sidi Bou Said",
    "hammamet": "Hammamet",
    "testour": "Testour",
    "dougga": "Dougga",
    "el jem": "El Jem",
    "matmata": "Matmata",
    "douz": "Douz",
    "chott el jerid": "Chott el Jerid",
    "tozeur": "Tozeur",
    "kairouan": "Kairuán"
  },
  pt: {
    "cairo": "Cairo",
    "giza": "Giza",
    "pyramids": "Pirâmides",
    "sphinx": "Esfinge",
    "luxor": "Luxor",
    "aswan": "Assuã",
    "alexandria": "Alexandria",
    "hurghada": "Hurghada",
    "sharm": "Sharm El Sheikh",
    "siwa": "Siwa",
    "abu simbel": "Abu Simbel",
    "kom ombo": "Kom Ombo",
    "edfu": "Edfu",
    "philae": "Philae",
    "valley of the kings": "Vales dos Reis",
    "istanbul": "Istambul",
    "cappadocia": "Capadócia",
    "pamukkale": "Pamukkale",
    "ephesus": "Éfeso",
    "antalya": "Antália",
    "ankara": "Ancara",
    "konya": "Konya",
    "bursa": "Bursa",
    "izmir": "Esmirna",
    "kusadasi": "Kusadasi",
    "canakkale": "Canakkale",
    "troy": "Troia",
    "amman": "Amã",
    "petra": "Petra",
    "wadi rum": "Wadi Rum",
    "dead sea": "Mar Morto",
    "jerash": "Jerash",
    "aqaba": "Ácaba",
    "dubai": "Dubai",
    "dubai airport": "Aeroporto de Dubai",
    "old dubai": "Dubai Antigo",
    "jumeirah": "Jumeirah",
    "burj khalifa": "Burj Khalifa",
    "dubai marina": "Marina de Dubai",
    "dubai desert": "Deserto de Dubai",
    "yas island": "Ilha de Yas",
    "abu dhabi": "Abu Dhabi",
    "marrakech": "Marraquexe",
    "casablanca": "Casablanca",
    "fes": "Fez",
    "rabat": "Rabat",
    "jerusalem": "Jerusalém",
    "bethlehem": "Belém",
    "nazareth": "Nazaré",
    "tel aviv": "Tel Aviv",
    "galilee": "Galileia",
    "athens": "Atenas",
    "mykonos": "Miconos",
    "santorini": "Santorini",
    "crete": "Creta",
    "tunis": "Túnis",
    "carthage": "Cartago",
    "sidi bou said": "Sidi Bou Said",
    "hammamet": "Hammamet",
    "testour": "Testour",
    "dougga": "Dougga",
    "el jem": "El Jem",
    "matmata": "Matmata",
    "douz": "Douz",
    "chott el jerid": "Chott el Jerid",
    "tozeur": "Tozeur",
    "kairouan": "Kairouan"
  },
  it: {
    "cairo": "Il Cairo",
    "giza": "Giza",
    "pyramids": "Piramidi",
    "sphinx": "Sfinge",
    "luxor": "Luxor",
    "aswan": "Assuan",
    "alexandria": "Alessandria",
    "hurghada": "Hurghada",
    "sharm": "Sharm El Sheikh",
    "siwa": "Siwa",
    "abu simbel": "Abu Simbel",
    "kom ombo": "Kom Ombo",
    "edfu": "Edfu",
    "philae": "Philae",
    "valley of the kings": "Valle dei Re",
    "istanbul": "Istanbul",
    "cappadocia": "Cappadocia",
    "pamukkale": "Pamukkale",
    "ephesus": "Efeso",
    "antalya": "Antalya",
    "ankara": "Ankara",
    "konya": "Konya",
    "bursa": "Bursa",
    "izmir": "Smirne",
    "kusadasi": "Kusadasi",
    "canakkale": "Canakkale",
    "troy": "Troia",
    "amman": "Amman",
    "petra": "Petra",
    "wadi rum": "Wadi Rum",
    "dead sea": "Mar Morto",
    "jerash": "Jerash",
    "aqaba": "Aqaba",
    "dubai": "Dubai",
    "dubai airport": "Aeroporto di Dubai",
    "old dubai": "Antica Dubai",
    "jumeirah": "Jumeirah",
    "burj khalifa": "Burj Khalifa",
    "dubai marina": "Marina di Dubai",
    "dubai desert": "Deserto di Dubai",
    "yas island": "Isola di Yas",
    "abu dhabi": "Abu Dhabi",
    "marrakech": "Marrakech",
    "casablanca": "Casablanca",
    "fes": "Fes",
    "rabat": "Rabat",
    "jerusalem": "Gerusalemme",
    "bethlehem": "Betlemme",
    "nazareth": "Nazareth",
    "tel aviv": "Tel Aviv",
    "galilee": "Galilea",
    "athens": "Atene",
    "mykonos": "Mykonos",
    "santorini": "Santorini",
    "crete": "Creta",
    "tunis": "Tunisi",
    "carthage": "Cartagine",
    "sidi bou said": "Sidi Bou Said",
    "hammamet": "Hammamet",
    "testour": "Testour",
    "dougga": "Dougga",
    "el jem": "El Jem",
    "matmata": "Matmata",
    "douz": "Douz",
    "chott el jerid": "Chott el Jerid",
    "tozeur": "Tozeur",
    "kairouan": "Kairouan"
  },
  en: {
    "cairo": "Cairo",
    "giza": "Giza",
    "pyramids": "Pyramids",
    "sphinx": "Sphinx",
    "luxor": "Luxor",
    "aswan": "Aswan",
    "alexandria": "Alexandria",
    "hurghada": "Hurghada",
    "sharm": "Sharm El Sheikh",
    "siwa": "Siwa",
    "abu simbel": "Abu Simbel",
    "kom ombo": "Kom Ombo",
    "edfu": "Edfu",
    "philae": "Philae",
    "valley of the kings": "Valley of the Kings",
    "istanbul": "Istanbul",
    "cappadocia": "Cappadocia",
    "pamukkale": "Pamukkale",
    "ephesus": "Ephesus",
    "antalya": "Antalya",
    "ankara": "Ankara",
    "konya": "Konya",
    "bursa": "Bursa",
    "izmir": "Izmir",
    "kusadasi": "Kusadasi",
    "canakkale": "Canakkale",
    "troy": "Troy",
    "amman": "Amman",
    "petra": "Petra",
    "wadi rum": "Wadi Rum",
    "dead sea": "Dead Sea",
    "jerash": "Jerash",
    "aqaba": "Aqaba",
    "dubai": "Dubai",
    "dubai airport": "Dubai Airport",
    "old dubai": "Old Dubai",
    "jumeirah": "Jumeirah",
    "burj khalifa": "Burj Khalifa",
    "dubai marina": "Dubai Marina",
    "dubai desert": "Dubai Desert",
    "yas island": "Yas Island",
    "abu dhabi": "Abu Dhabi",
    "marrakech": "Marrakech",
    "casablanca": "Casablanca",
    "fes": "Fes",
    "rabat": "Rabat",
    "jerusalem": "Jerusalem",
    "bethlehem": "Bethlehem",
    "nazareth": "Nazareth",
    "tel aviv": "Tel Aviv",
    "galilee": "Galilee",
    "athens": "Athens",
    "mykonos": "Mykonos",
    "santorini": "Santorini",
    "crete": "Crete",
    "tunis": "Tunis",
    "carthage": "Carthage",
    "sidi bou said": "Sidi Bou Said",
    "hammamet": "Hammamet",
    "testour": "Testour",
    "dougga": "Dougga",
    "el jem": "El Jem",
    "matmata": "Matmata",
    "douz": "Douz",
    "chott el jerid": "Chott el Jerid",
    "tozeur": "Tozeur",
    "kairouan": "Kairouan"
  }
};

const RouteMap = ({ itinerary }) => {
  const { t, i18n } = useTranslation();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const animationRef = useRef(null);

  const locations = useMemo(() => {
    if (!itinerary || !Array.isArray(itinerary)) return [];
    const extracted = [];

    itinerary.forEach((day) => {
      const rawTexts = [
        day.title,
        day.description,
        day.morning,
        day.afternoon,
        day.evening,
        day.titleDefault,
        day.descDefault,
        day.titleKey ? t(day.titleKey) : null,
        day.descKey ? t(day.descKey) : null
      ].filter(Boolean);

      const translatedTexts = [];
      rawTexts.forEach(text => {
        translatedTexts.push(text);
        
        // Try English translation first to enforce 100% standard route matching across all active locales
        const t1En = t(text, { lng: 'en' });
        if (t1En && t1En !== text) translatedTexts.push(t1En);

        const t2En = t(`data.${text}`, { lng: 'en' });
        if (t2En && t2En !== `data.${text}`) translatedTexts.push(t2En);

        const t3En = t(`trip.${text}`, { lng: 'en' });
        if (t3En && t3En !== `trip.${text}`) translatedTexts.push(t3En);

        // Also try current locale translation
        const t1 = t(text);
        if (t1 && t1 !== text) translatedTexts.push(t1);

        const t2 = t(`data.${text}`);
        if (t2 && t2 !== `data.${text}`) translatedTexts.push(t2);

        const t3 = t(`trip.${text}`);
        if (t3 && t3 !== `trip.${text}`) translatedTexts.push(t3);
      });

      const texts = translatedTexts.map((s) => s.toLowerCase());

      const combinedText = texts.join(" ");

      const dayMatches = [];
      Object.keys(KEYWORDS_MAP).forEach((keyword) => {
        const idx = combinedText.indexOf(keyword);
        if (idx !== -1) {
          dayMatches.push({
            keyword,
            dbKey: KEYWORDS_MAP[keyword],
            index: idx
          });
        }
      });

      // Prioritize longer, more specific keywords (e.g. "palm jumeirah" over "dubai")
      dayMatches.sort((a, b) => b.keyword.length - a.keyword.length);

      if (dayMatches.length > 0) {
        const rawTitle = day.title || day.titleDefault || 'Explore';
        let resolvedTitle = rawTitle;
        if (typeof rawTitle === 'string' && rawTitle.includes('.')) {
          const tVal = t(`data.${rawTitle}`) || t(rawTitle);
          if (tVal && tVal !== `data.${rawTitle}` && tVal !== rawTitle) {
            resolvedTitle = tVal;
          }
        }

        let matchedCoords = null;
        let matchedName = null;
        const lastLoc = extracted[extracted.length - 1];

        for (let i = 0; i < dayMatches.length; i++) {
          const match = dayMatches[i];
          const coords = COORDINATES_DATABASE[match.dbKey];
          if (coords) {
            if (!lastLoc || lastLoc.coords[0] !== coords[0] || lastLoc.coords[1] !== coords[1]) {
              matchedCoords = coords;
              
              const langCode = (i18n.language || 'en').split('-')[0].toLowerCase();
              const langTranslations = CITY_TRANSLATIONS[langCode] || CITY_TRANSLATIONS['en'];
              const translatedName = langTranslations[match.dbKey];
              matchedName = translatedName || (match.dbKey.charAt(0).toUpperCase() + match.dbKey.slice(1));
              break;
            }
          }
        }

        // If a day matched some keywords but they all result in the same coords as lastLoc,
        // we can still just skip pushing to avoid duplicate points on map, which is correct.
        if (matchedCoords) {
          extracted.push({
            name: matchedName,
            coords: matchedCoords,
            description: `${t('tour.day', 'Day')} ${day.day}: ${resolvedTitle}`
          });
        }
      }
    });

    return extracted;
  }, [itinerary, t, i18n.language]);

  useEffect(() => {
    if (!mapContainerRef.current || locations.length === 0) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    }).setView(locations[0].coords, 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    // Markers
    const markers = [];
    locations.forEach((loc) => {
      const marker = L.marker(loc.coords)
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b><br/>${loc.description || ''}`);
      markers.push(marker);
    });

    // Bounds
    const latlngs = locations.map(l => l.coords);
    if (latlngs.length > 0) {
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Animation / curved line if more than 1 location
    if (locations.length > 1) {
      const pathPoints = [];
      for (let i = 0; i < latlngs.length - 1; i++) {
        const segmentPoints = getCurvePoints(latlngs[i], latlngs[i + 1], 50);
        if (i > 0) segmentPoints.shift();
        pathPoints.push(...segmentPoints);
      }

      L.polyline(pathPoints, {
        color: '#f5a623',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);

      // Plane icon
      const planeIcon = L.divIcon({
        className: 'plane-marker',
        html: `
          <div style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; transition: transform 0.1s ease;">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#f5a623" stroke="#041446" stroke-width="1.5" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.45));">
              <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
            </svg>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const plane = L.marker(pathPoints[0], { icon: planeIcon }).addTo(map);

      let currentIndex = 0;
      const speed = 0.15; // Control speed (smaller = slower)
      const animate = () => {
        if (pathPoints.length < 2) return;
        
        const indexToUse = Math.floor(currentIndex);
        if (indexToUse >= pathPoints.length) {
          currentIndex = 0;
        }

        const currentPoint = pathPoints[Math.floor(currentIndex)];
        plane.setLatLng(currentPoint);

        const nextPoint = pathPoints[Math.floor(currentIndex) + 1] || pathPoints[0];
        if (nextPoint) {
          const dLat = nextPoint[0] - currentPoint[0];
          const dLng = nextPoint[1] - currentPoint[1];
          const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
          const planeDiv = plane.getElement()?.querySelector('div');
          if (planeDiv) {
            planeDiv.style.transform = `rotate(${angle}deg)`;
          }
        }

        currentIndex += speed;
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      map.remove();
    };
  }, [locations]);

  if (locations.length === 0) return null;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-16 w-full"
    >
      <div className="mb-10 text-center">
        <span className="text-gold-500 uppercase tracking-[4px] font-semibold block mb-3">
          {t('tour.routeMapSub', 'EXPLORE THE JOURNEY ROUTE')}
        </span>
        <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50" style={{ fontFamily: "'Playfair Display', serif" }}>
          {t('tour.routeMapTitle', 'Interactive Itinerary Map')}
        </h2>
        <div className="w-24 h-1 bg-gold-500 mx-auto mt-3"></div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xl border border-obsidian-900/5 h-[450px] relative z-10">
        <div ref={mapContainerRef} className="w-full h-full" style={{ direction: 'ltr' }} />
      </div>
    </motion.div>
  );
};

export default RouteMap;
