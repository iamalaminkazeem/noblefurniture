// Static marketing content that doesn't live in the database.
// Actual sellable Product/BlogPost records come from Prisma.
export const NAV = ["Home", "About", "Products", "Custom Furniture", "Services", "Projects", "Gallery", "Blog", "Contact"] as const;

export const IMG = {
  hero: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1800&auto=format&fit=crop",
  heroAlt: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1800&auto=format&fit=crop",
  sofa: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=900&auto=format&fit=crop",
  bed: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop",
  dining: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=900&auto=format&fit=crop",
  workshop: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
  project1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  project2: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
  project3: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
  founder1: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
  founder2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
  office: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900&auto=format&fit=crop",
  wardrobe: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=900&auto=format&fit=crop",
  console: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900&auto=format&fit=crop",
  custom: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1600&auto=format&fit=crop",
  blog: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1200&auto=format&fit=crop",
};

export const CATEGORIES = ["All", "Luxury Sofas", "Beds", "Dining Sets", "Office Furniture", "Wardrobes", "TV Consoles"];

export const SERVICES = [
  { title: "Furniture Manufacturing", desc: "In-house craftsmen building every piece to spec, from frame to finish." },
  { title: "Custom Furniture", desc: "Bespoke designs built around your space, your materials, your vision." },
  { title: "Furniture Installation", desc: "Careful, professional installation for homes and commercial sites." },
  { title: "Delivery Nationwide", desc: "Protected transport and on-site assembly across Nigeria." },
  { title: "Interior Consultation", desc: "Space planning and furniture selection guided by our design team." },
  { title: "Commercial Solutions", desc: "Full furnishing packages for hotels, offices, schools and restaurants." },
];

export const PROJECTS = [
  { name: "Château Residence, Ikoyi", type: "Private Villa · Full Furnishing", img: IMG.project1 },
  { name: "Palm Grove Hotel, Lekki", type: "48-Room Hotel · Custom Furniture", img: IMG.project2 },
  { name: "Whitfield Offices, VI", type: "Corporate HQ · Office Furniture", img: IMG.project3 },
];

export const TESTIMONIALS = [
  { name: "Adaeze O.", role: "Homeowner, Lekki", text: "Every joint, every seam — it shows in the hand-feel. Our living room finally looks like the house we imagined." },
  { name: "Emeka N.", role: "GM, Palm Grove Hotel", text: "They furnished 48 rooms on schedule without one piece arriving damaged. That kind of reliability is rare here." },
  { name: "Funmi A.", role: "Interior Designer", text: "I bring Noble Furniture Gallery into every client brief now. Custom orders come back exactly as drawn." },
];

export const FAQS = [
  { q: "Do you build custom furniture from a photo or sketch?", a: "Yes — send us a reference image, sketch, or Pinterest board and our design team will produce a buildable spec and quote within 2–3 working days." },
  { q: "How long does a custom order take?", a: "Most custom pieces are ready in 3–6 weeks depending on complexity and material availability. Ready-made pieces ship within 3–7 days." },
  { q: "Do you deliver and install outside Lagos?", a: "Yes, we deliver nationwide across Nigeria, and can arrange installation teams for major cities and international shipping on request." },
  { q: "What materials do you work with?", a: "Solid hardwoods (iroko, mahogany, oak, teak), engineered wood, genuine and faux leather, premium fabrics, marble, and powder-coated steel." },
  { q: "Do you offer payment plans for large commercial orders?", a: "Yes, for hotel, office and school orders above a set value we can discuss a milestone-based payment schedule — ask your account contact." },
  { q: "Can I visit the workshop, not just the showroom?", a: "Workshop tours can be arranged for commercial clients and interior designers by appointment." },
];
