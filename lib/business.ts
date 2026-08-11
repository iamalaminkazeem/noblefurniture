// Single source of truth for business contact details.
// Change a number/address here once — it updates everywhere on the site.
export const BUSINESS = {
  name: "Noble Furniture Gallery",
  phoneDisplay: "0805 045 2694",
  phoneTel: "+2348050452694",
  whatsappNumber: "2348050452694", // no + or leading 0, as wa.me expects
  email: "noblefurnitures.gallery@gmail.com",
  address: "14 Gaskiya Road, Apapa, Lagos",
  hours: "Mon – Sat, 9:00 AM – 6:00 PM",
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${BUSINESS.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
