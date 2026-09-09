import { useState, useRef, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaTimes, FaChevronLeft, FaChevronRight, FaVolumeMute, FaVolumeUp, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaHeadset, FaWhatsapp, FaArrowRight, FaCalendarAlt, FaSuitcase, FaUsers, FaMapMarkedAlt, FaGlobe, FaClock } from "react-icons/fa";
import Button from "../ui/Button";
import TourCard from "../tour/TourCard";
import { useTours } from "../../hooks/useTours";
import { useMedia } from "../../hooks/useMedia";
import { useDestinations } from "../../hooks/useDestinations";
import { useServices } from "../../hooks/useServices";
import { transportation as fallbackTransportation } from "../../data/transportation";
import AnimatedCounter from "../common/AnimatedCounter";
import { useCurrency } from "../../context/CurrencyContext";
import api from "../../utils/api";
import {
  homeTurkeyPreviewTours,
  homeJordanPreviewTours,
  homeDubaiPreviewTours,
} from "../../data/homePreviewTours";
import { dubaiTours } from "../../data/dubaiTours";
import {
  resolveTourTitle,
  resolveTourDuration,
  resolveTourOverview,
  resolveLocalizedText
} from "../../utils/titleHelper";


const _destinationsData = [
  {
    id: "egypt",
    nameKey: "home.destEgypt",
    descKey: "home.destEgyptDesc",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_600,c_fill/v1783023886/3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg",
  },
  {
    id: "turkey",
    nameKey: "home.destTurkey",
    descKey: "home.destTurkeyDesc",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_600,c_fill/v1783023877/2ec72126-709b-4c8d-8f7b-a592d212cc3b_czpoig.jpg",
  },
  {
    id: "dubai",
    nameKey: "home.destDubai",
    descKey: "home.destDubaiDesc",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_600,c_fill/v1783023865/80f6f47a-4938-4684-aaf1-b1e61d44dab6_n8vdtl.jpg",
  },
  {
    id: "jordan",
    nameKey: "home.destJordan",
    descKey: "home.destJordanDesc",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_600,c_fill/v1783023927/dad14822-455c-419c-8627-32b3daebef90_akfw3l.jpg",
  },
  {
    id: "morocco",
    nameKey: "home.destMorocco",
    descKey: "home.destMoroccoDesc",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_600,c_fill/v1783024003/d34eeca3-6bc8-4a19-aa18-bf13404bb11b_n0f8zn.jpg",
  },
  {
    id: "tunisia",
    nameKey: "home.destTunisia",
    descKey: "home.destTunisiaDesc",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_600,c_fill/v1783024062/071f261a-2ab6-48b5-a370-c47ad7889be3_immde1.jpg",
  },
  {
    id: "greece",
    nameKey: "home.destGreece",
    descKey: "home.destGreeceDesc",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_600,c_fill/v1783024053/66dc2b5e-f90d-424f-b9a7-4164b52f4e5a_eoqd3p.jpg",
  },
  {
    id: "holy-land",
    nameKey: "home.destHolyLand",
    descKey: "home.destHolyLandDesc",
    image: "/images/holy-land.webp",
  },
];

const _packagesData = [
  {
    id: "classic-program",
    nameKey: "egyptPackages.classic.name",
    nameDefault: "Classic Egypt Program",
    descKey: "egyptPackages.classic.desc",
    descDefault: "Timeless wonders of Cairo, Pyramids & Luxury Nile Cruise",
    badgeKey: "egyptPackages.classic.badge",
    badgeDefault: "Top Best Seller",
    durationKey: "egyptPackages.classic.duration",
    durationDefault: "8 Days / 7 Nights",
    tag1Key: "egyptPackages.classic.tag1",
    tag2Key: "egyptPackages.classic.tag2",
    tag3Key: "egyptPackages.classic.tag3",
    price: 1290,
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg",
    link: "/programs/classic/classic-program",
    featured: true,
  },
  {
    id: "honeymooners",
    nameKey: "egyptPackages.honeymooners.name",
    nameDefault: "Honeymoon & Romantic Luxury",
    descKey: "egyptPackages.honeymooners.desc",
    descDefault: "Enchanting Red Sea escapes & private Nile sunset cruises",
    badgeKey: "egyptPackages.honeymooners.badge",
    badgeDefault: "Pure Romance",
    durationKey: "egyptPackages.honeymooners.duration",
    durationDefault: "10 Days / 9 Nights",
    tag1Key: "egyptPackages.honeymooners.tag1",
    tag2Key: "egyptPackages.honeymooners.tag2",
    tag3Key: "egyptPackages.honeymooners.tag3",
    price: 1650,
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=65&fm=webp",
    link: "/programs/honeymooners",
    featured: false,
  },
  {
    id: "religious",
    nameKey: "egyptPackages.religious.name",
    nameDefault: "Holy Family & Sacred Journeys",
    descKey: "egyptPackages.religious.desc",
    descDefault: "Spiritual path along Coptic monasteries & ancient holy shrines",
    badgeKey: "egyptPackages.religious.badge",
    badgeDefault: "Spiritual Heritage",
    durationKey: "egyptPackages.religious.duration",
    durationDefault: "9 Days / 8 Nights",
    tag1Key: "egyptPackages.religious.tag1",
    tag2Key: "egyptPackages.religious.tag2",
    tag3Key: "egyptPackages.religious.tag3",
    price: 1390,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=65&fm=webp",
    link: "/programs/religious",
    featured: false,
  },
  {
    id: "multi-country",
    nameKey: "egyptPackages.multiCountry.name",
    nameDefault: "Egypt Multi-Country Combined",
    descKey: "egyptPackages.multiCountry.desc",
    descDefault: "Beyond borders: Egypt + Jordan, Turkey, Dubai or Jerusalem",
    badgeKey: "egyptPackages.multiCountry.badge",
    badgeDefault: "Grand Odyssey",
    durationKey: "egyptPackages.multiCountry.duration",
    durationDefault: "12-16 Days",
    tag1Key: "egyptPackages.multiCountry.tag1",
    tag2Key: "egyptPackages.multiCountry.tag2",
    tag3Key: "egyptPackages.multiCountry.tag3",
    price: 2450,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=65&fm=webp",
    link: "/programs/multi-country",
    featured: false,
  },
  {
    id: "extension",
    nameKey: "egyptPackages.extension.name",
    nameDefault: "Egypt Extensions & Escapes",
    descKey: "egyptPackages.extension.desc",
    descDefault: "Red Sea resorts in Hurghada, Sharm El Sheikh & Siwa Desert Oasis",
    badgeKey: "egyptPackages.extension.badge",
    badgeDefault: "Add-On Escapes ($0)",
    durationKey: "egyptPackages.extension.duration",
    durationDefault: "4 Days / 3 Nights",
    tag1Key: "egyptPackages.extension.tag1",
    tag2Key: "egyptPackages.extension.tag2",
    tag3Key: "egyptPackages.extension.tag3",
    price: 0,
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/w_600,h_450,c_fill,q_auto:eco,f_webp/v1783067135/grand_tour_of_turkey_lxb1f4.webp",
    link: "/programs/extension",
    featured: false,
  }
];

const _newDestinationsList = [
  {
    id: "egypt",
    nameAr: "مصر",
    nameEn: "Egypt",
    tagAr: "نبض النيل والأهرامات الخالدة",
    tagEn: "PHARAOHS & IMMORTAL TEMPLES",
    descAr: "رحلة عبر خمسة آلاف عام من السحر والغموض، من عظمة الجيزة إلى هدوء أسوان.",
    descEn: "A journey through five millennia of magic, from the majesty of Giza to the serenity of Aswan.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/8_mpyvu4.jpg",
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
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/11_xydddd.jpg",
    link: "/destinations/turkey"
  },
  {
    id: "dubai",
    nameAr: "دبي",
    nameEn: "Dubai",
    tagAr: "واحة المستقبل والرفاهية المطلقة",
    tagEn: "SKY-HIGH LUXURY & SAND DUNES",
    descAr: "ناطحات سحاب تعانق السماء، وتجارب تسوق فاخرة، وصحراء ذهبية لا تنام.",
    descEn: "Futuristic skylines, ultra-luxury retreats, and golden desert dunes that never sleep.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026772/14_z5msnu.jpg",
    link: "/destinations/dubai"
  },
  {
    id: "jordan",
    nameAr: "الأردن",
    nameEn: "Jordan",
    tagAr: "مدينة الأنباط الوردية وصحراء رم",
    tagEn: "PETRA WONDERS & BEDOUIN STARS",
    descAr: "من روعة البتراء المنحوتة في الصخر إلى هدوء وادي رم الساحر وسحر البحر الميت.",
    descEn: "From the pink-hued stone carvings of Petra to the starry silence of Wadi Rum.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/11_xydddd.jpg",
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
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/10_t3dnh6.jpg",
    link: "/destinations/morocco"
  },
  {
    id: "tunisia",
    nameAr: "تونس",
    nameEn: "Tunisia",
    tagAr: "تاريخ قرطاج وجمال سيدي بو سعيد",
    tagEn: "CARTHAGE RUINS & MEDITERRANEAN BREEZE",
    descAr: "نسيم البحر الأبيض المتوسط يداعب جدران الضيعات البيضاء والزرقاء وأطلال قرطاج.",
    descEn: "Mediterranean breezes caressing whitewashed walls and the ancient columns of Carthage.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026772/15_rrczuy.jpg",
    link: "/destinations/tunisia"
  },
  {
    id: "greece",
    nameAr: "اليونان",
    nameEn: "Greece",
    tagAr: "أساطير بحر إيجة وجزر سانتوريني",
    tagEn: "SANTORINI DOMES & GREEK MYTHS",
    descAr: "قباب زرقاء ممتدة مع الأفق، ومياه فيروزية تحكي قصص الفلاسفة والآلهة.",
    descEn: "Blue domes meeting the infinite horizon, and turquoise waters whispering ancient myths.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026772/12_fukk6b.jpg",
    link: "/destinations/greece"
  },
  {
    id: "holyland",
    nameAr: "الأراضي المقدسة",
    nameEn: "Holy Land",
    tagAr: "مهد الأديان وعبق التاريخ",
    tagEn: "FAITH, HISTORY & SACRED PATHWAYS",
    descAr: "معالم روحية وتاريخية خالدة تروي قصص الأنبياء والحضارات المتعاقبة.",
    descEn: "Sacred spires and ancient pathways whispering stories of faith and human history.",
    image: "/images/holy-land.webp",
    link: "/destinations/holyland"
  }
];

const getOptimizedImageUrl = (url, width = 400, height = 450) => {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    return url.replace('/image/upload/', `/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
  }
  return url;
};

const getThumbnailUrl = (url, size = 48) => {
  if (!url || typeof url !== 'string') return url;
  try {
    if (url.includes('images.unsplash.com')) {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', size.toString());
      parsedUrl.searchParams.set('h', size.toString());
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('q', '65');
      parsedUrl.searchParams.set('fm', 'webp');
      return parsedUrl.toString();
    }
    if (url.includes('cloudinary.com')) {
      if (url.includes('/upload/w_') || url.includes('/upload/f_auto')) {
        return url.replace(/\/upload\/[^/]+\//, `/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`);
      }
      return url.replace('/image/upload/', `/image/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`);
    }
  } catch (e) {
    return url;
  }
  return url;
};

const tourImageUrl = (tour) => {
  if (!tour) return '/imgs/egyothero.webp';
  const firstImage = Array.isArray(tour?.images) ? tour.images[0] : null;
  if (typeof firstImage === 'string' && firstImage.trim()) return firstImage;
  if (firstImage && typeof firstImage.imageUrl === 'string' && firstImage.imageUrl.trim()) {
    return firstImage.imageUrl;
  }
  if (typeof tour?.heroImage === 'string' && tour.heroImage.trim()) return tour.heroImage;
  if (typeof tour?.image === 'string' && tour.image.trim()) return tour.image;
  if (typeof tour?.heroImageUrl === 'string' && tour.heroImageUrl.trim()) return tour.heroImageUrl;
  return '/imgs/egyothero.webp';
};

const buildInfiniteMarqueeList = (items, prefix = 'tour', maxVisible = 8) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  let base = items.slice(0, maxVisible);
  while (base.length < 4 && items.length > 0) {
    base = [...base, ...items].slice(0, maxVisible);
  }
  return [
    ...base.map((tItem, i) => ({ ...tItem, isDuplicate: false, uKey: `${prefix}-set1-${tItem.id || tItem.slug || i}-${i}` })),
    ...base.map((tItem, i) => ({ ...tItem, isDuplicate: true, uKey: `${prefix}-set2-${tItem.id || tItem.slug || i}-${i}` })),
  ];
};

const HomeExperienceSection = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const isRtl = i18n.dir() === 'rtl';
  const lang = i18n.language || 'en';
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [isAllToursPopupOpen, setIsAllToursPopupOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const { galleryImages = [], videos = [] } = useMedia({ category: 'general' });
  const {
    tours: allLiveToursRaw,
    loading: toursLoading,
    error: toursError,
  } = useTours({ limit: 100 });
  const allLiveTours = useMemo(() => Array.isArray(allLiveToursRaw) ? allLiveToursRaw : [], [allLiveToursRaw]);
  const { services: rawTransportation = [], loading: transportLoading } = useServices('transportation');
  const transportationList = useMemo(() => {
    const rawList = Array.isArray(rawTransportation) && rawTransportation.length > 0
      ? rawTransportation
      : fallbackTransportation;

    return rawList.map((v, idx) => {
      const seats = Number(v.seats || v.capacity || (v.category === 'bus' ? 45 : v.category === 'coaster' ? 24 : 4));
      const rawCat = String(v.vehicleCategory || v.category || '').toLowerCase();
      let normalizedCat = 'private';
      if (rawCat.includes('bus') || seats > 30) normalizedCat = 'bus';
      else if (rawCat.includes('coaster') || rawCat.includes('mini') || (seats > 8 && seats <= 30)) normalizedCat = 'coaster';
      else normalizedCat = 'private';

      const firstImage = Array.isArray(v.images)
        ? (typeof v.images[0] === 'string' ? v.images[0] : v.images[0]?.imageUrl)
        : null;
      const image = v.heroImage || v.image || v.heroImageUrl || firstImage || (
        normalizedCat === 'bus' ? '/imgs/transportation/bus1.jpeg' :
        normalizedCat === 'coaster' ? '/imgs/transportation/costar.jpeg' :
        '/imgs/transportation/privte.jpeg'
      );

      const price = Number(v.pricePerDay || v.pricePerTrip || v.price || v.basePriceUsd || 0);

      return {
        ...v,
        id: v.id || v._id || `trans-${idx}`,
        name: resolveLocalizedText(v.name || v.title, t, lang) || (
          normalizedCat === 'bus' ? 'Luxury Tour Bus' :
          normalizedCat === 'coaster' ? 'Executive Coaster' :
          'VIP Private Transfer'
        ),
        image,
        heroImage: image,
        category: normalizedCat,
        vehicleCategory: normalizedCat,
        seats,
        pricePerDay: price,
      };
    });
  }, [rawTransportation, lang, t]);
  const {
    destinations: liveDestinationsRaw,
    loading: destinationsLoading,
    error: destinationsError,
  } = useDestinations();
  const liveDestinations = useMemo(() => Array.isArray(liveDestinationsRaw) ? liveDestinationsRaw : [], [liveDestinationsRaw]);
  const DEST_HERO_MAP = {
    egypt: '/imgs/egyothero.webp',
    turkey: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=480&h=320&q=75&fm=webp',
    jordan: '/images/jordan-petra.webp',
    dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=480&h=320&q=75&fm=webp',
    morocco: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=480&h=320&q=75&fm=webp',
    greece: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=480&h=320&q=75&fm=webp',
    tunisia: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=480&h=320&q=75&fm=webp',
    'holy-land': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=480&h=320&q=75&fm=webp',
    holyland: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=480&h=320&q=75&fm=webp',
  };

  const DEST_TOUR_COUNTS = {
    egypt: 9,
    turkey: 15,
    jordan: 7,
    dubai: 9,
    morocco: 1,
    greece: 1,
    tunisia: 1,
    'holy-land': 0,
    holyland: 0,
  };

  const liveDestinationCards = useMemo(() => {
    const cardMap = new Map();

    (liveDestinations || []).forEach((destination) => {
      const slug = destination.slug || destination.id;
      const heroImg = DEST_HERO_MAP[slug] || destination.heroImageUrl || destination.image;
      const dynamicCount = (allLiveTours || []).filter(t => t && (t.destination === slug || (slug.includes('holy') && (t.destination === 'holy-land' || t.destination === 'holyland')))).length;
      const exactCount = DEST_TOUR_COUNTS[slug] !== undefined ? DEST_TOUR_COUNTS[slug] : destination.toursCount;
      const toursCount = exactCount !== undefined ? exactCount : dynamicCount;
      const navKey = (slug === 'holy-land' || slug === 'holyland') ? 'holyland' : slug;

      const name = t(`nav.${navKey}`, destination.title || destination.name);
      const subtitle = t(`dest.${navKey}.subtitle`, destination.subtitle || destination.description || '');

      const key = (slug === 'holyland' || slug === 'holy-land') ? 'holy-land' : slug;

      cardMap.set(key, {
        id: slug === 'holy-land' ? 'holyland' : slug,
        name,
        description: subtitle,
        subtitle,
        image: heroImg,
        toursCount: toursCount,
        link: `/destinations/${slug === 'holy-land' ? 'holyland' : slug}`,
      });
    });

    const DESIRED_ORDER = ['egypt', 'turkey', 'dubai', 'jordan', 'morocco', 'tunisia', 'greece', 'holy-land'];

    const result = [];
    DESIRED_ORDER.forEach((key) => {
      if (cardMap.has(key)) {
        result.push(cardMap.get(key));
      } else {
        const navKey = key === 'holy-land' ? 'holyland' : key;
        result.push({
          id: key === 'holy-land' ? 'holyland' : key,
          name: t(`nav.${navKey}`, key.charAt(0).toUpperCase() + key.slice(1)),
          description: t(`dest.${navKey}.subtitle`, ''),
          subtitle: t(`dest.${navKey}.subtitle`, ''),
          image: DEST_HERO_MAP[key] || '/images/holy-land.webp',
          toursCount: DEST_TOUR_COUNTS[key] !== undefined ? DEST_TOUR_COUNTS[key] : (DEST_TOUR_COUNTS[navKey] !== undefined ? DEST_TOUR_COUNTS[navKey] : 0),
          link: `/destinations/${key === 'holy-land' ? 'holyland' : key}`,
        });
      }
    });

    return result;
  }, [liveDestinations, allLiveTours, t]);
  const livePackageCards = useMemo(() => {
    return _packagesData.map((pkg) => ({
      ...pkg,
      recordId: pkg.id,
      name: t(pkg.nameKey, pkg.nameDefault),
      desc: t(pkg.descKey, pkg.descDefault),
      badge: t(pkg.badgeKey, pkg.badgeDefault),
      duration: t(pkg.durationKey, pkg.durationDefault),
      tag1: pkg.tag1Key ? t(pkg.tag1Key, '') : '',
      tag2: pkg.tag2Key ? t(pkg.tag2Key, '') : '',
      tag3: pkg.tag3Key ? t(pkg.tag3Key, '') : '',
    }));
  }, [t]);

  const allToursForMarquee = useMemo(() => {
    if (!Array.isArray(allLiveTours)) return [];
    return allLiveTours.filter(Boolean).map((tour) => ({
      ...tour,
      description: tour.overview || tour.description || '',
      images: Array.isArray(tour.images) ? tour.images : [],
      link: `/tours/${tour.slug || tour.id}`,
    }));
  }, [allLiveTours]);

  const packagesToursMap = useMemo(() => {
    const matches = (tour, values) => {
      if (!tour) return false;
      const searchable = `${tour.slug || ''} ${tour.category || ''} ${tour.title || ''}`.toLowerCase();
      return values.some((value) => searchable.includes(value));
    };
    const withLinkBase = (items) => (items || []).map((tour) => ({ ...tour, linkBase: '/tours' }));
    const safeTours = Array.isArray(allLiveTours) ? allLiveTours : [];
    return {
      'classic-program': withLinkBase(safeTours.filter((tour) => matches(tour, ['classic', 'classico', 'clásico', 'cairo']))),
      honeymooners: withLinkBase(safeTours.filter((tour) => matches(tour, ['honeymoon', 'luna de miel', 'شهر العسل']))),
      religious: withLinkBase(safeTours.filter((tour) => matches(tour, ['religious', 'holy family', 'العائلة المقدسة']))),
      'multi-country': withLinkBase(safeTours.filter((tour) => matches(tour, ['multi-country', 'combined', 'and-']))),
      extension: withLinkBase(safeTours.filter((tour) => matches(tour, ['extension', 'escape']))),
    };
  }, [allLiveTours]);

  const defaultPackageTours = useMemo(() => [
    // 1. Multi-Country Combined - Top Picks matching reference order
    {
      id: "mct-005",
      slug: "stars-of-the-middle-east-16-days",
      title: isAr ? "نجوم الشرق الأوسط (مصر والأردن ودبي 16 يوماً)" : "Stars of the Middle East 16 Days",
      overview: isAr ? "رحلة استكشافية شاملة تجمع بين النيل، البتراء، وصحراء رم، وناطحات سحاب دبي." : "16-day luxury tour across the Nile valley, Petra rose city, and Dubai skyline.",
      duration: isAr ? "16 يوم / 15 ليلة" : "16 Days / 15 Nights",
      price: 3100,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.94,
      reviewCount: 165,
      images: ["/imgs/Stars of the Middle East .png"],
      link: "/programs/multi-country/stars-of-the-middle-east-16-days"
    },
    {
      id: "mct-004",
      slug: "marvels-of-dubai-and-turkey-14-days",
      title: isAr ? "روائع دبي وتركيا (فخامة الخليج وسحر البسفور)" : "Marvels of Dubai and Turkey (14 Days)",
      overview: isAr ? "توليفة استثنائية بين حداثة دبي الفائقة وتاريخ إسطنبول وجمال الطبيعة التركية." : "14 days exploring futuristic Dubai luxury and historic Turkish Riviera beauty.",
      duration: isAr ? "14 يوم / 13 ليلة" : "14 Days / 13 Nights",
      price: 2750,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.91,
      reviewCount: 198,
      images: ["/imgs/Marvels of Dubai and Turkey.png"],
      link: "/programs/multi-country/marvels-of-dubai-and-turkey-14-days"
    },
    {
      id: "mct-003",
      slug: "essences-of-egypt-and-turkey-15-days",
      title: isAr ? "جوهر مصر وتركيا (النيل وإسطنبول 15 يوماً)" : "Essences of Egypt and Turkey 15 Days",
      overview: isAr ? "برنامج فاخر يربط سحر الأهرامات والرحلة النيلية بأجواء البسفور وكبادوكيا." : "15 days spanning Cairo, Nile Cruise, Istanbul, and Cappadocia balloon skies.",
      duration: isAr ? "15 يوم / 14 ليلة" : "15 Days / 14 Nights",
      price: 2890,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.92,
      reviewCount: 278,
      images: ["/imgs/Essences of Egypt and Turkey .png"],
      link: "/programs/multi-country/essences-of-egypt-and-turkey-15-days"
    },
    {
      id: "mct-006",
      slug: "treasures-of-egypt-and-tunisia-16-days",
      title: isAr ? "كنوز مصر وتونس (الحضارة وسيدي بو سعيد)" : "Treasures of Egypt and Tunisia 16 Days",
      overview: isAr ? "رحلة شمال أفريقية تدمج الأهرامات والنيل مع تاريخ قرطاج وجمال سيدي بو سعيد." : "16 days combining Pharaohs' temples with Carthage ruins and blue whitewashed Sidi Bou Said.",
      duration: isAr ? "16 يوم / 15 ليلة" : "16 Days / 15 Nights",
      price: 2950,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.87,
      reviewCount: 132,
      images: ["/imgs/Treasures of Egypt and Tunisia.png"],
      link: "/programs/multi-country/treasures-of-egypt-and-tunisia-16-days"
    },
    {
      id: "mct-007",
      slug: "egypt-and-dubai-13-days",
      title: isAr ? "رحلة مصر ودبي (الأهرامات والتسوق الفاخر)" : "Egypt and Dubai 13 Days",
      overview: isAr ? "مزيج متناغم بين أسرار الفراعنة وأشهر المعالم الحديثة والتجارب الفاخرة في دبي." : "13 days combining ancient Egyptian heritage with Dubai modern luxury.",
      duration: isAr ? "13 يوم / 12 ليلة" : "13 Days / 12 Nights",
      price: 2650,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.89,
      reviewCount: 175,
      images: ["/imgs/Egypt and Dubai.png"],
      link: "/programs/multi-country/egypt-and-dubai-13-days"
    },

    // 2. Classic Program (1 tour)
    {
      id: "classic-program-tour-1",
      slug: "classic-program",
      title: isAr ? "البرنامج الكلاسيكي: القاهرة والأهرامات والنيل الفاخر" : "Classic Egypt: Cairo, Pyramids & Nile Cruise",
      overview: isAr ? "برنامج متميز يجمع بين الأهرامات، الجيزة، والمتحف الكبير مع رحلة نيلية فاخرة." : "Timeless Classic Egypt itinerary covering Cairo Pyramids, GEM Museum, and Nile Cruise.",
      duration: isAr ? "8 أيام / 7 ليالي" : "8 Days / 7 Nights",
      price: 1290,
      badge: isAr ? "البرنامج الكلاسيكي" : "Classic Program",
      destination: "egypt",
      rating: 4.9,
      reviewCount: 312,
      images: ["https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg"],
      link: "/programs/classic/classic-program"
    },

    // 3. Honeymooners (1 tour)
    {
      id: "honeymooners-tour-1",
      slug: "honeymooners",
      title: isAr ? "باقة شهر العسل والرفاهية الرومانسية" : "Honeymoon & Romantic Luxury Escape",
      overview: isAr ? "عطلة رومانسية ساحرة تشمل شواطئ البحر الأحمر وغروب النيل المذهل." : "Enchanting Red Sea escapes & private Nile sunset cruises for couples.",
      duration: isAr ? "10 أيام / 9 ليالي" : "10 Days / 9 Nights",
      price: 1650,
      badge: isAr ? "شهر العسل" : "Honeymoon",
      destination: "egypt",
      rating: 4.95,
      reviewCount: 189,
      images: ["https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=65&fm=webp"],
      link: "/programs/honeymooners"
    },

    // 4. Religious Programs (1 tour)
    {
      id: "religious-tour-1",
      slug: "religious",
      title: isAr ? "باقة مسار العائلة المقدسة والتراث الديني" : "Holy Family & Sacred Journeys",
      overview: isAr ? "مسار إيماني وثقافي عريق يمتد عبر الكنائس والأديرة الأثرية في مصر." : "Spiritual path along Coptic monasteries & ancient holy shrines.",
      duration: isAr ? "9 أيام / 8 ليالي" : "9 Days / 8 Nights",
      price: 1390,
      badge: isAr ? "رحلة دينية" : "Religious Heritage",
      destination: "egypt",
      rating: 4.85,
      reviewCount: 176,
      images: ["https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=65&fm=webp"],
      link: "/programs/religious"
    },

    // 5. Remaining Multi-Country Tours
    {
      id: "mct-001",
      slug: "estrellas-medio-oriente-19d",
      title: isAr ? "نجوم الشرق الأوسط (مصر والأردن وتركيا ودبي)" : "Estrellas del Medio Oriente (19 Days)",
      overview: isAr ? "رحلة أسطورية تجمع بين عظمة الفراعنة، البتراء الوردية، مناطيد كبادوكيا وبرج خليفة." : "19-day grand odyssey traversing Egypt, Jordan, Turkey, and Dubai.",
      duration: isAr ? "19 يوم / 18 ليلة" : "19 Days / 18 Nights",
      price: 3450,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.9,
      reviewCount: 210,
      images: ["https://theglobetrottingdetective.com/wp-content/uploads/2022/03/best-places-in-the-middle-east-traveling-the-middle-east-cappadocia-turkey.jpg"],
      link: "/programs/multi-country/estrellas-medio-oriente-19d"
    },
    {
      id: "mct-002",
      slug: "cairo-and-athens-11-days",
      title: isAr ? "رحلة القاهرة وأثينا (عجائب مصر واليونان)" : "Cairo and Athens 11 Days",
      overview: isAr ? "رحلة تجمع بين حضارة الفراعنة في القاهرة وأساطير الأكروبوليس في أثينا." : "11 days combining ancient Egyptian wonders and Greek Mediterranean mythology.",
      duration: isAr ? "11 يوم / 10 ليالي" : "11 Days / 10 Nights",
      price: 2250,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.88,
      reviewCount: 145,
      images: ["https://cdn.thecollector.com/wp-content/uploads/2024/07/history-cairo-monuments.jpg"],
      link: "/programs/multi-country/cairo-and-athens-11-days"
    },
    {
      id: "mct-008",
      slug: "spices-of-egypt-and-morocco",
      title: isAr ? "عبق مصر والمغرب (النيل وسحر مراكش)" : "Spices of Egypt and Morocco 12 Days",
      overview: isAr ? "تجربة ثقافية ساحرة بين النيل وأهرامات مصر وأسواق مراكش وقصور فاس." : "12 days exploring Nile valley treasures and imperial medinas of Morocco.",
      duration: isAr ? "12 يوم / 11 ليلة" : "12 Days / 11 Nights",
      price: 2490,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.93,
      reviewCount: 220,
      images: ["https://th.bing.com/th/id/R.58564825c2c22ad5062b00d620ed4397?rik=XgQR%2bu8MUj6NHA&pid=ImgRaw&r=0"],
      link: "/programs/multi-country/spices-of-egypt-and-morocco"
    },
    {
      id: "mct-009",
      slug: "jewels-of-egypt-and-jordan-11-days",
      title: isAr ? "جواهر مصر والأردن (القاهرة، النيل، البتراء والبحر الميت)" : "Jewels of Egypt and Jordan 11 Days",
      overview: isAr ? "برنامج رائع يشمل عجائب الجيزة، الأقصر، أسوان، البتراء، والطفو في البحر الميت." : "11 days featuring Giza Pyramids, Nile Cruise, Petra Wonders, and Dead Sea floating.",
      duration: isAr ? "11 يوم / 10 ليالي" : "11 Days / 10 Nights",
      price: 2350,
      badge: isAr ? "جولات متعددة الدول" : "Multi-Country",
      destination: "multi-country",
      rating: 4.96,
      reviewCount: 285,
      images: ["https://th.bing.com/th/id/R.d4c411bd75b827b087396502b4144fe6?rik=3VllwT9EP1BvFA&pid=ImgRaw&r=0"],
      link: "/programs/multi-country/jewels-of-egypt-and-jordan-11-days"
    },

    // 6. Extensions (3 tours)
    {
      id: "extension-tour-1",
      slug: "hurghada-4d3n",
      title: isAr ? "استجمام الغردقة والبحر الأحمر" : "Hurghada Red Sea Escape",
      overview: isAr ? "إقامة فاخرة على ساحل الغردقة للاستمتاع بالمياه الفيروزية والأنشطة البحرية." : "Red Sea resorts in Hurghada with beach escapes and coral diving.",
      duration: isAr ? "4 أيام / 3 ليالي" : "4 Days / 3 Nights",
      price: 590,
      badge: isAr ? "تمديد وساحل" : "Extension",
      destination: "egypt",
      rating: 4.8,
      reviewCount: 168,
      images: ["https://1.bp.blogspot.com/-HqmKDzZ73hY/XgSOtrhSAOI/AAAAAAAARdc/cxtywSwZxLIaZPfw98FzQHYtiPblmzg2gCLcBGAsYHQ/w1200-h630-p-k-no-nu/%D8%A3%D9%81%D8%B6%D9%84-%D8%A3%D9%86%D8%B4%D8%B7%D8%A9-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A%D8%A9-%D9%81%D9%89-%D8%A7%D9%84%D8%BA%D8%B1%D8%AF%D9%82%D8%A9-825x510.jpg"],
      link: "/programs/extension/hurghada-4d3n"
    },
    {
      id: "extension-tour-2",
      slug: "sharm-4d3n",
      title: isAr ? "شرم الشيخ ومنتجعات البحر الأحمر" : "Sharm El Sheikh Paradise",
      overview: isAr ? "استجمام شاطئي ممتع في شرم الشيخ مع زيارة محمية رأس محمد الساحرة." : "Red Sea luxury resort getaway in Sharm El Sheikh.",
      duration: isAr ? "4 أيام / 3 ليالي" : "4 Days / 3 Nights",
      price: 620,
      badge: isAr ? "تمديد وساحل" : "Extension",
      destination: "egypt",
      rating: 4.84,
      reviewCount: 135,
      images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=65&fm=webp"],
      link: "/programs/extension/sharm-4d3n"
    },
    {
      id: "extension-tour-3",
      slug: "siwa-oasis-alexandria",
      title: isAr ? "سحر واحة سيوة والإسكندرية" : "Siwa Oasis & Alexandria Adventure",
      overview: isAr ? "مغامرة صحراوية بيئية فريدة في سيوة مع جولة تاريخية ساحلية بالإسكندرية." : "Siwa Desert Oasis eco-adventure & Mediterranean Alexandria escape.",
      duration: isAr ? "5 أيام / 4 ليالي" : "5 Days / 4 Nights",
      price: 780,
      badge: isAr ? "سياحة بيئية" : "Eco Tour",
      destination: "egypt",
      rating: 4.88,
      reviewCount: 110,
      images: ["https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=65&fm=webp"],
      link: "/programs/extension/siwa-oasis-alexandria"
    }
  ], [isAr]);

  const packagesToursForMarquee = useMemo(() => {
    return (defaultPackageTours || []).slice(0, 8);
  }, [defaultPackageTours]);

  const destinationToursForMarquee = useMemo(() => {
    const egyptTours = (allLiveTours || [])
      .filter((tourItem) => tourItem && (tourItem.destination === 'egypt' || String(tourItem.country || '').toLowerCase() === 'egypt'))
      .slice(0, 3)
      .map((tourItem) => ({
        ...tourItem,
        id: tourItem.id || tourItem.slug,
        title: resolveTourTitle(tourItem, t, lang),
        duration: resolveTourDuration(tourItem, t, lang),
        destination: 'egypt',
        images: Array.isArray(tourItem.images) && tourItem.images.length > 0 ? tourItem.images : [tourItem.heroImage || tourItem.image || '/imgs/egyothero.webp'],
        link: `/tours/${tourItem.slug || tourItem.id}`,
      }));

    const turkeyFormatted = (homeTurkeyPreviewTours || []).map((tourItem) => ({
      id: tourItem.id,
      slug: tourItem.slug || tourItem.id,
      title: resolveLocalizedText(tourItem.name || tourItem.title, t, lang),
      duration: resolveLocalizedText(tourItem.duration, t, lang),
      overview: resolveLocalizedText(tourItem.overview, t, lang),
      destination: 'turkey',
      price: tourItem.price || 0,
      rating: 4.9,
      reviewCount: 45,
      images: Array.isArray(tourItem.images) && tourItem.images.length > 0 ? tourItem.images : ['https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=500&q=75&fm=webp'],
      link: `/programs/turkey/${tourItem.slug || tourItem.id}`,
    }));

    const jordanFormatted = (homeJordanPreviewTours || []).map((tourItem) => ({
      id: tourItem.id,
      slug: tourItem.slug || tourItem.id,
      title: resolveLocalizedText(tourItem.name || tourItem.title, t, lang),
      duration: resolveLocalizedText(tourItem.duration, t, lang),
      overview: resolveLocalizedText(tourItem.overview, t, lang),
      destination: 'jordan',
      price: tourItem.price || 0,
      rating: 4.95,
      reviewCount: 38,
      images: Array.isArray(tourItem.images) && tourItem.images.length > 0 ? tourItem.images : ['/images/jordan-petra.webp'],
      link: `/programs/jordan/${tourItem.slug || tourItem.id}`,
    }));

    const dubaiFormatted = (homeDubaiPreviewTours || []).map((tourItem) => ({
      id: tourItem.id,
      slug: tourItem.slug || tourItem.id,
      title: resolveLocalizedText(tourItem.name || tourItem.title, t, lang),
      duration: resolveLocalizedText(tourItem.duration, t, lang),
      overview: resolveLocalizedText(tourItem.overview, t, lang),
      destination: 'dubai',
      price: tourItem.price || 0,
      rating: 4.88,
      reviewCount: 52,
      images: Array.isArray(tourItem.images) && tourItem.images.length > 0 ? tourItem.images : ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=75&fm=webp'],
      link: `/programs/dubai/${tourItem.slug || tourItem.id}`,
    }));

    const otherDestTours = (allLiveTours || [])
      .filter((tourItem) => tourItem && ['morocco', 'greece', 'tunisia'].includes(tourItem.destination))
      .map((tourItem) => ({
        ...tourItem,
        id: tourItem.id || tourItem.slug,
        title: resolveTourTitle(tourItem, t, lang),
        duration: resolveTourDuration(tourItem, t, lang),
        destination: tourItem.destination,
        images: Array.isArray(tourItem.images) && tourItem.images.length > 0 ? tourItem.images : [tourItem.heroImage || tourItem.image || '/imgs/egyothero.webp'],
        link: `/tours/${tourItem.slug || tourItem.id}`,
      }));

    const combined = [
      ...jordanFormatted.slice(0, 1),
      ...dubaiFormatted.slice(0, 1),
      ...egyptTours.slice(0, 2),
      ...turkeyFormatted.slice(0, 2),
      ...jordanFormatted.slice(1),
      ...dubaiFormatted.slice(1),
      ...otherDestTours,
      ...egyptTours.slice(2),
      ...turkeyFormatted.slice(2),
    ].filter(Boolean);

    return combined.length > 0 ? combined : allToursForMarquee;
  }, [allLiveTours, allToursForMarquee, homeTurkeyPreviewTours, homeJordanPreviewTours, homeDubaiPreviewTours, lang, t]);


  // Hero Video State
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Defer hero video loading after first paint so initial bundle and LCP paint are not blocked
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(() => setShouldLoadVideo(true), { timeout: 1200 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setShouldLoadVideo(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

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

  const destinations = liveDestinationCards.map((destination) => ({
    id: destination.id,
    label: destination.name,
    img: destination.image,
  }));

  const slugify = (str) => String(str || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const DEST_ALIASES = useMemo(() => ({
    'united arab emirates': 'dubai',
    'uae': 'dubai',
    'emirates': 'dubai',
    'holy land': 'holyland',
    'holy-land': 'holyland',
  }), []);

  const normalizeDest = (d) => {
    const clean = String(d || '').toLowerCase().trim();
    return DEST_ALIASES[clean] || clean;
  };

  const getToursForDest = (destId) => {
    const result = [];
    const seenKeys = new Set();

    const addTourItem = (tour, defaultBaseUrl = '/tours', defaultDest = '') => {
      if (!tour) return;
      const idStr = tour.id || tour.slug || '';
      const rawTitle = tour.title || tour.name || '';
      const titleStr = resolveLocalizedText(rawTitle, t, lang) || (typeof rawTitle === 'string' ? rawTitle : '') || idStr;
      if (!idStr && !titleStr) return;

      const enTitle = typeof rawTitle === 'object' ? (rawTitle.en || rawTitle.ar || '') : String(rawTitle || '');
      const slugStr = tour.slug || slugify(`${idStr}-${enTitle || titleStr}`);
      const destName = normalizeDest(tour.destination || tour.country || defaultDest);
      const uniqueKey = `${destName}-${idStr || slugStr}`;
      if (seenKeys.has(uniqueKey)) return;
      seenKeys.add(uniqueKey);

      let baseUrl = defaultBaseUrl;
      if (destName === 'dubai') baseUrl = '/programs/dubai';
      else if (destName === 'turkey') baseUrl = '/programs/turkey';
      else if (destName === 'jordan') baseUrl = '/programs/jordan';

      result.push({
        id: `tour-${slugStr}`,
        label: titleStr,
        url: `${baseUrl}/${slugStr}`,
      });
    };

    const targetDest = normalizeDest(destId);

    if (targetDest === "dubai") {
      (dubaiTours || []).forEach((tour) => addTourItem(tour, "/programs/dubai", "dubai"));
      return result;
    }

    if (targetDest === "all") {
      (allLiveTours || []).forEach((tour) => addTourItem(tour, "/tours"));
      (dubaiTours || []).forEach((tour) => addTourItem(tour, "/programs/dubai", "dubai"));
      (homeTurkeyPreviewTours || []).forEach((tour) => addTourItem(tour, "/programs/turkey", "turkey"));
      (homeJordanPreviewTours || []).forEach((tour) => addTourItem(tour, "/programs/jordan", "jordan"));
      return result;
    }

    // 1. Live tours matching target destination alias
    const filteredLive = (allLiveTours || []).filter((tour) => {
      const tourDest = normalizeDest(tour.destination || tour.country);
      return tourDest === targetDest || tourDest.includes(targetDest) || targetDest.includes(tourDest);
    });
    filteredLive.forEach((tour) => addTourItem(tour, "/tours", targetDest));

    // 2. Local fallback datasets per destination
    if (targetDest === "turkey") {
      (homeTurkeyPreviewTours || []).forEach((tour) => addTourItem(tour, "/programs/turkey", "turkey"));
    } else if (targetDest === "jordan") {
      (homeJordanPreviewTours || []).forEach((tour) => addTourItem(tour, "/programs/jordan", "jordan"));
    }

    return result;
  };

  const destTours = searchDest ? getToursForDest(searchDest) : [];

  const handleSearch = () => {
    if (searchTour) {
      const found = destTours.find((tour) => tour.id === searchTour);
      if (found) { navigate(found.url); return; }
    }
    if (searchDest && searchDest !== "all") {
      navigate(`/destinations/${searchDest}`);
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

  const handleResSubmit = async (e) => {
    e.preventDefault();
    if (resForm.date && resForm.date < todayStr) {
      return;
    }
    setResSuccess(true);
    setTimeout(() => setResSuccess(false), 5000);

    try {
      const selectedVehicle = transportationList.find((v) => v.id === resForm.vehicle);
      const vehicleName = selectedVehicle?.name || resForm.vehicle || 'Standard Vehicle';
      await api.post('/inquiries', {
        fullName: resForm.name.trim(),
        email: resForm.email.trim(),
        phone: resForm.phone.trim(),
        preferredLanguage: i18n.language || 'en',
        destinations: ['Egypt', 'Transportation Transfer'],
        startDate: resForm.date,
        adults: parseInt(resForm.adults, 10) || 1,
        children: parseInt(resForm.children, 10) || 0,
        notes: `[VIP Chauffeur & Transfer Reservation]\nVehicle: ${vehicleName} (ID: ${resForm.vehicle})\nPickup Date: ${resForm.date} at ${resForm.time}\nPickup Location: ${resForm.pickup}\nDropoff Location: ${resForm.dropoff}`,
      });
    } catch (err) {
      console.warn('Backend transfer inquiry submission warning:', err);
    }

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

  const filteredVehicles = useMemo(() => {
    const list = (fallbackTransportation && fallbackTransportation.length > 0) ? fallbackTransportation : (transportationList || []);
    if (vehicleFilter === "all") return list;
    return list.filter((v) => {
      const cat = (v.category || v.vehicleCategory || "").toLowerCase();
      if (vehicleFilter === "bus") return cat === "bus" || v.seats > 30;
      if (vehicleFilter === "coaster") return cat === "coaster" || (v.seats > 8 && v.seats <= 30);
      if (vehicleFilter === "private") return cat === "private" || v.seats <= 8;
      return cat === vehicleFilter.toLowerCase();
    });
  }, [vehicleFilter, transportationList]);

  const generalGalleryImages = useMemo(() => {
    return (galleryImages || []).slice(0, 8);
  }, [galleryImages]);

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
      prev === generalGalleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setZoomScale(1);
    setActiveGalleryIndex((prev) =>
      prev === 0 ? generalGalleryImages.length - 1 : prev - 1,
    );
  };



  const handleDestinationClick = (id) => {
    navigate(`/destinations/${id}`);
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
            preload="none"
            poster="/imgs/hero-poster.webp"
            className="w-full h-full object-contain"
            width="1440"
            height="812"
          >
            {shouldLoadVideo && (
              <source src="/imgs/hero.webm" type="video/webm" />
            )}
          </video>
          <div className="absolute inset-0 bg-obsidian-900/50 pointer-events-none"></div>
        </div>
        {/* Sound Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? t('home.unmuteVideo', 'Unmute Hero Video') : t('home.muteVideo', 'Mute Hero Video')}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 backdrop-blur-md border border-gold-500/40 flex items-center justify-center text-gold-400 hover:text-gold-200 hover:border-gold-400 hover:bg-slate-900 hover:scale-108 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          aria-label={isMuted ? t('home.unmuteVideo', 'Unmute Hero Video') : t('home.muteVideo', 'Mute Hero Video')}
        >
          {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} className="text-gold-300" />}
        </button>
      </section>
      {/* Search Section */}
      <section className="relative w-full py-20 md:py-28 overflow-hidden mt-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/degbrq3ck/image/upload/w_640,h_400,c_fill,q_auto:eco,f_webp/v1783067135/grand_tour_of_turkey_lxb1f4.webp"
            srcSet="
              https://res.cloudinary.com/degbrq3ck/image/upload/w_640,h_400,c_fill,q_auto:eco,f_webp/v1783067135/grand_tour_of_turkey_lxb1f4.webp 640w,
              https://res.cloudinary.com/degbrq3ck/image/upload/w_1024,h_500,c_fill,q_auto:eco,f_webp/v1783067135/grand_tour_of_turkey_lxb1f4.webp 1024w,
              https://res.cloudinary.com/degbrq3ck/image/upload/w_1440,h_600,c_fill,q_auto:eco,f_webp/v1783067135/grand_tour_of_turkey_lxb1f4.webp 1440w
            "
            sizes="100vw"
            alt="Search tours and holiday packages background"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
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
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setSearchTour(selectedVal);
                      if (selectedVal) {
                        const found = destTours.find((tour) => tour.id === selectedVal);
                        if (found?.url) {
                          navigate(found.url);
                        }
                      }
                    }}
                    disabled={!searchDest || searchDest === "all"}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white text-[13px] sm:text-body-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&>option]:text-obsidian-900 [&>option]:dark:text-ivory-100 [&>option]:dark:bg-obsidian-800"
                  >
                    <option value="" className="text-obsidian-900 dark:text-ivory-100 dark:bg-obsidian-800">
                      {searchDest === "all" ? t('home.selectDestFirst', 'Select a destination first') : t('home.searchAllTours', 'All Tours')}
                    </option>
                    {searchDest && searchDest !== "all" && destTours.map((item) => (
                      <option key={item.id} value={item.id} className="text-obsidian-900 dark:text-ivory-100 dark:bg-obsidian-800">{item.label}</option>
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
                    <img src={getThumbnailUrl(d.img, 48)} alt="" className="w-full h-full object-cover" width="24" height="24" loading="lazy" decoding="async" />
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
      <section className="py-12 bg-ivory-50">
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
                decoding="async"
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
              { count: 17, suffix: '+', icon: FaCalendarAlt, labelKey: 'about.heroStatsYears' },
              { count: 95654, suffix: '+', icon: FaSuitcase, labelKey: 'about.heroStatsTravelers' },
              { count: 438, suffix: '+', icon: FaUsers, labelKey: 'about.heroStatsEmployees' },
              { count: 182, suffix: '+', icon: FaMapMarkedAlt, labelKey: 'about.heroStatsGuides' },
              { count: 5, suffix: '', icon: FaGlobe, labelKey: 'about.heroStatsOffices' },
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
                <div className="text-4xl md:text-5xl font-bold text-white font-display">
                  <AnimatedCounter value={s.count} suffix={s.suffix} />
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
            {(destinationsLoading || toursLoading) && (
              <div className="md:col-span-3 rounded-2xl border border-white/10 bg-obsidian-950/30 px-6 py-10 text-center text-ivory-200">
                {t('common.loading', 'Loading destinations and tours...')}
              </div>
            )}
            {(destinationsError || toursError) && liveDestinationCards.length === 0 && !destinationsLoading && !toursLoading && (
              <div className="md:col-span-3 rounded-2xl border border-red-300/30 bg-red-950/20 px-6 py-10 text-center text-red-100">
                {t('common.loadError', 'Unable to load live catalog data. Please try again later.')}
              </div>
            )}
            {!destinationsLoading && !toursLoading && liveDestinationCards.length === 0 && !destinationsError && !toursError && (
              <div className="md:col-span-3 rounded-2xl border border-white/10 bg-obsidian-950/30 px-6 py-10 text-center text-ivory-200">
                {t('destination.empty', 'No destinations are currently available.')}
              </div>
            )}
            {!destinationsLoading && !toursLoading && liveDestinationCards.length > 0 && liveDestinationCards.map((dest) => {
              const tourCount = dest.toursCount;

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
                  aria-label={`${t("destination.viewGuide", "View destination guide")} ${dest.name}`}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 0 32px rgba(245,166,35,0.22)",
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className="relative h-[320px] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gold-500 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(245,166,35,0.2)]"
                >
                  <img
                    src={dest.image}
                    srcSet={dest.image && dest.image.includes('images.unsplash.com') ? `
                      ${dest.image.replace(/w=\d+&h=\d+/, 'w=480&h=320')} 480w
                    ` : undefined}
                    sizes="(max-width: 768px) 480px, 480px"
                    alt={dest.name}
                    width="480"
                    height="320"
                    className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.08] transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-obsidian-900/60 to-obsidian-900/40 group-hover:from-obsidian-950/75 transition-colors duration-500"
                  ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <h3 className="text-display-lg text-white font-bold mb-2 drop-shadow-md">
                      {dest.name}
                    </h3>
                    <p className="text-body-lg text-white font-medium mb-4 leading-relaxed line-clamp-2 max-w-xs drop-shadow">{dest.description}</p>
                    
                    {/* Tour Count Badge */}
                    <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-wider bg-black/65 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/40 shadow-lg group-hover:border-gold-400 group-hover:bg-gold-500/20 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V8.5M12 12a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                      <span className="text-white font-bold">{tourCount} {t("home.toursAvailable", "رحلات متوفرة")}</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Destination Tours Marquee Section */}
      <section className="py-12 bg-ivory-100 dark:bg-obsidian-950 overflow-hidden relative content-auto">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-gold-600 dark:text-gold-400 uppercase tracking-widest text-caption block mb-3 font-semibold">
              {t("home.destToursBadge", "Meticulously crafted experiences across all our destinations")}
            </span>
            <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("home.destToursTitle", "جولات الوجهات المميزة")}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-6 rounded-full"></div>
          </div>
        </div>

        <div dir="ltr" className="overflow-hidden w-full relative">
          <div
            className="flex w-max"
            style={{
              gap: "24px",
              paddingLeft: "24px",
              animation: "tourMarquee 45s linear infinite",
            }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
          >
            {(() => {
              const sliced = (destinationToursForMarquee || []).slice(0, 8);
              return [
                ...sliced.map(tData => ({ ...tData, isDuplicate: false })),
                ...sliced.map(tData => ({ ...tData, isDuplicate: true }))
              ].map((tData, idx) => {
                const resolvedTitle = resolveTourTitle(tData, t, lang);
                const resolvedDuration = resolveTourDuration(tData, t, lang);
                const rawDest = tData.destination === 'holy-land' ? 'holyland' : (tData.destination || 'egypt');
                const resolvedDest = t(`nav.${rawDest}`, rawDest.charAt(0).toUpperCase() + rawDest.slice(1));
                const imageUrl = tourImageUrl(tData);

                return (
                  <Link
                    key={`dest-tour-${tData.id || idx}-${idx}`}
                    to={tData.link || `/tours/${tData.slug || tData.id}`}
                    tabIndex={tData.isDuplicate ? -1 : undefined}
                    aria-hidden={tData.isDuplicate ? "true" : undefined}
                    className="min-w-[320px] md:min-w-[400px] shrink-0 group relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 h-[450px] block focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <img
                      src={getOptimizedImageUrl(imageUrl, 400, 450)}
                      alt={resolvedTitle}
                      width="400"
                      height="450"
                      className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.06]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/20 to-transparent"></div>

                    <div className="absolute top-4 left-4 bg-gold-500/90 backdrop-blur-sm text-obsidian-900 text-caption font-bold px-3.5 py-1.5 rounded-full shadow-md uppercase">
                      {resolvedDest}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-display-md text-white font-bold mb-2 leading-tight">
                          {resolvedTitle}
                        </h3>

                        <div className="flex items-center justify-between text-caption text-ivory-300 mb-4">
                          <span>{resolvedDuration}</span>
                          {Number.isFinite(Number(tData.price)) && Number(tData.price) > 0 && (
                            <span className="text-gold-500 font-semibold">
                              {formatPrice(tData.price)}
                            </span>
                          )}
                        </div>

                        {Number.isFinite(Number(tData.rating)) && Number.isFinite(Number(tData.reviewCount)) ? (
                          <div className="flex items-center gap-1 text-gold-500 mb-4">
                            <FaStar size={14} />
                            <span className="text-ivory-50 ml-1 text-sm font-semibold">
                              {Number(tData.rating).toFixed(1)} <span className="text-ivory-300 font-normal">({tData.reviewCount})</span>
                            </span>
                          </div>
                        ) : null}

                        <div className="block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <Button variant="outline-gold" tabIndex={-1} className="w-full py-2">
                            {t("home.viewTour", "View Tour")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              });
            })()}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Link to="/tours">
            <Button
              variant="gold-glow"
              className="px-8 py-3 font-bold"
            >
              {t("home.exploreAllTours", isAr ? "استكشف جميع الرحلات" : "Explore All Tours")} →
            </Button>
          </Link>
        </div>
      </section>

      {/* Packages Section — 5 Egypt Packages Ultra Luxury Bento Grid */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #050a18 0%, #0a132e 50%, #070d20 100%)" }}>
        {/* Decorative ambient glowing circles */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-500/20 border border-gold-400/50 text-gold-300 text-sm font-bold uppercase tracking-wider mb-4 shadow-lg backdrop-blur-md"
            >
              <span className="text-amber-400">✨</span> {t("home.ourPackages", "Discover Egypt Packages")}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl text-white font-serif tracking-tight mb-4 font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("home.packagesTitle", "Curated Programs & Experiences")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm"
            >
              {t("home.packagesSubtitle", "Selection of premium itineraries designed to experience the magic of Egypt & the Middle East")}
            </motion.p>
            <div className="w-28 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-6 rounded-full shadow-[0_0_12px_rgba(245,166,35,0.6)]"></div>
          </div>

          {/* 5-Card Bento Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {livePackageCards.map((pkg, idx) => {
              const isHero = pkg.featured || idx === 0;

              return (
                <motion.div
                  key={pkg.recordId || pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between border transition-all duration-500 backdrop-blur-xl ${
                    isHero 
                      ? "lg:col-span-2 min-h-[380px] sm:min-h-[420px] bg-gradient-to-br from-[#121c3b]/90 via-[#0d152d]/90 to-[#070c1b]/90 border-gold-500/40 hover:border-gold-400 shadow-[0_12px_40px_rgba(245,166,35,0.2)] hover:shadow-[0_16px_50px_rgba(245,166,35,0.35)]" 
                      : "min-h-[360px] bg-gradient-to-br from-[#121c3b]/80 via-[#0a1127]/80 to-[#060a17]/80 border-white/10 hover:border-gold-500/50 hover:shadow-[0_12px_36px_rgba(245,166,35,0.25)] hover:-translate-y-2"
                  }`}
                  onClick={() => handlePackageClick(pkg.id)}
                >
                  {/* Background Image with High Clarity & Gradient Overlay */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a17]/95 via-[#060a17]/40 to-transparent"></div>
                  </div>

                  {/* Top Floating Badges */}
                  <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-4">
                    {pkg.badge && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-caption uppercase tracking-wider shadow-lg backdrop-blur-md">
                        <span>★</span> {pkg.badge}
                      </span>
                    )}
                    {pkg.duration && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 text-white font-medium text-caption border border-white/30 backdrop-blur-md shadow-md">
                        <FaClock className="text-gold-400 text-xs" /> {pkg.duration}
                      </span>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="relative z-10 p-6 sm:p-8 mt-auto flex flex-col justify-end">
                    {/* Tags Pills */}
                    {(pkg.tag1 || pkg.tag2 || pkg.tag3) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[pkg.tag1, pkg.tag2, pkg.tag3].filter(Boolean).map((tText, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="text-[11px] font-semibold text-white bg-black/50 backdrop-blur-md border border-white/30 px-2.5 py-1 rounded-full shadow-sm"
                          >
                            {tText}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 
                      className={`${isHero ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"} text-white font-serif font-bold mb-2 group-hover:text-gold-300 transition-colors duration-300`}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {pkg.name}
                    </h3>

                    <p className="text-body-sm text-white/90 line-clamp-2 mb-6 max-w-xl">
                      {pkg.desc}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end pt-4 border-t border-white/20 group-hover:border-gold-500/40 transition-colors">
                      <Link 
                        to={pkg.link} 
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs border border-gold-400"
                      >
                        {t("home.explorePackage", "Explore Program")}
                        <span className="rtl-flip">→</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Nested Tours Accordion */}
          <AnimatePresence>
            {activePackage && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden mt-12 bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-gold-500/20 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gold-500/20">
                  <h3 className="text-2xl md:text-3xl text-white font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {livePackageCards.find(p => p.id === activePackage)?.name} — {t("nav.tours", "Tours")}
                  </h3>
                  <button 
                    onClick={() => setActivePackage(null)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 hover:text-obsidian-900 text-white flex items-center justify-center transition-all"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePackageTours.slice(0, 6).map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      linkBase={tour.linkBase || "/tours"}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-10">
                  <Link to={livePackageCards.find(p => p.id === activePackage)?.link || "/tours"}>
                    <Button variant="gold-glow" className="px-8 py-3 font-bold">
                      {t("home.explorePackage", "Explore Full Program")} →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Packages Tours Marquee */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-ivory-100 dark:bg-obsidian-950 content-auto">
        <div className="container mx-auto px-6 mb-12">
          <div className="text-center max-w-4xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-caption font-bold uppercase tracking-widest mb-4 shadow-sm"
            >
              <span>✨</span> {t("home.packageTripsSub", "تجارب مصممة بعناية فائقة لتلبي أعلى تطلعات عشاق الفخامة والتميز")}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl text-obsidian-900 dark:text-white font-serif tracking-tight mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("home.packageTripsTitle", "رحلات الباقات الخاصة بنا")}
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4 rounded-full"></div>
          </div>
        </div>

        {/* Marquee Strip: Moving smoothly without stopping unless hovered */}
        <div dir="ltr" className="overflow-hidden w-full relative py-4">
          <div
            className="flex w-max"
            style={{
              gap: "24px",
              paddingLeft: "24px",
              animation: "tourMarquee 120s linear infinite",
            }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
          >
            {(() => {
              const infiniteList = buildInfiniteMarqueeList(packagesToursForMarquee, 'pkg');
              return infiniteList.map((tData, idx) => {
                const tourImg = (Array.isArray(tData.images) && tData.images[0]) || tData.heroImage || tData.image || '/imgs/egyothero.webp';
                return (
                  <Link
                    key={tData.uKey || `pkg-tour-${idx}`}
                    to={tData.link || "/tours"}
                    tabIndex={tData.isDuplicate ? -1 : undefined}
                    aria-hidden={tData.isDuplicate ? "true" : undefined}
                    className="min-w-[300px] sm:min-w-[340px] md:min-w-[380px] shrink-0 group relative rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(245,166,35,0.3)] transition-all duration-500 h-[450px] block border border-obsidian-700/50 hover:border-gold-500 bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <img
                      src={getOptimizedImageUrl(tourImg, 400, 450)}
                      alt={tData.title}
                      width="400"
                      height="450"
                      className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.08] opacity-90 group-hover:opacity-100"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/50 to-transparent"></div>

                    {tData.badge && (
                      <div className="absolute top-4 left-4 z-20 bg-gold-500 text-obsidian-950 text-caption font-bold px-3.5 py-1.5 rounded-full shadow-md uppercase backdrop-blur-md">
                        ★ {tData.badge}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full z-10">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-xl md:text-2xl text-white font-serif font-bold mb-2 leading-tight drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {tData.title}
                        </h3>

                        {tData.overview && (
                          <p className="text-body-sm text-ivory-200 line-clamp-2 mb-3 font-medium drop-shadow">
                            {tData.overview}
                          </p>
                        )}

                        <div className="flex items-center text-caption text-gold-400 font-semibold mb-4 pt-2 border-t border-white/15">
                          <span>{tData.duration}</span>
                        </div>

                        <div className="block">
                          <Button variant="gold-glow" tabIndex={-1} className="w-full py-2.5 text-xs font-bold shadow-lg">
                            {t("home.viewTour", isAr ? "عرض التفاصيل وحجز الرحلة" : "View Tour & Book")} →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              });
            })()}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Link to="/tours">
            <Button variant="outline-gold" className="px-8 py-3 text-body-sm font-bold">
              {t("home.exploreAllTours", isAr ? "استكشف جميع البرامج والرحلات" : "Explore All Programs & Tours")} →
            </Button>
          </Link>
        </div>
      </section>

      {/* Transportation & Transfers */}
      <section className="py-12 bg-ivory-50 relative overflow-hidden content-auto">
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

          {/* Vehicles Strip: Infinite Marquee */}
          <div dir="ltr" className="w-full relative overflow-hidden mb-12 py-4">
            <div
              className="flex w-max"
              style={{
                gap: "16px",
                paddingLeft: "16px",
                animation: "tourMarquee 75s linear infinite",
              }}
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
            >
              {(() => {
                const repeatedList = buildInfiniteMarqueeList(filteredVehicles, 'veh', 8);
                return repeatedList.map((vehicle, idx) => (
                  <div
                    key={`veh-${vehicle.id}-${idx}`}
                    className="flex-shrink-0 flex flex-col rounded-[16px] overflow-hidden group relative w-[280px] h-[360px] md:h-[380px] transition-all duration-[350ms] ease-out hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(245,166,35,0.35)] hover:z-10 border border-obsidian-700/50 hover:border-gold-500 bg-obsidian-900"
                  >
                    <img
                      src={vehicle.heroImage || vehicle.image}
                      alt={vehicle.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
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
                        className="w-full py-2 text-sm font-semibold text-white transition-colors border border-gold-500 rounded-lg flex items-center justify-center bg-obsidian-900/40 backdrop-blur-sm cursor-pointer outline-none hover:bg-gold-500 hover:text-obsidian-950"
                      >
                        {t("transportation.reserveNow", "Reserve Now")}
                      </button>
                    </div>
                  </div>
                ));
              })()}
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
                      {transportationList.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.capacity || v.seats || 4}{" "}
                          {t("transportation.seatsCount", "Seats")}) - {formatPrice(v.pricePerDay || v.pricePerTrip || v.basePriceUsd || 0)}/{t("transportation.day", "day")}
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
      <section className="py-10 bg-[#1E3A8A] overflow-hidden content-auto">
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

        <div dir="ltr" className="w-full mt-10 relative overflow-hidden py-4">
          <div
            className="flex w-max"
            style={{
              animation: "tourMarquee 180s linear infinite",
              gap: "16px",
              paddingLeft: "16px",
            }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
          >
            {(() => {
              const infiniteImages = buildInfiniteMarqueeList(generalGalleryImages, 'gal');
              return infiniteImages.map((img, idx) => {
                const originalIndex = generalGalleryImages.indexOf(img);
                return (
                  <div
                    key={img.uKey || `gal-${idx}`}
                    className="flex-shrink-0 cursor-pointer overflow-hidden rounded-[16px] group relative transition-all duration-500 ease-out hover:scale-[1.06] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(245,166,35,0.35)] hover:z-10 focus:outline-none focus:ring-2 focus:ring-gold-500 border border-obsidian-700/40 hover:border-gold-500"
                    onClick={img.isDuplicate ? undefined : () => openLightbox(originalIndex)}
                    onKeyDown={img.isDuplicate ? undefined : (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(originalIndex);
                      }
                    }}
                    tabIndex={img.isDuplicate ? -1 : 0}
                    role={img.isDuplicate ? undefined : "button"}
                    aria-label={img.isDuplicate ? undefined : `${t("home.viewLarger", "View larger image of")} ${img.label || 'image'}`}
                    aria-hidden={img.isDuplicate ? "true" : undefined}
                  >
                    <img
                      src={getOptimizedImageUrl(img.url, 400, 380)}
                      alt={img.label || 'Luxury moment'}
                      loading="lazy"
                      decoding="async"
                      width="280"
                      height="380"
                      className="h-[220px] md:h-[380px] w-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                );
              });
            })()}
          </div>
        </div>
        <div className="flex justify-center mt-12 mb-6">
          <button
            onClick={() => navigate('/media-gallery?tab=photos')}
            className="animated-media-btn btn-images-glow px-10 py-4 text-white text-base font-bold rounded-full uppercase tracking-wider transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            }}
          >
            {t("home.viewAllImages", "View All Images")}
          </button>
        </div>
      </section>

      {/* Render this only when the provider returns persisted video assets. */}
      {videos.length > 0 && <section className="py-16 content-auto" style={{ background: 'linear-gradient(180deg, rgb(10,25,105) 0%, rgb(6,29,93) 50%, rgb(10,21,53) 100%)' }}>
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
                animation: `${isRtl ? 'marqueeVideoRTL' : 'marqueeVideo'} 90s linear infinite`,
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
                      loading="lazy"
                      decoding="async"
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
          <div className="flex justify-center mt-12 mb-4">
            <button
              onClick={() => navigate('/media-gallery?tab=videos')}
              className="animated-media-btn btn-videos-glow px-10 py-4 text-white text-base font-bold rounded-full uppercase tracking-wider transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
              }}
            >
              {t("home.viewAllVideos", "View All Videos")}
            </button>
          </div>
        </div>
      </section>}

      {/* Services Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden content-auto" style={{ background: 'linear-gradient(160deg, rgb(4,20,70) 0%, rgb(6,29,93) 50%, rgb(8,16,50) 100%)' }}>
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
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative flex-1 md:hover:grow-[1.4] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-lg border border-gold-200/20 flex flex-col justify-end"
            >
              <Link to="/services" className="absolute inset-0 z-20" aria-label={t('nav.hotelsTab', 'Hotels')} />
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
            </motion.div>

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
      <section className="py-20 lg:py-32 relative overflow-hidden bg-obsidian-900 content-auto">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

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
      <section className="py-28 lg:py-36 bg-[#FEFCF7] relative overflow-hidden content-auto" dir={isRtl ? "rtl" : "ltr"}>
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
              <h2 className="text-display-lg text-black dark:text-ivory-100 font-display tracking-wide leading-tight mt-2">
                {isRtl ? "الوجهات" : t('nav.destinations', 'Destinations')}
              </h2>
              <p className="text-black dark:text-ivory-100 text-body-md max-w-xl mx-auto font-body font-medium leading-relaxed">
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
            {liveDestinationCards.map((item, idx) => (
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
                  
                  {/* Clear & Vivid Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-obsidian-950/30 to-transparent transition-all duration-500" />
                  
                  {/* Golden Lighting Leak */}
                  <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Card Content */}
                  <div className={`relative z-10 p-8 flex flex-col justify-end h-full ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="space-y-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                      {/* Subheading / Tagline */}
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] block transform group-hover:scale-105 origin-left transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-gold-400">
                        {item.subtitle}
                      </span>
                      
                      {/* Destination Name */}
                      <h3 className="text-2xl md:text-3xl font-bold font-display tracking-wide transition-colors duration-300 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] text-ivory-50 group-hover:text-gold-400">
                        {item.name}
                      </h3>
                      
                      {/* Divider line that expands from 0 to 100% on hover */}
                      <div className="w-0 group-hover:w-full h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent transition-all duration-[800ms] ease-out mt-2" />

                      {/* Description text */}
                      <p className="text-ivory-300 text-xs md:text-sm leading-relaxed font-body font-medium opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-[600ms] delay-75 ease-out max-w-[280px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {item.description}
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
        className="relative py-20 lg:py-28 bg-obsidian-900 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/u7xf91gp/image/upload/v1787814393/dunas-travel/catalog/30220e12459b5d974a167d56024e5403d2f5e9c8ec82006eaa849e42e640b042.webp')",
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
              src={generalGalleryImages[activeGalleryIndex]?.url}
              alt={generalGalleryImages[activeGalleryIndex]?.label}
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
                  generalGalleryImages[activeGalleryIndex]?.label,
                  generalGalleryImages[activeGalleryIndex]?.label,
                )}
              </p>
              <p className="text-gold-500 tracking-widest text-xs uppercase">
                {t(
                  'mediaGallery.subheading',
                  'Visual Journey',
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
                      {tour.images[0] ? (
                        <img
                          src={tour.images[0]}
                          alt={t(`data.${tour.title}`, tour.title)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-obsidian-800 px-4 text-center text-sm text-ivory-300">
                          {t('tour.imageUnavailable', 'No image has been added for this tour.')}
                        </div>
                      )}
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
      <section className="w-full bg-white py-12 sm:py-16 content-auto">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-center text-obsidian-900 text-xl sm:text-2xl font-bold mb-10">{t('ourBrands.title', 'Our Brands')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 lg:gap-16 items-center justify-items-center">
            {[
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_webp/v1783033035/dunas-travel-logo-removebg-preview_mjfl90.webp", alt: "Logo 1" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783033441/logo20_f5rfsz.png", alt: "Logo 2" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783033442/logo3_sk0tns.png", alt: "Logo 3" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783033442/logo4_tso9ey.png", alt: "Logo 4" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783033440/logo5_qpuki9.png", alt: "Logo 5" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783074195/drilldown-removebg-preview_z9np4k.png", alt: "Logo 6" },
            ].map((logo, idx) => (
              <div key={idx} className="flex items-center justify-center w-full h-28 select-none">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={200}
                  height={120}
                  loading="lazy"
                  decoding="async"
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

export default HomeExperienceSection;
