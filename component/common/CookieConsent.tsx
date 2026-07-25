"use client";

import { useState, useEffect } from "react";
import { activityTracker } from "@/lib/activityTracker";
import { X } from "lucide-react";

export default function CookieConsent() {
	const [showBanner, setShowBanner] = useState(false);

	useEffect(() => {
		// Check if user has already made a choice
		const consent = activityTracker.getCookieConsent();
		if (consent === null) {
			// Show banner after a short delay
			const timer = setTimeout(() => {
				setShowBanner(true);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleAccept = () => {
		activityTracker.acceptCookies();
		setShowBanner(false);
	};

	const handleReject = () => {
		activityTracker.rejectCookies();
		setShowBanner(false);
	};

	if (!showBanner) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 animate-slide-up">
			<div className="container mx-auto px-4 py-4 md:py-6">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">🍪 We use cookies</h3>
						<p className="text-sm text-gray-600">
							We use cookies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. By
							clicking "Accept", you consent to our use of cookies.{" "}
							<a href="/privacy-policy" className="text-green-600 hover:underline">
								Learn more
							</a>
						</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={handleReject}
							className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						>
							Reject
						</button>
						<button
							onClick={handleAccept}
							className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
						>
							Accept All
						</button>
					</div>

					<button onClick={handleReject} className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-600">
						<X size={20} />
					</button>
				</div>
			</div>
		</div>
	);
}
