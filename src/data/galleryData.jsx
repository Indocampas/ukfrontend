// src/data/galleryData.jsx
// Shared gallery data used by the public Gallery / GalleryGrid pages
// AND the Admin Gallery Management page. Keeping a single source of
// truth here means edits made by the admin are reflected everywhere.
import {
  FiGrid,
  FiImage,
  FiMapPin,
  FiUsers,
  FiAward,
  FiCalendar,
  FiHome,
  FiBookOpen,
  FiActivity,
} from "react-icons/fi";

// Academy logo/image - replace with your actual academy image URL
const ACADEMY_IMAGE =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=800&fit=crop";

export const CATEGORIES = [
  "Academy",
  "Campus",
  "Classrooms",
  "Faculty",
  "Student Activities",
  "Results",
  "Events",
  "Infrastructure",
  "Campus Life",
];

export const DEFAULT_GALLERY_DATA = [
  // Academy Main Image
  {
    id: 0,
    title: "UK Academy",
    category: "Academy",
    image: ACADEMY_IMAGE,
    description: "Welcome to UK Academy - Excellence in Education",
    isMain: true,
  },
  // Campus
  {
    id: 1,
    title: "Main Campus Building",
    category: "Campus",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
    description: "Our state-of-the-art main campus building",
  },
  {
    id: 2,
    title: "Campus Garden",
    category: "Campus",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop",
    description: "Serene green spaces for student relaxation",
  },
  {
    id: 3,
    title: "Campus Entrance",
    category: "Campus",
    image:
      "https://images.unsplash.com/photo-1576485290814-1c72aa2d3b9a?w=800&h=600&fit=crop",
    description: "Welcoming entrance to UK Academy",
  },
  // Classrooms
  {
    id: 4,
    title: "Smart Classroom",
    category: "Classrooms",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
    description: "Modern smart classrooms with digital boards",
  },
  {
    id: 5,
    title: "Physics Lab",
    category: "Classrooms",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    description: "Advanced physics laboratory",
  },
  {
    id: 6,
    title: "Chemistry Lab",
    category: "Classrooms",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop",
    description: "Well-equipped chemistry laboratory",
  },
  // Faculty
  {
    id: 7,
    title: "Faculty Meeting",
    category: "Faculty",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
    description: "Dedicated faculty team discussion",
  },
  {
    id: 8,
    title: "Teaching Session",
    category: "Faculty",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    description: "Interactive teaching session in progress",
  },
  // Student Activities
  {
    id: 9,
    title: "Sports Day",
    category: "Student Activities",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    description: "Annual sports day celebration",
  },
  {
    id: 10,
    title: "Cultural Fest",
    category: "Student Activities",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    description: "Vibrant cultural festival performances",
  },
  {
    id: 11,
    title: "Study Group",
    category: "Student Activities",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
    description: "Collaborative student study sessions",
  },
  // Results
  {
    id: 12,
    title: "Achievement Celebration",
    category: "Results",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&h=600&fit=crop",
    description: "Celebrating student achievements",
  },
  {
    id: 13,
    title: "Award Ceremony",
    category: "Results",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    description: "Annual award ceremony",
  },
  // Events
  {
    id: 14,
    title: "Seminar Hall",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    description: "Guest lecture seminar",
  },
  {
    id: 15,
    title: "Workshop Session",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop",
    description: "Interactive workshop sessions",
  },
  // Infrastructure
  {
    id: 16,
    title: "Library",
    category: "Infrastructure",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop",
    description: "Well-stocked library with digital resources",
  },
  {
    id: 17,
    title: "Auditorium",
    category: "Infrastructure",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop",
    description: "Modern auditorium for events",
  },
  // Campus Life
  {
    id: 18,
    title: "Campus Life",
    category: "Campus Life",
    image:
      "https://images.unsplash.com/photo-1523050854058-5df90110c7f1?w=800&h=600&fit=crop",
    description: "Vibrant campus life experience",
  },
  {
    id: 19,
    title: "Student Lounge",
    category: "Campus Life",
    image:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=600&fit=crop",
    description: "Student lounge and recreation area",
  },
];

export const CATEGORY_ICONS = {
  All: <FiGrid />,
  Academy: <FiHome />,
  Campus: <FiHome />,
  Classrooms: <FiBookOpen />,
  Faculty: <FiUsers />,
  "Student Activities": <FiActivity />,
  Results: <FiAward />,
  Events: <FiCalendar />,
  Infrastructure: <FiMapPin />,
  "Campus Life": <FiImage />,
};

export const CATEGORY_COLORS = {
  Academy: "#e8b430",
  Campus: "#4CAF50",
  Classrooms: "#2196F3",
  Faculty: "#9C27B0",
  "Student Activities": "#FF5722",
  Results: "#e8b430",
  Events: "#FF9800",
  Infrastructure: "#00BCD4",
  "Campus Life": "#E91E63",
};
