'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/916375010189?text=Hi%20Vrateez!%20I%27d%20like%20to%20know%20more%20about%20your%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 group"
            aria-label="Chat on WhatsApp"
        >
            <div className="relative">
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
                {/* Button */}
                <div className="relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-200">
                    <MessageCircle size={26} className="text-white" fill="white" />
                </div>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us
            </div>
        </a>
    );
}
