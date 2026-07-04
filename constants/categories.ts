export const BOOK_CATEGORIES = [
  "Textbooks & Course Materials",
  "Journals & Research Papers",
  "Past Questions & Exam Guides",
  "General Studies (GNS/GST)",
  "Science & Technology",
  "Information & Communication Technology (ICT)",
  "Arts & Humanities",
  "Career & Professional Development",
  "Business & Management",
  "Law & Legal Studies",
  "Medicine & Health Sciences",
  "Agriculture & Veterinary Sciences",
  "Education & Teaching",
  "Social Sciences",
  "Engineering & Applied Sciences",
  "Mathematics & Statistics",
  "Environmental Sciences",
  "Architecture & Urban Planning",
  "Languages & Communication",
  "Religion & Theology",
  "Political Science & Government",
  "Economics & Finance",
  "Computer Science & Programming",
  "Nursing & Allied Health",
  "Pharmacy & Pharmacology",
];

const EXPLORE_COLOR_PALETTE = ["#C4D9F4", "#B8F4D4", "#E5E5E5", "#FFD4D4"];

export const EXPLORE_CATEGORIES = BOOK_CATEGORIES.map((title, index) => ({
  id: index + 1,
  title,
  color: EXPLORE_COLOR_PALETTE[index % EXPLORE_COLOR_PALETTE.length],
}));
