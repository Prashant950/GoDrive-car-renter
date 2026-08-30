import {
  FiMapPin,
  FiBriefcase,
  FiHeart,
  FiNavigation,
  FiSend,
  FiCompass,
} from "react-icons/fi";

// The six services shown on Home & Services pages
export const SERVICES = [
  {
    icon: FiMapPin,
    title: "Cars on Rent for Outstation",
    desc: "Comfortable, well-maintained cars for long inter-city trips with transparent per-km and per-day pricing.",
  },
  {
    icon: FiBriefcase,
    title: "Rental Cars for Corporate",
    desc: "Reliable vehicle solutions for company travel, client pick-ups and employee transport with monthly billing.",
  },
  {
    icon: FiHeart,
    title: "Rental Car for Wedding Ceremony",
    desc: "Decorated premium cars and luxury SUVs to make your big day arrive in style, on time, every time.",
  },
  {
    icon: FiNavigation,
    title: "City Transfer",
    desc: "Quick, safe point-to-point rides within the city — perfect for meetings, shopping and events.",
  },
  {
    icon: FiSend,
    title: "Airport Transfer",
    desc: "On-time airport pick-up and drop with flight tracking, so you never miss a flight or wait for a ride.",
  },
  {
    icon: FiCompass,
    title: "Whole City Tour",
    desc: "Explore every corner of the city with a knowledgeable driver and a full-day, all-inclusive package.",
  },
];

export const CATEGORIES = ["All", "SUV", "MUV", "Sedan", "Hatchback", "Luxury"];
export const FUEL_TYPES = ["All", "Petrol", "Diesel", "CNG+Petrol", "Electric", "Hybrid"];
export const TRANSMISSIONS = ["All", "Manual", "Automatic"];

export const SERVICE_TYPES = [
  "Outstation",
  "Corporate",
  "Wedding Ceremony",
  "City Transfer",
  "Airport Transfer",
  "Whole City Tour",
  "Self Drive",
];

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export const REGISTRATION_FEE = 2;
