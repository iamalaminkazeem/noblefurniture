import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/business";

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-30">
      <a href={whatsappLink("Hi, I'd like to know more about your furniture.")} target="_blank" rel="noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform" aria-label="Chat on WhatsApp">
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
