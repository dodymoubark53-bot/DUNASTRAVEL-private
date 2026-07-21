import { useState, useRef, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaTimes, FaChevronLeft, FaChevronRight, FaMicrophone, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaHeadset, FaWhatsapp, FaArrowRight, FaCalendarAlt, FaSuitcase, FaUsers, FaMapMarkedAlt, FaGlobe } from "react-icons/fa";
import Button from "../components/ui/Button";
import TourCard from "../components/tour/TourCard";
import { tours } from "../data/tours";
import { turkeyTours } from "../data/turkeyTours";
import { multiCountryTours } from "../data/multiCountryTours";
import { useTurkeyPrograms } from "../hooks/useTurkeyPrograms";
import { useJordanPrograms } from "../hooks/useJordanPrograms";
import { useDubaiPrograms } from "../hooks/useDubaiPrograms";
import { useMoroccoPrograms } from "../hooks/useMoroccoPrograms";
import { transportation } from "../data/transportation";
import useScrollAnimations from "../hooks/useScrollAnimations";
import { useCurrency } from "../context/CurrencyContext";
import rawProgramData from "../data/programs.json";
const rawPrograms = rawProgramData.programs;

const destinationsData = [
  {
    id: "egypt",
    nameKey: "nav.egypt",
    descKey: "home.destEgyptDesc",
    image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=600&q=40&fm=webp",
  },
  {
    id: "turkey",
    nameKey: "nav.turkey",
    descKey: "home.destTurkeyDesc",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=40&fm=webp",
  },
  {
    id: "dubai",
    nameKey: "nav.dubai",
    descKey: "home.destDubaiDesc",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=40&fm=webp",
  },
  {
    id: "jordan",
    nameKey: "nav.jordan",
    descKey: "home.destJordanDesc",
    image: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?auto=format&fit=crop&w=600&q=40&fm=webp",
  },
  {
    id: "morocco",
    nameKey: "nav.morocco",
    descKey: "home.destMoroccoDesc",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=600&q=40&fm=webp",
  },
  {
    id: "greece",
    nameKey: "nav.greece",
    descKey: "home.destGreeceDesc",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=40&fm=webp",
  },
  {
    id: "tunisia",
    nameKey: "nav.tunisia",
    descKey: "home.destTunisiaDesc",
    image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=600&q=40&fm=webp",
  },
  {
    id: "holy-land",
    nameKey: "nav.holyland",
    descKey: "home.destHolyLandDesc",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=40&fm=webp",
  },
];

const packagesData = [
  {
    id: "classic-program",
    name: "Classic Program",
    desc: "Timeless Wonders",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=40&fm=webp",
    link: "/programs/classic/classic-program"
  },
  {
    id: "honeymooners",
    name: "Honeymooners Package",
    desc: "Romantic Escapes",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=40&fm=webp",
    link: "/programs/honeymooners"
  },
  {
    id: "religious",
    name: "Religious Programs",
    desc: "Spiritual Journeys",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=40&fm=webp",
    link: "/programs/religious"
  },
  {
    id: "multi-country",
    name: "Multi-Country Tours",
    desc: "Beyond Borders",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=40&fm=webp",
    link: "/programs/multi-country"
  },
  {
    id: "extension",
    name: "Egypt Extensions",
    desc: "Expand Your Adventure",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=40&fm=webp",
    link: "/programs/extension"
  }
];

const newDestinationsList = [
  {
    id: "egypt",
    nameAr: "مصر",
    nameEn: "Egypt",
    tagAr: "نبض النيل والأهرامات الخالدة",
    tagEn: "PHARAOHS & IMMORTAL TEMPLES",
    descAr: "رحلة عبر خمسة آلاف عام من السحر والغموض، من عظمة الجيزة إلى هدوء أسوان.",
    descEn: "A journey through five millennia of magic, from the majesty of Giza to the serenity of Aswan.",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80",
    link: "/destinations/egypt"
  },
  {
    id: "turkey",
    nameAr: "تركيا",
    nameEn: "Turkey",
    tagAr: "حكاية الشرق وسحر إسطنبول",
    tagEn: "CAPPADOCIA BALLOONS & OTTOMAN LEGACY",
    descAr: "جسور الحضارة التاريخية، وشواطئ الريفييرا التركية، ومناطيد كبادوكيا الحالمة.",
    descEn: "Bridges of history, the sun-kissed Turkish Riviera, and the dreamlike balloon-filled skies of Cappadocia.",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
    link: "/destinations/turkey"
  },
  {
    id: "jordan",
    nameAr: "الأردن",
    nameEn: "Jordan",
    tagAr: "مدينة الأنباط الوردية وصحراء رم",
    tagEn: "PETRA WONDERS & BEDOUIN STARS",
    descAr: "من روعة البتراء المنحوتة في الصخر إلى هدوء وادي رم الساحر وسحر البحر الميت.",
    descEn: "From the pink-hued stone carvings of Petra to the starry silence of Wadi Rum.",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
    link: "/destinations/jordan"
  },
  {
    id: "morocco",
    nameAr: "المغرب",
    nameEn: "Morocco",
    tagAr: "ألوان مراكش وعبق الأندلس",
    tagEn: "MEDINAS & ATLAS MOUNTAIN PALACES",
    descAr: "دروب فاس العتيقة، وقصور مراكش الفاخرة، وحكايات الصحراء تحت النجوم.",
    descEn: "The ancient winding streets of Fez, red palaces of Marrakech, and tales of the Sahara.",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
    link: "/destinations/morocco"
  },
  {
    id: "greece",
    nameAr: "اليونان",
    nameEn: "Greece",
    tagAr: "أساطير بحر إيجة وجزر سانتوريني",
    tagEn: "SANTORINI DOMES & GREEK MYTHS",
    descAr: "قباب زرقاء ممتدة مع الأفق، ومياه فيروزية تحكي قصص الفلاسفة والآلهة.",
    descEn: "Blue domes meeting the infinite horizon, and turquoise waters whispering ancient myths.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    link: "/destinations/greece"
  },
  {
    id: "dubai",
    nameAr: "دبي",
    nameEn: "Dubai",
    tagAr: "واحة المستقبل والرفاهية المطلقة",
    tagEn: "SKY-HIGH LUXURY & SAND DUNES",
    descAr: "ناطحات سحاب تعانق السماء، وتجارب تسوق فاخرة، وصحراء ذهبية لا تنام.",
    descEn: "Futuristic skylines, ultra-luxury retreats, and golden desert dunes that never sleep.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    link: "/destinations/dubai"
  },
  {
    id: "tunisia",
    nameAr: "تونس",
    nameEn: "Tunisia",
    tagAr: "تاريخ قرطاج وجمال سيدي بو سعيد",
    tagEn: "CARTHAGE RUINS & MEDITERRANEAN BREEZE",
    descAr: "نسيم البحر الأبيض المتوسط يداعب جدران الضيعات البيضاء والزرقاء وأطلال قرطاج.",
    descEn: "Mediterranean breezes caressing whitewashed walls and the ancient columns of Carthage.",
    image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=800&q=80",
    link: "/destinations/tunisia"
  },
  {
    id: "holyland",
    nameAr: "الأراضي المقدسة",
    nameEn: "Holy Land",
    tagAr: "مهد الأديان وعبق التاريخ",
    tagEn: "FAITH, HISTORY & SACRED PATHWAYS",
    descAr: "معالم روحية وتاريخية خالدة تروي قصص الأنبياء والحضارات المتعاقبة.",
    descEn: "Sacred spires and ancient pathways whispering stories of faith and human history.",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
    link: "/destinations/holyland"
  }
];

const getOptimizedImageUrl = (url, width = 400, height = 450) => {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    return url.replace('/image/upload/', `/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
  }
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', '40');
      urlObj.searchParams.set('fm', 'webp');
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    } catch {
      return url;
    }
  }
  return url;
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [activeDestination, setActiveDestination] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [isAllToursPopupOpen, setIsAllToursPopupOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [tourPaused, setTourPaused] = useState(false);
  const turkeyPrograms = useTurkeyPrograms();
  const formattedTurkeyTours = turkeyPrograms.map((tp) => ({
    id: tp.id,
    slug: tp.slug,
    destination: "turkey",
    title: tp.title,
    description: tp.overview,
    duration: tp.duration,
    price: tp.raw?.price || 899,
    rating: 4.8,
    reviewCount: 120,
    images: tp.images,
    type: tp.raw?.type || "Cultural Tour",
    market: "Global",
    highlights: tp.highlights,
    code: tp.code
  }));

  const jordanPrograms = useJordanPrograms();
  const formattedJordanTours = jordanPrograms.map((jp) => ({
    id: jp.id,
    slug: jp.slug,
    destination: "jordan",
    title: jp.title,
    description: jp.overview,
    duration: jp.duration,
    price: jp.raw?.price || 899,
    rating: 4.8,
    reviewCount: 120,
    images: jp.images,
    type: jp.raw?.type || "Cultural Tour",
    market: "Global",
    highlights: jp.highlights,
    code: jp.code
  }));

  const dubaiPrograms = useDubaiPrograms();
  const formattedDubaiTours = dubaiPrograms.map((dp) => ({
    id: dp.id,
    slug: dp.slug,
    destination: "dubai",
    title: dp.title,
    description: dp.overview,
    duration: dp.duration,
    price: dp.raw?.price || 899,
    rating: 4.8,
    reviewCount: 120,
    images: dp.images,
    type: dp.raw?.type || "Dubai Tour",
    market: "Global",
    highlights: dp.highlights,
    code: dp.code
  }));

  const moroccoPrograms = useMoroccoPrograms();
  const formattedMoroccoTours = moroccoPrograms.map((mp) => ({
    id: mp.id,
    slug: mp.slug,
    destination: "morocco",
    title: mp.title,
    description: mp.overview,
    duration: mp.duration,
    price: mp.raw?.price || 899,
    rating: 4.8,
    reviewCount: 120,
    images: mp.images,
    type: mp.raw?.type || "Cultural Tour",
    market: "Global",
    highlights: mp.highlights,
    code: mp.code
  }));

  const allToursForMarquee = useMemo(() => {
    const combined = [];
    tours.forEach(tour => combined.push({ ...tour, description: tour.overview, link: `/tours/${tour.slug}` }));
    formattedTurkeyTours.forEach(t => combined.push({ ...t, link: `/programs/turkey/${t.slug}` }));
    formattedJordanTours.forEach(t => combined.push({ ...t, link: `/programs/jordan/${t.slug}` }));
    formattedDubaiTours.forEach(t => combined.push({ ...t, link: `/programs/dubai/${t.slug}` }));
    formattedMoroccoTours.forEach(t => combined.push({ ...t, link: `/programs/morocco/${t.slug}` }));
    multiCountryTours.forEach(tour => combined.push({
      id: tour.id, slug: tour.slug, destination: tour.destination,
      title: tour.title, description: tour.overview || tour.description,
      duration: tour.duration, price: tour.price, rating: tour.rating,
      reviewCount: tour.reviewCount, images: tour.images, type: tour.type,
      link: `/programs/multi-country/${tour.slug}`,
    }));
    turkeyTours.forEach(tour => combined.push({ ...tour, description: tour.overview, link: `/tours/${tour.slug}` }));
    return combined;
  }, [tours, formattedTurkeyTours, formattedJordanTours, formattedDubaiTours, formattedMoroccoTours]);

  const packagesToursMap = useMemo(() => {
    return {
      "classic-program": [{
        id: "classic-prog-1",
        slug: "classic-program",
        destination: "egypt",
        title: "Classic Egypt Programme",
        description: "Experience the timeless wonders of Egypt.",
        duration: "Classic",
        price: 890,
        rating: 5,
        reviewCount: 312,
        images: ["https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=40&fm=webp"],
        linkBase: "/programs/classic"
      }],
      "honeymooners": [{
        id: "hm-prog-1",
        slug: "honeymooners",
        destination: "egypt",
        title: "Honeymoon in Egypt",
        description: "A romantic escape across the magical landscapes of Egypt.",
        duration: "Honeymoon",
        price: 1500,
        rating: 5,
        reviewCount: 150,
        images: ["https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=40&fm=webp"],
        linkBase: "/programs"
      }],
      "religious": [{
        id: "rel-prog-1",
        slug: "religious",
        destination: "egypt",
        title: "JOURNEY OF THE HOLY FAMILY – 10 DAYS – 09 NIGHTS",
        description: "Spiritual journey tracing the steps of the Holy Family in Egypt.",
        duration: "10 Days / 9 Nights",
        price: 1350,
        rating: 5,
        reviewCount: 110,
        images: ["https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=40&fm=webp"],
        linkBase: "/programs"
      }],
      "multi-country": multiCountryTours.map(tour => ({
        id: tour.id, slug: tour.slug, destination: tour.destination || "multi-country",
        title: tour.title, description: tour.overview || tour.description,
        duration: tour.duration, price: tour.price, rating: tour.rating,
        reviewCount: tour.reviewCount, images: tour.images, type: tour.type,
        linkBase: "/programs/multi-country"
      })),
      "extension": [
        {
          id: "ext-hurghada",
          slug: "hurghada-4d3n",
          destination: "egypt",
          title: "Hurghada",
          description: "Transfer to Cairo Airport and board your flight to Hurghada. Arrival and transfer to...",
          duration: "4 Days / 3 Nights",
          price: 450,
          rating: 4.8,
          reviewCount: 95,
          images: ["https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=40&fm=webp"],
          linkBase: "/trips"
        },
        {
          id: "ext-sharm",
          slug: "sharm-4d3n",
          destination: "egypt",
          title: "Sharm El Sheikh",
          description: "Transfer to Cairo Airport and boarding the flight to Sharm El Sheikh. Arrival and transfer...",
          duration: "4 Days / 3 Nights",
          price: 500,
          rating: 4.7,
          reviewCount: 105,
          images: ["https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=600&q=40&fm=webp"],
          linkBase: "/trips"
        },
        {
          id: "ext-siwa",
          slug: "siwa-oasis-alexandria",
          destination: "egypt",
          title: "Oasis Siwa + Alexandria",
          description: "Cairo → Wadi El Natroun → Marsa Matruh → Siwa → Alexandria → Cairo",
          duration: "Various",
          price: 600,
          rating: 4.9,
          reviewCount: 88,
          images: ["https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=40&fm=webp"],
          linkBase: "/trips"
        }
      ]
    };
  }, [multiCountryTours]);

  const packagesToursForMarquee = useMemo(() => {
    const combined = [];
    const seen = new Set();

    Object.values(packagesToursMap).flat().forEach(t => {
      const link = `${t.linkBase}/${t.slug}`;
      if (!seen.has(link)) {
        seen.add(link);
        combined.push({
          ...t,
          link
        });
      }
    });

    return combined;
  }, [packagesToursMap]);


  // Hero Video State
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Sync muted state to video DOM element (reliable approach)
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
    if (!isMuted) {
      el.play().catch(() => {});
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Search Form State
  const [searchDest, setSearchDest] = useState("all");
  const [searchTour, setSearchTour] = useState("");
  const [searchPeople, setSearchPeople] = useState(1);

  const destinations = [
    { id: "egypt", label: t("dest.egypt.title", "Egypt"), img: "/imgs/destinations/egypt.webp" },
    { id: "turkey", label: t("dest.turkey.title", "Turkey"), img: "/imgs/destinations/turkey.webp" },
    { id: "dubai", label: t("dest.dubai.title", "Dubai"), img: "/imgs/destinations/dubai.webp" },
    { id: "jordan", label: t("dest.jordan.title", "Jordan"), img: "/imgs/destinations/jordan.webp" },
    { id: "tunisia", label: t("dest.tunisia.title", "Tunisia"), img: "/imgs/destinations/tunisia.webp" },
    { id: "morocco", label: t("dest.morocco.title", "Morocco"), img: "/imgs/destinations/morocco.webp" },
    { id: "greece", label: t("dest.greece.title", "Greece"), img: "https://res.cloudinary.com/degbrq3ck/image/upload/w_100,h_100,c_fill,q_auto,f_auto/v1783026773/13_wtazze.jpg" },
    { id: "holyland", label: t("dest.holyland.title", "Holy Land"), img: "https://res.cloudinary.com/degbrq3ck/image/upload/w_100,h_100,c_fill,q_auto,f_auto/v1783026773/17_wpxrtt.jpg" },
  ];

  const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const TURKEY_IDS = ["REG-01", "IST-01", "REG-03", "REG-04", "REG-05", "REG-05-B", "REG-06", "REG-07", "REG-08", "REG-09", "REG-10", "REG-11", "REG-12", "REG-13", "REG-14"];
  const JORDAN_IDS = ["REG-15", "REG-16", "REG-17", "REG-18", "REG-19", "REG-20", "REG-21"];
  const DUBAI_IDS = ["REG-22", "REG-23", "REG-24", "REG-25", "REG-26", "REG-27", "REG-28", "HM001", "HM002"];
  const EGYPT_IDS = ["REG-29"];
  const MOROCCO_IDS = ["MRC-01"];

  const programCountry = (id) => {
    if (TURKEY_IDS.includes(id)) return "turkey";
    if (JORDAN_IDS.includes(id)) return "jordan";
    if (DUBAI_IDS.includes(id)) return "dubai";
    if (EGYPT_IDS.includes(id)) return "egypt";
    if (MOROCCO_IDS.includes(id)) return "morocco";
    return "turkey";
  };

  const allExtraTours = useMemo(() => ({
    turkey: turkeyTours,
  }), [turkeyTours]);

  const getToursForDest = (destId) => {
    const lang = i18n.language;
    const langMap = { pt: 'pt-BR', en: 'en', es: 'es', it: 'it', ar: 'ar' };
    const tourLang = langMap[lang] || 'en';
    const result = [];

    const addTour = (tour, baseUrl) => {
      const slug = tour.slug || slugify(tour.id + "-" + (tour.title || ""));
      result.push({ label: t(`tour.${tour.id}`, tour.title), url: `${baseUrl}/${slug}`, id: `tour-${slug}` });
    };

    const addProgram = (p, country) => {
      const slug = slugify(p.id + "-" + p.name.en);
      result.push({ label: p.name[lang] || p.name.en, url: `/programs/${country}/${slug}`, id: `prog-${p.id}` });
    };

    if (destId === "all") {
      tours.forEach((tour) => addTour(tour, "/tours"));
      rawPrograms.forEach((p) => addProgram(p, programCountry(p.id)));
      turkeyTours.forEach((tour) => addTour(tour, "/tours"));
      multiCountryTours.forEach((mc) => {
        const slug = mc.slug || slugify(mc.id + "-" + (mc.title || ""));
        result.push({ label: mc.title, url: `/programs/multi-country/${slug}`, id: `multi-${mc.id}` });
      });
      return result;
    }

    const filtered = tours.filter((t) => t.destination === destId && t.language === tourLang);
    const fallback = tours.filter((t) => t.destination === destId && t.language !== tourLang);
    const seen = new Set();
    [...filtered, ...fallback].forEach((tour) => {
      if (!seen.has(tour.id)) { seen.add(tour.id); addTour(tour, "/tours"); }
    });

    const extra = allExtraTours[destId];
    if (extra) {
      extra.forEach((tour) => addTour(tour, "/tours"));
    }

    if (destId === "turkey") {
      rawPrograms.filter((p) => TURKEY_IDS.includes(p.id)).forEach((p) => addProgram(p, "turkey"));
    }
    if (destId === "jordan") {
      rawPrograms.filter((p) => JORDAN_IDS.includes(p.id)).forEach((p) => addProgram(p, "jordan"));
    }
    if (destId === "dubai") {
      rawPrograms.filter((p) => DUBAI_IDS.includes(p.id)).forEach((p) => addProgram(p, "dubai"));
    }
    if (destId === "morocco") {
      rawPrograms.filter((p) => MOROCCO_IDS.includes(p.id)).forEach((p) => addProgram(p, "morocco"));
    }
    if (destId === "egypt") {
      rawPrograms.filter((p) => EGYPT_IDS.includes(p.id)).forEach((p) => addProgram(p, "egypt"));
    }
    return result;
  };

  const destTours = searchDest ? getToursForDest(searchDest) : [];

  const handleSearch = () => {
    if (searchTour) {
      const found = destTours.find((t) => t.id === searchTour);
      if (found) { window.location.href = found.url; return; }
    }
    if (searchDest && searchDest !== "all") {
      window.location.href = `/destinations/${searchDest}`;
    }
  };

  // Transportation State
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [resForm, setResForm] = useState({
    vehicle: "",
    date: "",
    time: "",
    adults: 1,
    children: 0,
    pickup: "",
    dropoff: "",
    name: "",
    phone: "",
    email: "",
  });
  const [resSuccess, setResSuccess] = useState(false);

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayString();

  const handleResSubmit = (e) => {
    e.preventDefault();
    if (resForm.date && resForm.date < todayStr) {
      return;
    }
    setResSuccess(true);
    setTimeout(() => setResSuccess(false), 5000);
    setResForm({
      vehicle: "",
      date: "",
      time: "",
      adults: 1,
      children: 0,
      pickup: "",
      dropoff: "",
      name: "",
      phone: "",
      email: "",
    });
  };

  const handleHomeReserveClick = (vehicleId) => {
    setResForm((prev) => ({ ...prev, vehicle: vehicleId }));
    const element = document.getElementById("home-reservation-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useScrollAnimations();
  const isRtl = i18n.dir() === 'rtl';

  const filteredVehicles =
    vehicleFilter === "all"
      ? transportation
      : transportation.filter((v) => v.category === vehicleFilter);

  const galleryImages = [
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783023886/3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783023877/2ec72126-709b-4c8d-8f7b-a592d212cc3b_czpoig.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783023865/80f6f47a-4938-4684-aaf1-b1e61d44dab6_n8vdtl.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783023927/dad14822-455c-419c-8627-32b3daebef90_akfw3l.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024003/d34eeca3-6bc8-4a19-aa18-bf13404bb11b_n0f8zn.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024053/66dc2b5e-f90d-424f-b9a7-4164b52f4e5a_eoqd3p.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024062/071f261a-2ab6-48b5-a370-c47ad7889be3_immde1.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024072/400a841d-18b7-4915-8483-f9a3346651cf_ocdouu.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024090/9788c6d2-7046-4ce0-aa64-a0adcbe1a54d_omcrnc.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/5_upvijm.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/6_q4vcdg.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/8_mpyvu4.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/11_xydddd.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/10_t3dnh6.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026772/12_fukk6b.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026772/14_z5msnu.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026772/15_rrczuy.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/17_wpxrtt.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/18_hbfrt1.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/13_wtazze.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/20_riy2ce.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/19_suxy3c.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026774/21_gqrhmg.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026774/1_uidqje.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026774/2_h2krys.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026775/22_gywthx.jpg", dest: "Gallery", tag: "Photo" },
    { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026775/3_rbjrys.jpg", dest: "Gallery", tag: "Photo" },
  ];

  const videos = [
    { publicId: 'Despu%C3%A9s_de_una_intensa_jornada_en_Bogot%C3%A1__en_Dunas_Travel_compartimos_una_cena_exclusiva_con_nuestros_partners_estrat%C3%A9gicos._480P_SD_sv2pei' },
    { publicId: 'Somos_Dunas_Travel_Group__480P_SD_gxfsxm' },
    { publicId: 'VID-20260611-WA0001_az82kl' },
    { publicId: 'VID-20260623-WA0112_xmyc5z' },
    { publicId: 'VID-20260611-WA0000_mwgayg' },
    { publicId: '%EF%B8%8F_Viagem_inteligente_come%C3%A7a_no_planejamento_certo_480P_SD_s3dyjb' },
    { publicId: 'VID-20260623-WA0109_lxcv2r' },
    { publicId: 'Temos_grande_honra_em_receber_este_reconhecimento_da_Lusanova_como__Melhores_Parceiros_2025_._480P_SD_rgbhr5' },
  ];

  const cloudName = 'degbrq3ck';

  const openLightbox = (index) => {
    setActiveGalleryIndex(index);
    setZoomScale(1);
    setIsLightboxOpen(true);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setZoomScale(1);
    setActiveGalleryIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setZoomScale(1);
    setActiveGalleryIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  };



  const activeTours = activeDestination
    ? activeDestination === "turkey"
      ? formattedTurkeyTours
      : activeDestination === "jordan"
        ? formattedJordanTours
        : activeDestination === "dubai"
          ? formattedDubaiTours
          : activeDestination === "morocco"
            ? formattedMoroccoTours
            : tours.filter((t) => t.destination === activeDestination)
    : [];

  const featuredToursList = [
    tours.find((t) => t.destination === "egypt"),
    formattedTurkeyTours[0] || tours.find((t) => t.destination === "turkey"),
    formattedJordanTours[0] || tours.find(
      (t) =>
        t.destination === "jordan" &&
        t.id !== tours.find((x) => x.destination === "jordan")?.id,
    ),
    formattedMoroccoTours[0] || tours.find(
      (t) =>
        t.destination === "morocco" &&
        t.id !== tours.find((x) => x.destination === "morocco")?.id,
    ),
    tours.find((t) => t.destination === "tunisia"),
  ].filter(Boolean);

  const handleDestinationClick = (id) => {
    setActiveDestination((prev) => (prev === id ? null : id));
  };

  const [activePackage, setActivePackage] = useState(null);

  const handlePackageClick = (id) => {
    setActivePackage((prev) => (prev === id ? null : id));
  };

  const activePackageTours = useMemo(() => {
    if (!activePackage) return [];
    return packagesToursMap[activePackage] || [];
  }, [activePackage, packagesToursMap]);

  return (
    <div className="w-full">
      <Helmet>
        <title>
          {t(
            "home.metaTitle",
            "Dunas Travel | Award-Winning Experiences in Egypt, Jordan, Turkey, Tunisia, Greece, Holy Land, Morocco & Dubai",
          )}
        </title>
        <meta
          name="description"
          content={t(
            "home.metaDesc",
            "Experience true luxury with Dunas Travel — curated journeys through the timeless wonders of Egypt, Jordan, Turkey, Tunisia, Greece, the Holy Land, Morocco, and Dubai.",
          )}
        />
        <meta property="og:title" content="Dunas Travel" />
        <meta
          property="og:description"
          content="Premium luxury travel agency — Egypt, Jordan, Turkey, Tunisia, Greece, Holy Land, Morocco & Dubai"
        />
        <meta property="og:image" content="/dunas-travel-logo.png" />
        <link rel="icon" type="image/png" href="/dunas-travel-logo.png" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-black mt-[104px] sm:mt-[108px] lg:mt-[124px]">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            fetchpriority="high"
            poster="/imgs/hero-poster.webp"
            className="w-full h-full object-contain"
            width="1440"
            height="812"
          >
            <source src="/imgs/hero.webm" type="video/webm" />
            <source src="/imgs/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-obsidian-900/50 pointer-events-none"></div>
        </div>
        {/* Sound Toggle */}
        <button
          onClick={toggleMute}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-20 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-obsidian-900/70 backdrop-blur-md border border-gold-500/30 flex items-center justify-center text-ivory-50 hover:text-gold-500 hover:bg-obsidian-900 transition-all shadow-lg"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <FaMicrophone size={14} /> : <FaMicrophone size={14} className="text-green-500" />}
        </button>
      </section>
      {/* Search Section */}
      <section className="relative w-full py-20 md:py-28 overflow-hidden mt-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/degbrq3ck/image/upload/w_1440,h_600,c_fill,q_auto,f_auto/v1783067135/grand_tour_of_turkey_lxb1f4.jpg"
            alt="Search tours and holiday packages background"
            className="w-full h-full object-cover object-center"
            fetchpriority="high"
            width="1440"
            height="600"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/30 via-obsidian-900/20 to-obsidian-900/50"></div>
        </div>

        {/* Search Content (overlay on image) */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          {/* Search Form */}
          <div className="w-full max-w-5xl">
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-5 md:p-6 lg:p-8 border border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {/* Destination */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="search-dest-input" className="block text-[10px] sm:text-caption text-gold-400 uppercase tracking-wider mb-1 font-semibold">
                    {t('home.searchDest', 'Destination')}
                  </label>
                  <select
                    id="search-dest-input"
                    value={searchDest}
                    onChange={(e) => { setSearchDest(e.target.value); setSearchTour(""); }}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white text-[13px] sm:text-body-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] appearance-none cursor-pointer [&>option]:text-obsidian-900 [&>option]:dark:text-ivory-100 [&>option]:dark:bg-obsidian-800"
                  >
                    <option value="all" className="text-obsidian-900 dark:text-ivory-100 dark:bg-obsidian-800">{t('home.searchAllDest', 'All Destinations')}</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id} className="text-obsidian-900 dark:text-ivory-100 dark:bg-obsidian-800">{d.label}</option>
                    ))}
                  </select>
                </div>

                {/* Tour */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="search-tour-input" className="block text-[10px] sm:text-caption text-gold-400 uppercase tracking-wider mb-1 font-semibold">
                    {t('home.searchTour', 'Tour / Program')}
                  </label>
                  <select
                    id="search-tour-input"
                    value={searchTour}
                    onChange={(e) => setSearchTour(e.target.value)}
                    disabled={!searchDest || searchDest === "all"}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white text-[13px] sm:text-body-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&>option]:text-obsidian-900 [&>option]:dark:text-ivory-100 [&>option]:dark:bg-obsidian-800"
                  >
                    <option value="" className="text-obsidian-900 dark:text-ivory-100 dark:bg-obsidian-800">
                      {searchDest === "all" ? t('home.selectDestFirst', 'Select a destination first') : t('home.searchAllTours', 'All Tours')}
                    </option>
                    {searchDest && searchDest !== "all" && destTours.map((t) => (
                      <option key={t.id} value={t.id} className="text-obsidian-900 dark:text-ivory-100 dark:bg-obsidian-800">{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* People + Search */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="search-people-input" className="block text-[10px] sm:text-caption text-gold-400 uppercase tracking-wider mb-1 font-semibold">
                    {t('home.searchPeople', 'People')}
                  </label>
                  <div className="flex gap-1.5 sm:gap-2">
                    <input
                      id="search-people-input"
                      type="number"
                      min="1"
                      max="50"
                      value={searchPeople}
                      onChange={(e) => setSearchPeople(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 sm:w-20 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white text-[13px] sm:text-body-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FF6B35] [color-scheme:dark]"
                    />
                    <button
                      onClick={handleSearch}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 font-semibold rounded-lg transition-all text-[13px] sm:text-body-sm whitespace-nowrap text-white"
                      style={{ background: 'linear-gradient(135deg, #FF6B35, #1E3A8A)' }}
                    >
                      {t('home.searchBtn', 'Search')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 sm:mt-6 text-center w-full max-w-5xl"
          >
            <p className="text-gold-400 text-[10px] sm:text-caption uppercase tracking-widest mb-2 sm:mb-3 font-semibold drop-shadow-lg">
              {t('home.popularDests', 'Popular Destinations')}
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
              {destinations.map((d) => (
                <Link
                  key={d.id}
                  to={`/destinations/${d.id}`}
                  className="group flex items-center gap-1.5 sm:gap-2 bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/30 hover:border-[#FF6B35] rounded-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 transition-all shadow-lg"
                >
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 ring-2 ring-white/50 shadow-md">
                    <img src={d.img} alt="" className="w-full h-full object-cover" width="28" height="28" />
                  </span>
                  <span className="text-white text-[11px] sm:text-body-sm font-semibold drop-shadow-lg group-hover:text-[#FF6B35] transition-colors">
                    {d.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Customize & Contact Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 sm:mt-5 flex flex-wrap justify-center gap-3"
            >
              <Link
                to="/tailor-a-tour"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#C07D0A] text-[#1A1A2E] font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-[0_0_20px_rgba(245,166,35,0.6)] hover:shadow-[0_0_30px_rgba(245,166,35,0.9)] hover:scale-105 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('home.customize', 'Customize Your Trip')}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#C07D0A] text-[#1A1A2E] font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-[0_0_20px_rgba(245,166,35,0.6)] hover:shadow-[0_0_30px_rgba(245,166,35,0.9)] hover:scale-105 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('nav.contact', 'Contact Us')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About the Company */}
      <section className="py-12 bg-ivory-50 gsap-reveal">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <span className="text-gold-500 uppercase tracking-widest text-caption block mb-4">
                {t("home.whoWeAre", "QUIÉNES SOMOS")}
              </span>
              <h2 className="text-display-lg text-obsidian-900 mb-6">
                {t("home.aboutTitle", "Experiencias exclusivas, diseñadas a medida")}
              </h2>
              <p className="text-body-lg text-obsidian-700 mb-8 leading-relaxed">
                {t(
                  "home.aboutDesc",
                  "En Dunas Travel diseñamos experiencias exclusivas por los destinos más fascinantes de Oriente Medio y el Mediterráneo. Con un profundo conocimiento de cada destino y una cuidada selección de hoteles, cruceros boutique y experiencias privadas, creamos itinerarios a medida donde la excelencia, la autenticidad y la atención personalizada convierten cada viaje en una experiencia verdaderamente inolvidable."
                )}
              </p>
              <Link to="/about">
                <Button variant="outline-gold" className="px-8 py-3">
                  {t("home.learnMore", "Learn More About Us")}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <img
                src="/images/crafting-journeys.webp"
                alt="Crafting Journeys"
                className="w-full h-[300px] lg:h-[480px] object-cover rounded-[16px] shadow-[0_0_40px_rgba(245,166,35,0.25)] transition-transform duration-400 ease hover:-translate-y-[8px]"
                width="600"
                height="480"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1428] via-[#141e3c] to-[#0c1428]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4a843\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
            {[
              { count: 17, icon: FaCalendarAlt, labelKey: 'about.heroStatsYears', prefix: '', suffix: '' },
              { count: 95654, icon: FaSuitcase, labelKey: 'about.heroStatsTravelers', prefix: '', suffix: '' },
              { count: 438, icon: FaUsers, labelKey: 'about.heroStatsEmployees', prefix: '', suffix: '' },
              { count: 182, icon: FaMapMarkedAlt, labelKey: 'about.heroStatsGuides', prefix: '', suffix: '' },
              { count: 5, icon: FaGlobe, labelKey: 'about.heroStatsOffices', prefix: '', suffix: '' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-300">
                  <s.icon className="text-gold-500 text-2xl" />
                </div>
                <div className="gsap-count text-4xl md:text-5xl font-bold text-white font-display" data-count={s.count}>
                  0
                </div>
                <div className="text-white text-sm mt-2 tracking-wide uppercase">
                  {t(s.labelKey)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations & Their Tours */}
      <section className="py-10" style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-gold-500 uppercase tracking-widest text-caption block mb-4">
              {t("home.discoverMagic")}
            </span>
            <h2 className="text-display-lg text-ivory-50">
              {t("home.destTitle")}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinationsData.map((dest) => {
              const tourCount = dest.id === "turkey"
                ? formattedTurkeyTours.length
                : dest.id === "jordan"
                  ? formattedJordanTours.length
                  : dest.id === "dubai"
                    ? formattedDubaiTours.length
                    : dest.id === "morocco"
                      ? formattedMoroccoTours.length
                      : tours.filter((t) => t.destination === dest.id).length;
              const isActive = activeDestination === dest.id;

              return (
                <motion.div
                  key={dest.id}
                  onClick={() => handleDestinationClick(dest.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDestinationClick(dest.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`${t("home.select", "Select")} ${t(dest.nameKey, dest.nameKey)} ${t("nav.tours", "Tours")}`}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 0 32px rgba(245,166,35,0.22)",
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className={`relative h-[300px] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gold-500 ${isActive ? "ring-2 ring-gold-500 shadow-[0_0_20px_rgba(245,166,35,0.4)] scale-[1.02]" : "hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(245,166,35,0.2)]"}`}
                >
                  <img
                    src={dest.image}
                    alt={t(dest.nameKey, dest.nameKey)}
                    className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 transition-colors duration-500 ${isActive ? "bg-obsidian-900/40" : "bg-obsidian-900/60 group-hover:bg-obsidian-900/40"}`}
                  ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-display-lg text-ivory-50 mb-2">
                      {t(dest.nameKey, dest.nameKey)}
                    </h3>
                    <p className="text-body-lg text-gold-500 font-medium mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(dest.descKey, dest.descKey) }} />
                    <span className="text-caption text-ivory-300 uppercase tracking-wider bg-obsidian-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-ivory-50/10">
                      {tourCount} {t("home.toursAvailable")}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {activeDestination && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-12">
                  <h3 className="text-display-md text-ivory-50 mb-8 text-center capitalize">
                    {t(
                      `nav.${activeDestination === 'holy-land' ? 'holyland' : activeDestination}`,
                      activeDestination.charAt(0).toUpperCase() + activeDestination.slice(1)
                    )}{" "}
                    {t("nav.tours")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTours.slice(0, 6).map((tour) => (
                      <TourCard
                        key={tour.id}
                        tour={tour}
                        linkBase={activeDestination === "turkey" ? "/programs/turkey" : activeDestination === "jordan" ? "/programs/jordan" : activeDestination === "dubai" ? "/programs/dubai" : "/tours"}
                      />
                    ))}
                  </div>
                  {activeTours.length > 6 && (
                    <div className="flex justify-center mt-10">
                      <Link to={`/destinations/${activeDestination}`}>
                        <Button variant="outline-gold" className="px-8 py-3">
                          {t("home.viewAll", "View All")} {activeTours.length} {t("nav.tours", "Tours")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* All Tours Marquee */}
      <section className="py-12 bg-ivory-100 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold-600 uppercase tracking-widest text-caption block mb-4">
              {t("home.handpicked", "HANDPICKED FOR YOU")}
            </span>
            <h2 className="text-display-lg text-obsidian-900">
              {t("home.lovedJourneys", "Our Most Loved Journeys")}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
          </div>
        </div>

        {/* Navigation Buttons - removed, CSS animation handles auto-scroll */}

          <div className="overflow-hidden w-full">
            <div
              className="flex w-max"
              style={{
                gap: "24px",
                paddingLeft: "24px",
                animation: `${isRtl ? 'tourMarqueeRTL' : 'tourMarquee'} 60s linear infinite`,
              }}
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
            >
            {(() => {
              const sliced = allToursForMarquee.slice(0, 8);
              return [
                ...sliced.map(t => ({ ...t, isDuplicate: false })),
                ...sliced.map(t => ({ ...t, isDuplicate: true }))
              ].map((tData, idx) => (
                <Link
                  key={`${tData.id}-${idx}`}
                  to={tData.link}
                  tabIndex={tData.isDuplicate ? -1 : undefined}
                  aria-hidden={tData.isDuplicate ? "true" : undefined}
                  className="min-w-[320px] md:min-w-[400px] shrink-0 group relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 h-[450px] block focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <img
                    src={getOptimizedImageUrl(tData.images[0], 400, 450)}
                    alt={tData.title}
                    width="400"
                    height="450"
                    className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/20 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-gold-500/90 backdrop-blur-sm text-obsidian-900 text-caption font-bold px-3 py-1 rounded shadow-md uppercase">
                  {t(`nav.${tData.destination === 'holy-land' ? 'holyland' : tData.destination}`, tData.destination)}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-display-md text-ivory-50 mb-2 leading-tight">
                      {t(`data.${tData.title}`, tData.title)}
                    </h3>

                    <div className="flex items-center justify-between text-caption text-ivory-300 mb-4">
                      <span>{t(`data.${tData.duration}`, tData.duration)}</span>
                      <span className="text-gold-500 font-semibold">
                        {formatPrice(tData.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gold-500 mb-4">
                      <FaStar size={14} />
                      <span className="text-ivory-50 ml-1 text-sm font-semibold">
                        {(tData.rating || 5).toFixed(1)} <span className="text-ivory-300 font-normal">({tData.reviewCount || 100})</span>
                      </span>
                    </div>

                    <div className="block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Button variant="outline-gold" tabIndex={-1} className="w-full py-2">
                        {t("home.viewTour", "View Tour")}
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ));
          })()}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Button
            variant="gold-glow"
            className="px-8 py-3"
            onClick={() => setIsAllToursPopupOpen(true)}
          >
            {t("home.exploreAllTours", "Explore All Tours")}
          </Button>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-10" style={{ background: "linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-gold-500 uppercase tracking-widest text-caption block mb-4">
              {t("home.ourPackages", "Discover Our Packages")}
            </span>
            <h2 className="text-display-lg text-ivory-50">
              {t("home.packagesTitle", "Curated Programs & Experiences")}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {packagesData.map((pkg) => {
              const isActive = activePackage === pkg.id;
              return (
                <motion.div
                  key={pkg.id}
                  onClick={() => handlePackageClick(pkg.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePackageClick(pkg.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`View ${pkg.name}`}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 0 32px rgba(245,166,35,0.22)",
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className={`relative h-[300px] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gold-500 block ${isActive ? "ring-2 ring-gold-500 shadow-[0_0_20px_rgba(245,166,35,0.4)] scale-[1.02]" : "hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(245,166,35,0.2)]"}`}
                >
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? "bg-obsidian-900/40" : "bg-obsidian-900/60 group-hover:bg-obsidian-900/40"}`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-display-lg text-ivory-50 mb-2">
                      {t(`packages.${pkg.id}.name`, pkg.name)}
                    </h3>
                    <p className="text-body-lg text-gold-500 font-medium mb-4 leading-relaxed">
                      {t(`packages.${pkg.id}.desc`, pkg.desc)}
                    </p>
                    <span className="text-caption text-ivory-300 uppercase tracking-wider bg-obsidian-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-ivory-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {t("home.explorePackage", "Explore Package")}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {activePackage && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-12">
                  <h3 className="text-display-md text-ivory-50 mb-8 text-center capitalize">
                    {t(`packages.${activePackage}.name`, packagesData.find(p => p.id === activePackage)?.name)}{" "}
                    {t("nav.tours", "Tours")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePackageTours.slice(0, 6).map((tour) => (
                      <TourCard
                        key={tour.id}
                        tour={tour}
                        linkBase={tour.linkBase || "/tours"}
                      />
                    ))}
                  </div>
                  {activePackageTours.length > 6 && (
                    <div className="flex justify-center mt-8">
                      <Link to={packagesData.find(p => p.id === activePackage)?.link || "/tours"}>
                        <Button variant="outline-gold">
                          {t("home.viewAllTours", "View All Tours")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Packages Tours Marquee */}
      <section className="py-12 bg-ivory-100 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold-600 uppercase tracking-widest text-caption block mb-4">
              {t("home.packageTripsSub", "FEATURED TRIPS")}
            </span>
            <h2 className="text-display-lg text-obsidian-900">
              {t("home.packageTripsTitle", "Trips From Our Packages")}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
          </div>
        </div>

        <div className="overflow-hidden w-full">
          <div
            className="flex w-max"
            style={{
              gap: "24px",
              paddingLeft: "24px",
              animation: `${isRtl ? 'tourMarqueeRTL' : 'tourMarquee'} 60s linear infinite`,
            }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
          >
            {(() => {
              const sliced = packagesToursForMarquee.slice(0, 8);
              return [
                ...sliced.map(t => ({ ...t, isDuplicate: false })),
                ...sliced.map(t => ({ ...t, isDuplicate: true }))
              ].map((tData, idx) => (
                <Link
                  key={`pkg-${tData.id}-${idx}`}
                  to={tData.link}
                  tabIndex={tData.isDuplicate ? -1 : undefined}
                  aria-hidden={tData.isDuplicate ? "true" : undefined}
                  className="min-w-[320px] md:min-w-[400px] shrink-0 group relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 h-[450px] block focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <img
                    src={getOptimizedImageUrl(tData.images && tData.images.length > 0 ? tData.images[0] : "", 400, 450)}
                    alt={tData.title}
                    width="400"
                    height="450"
                    className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/20 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 bg-gold-500/90 backdrop-blur-sm text-obsidian-900 text-caption font-bold px-3 py-1 rounded shadow-md uppercase">
                    {t(`nav.${tData.destination === 'holy-land' ? 'holyland' : (tData.destination || 'tour')}`, tData.destination || 'tour')}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-display-md text-ivory-50 mb-2 leading-tight">
                        {t(`data.${tData.title}`, tData.title)}
                      </h3>

                      <div className="flex items-center justify-between text-caption text-ivory-300 mb-4">
                        <span>{t(`data.${tData.duration}`, tData.duration)}</span>
                        <span className="text-gold-500 font-semibold">
                          {formatPrice(tData.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-gold-500 mb-4">
                        {[...Array(Math.floor(tData.rating || 5))].map((_, i) => (
                          <FaStar key={i} size={12} />
                        ))}
                        <span className="text-ivory-50 ml-1 text-xs">
                          ({tData.reviewCount || 100})
                        </span>
                      </div>

                      <div className="block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Button variant="outline-gold" tabIndex={-1} className="w-full py-2">
                          {t("home.viewTour", "View Tour")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Transportation & Transfers */}
      <section className="py-12 bg-ivory-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold-500 uppercase tracking-widest text-caption block mb-4"
            >
              {t('home.transportSub', 'GET AROUND IN STYLE')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-display-lg text-obsidian-900 mb-6"
            >
              {t('home.transportTitle', 'Premium Transportation Services')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-body-lg text-obsidian-700 max-w-2xl mx-auto"
            >
              {t('home.transportDesc', 'Luxury vehicles and professional drivers — available across Egypt, Jordan, Turkey & Tunisia')}
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-1 bg-gold-500 mx-auto mt-6"
            ></motion.div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["all", "bus", "coaster", "private"].map((tab) => (
              <button
                key={tab}
                onClick={() => setVehicleFilter(tab)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium tracking-wide ${vehicleFilter === tab
                  ? tab === "all"
                    ? "bg-obsidian-900/80 text-white border-gold-500"
                    : "bg-gold-500 text-obsidian-900 border-gold-500 shadow-[0_0_15px_rgba(245,166,35,0.4)]"
                  : "bg-obsidian-900/80 text-white border-obsidian-900/80"
                  }`}
              >
                {tab === "all"
                  ? t("home.allVehicles", "All")
                  : tab === "bus"
                    ? t("home.buses", "Buses")
                    : tab === "coaster"
                      ? t("home.coasters", "Coasters")
                      : t("home.privateVehicles", "Private Vehicles")}
              </button>
            ))}
          </div>

          {/* Vehicles Strip */}
          <div className="w-full relative overflow-hidden mb-12">
            <div
              className="flex gallery-strip w-max"
              style={{
                animation: `${isRtl ? 'scrollStripRTL' : 'scrollStrip'} 80s linear infinite`,
                gap: "16px",
              }}
            >
              {Array.from({ length: 4 })
                .flatMap(() => filteredVehicles)
                .map((vehicle, idx) => (
                  <div
                    key={`${vehicle.id}-${idx}`}
                    className="flex-shrink-0 flex flex-col rounded-[16px] overflow-hidden group relative w-[280px] h-[220px] md:h-[380px] transition-all duration-[350ms] ease-out hover:scale-[1.08] hover:-translate-y-[12px] hover:shadow-[0_12px_40px_rgba(245,166,35,0.35)] hover:z-10"
                  >
                    <img
                      src={vehicle.heroImage || vehicle.image}
                      alt={vehicle.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent"></div>

                    <div className="absolute top-4 left-4 bg-gold-500 text-obsidian-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded shadow-md">
                      {vehicle.category === 'bus' ? t('transportation.filter.buses', 'Buses') :
                        vehicle.category === 'coaster' ? t('transportation.filter.coasters', 'Coaster Vehicles') :
                          t('transportation.filter.private', 'Private Vehicles')}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end">
                      <h3 className="font-display text-xl text-ivory-50 mb-1 drop-shadow-md">
                        {vehicle.name}
                      </h3>
                      <div className="flex items-center text-xs text-white mb-3 gap-1">
                        <svg
                          className="w-4 h-4 text-gold-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        {vehicle.seats}{" "}
                        {t("transportation.seatsCount", "Seats")}
                      </div>

                      <div className="flex items-center justify-between mb-4 border-t border-ivory-50/20 pt-3 mt-1">
                        <span className="text-xs text-white uppercase tracking-wider">
                          {t("tourCard.from", "From")}
                        </span>
                        <span className="text-lg font-semibold text-gold-500">
                          {formatPrice(vehicle.pricePerDay)}
                          <span className="text-xs text-white font-normal">
                            {" "}
                            / {t("transportation.day", "day")}
                          </span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleHomeReserveClick(vehicle.id)}
                        className="w-full py-2 text-sm font-semibold text-white transition-colors border border-gold-500 rounded-lg flex items-center justify-center bg-obsidian-900/40 backdrop-blur-sm cursor-pointer outline-none"
                      >
                        {t("transportation.reserveNow", "Reserve Now")}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Reservation Form */}
          <motion.div
            id="home-reservation-form"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto rounded-3xl p-8 md:p-12 relative overflow-hidden border border-[rgba(245,166,35,0.2)]"
            style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)', boxShadow: '0 0 40px rgba(10,25,105, 0.8)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h3 className="text-display-md text-ivory-50 mb-2">
                  {t("home.bookTransfer", "Book Your Transfer")}
                </h3>
                <p className="text-body-md text-ivory-300">
                  {t(
                    "home.bookTransferDesc",
                    "Fill out the details below and our concierge will confirm your reservation.",
                  )}
                </p>
              </div>

              {resSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-sage-500/20 text-sage-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-display text-ivory-50 mb-2">
                    {t("home.resSuccess", "Reservation Received")}
                  </h4>
                  <p className="text-ivory-300">
                    {t(
                      "home.resSuccessDesc",
                      "We will contact you shortly to confirm the details.",
                    )}
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleResSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Select Vehicle */}
                  <div className="md:col-span-2">
                    <label htmlFor="book-vehicle-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                      {t("home.selectVehicle", "Select Vehicle *")}
                    </label>
                    <select
                      id="book-vehicle-input"
                      required
                      value={resForm.vehicle}
                      onChange={(e) =>
                        setResForm({ ...resForm, vehicle: e.target.value })
                      }
                      className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    >
                      <option value="">
                        {t("home.chooseVehicle", "Choose a vehicle")}
                      </option>
                      {transportation.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.seats}{" "}
                          {t("transportation.seatsCount", "Seats")}) - {formatPrice(v.pricePerDay)}/{t("transportation.day", "day")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <label htmlFor="book-date-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                      {t("home.tripDate", "Trip Date *")}
                    </label>
                    <input
                      id="book-date-input"
                      type="date"
                      required
                      value={resForm.date}
                      min={todayStr}
                      onChange={(e) =>
                        setResForm({ ...resForm, date: e.target.value })
                      }
                      className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label htmlFor="book-time-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                      {t("home.pickupTime", "Pick Up Time *")}
                    </label>
                    <input
                      id="book-time-input"
                      type="time"
                      required
                      value={resForm.time}
                      onChange={(e) =>
                        setResForm({ ...resForm, time: e.target.value })
                      }
                      className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>

                  {/* Passengers */}
                  <div>
                    <label htmlFor="book-adults-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                      {t("home.adultsCount", "Adults *")}
                    </label>
                    <input
                      id="book-adults-input"
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={resForm.adults}
                      onChange={(e) =>
                        setResForm({ ...resForm, adults: e.target.value })
                      }
                      className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="book-children-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                      {t("home.childrenCount", "Children (0-20)")}
                    </label>
                    <input
                      id="book-children-input"
                      type="number"
                      min="0"
                      max="20"
                      value={resForm.children}
                      onChange={(e) =>
                        setResForm({ ...resForm, children: e.target.value })
                      }
                      className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    />
                  </div>

                  {/* Locations */}
                  <div>
                    <label htmlFor="book-pickup-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                      {t("home.pickupLocation", "Pick Up Location *")}
                    </label>
                    <input
                      id="book-pickup-input"
                      type="text"
                      required
                      placeholder={t(
                        "home.pickupPlaceholder",
                        "Hotel, Airport, etc.",
                      )}
                      value={resForm.pickup}
                      onChange={(e) =>
                        setResForm({ ...resForm, pickup: e.target.value })
                      }
                      className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="book-dropoff-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                      {t("home.dropoffLocation", "Drop Off Location *")}
                    </label>
                    <input
                      id="book-dropoff-input"
                      type="text"
                      required
                      placeholder={t(
                        "home.dropoffPlaceholder",
                        "Hotel, Airport, etc.",
                      )}
                      value={resForm.dropoff}
                      onChange={(e) =>
                        setResForm({ ...resForm, dropoff: e.target.value })
                      }
                      className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="book-name-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                        {t("contact.fullName", "Full Name *")}
                      </label>
                      <input
                        id="book-name-input"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={resForm.name}
                        onChange={(e) =>
                          setResForm({ ...resForm, name: e.target.value })
                        }
                        className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="book-phone-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                        {t("contact.phoneNumber", "Phone Number *")}
                      </label>
                      <input
                        id="book-phone-input"
                        type="text"
                        required
                        placeholder="+1 234 567 890"
                        value={resForm.phone}
                        onChange={(e) =>
                          setResForm({ ...resForm, phone: e.target.value })
                        }
                        className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="book-email-input" className="block text-caption text-ivory-300 uppercase tracking-widest mb-2">
                        {t("contact.email", "Email *")}
                      </label>
                      <input
                        id="book-email-input"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={resForm.email}
                        onChange={(e) =>
                          setResForm({ ...resForm, email: e.target.value })
                        }
                        className="w-full bg-obsidian-900/50 border border-ivory-50/10 rounded-lg p-3 text-ivory-50 placeholder-ivory-300/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-center mt-6 pt-6 border-t border-ivory-50/10">
                    <Button
                      type="submit"
                      className="w-full md:w-auto px-12 py-4 text-lg rounded-full text-white hover:scale-105 transition-transform"
                      style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)', boxShadow: '0 0 20px rgba(10,25,105, 0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {t("home.reserveNow", "Reserve Now")}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-10 bg-[#1E3A8A] overflow-hidden">
        <style>
          {`
            @keyframes scrollStrip {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes scrollStripRTL {
              0%   { transform: translateX(0); }
              100% { transform: translateX(50%); }
            }
            .gallery-strip:hover {
              animation-play-state: paused;
            }
          `}
        </style>
        <div className="container mx-auto px-6 mb-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-500 uppercase tracking-widest text-caption block mb-4"
          >
            {t("home.galleryLabel", "CAPTURED MOMENTS")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-display-lg text-ivory-50"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("home.galleryHeading", "A Glimpse Into Your Journey")}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-1 bg-gold-500 mx-auto mt-6"
          ></motion.div>
        </div>

        <div className="w-full mt-10 relative">
          <div
            className="flex gallery-strip w-max"
            style={{
              animation: `${isRtl ? 'scrollStripRTL' : 'scrollStrip'} 80s linear infinite`,
              gap: "16px",
            }}
          >
            {(() => {
              const sliced = galleryImages.slice(0, 12);
              return [...sliced, ...sliced].map((img, idx) => {
                const originalIndex = galleryImages.indexOf(img);
                const isDuplicate = idx >= sliced.length;
                return (
                  <div
                    key={idx}
                    className="flex-shrink-0 cursor-pointer overflow-hidden rounded-[12px] group relative transition-all duration-[350ms] ease-out hover:scale-[1.08] hover:-translate-y-[12px] hover:shadow-[0_12px_40px_rgba(245,166,35,0.35)] hover:z-10 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    onClick={isDuplicate ? undefined : () => openLightbox(originalIndex)}
                    onKeyDown={isDuplicate ? undefined : (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(originalIndex);
                      }
                    }}
                    tabIndex={isDuplicate ? -1 : 0}
                    role={isDuplicate ? undefined : "button"}
                    aria-label={isDuplicate ? undefined : `${t("home.viewLarger", "View larger image of")} ${img.dest}`}
                    aria-hidden={isDuplicate ? "true" : undefined}
                  >
                    <img
                      src={getOptimizedImageUrl(img.src, 400, 380)}
                      alt={img.dest}
                      loading="lazy"
                      width="280"
                      height="380"
                      className="h-[220px] md:h-[380px] w-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* Video Strip Section */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, rgb(10,25,105) 0%, rgb(6,29,93) 50%, rgb(10,21,53) 100%)' }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold-500 uppercase tracking-widest text-caption block mb-4">
              {t('home.videoSectionSub', 'Moments to Remember')}
            </span>
            <h2 className="text-display-lg text-ivory-50 font-display">
              {t('home.videoSectionTitle', 'Join Our Beautiful Journey')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
          </motion.div>

          <div className="overflow-hidden">
            <div className="flex gap-6 pb-4"
              style={{
                width: 'max-content',
                animation: `${isRtl ? 'marqueeVideoRTL' : 'marqueeVideo'} 40s linear infinite`,
              }}
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
            >
              {[...videos, ...videos, ...videos].map((video, idx) => {
                const isDuplicate = idx >= videos.length;
                return (
                  <motion.div
                    key={`${video.publicId}-${idx}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % videos.length) * 0.1 }}
                    onClick={isDuplicate ? undefined : () => setActiveVideo(video.publicId)}
                    onKeyDown={isDuplicate ? undefined : (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveVideo(video.publicId);
                      }
                    }}
                    tabIndex={isDuplicate ? -1 : 0}
                    role={isDuplicate ? undefined : "button"}
                    aria-label={isDuplicate ? undefined : t('home.playVideo', 'Play video clip')}
                    aria-hidden={isDuplicate ? "true" : undefined}
                    className="min-w-[300px] md:min-w-[360px] shrink-0 relative rounded-2xl overflow-hidden cursor-pointer group h-[200px] md:h-[240px] focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <img
                      src={`https://res.cloudinary.com/${cloudName}/video/upload/w_400,h_240,c_fill/${video.publicId}.jpg`}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-obsidian-900/40 group-hover:bg-obsidian-900/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gold-500/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-obsidian-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, rgb(4,20,70) 0%, rgb(6,29,93) 50%, rgb(8,16,50) 100%)' }}>
        {/* Decorative backdrop elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.05]" 
          style={{ 
            background: 'radial-gradient(circle at 10% 20%, rgb(30,58,138) 0%, transparent 40%), radial-gradient(circle at 90% 80%, #F5A623 0%, transparent 40%)' 
          }} 
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="inline-block text-gold-600 uppercase tracking-[0.25em] text-caption mb-4 font-bold text-xs px-4 py-1.5 rounded-full bg-gold-500/5 border border-gold-500/10">
              {t('home.servicesSub', 'Our Services')}
            </span>
            <h2 className="text-display-lg text-ivory-50 font-display mb-6 tracking-wide">
              {t('home.servicesTitle', 'Services')}
            </h2>
            <p className="text-ivory-300 text-body-md max-w-xl mx-auto font-body">
              {t('home.servicesDesc', 'Premium travel solutions tailored to your needs')}
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-8 rounded-full" />
          </motion.div>

          {/* Dynamic Expanding Panels */}
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto min-h-[500px] md:h-[550px]">
            
            {/* Hotels Card */}
            <motion.a
              href="/programs/hotels"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative flex-1 md:hover:grow-[1.4] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-lg border border-gold-200/20 flex flex-col justify-end"
            >
              {/* Background Image with Muted Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
              
              {/* Golden Overlay Light Leak */}
              <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Background Motif: Arched Dome Outlines */}
              <svg className="absolute -right-12 -bottom-12 w-64 h-64 text-gold-500/10 pointer-events-none transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="50" cy="50" r="40" strokeDasharray="2 2" />
                <path d="M50 10v80M10 50h80" />
                <path d="M22 22l56 56M22 78l56-56" />
              </svg>

              {/* Content Panel */}
              <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-start transform md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {/* Custom Palace Door SVG Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md transition-all duration-500 group-hover:bg-gold-500 group-hover:text-obsidian-900 group-hover:scale-110">
                  <svg className="w-9 h-9 text-gold-400 group-hover:text-obsidian-900 transition-colors duration-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 52V28C12 16.9543 20.9543 8 32 8C43.0457 8 52 16.9543 52 28V52" strokeLinecap="round"/>
                    <path d="M6 52H58" strokeLinecap="round"/>
                    <path d="M22 52V30C22 24.4772 26.4772 20 32 20C37.5228 20 42 24.4772 42 30V52" strokeLinecap="round"/>
                    <circle cx="32" cy="30" r="4" fill="currentColor"/>
                    <path d="M32 34V42" strokeLinecap="round"/>
                    <line x1="32" y1="8" x2="32" y2="14" strokeLinecap="round"/>
                    <path d="M28 14H36" strokeLinecap="round"/>
                  </svg>
                </div>

                <div className="space-y-3 flex-grow">
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.2em]">01 / Sanctuary Stay</span>
                  <h3 className="text-2xl font-bold text-ivory-50 font-display tracking-wide">{t('nav.hotelsTab', 'Hotels')}</h3>
                  <p className="text-ivory-300 text-sm leading-relaxed font-body max-w-sm md:opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    {t('home.servicesHotelsDesc', 'Luxury 5-star accommodations and handpicked boutique hotels across all destinations')}
                  </p>
                  
                  {/* Action Link */}
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 group-hover:text-gold-300 transition-colors pt-2 uppercase tracking-widest">
                    <span>{t('services.explore', 'Explore')}</span>
                    <FaArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.a>

            {/* Transportation Card */}
            <motion.a
              href="/programs/transportation"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex-1 md:hover:grow-[1.4] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-lg border border-gold-200/20 flex flex-col justify-end"
            >
              {/* Background Image with Muted Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: "url('https://res.cloudinary.com/degbrq3ck/image/upload/w_800,q_auto,f_auto/v1783071610/bus1_lprkiy.jpg')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
              
              {/* Golden Overlay Light Leak */}
              <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Background Motif: Navigational Lines */}
              <svg className="absolute -right-12 -bottom-12 w-64 h-64 text-gold-500/10 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <path d="M10 90 C 20 40, 80 60, 90 10" strokeLinecap="round" />
                <path d="M15 90 C 25 45, 75 55, 85 15" strokeLinecap="round" strokeDasharray="3 3" />
                <circle cx="90" cy="10" r="4" fill="currentColor" />
                <circle cx="10" cy="90" r="4" fill="currentColor" />
              </svg>

              {/* Content Panel */}
              <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-start transform md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {/* Custom Windrose / Navigator SVG Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md transition-all duration-500 group-hover:bg-gold-500 group-hover:text-obsidian-900 group-hover:scale-110">
                  <svg className="w-9 h-9 text-gold-400 group-hover:text-obsidian-900 transition-colors duration-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="32" cy="32" r="24" strokeDasharray="4 4" strokeLinecap="round"/>
                    <path d="M32 12L36 28L32 32L28 28Z" fill="currentColor" opacity="0.3"/>
                    <path d="M32 52L28 36L32 32L36 36Z" fill="currentColor" opacity="0.3"/>
                    <path d="M12 32L28 28L32 32L28 36Z" fill="currentColor" opacity="0.3"/>
                    <path d="M52 32L36 36L32 32L36 28Z" fill="currentColor" opacity="0.3"/>
                    <path d="M32 10V22" strokeLinecap="round"/>
                    <path d="M30 14L32 10L34 14" strokeLinecap="round" strokeJoin="round"/>
                    <path d="M16 48C28 48 24 24 48 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="48" cy="20" r="3" fill="currentColor"/>
                  </svg>
                </div>

                <div className="space-y-3 flex-grow">
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.2em]">02 / Premium Voyage</span>
                  <h3 className="text-2xl font-bold text-ivory-50 font-display tracking-wide">{t('nav.transportation', 'Transportation')}</h3>
                  <p className="text-ivory-300 text-sm leading-relaxed font-body max-w-sm md:opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    {t('home.servicesTransportDesc', 'Private luxury vehicles, airport transfers, and chauffeur-driven tours with expert drivers')}
                  </p>
                  
                  {/* Action Link */}
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 group-hover:text-gold-300 transition-colors pt-2 uppercase tracking-widest">
                    <span>{t('services.explore', 'Explore')}</span>
                    <FaArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.a>

          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden bg-obsidian-900">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        
        {/* Custom Styles for animated rings */}
        <style>
          {`
            @keyframes pulse-ring {
              0% { transform: scale(0.95); opacity: 0; }
              50% { opacity: 0.5; }
              100% { transform: scale(1.4); opacity: 0; }
            }
            .animate-ring-slow {
              animation: pulse-ring 3s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            }
            .animate-ring-fast {
              animation: pulse-ring 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            }
            .glassmorphism-card {
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .glassmorphism-card:hover {
              border-color: rgba(245, 166, 35, 0.3);
              box-shadow: 0 0 30px rgba(245, 166, 35, 0.08);
            }
            .gold-text-glow {
              text-shadow: 0 0 20px rgba(245, 166, 35, 0.2);
            }
          `}
        </style>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            
            {/* Left Column: Visual Focal Point + Typography Heading */}
            <div className="lg:col-span-2 space-y-8 text-center lg:text-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-caption uppercase tracking-[0.2em] font-semibold text-xs mx-auto lg:mx-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-ping" />
                  {t('home.contactSub', 'Get In Touch')}
                </div>
                
                <h2 className="text-display-lg text-white font-display leading-tight tracking-wide gold-text-glow">
                  {t('home.contactTitle', "We're Here to Help")}
                </h2>
                
                <p className="text-body-md text-ivory-300 leading-relaxed font-body max-w-md mx-auto lg:mx-0">
                  {i18n.language === 'ar' 
                    ? "فريق مستشاري السفر الفاخر لدينا متاح دائمًا لتصميم رحلتك المخصصة والإجابة على أي استفسارات على مدار الساعة."
                    : "Our dedicated travel advisors are standing by 24/7 to design your bespoke itinerary, answer questions, or provide support at any point of your journey."
                  }
                </p>
              </motion.div>

              {/* Headset Support Focal Point */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="relative w-48 h-48 mx-auto lg:ms-0 flex items-center justify-center"
              >
                {/* Glowing Circles */}
                <div className="absolute inset-0 rounded-full border border-gold-500/10 animate-ring-slow" />
                <div className="absolute inset-4 rounded-full border border-gold-500/20 animate-ring-fast" />
                
                {/* Center visual box */}
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-primary-900 to-primary-500 p-0.5 shadow-gold/20 shadow-2xl relative flex items-center justify-center border border-white/10 group hover:rotate-6 transition-transform duration-500">
                  <div className="absolute inset-[2px] bg-obsidian-900 rounded-[22px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                    <FaHeadset className="w-12 h-12 text-gold-500 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <a
                  href="https://wa.me/201149401111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold uppercase tracking-wider text-xs px-8 py-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
                >
                  <FaWhatsapp className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {i18n.language === 'ar' ? "تحدث معنا عبر واتساب" : "Chat on WhatsApp"}
                </a>
                
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 glassmorphism-card text-ivory-50 font-medium uppercase tracking-wider text-xs px-8 py-4 rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  {i18n.language === 'ar' ? "صفحة الاتصال" : "Contact Page"}
                  <FaArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>

            {/* Right Column: 3 Contact Cards */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Card 1: Address */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -6 }}
                className="glassmorphism-card rounded-2xl p-6 md:p-8 flex items-start gap-6 group transition-all duration-300 text-start"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-obsidian-900 transition-all duration-300 shrink-0 shadow-lg">
                  <FaMapMarkerAlt className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-grow">
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block">01 / {t('contact.office', 'Address')}</span>
                  <h3 className="text-lg font-bold text-ivory-50 tracking-wide font-display">{t('home.contactAddress', 'Our Location')}</h3>
                  <p className="text-ivory-300 text-sm leading-relaxed font-body">
                    5 Hussein Said St, Old Hadayk El Ahram<br />
                    First floor, Flat 102 – 103<br />
                    Haram - Giza – Egypt
                  </p>
                  <a 
                    href="https://maps.google.com/?q=5+Hussein+Said+St,+Old+Hadayk+El+Ahram,+Haram,+Giza,+Egypt" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors pt-2 group/link"
                  >
                    {i18n.language === 'ar' ? "عرض على الخريطة" : "Open in Google Maps"}
                    <FaArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>

              {/* Card 2: Phone */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -6 }}
                className="glassmorphism-card rounded-2xl p-6 md:p-8 flex items-start gap-6 group transition-all duration-300 text-start"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-obsidian-900 transition-all duration-300 shrink-0 shadow-lg">
                  <FaPhoneAlt className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-grow">
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block">02 / {t('contact.phoneLabel', 'Phone')}</span>
                  <h3 className="text-lg font-bold text-ivory-50 tracking-wide font-display">{t('home.contactPhone', 'Call Us')}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href="tel:+20233746643"
                      className="inline-flex items-center gap-2.5 text-ivory-300 hover:text-gold-400 text-sm font-medium transition-colors py-1 px-3 rounded-lg bg-white/5 border border-white/5 hover:border-gold-500/30 hover:bg-gold-500/5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      02 33746643
                    </a>
                    <a
                      href="tel:+20233746654"
                      className="inline-flex items-center gap-2.5 text-ivory-300 hover:text-gold-400 text-sm font-medium transition-colors py-1 px-3 rounded-lg bg-white/5 border border-white/5 hover:border-gold-500/30 hover:bg-gold-500/5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      02 33746654
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Email */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -6 }}
                className="glassmorphism-card rounded-2xl p-6 md:p-8 flex items-start gap-6 group transition-all duration-300 text-start"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-obsidian-900 transition-all duration-300 shrink-0 shadow-lg">
                  <FaEnvelope className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-grow">
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block">03 / {t('contact.emailLabel', 'Email')}</span>
                  <h3 className="text-lg font-bold text-ivory-50 tracking-wide font-display">{t('home.contactEmail', 'Email Us')}</h3>
                  
                  <div className="pt-2">
                    <a
                      href="mailto:info@dunas-travel.com"
                      aria-label="Send us an email at info@dunas-travel.com"
                      className="inline-flex items-center gap-2.5 text-ivory-300 hover:text-gold-400 text-sm font-medium transition-colors py-1.5 px-4 rounded-lg bg-white/5 border border-white/5 hover:border-gold-500/30 hover:bg-gold-500/5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      info@dunas-travel.com
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-28 lg:py-36 bg-[#FEFCF7] relative overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        {/* Soft Background Gradients */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            background: 'radial-gradient(circle at 80% 20%, rgb(30,58,138) 0%, transparent 60%), radial-gradient(circle at 20% 80%, #F5A623 0%, transparent 60%)' 
          }} 
        />
        {/* Decorative Grid Lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        
        {/* Slow-spinning background compass motif */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.02] pointer-events-none z-0">
          <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="#d4af37" strokeWidth="0.25">
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="40" strokeDasharray="1 3" />
            <circle cx="50" cy="50" r="2" fill="#d4af37" />
            <path d="M50 5v90M5 50h90" />
            <path d="M50 5L52 45L50 50L48 45Z" fill="#d4af37" />
            <path d="M50 95L48 55L50 50L52 55Z" fill="#d4af37" />
            <path d="M5 50L45 48L50 50L45 52Z" fill="#d4af37" />
            <path d="M95 50L55 52L50 50L55 48Z" fill="#d4af37" />
          </svg>
        </div>

        {/* Shimmer & Rotation Custom Styles */}
        <style>
          {`
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 150s linear infinite;
            }
            .dest-card-shimmer::after {
              content: '';
              position: absolute;
              top: -50%;
              left: -60%;
              width: 30%;
              height: 200%;
              background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.15) 50%,
                rgba(255, 255, 255, 0) 100%
              );
              transform: rotate(25deg);
              transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
              pointer-events: none;
            }
            .group:hover .dest-card-shimmer::after {
              left: 130%;
            }
          `}
        </style>

        <div className="container mx-auto px-6 relative z-10">
          
          {/* Section Header with Layered Watermark */}
          <div className="relative mb-24 text-center">
            {/* Huge watermarked text behind */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[70px] sm:text-[110px] md:text-[150px] font-display font-bold uppercase tracking-[0.15em] text-gold-500/[0.04] select-none pointer-events-none whitespace-nowrap z-0">
              {isRtl ? "اكتشف العالم" : "EXPLORE"}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-10 space-y-4"
            >
              <span className="inline-block text-gold-600 uppercase tracking-[0.25em] text-[10px] md:text-xs font-bold px-5 py-2 rounded-full bg-gold-500/5 border border-gold-500/10 backdrop-blur-sm shadow-[0_4px_20px_rgba(201,162,39,0.05)]">
                {isRtl ? "الرحلات الحصرية لعام ٢٠٢٦" : "EXCLUSIVE VOYAGES 2026"}
              </span>
              <h2 className="text-display-lg text-black dark:text-black font-display tracking-wide leading-tight mt-2">
                {isRtl ? "الوجهات" : t('nav.destinations', 'Destinations')}
              </h2>
              <p className="text-black dark:text-black text-body-md max-w-xl mx-auto font-body font-medium leading-relaxed">
                {isRtl 
                  ? "اكتشف عجائب الدنيا القديمة وعواصم الحداثة الفاخرة، رحلات منسقة خصيصًا لتلبي تطلعاتك."
                  : "Discover the wonders of the ancient world and the capitals of modern luxury, curated bespoke for you."
                }
              </p>
              <div className="w-24 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6 rounded-full" />
            </motion.div>
          </div>

          {/* Destinations Cinematic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {newDestinationsList.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.75, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={item.link}
                  className="group relative flex flex-col justify-end h-[460px] md:h-[500px] rounded-[32px] overflow-hidden bg-obsidian-950 border border-gold-300/10 shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_24px_64px_rgba(245,166,35,0.22)] hover:border-gold-500/35 transition-all duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer text-start dest-card-shimmer"
                >
                  {/* Floating Recommended Badge */}
                  <div className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} z-20`}>
                    <div className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-[9px] font-bold text-gold-400 uppercase tracking-widest shadow-md">
                      {isRtl ? "موصى به" : "RECOMMENDED"}
                    </div>
                  </div>

                  {/* Background Image with Zoom on Hover */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-115"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  
                  {/* Strong Dark Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/65 to-obsidian-950/10 transition-all duration-500" />
                  
                  {/* Golden Lighting Leak */}
                  <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Card Content */}
                  <div className={`relative z-10 p-8 flex flex-col justify-end h-full ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="space-y-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                      {/* Subheading / Tagline */}
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] block transform group-hover:scale-105 origin-left transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-gold-400">
                        {isRtl ? item.tagAr : item.tagEn}
                      </span>
                      
                      {/* Destination Name */}
                      <h3 className="text-2xl md:text-3xl font-bold font-display tracking-wide transition-colors duration-300 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] text-ivory-50 group-hover:text-gold-400">
                        {isRtl ? item.nameAr : item.nameEn}
                      </h3>
                      
                      {/* Divider line that expands from 0 to 100% on hover */}
                      <div className="w-0 group-hover:w-full h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent transition-all duration-[800ms] ease-out mt-2" />

                      {/* Description text */}
                      <p className="text-ivory-300 text-xs md:text-sm leading-relaxed font-body font-medium opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-[600ms] delay-75 ease-out max-w-[280px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {isRtl ? item.descAr : item.descEn}
                      </p>
                      
                      {/* Action Explore Button */}
                      <div className="flex items-center justify-between pt-2 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-[600ms] delay-150 ease-out border-t border-white/5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gold-400">
                          {isRtl ? "استكشف البرامج" : "Explore Programs"}
                        </span>
                        <FaArrowRight className={`w-3.5 h-3.5 text-gold-400 transform transition-transform duration-300 ${isRtl ? 'rotate-180 group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-12 lg:py-16 bg-obsidian-900 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=compress&cs=tinysrgb&w=1600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/60 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display italic text-4xl md:text-5xl lg:text-6xl text-ivory-50 mb-6 drop-shadow-lg">
              {t("home.ctaTitle", "Your Next Adventure Awaits")}
            </h2>
            <p className="text-body-lg text-ivory-300 mb-10 max-w-xl mx-auto drop-shadow-md">
              {t(
                "home.ctaDesc",
                "Let us craft a journey tailored entirely to you",
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/contact">
                <Button
                  variant="gold-glow"
                  className="px-8 py-4 text-lg w-full sm:w-auto"
                >
                  {t("home.ctaStart", "Start Planning")}
                </Button>
              </Link>
              <Button
                variant="glass"
                className="px-8 py-4 text-lg w-full sm:w-auto"
                onClick={() => setIsAllToursPopupOpen(true)}
              >
                {t("home.ctaBrowse", "Browse Tours")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian-900/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-ivory-50 hover:text-gold-500 z-50 text-2xl"
            >
              <FaTimes />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
               className="w-full max-w-4xl aspect-video max-h-[75vh] rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${activeVideo}&autoplay=true&controls=true&muted=false`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-obsidian-900/95 flex items-center justify-center backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-ivory-50 hover:text-gold-500 transition-colors z-[101]"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
            >
              <FaTimes size={32} />
            </button>

            <button
              className={`absolute ${isRtl ? 'right-4 md:right-10' : 'left-4 md:left-10'} text-ivory-50 hover:text-gold-500 transition-colors z-[101] p-4`}
              onClick={isRtl ? nextImage : prevImage}
            >
              <FaChevronLeft size={40} />
            </button>

            <motion.img
              key={activeGalleryIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoomScale }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={galleryImages[activeGalleryIndex].src}
              alt={galleryImages[activeGalleryIndex].dest}
              className="max-w-[90vw] max-h-[90vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-md cursor-zoom-in"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.stopPropagation();
                const delta = e.deltaY > 0 ? -0.25 : 0.25;
                setZoomScale((s) => Math.max(1, Math.min(4, s + delta)));
              }}
            />

            {/* Zoom Controls */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[101] flex gap-3 bg-obsidian-900/70 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale((s) => Math.max(1, s - 0.5)); }}
                className="text-ivory-50 hover:text-gold-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-lg font-bold"
              >
                -
              </button>
              <span className="text-ivory-50 text-sm flex items-center">{Math.round(zoomScale * 100)}%</span>
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale((s) => Math.min(4, s + 0.5)); }}
                className="text-ivory-50 hover:text-gold-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-lg font-bold"
              >
                +
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale(1); }}
                className="text-gold-500 hover:text-gold-400 transition-colors text-xs font-semibold px-2"
              >
                RESET
              </button>
            </div>

            <button
              className={`absolute ${isRtl ? 'left-4 md:left-10' : 'right-4 md:right-10'} text-ivory-50 hover:text-gold-500 transition-colors z-[101] p-4`}
              onClick={isRtl ? prevImage : nextImage}
            >
              <FaChevronRight size={40} />
            </button>

            <div className="absolute bottom-10 left-0 right-0 text-center text-ivory-50">
              <p className="font-display text-2xl mb-1">
                {t(
                  `data.${galleryImages[activeGalleryIndex].dest}`,
                  galleryImages[activeGalleryIndex].dest,
                )}
              </p>
              <p className="text-gold-500 tracking-widest text-xs uppercase">
                {t(
                  `data.${galleryImages[activeGalleryIndex].tag}`,
                  galleryImages[activeGalleryIndex].tag,
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Tours Popup Modal */}
      <AnimatePresence>
        {isAllToursPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
            onClick={() => setIsAllToursPopupOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[16px] max-w-[1000px] w-[95%] md:w-[90%] max-h-[85vh] overflow-y-auto p-5 md:p-10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-2xl font-bold cursor-pointer text-gray-500 hover:text-black select-none z-[10000]"
                onClick={() => setIsAllToursPopupOpen(false)}
              >
                &times;
              </button>

              {/* Popup Title */}
              <h2 className="text-center font-display text-3xl font-semibold text-obsidian-900 mb-6">
                {t("home.allToursTitle", "All Tours")}
              </h2>

              {/* Tours Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {allToursForMarquee.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col h-full text-left"
                  >
                    {/* Tour image on top */}
                    <div className="h-[180px] w-full overflow-hidden">
                      <img
                        src={tour.images[0]}
                        alt={t(`data.${tour.title}`, tour.title)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Tour name below image */}
                    <h3 className="font-semibold text-base text-obsidian-900 p-3 pb-1 line-clamp-2">
                      {t(`data.${tour.title}`, tour.title)}
                    </h3>

                    {/* Short description if available */}
                    {tour.description && (
                      <p className="text-[13px] text-gray-600 px-3 pb-3 flex-grow line-clamp-3">
                        {t(`data.${tour.description}`, tour.description)}
                      </p>
                    )}

                    {/* View Details button at the bottom */}
                    <div className="p-3 pt-0 mt-auto">
                      <Link to={tour.link}>
                        <Button
                          variant="outline-gold"
                          className="w-full py-2 text-sm text-center"
                        >
                          {t("tourCard.viewDetails", "View Details")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Our Brands Logos - White Background */}
      <section className="w-full bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-center text-obsidian-900 text-xl sm:text-2xl font-bold mb-10">{t('ourBrands.title', 'Our Brands')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 lg:gap-16 items-center justify-items-center">
            {[
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_400,h_240,c_limit,q_auto,f_auto/v1783033035/dunas-travel-logo-removebg-preview_mjfl90.png", alt: "Logo 1" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_400,h_240,c_limit,q_auto,f_auto/v1783033441/logo20_f5rfsz.png", alt: "Logo 2" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_400,h_240,c_limit,q_auto,f_auto/v1783033442/logo3_sk0tns.png", alt: "Logo 3" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_400,h_240,c_limit,q_auto,f_auto/v1783033442/logo4_tso9ey.png", alt: "Logo 4" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_400,h_240,c_limit,q_auto,f_auto/v1783033440/logo5_qpuki9.png", alt: "Logo 5" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_400,h_240,c_limit,q_auto,f_auto/v1783074195/drilldown-removebg-preview_z9np4k.png", alt: "Logo 6" },
            ].map((logo, idx) => (
              <div key={idx} className="flex items-center justify-center w-full h-28 select-none">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={400}
                  height={240}
                  loading="lazy"
                  className="max-h-20 md:max-h-24 max-w-[180px] md:max-w-[220px] w-auto h-auto object-contain hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;