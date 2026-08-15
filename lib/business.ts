// Single source of truth for business contact details.
export const BUSINESS = {
  name: "Noble Furniture Gallery",
  legalName: "Noble Furniture Gallery Limited",
  phoneDisplay: "0805 045 2694",
  phoneTel: "+2348050452694",
  phoneNumbers: ["08050452694", "09020774279", "08125451864"],
  whatsappNumber: "2348050452694",
  email: "noblefurnitures.gallery@gmail.com",
  address: "Gaskiya, Apapa, Lagos, Nigeria",
  hours: "Mon – Sat, 9:00 AM – 6:00 PM",
  // Placeholders — fill these in once you have the real details. Nothing here is invented.
  cacNumber: "RC 9762160",
  bankName: "[Add your bank name]",
  bankAccountName: "Noble Furniture Gallery Limited",
  bankAccountNumber: "[Add your account number]",
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${BUSINESS.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;