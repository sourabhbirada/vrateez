"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { activityTracker } from "@/lib/activityTracker";

export default function ActivityTracker() {
	const pathname = usePathname();

	useEffect(() => {
		// Track page view on route change
		activityTracker.trackPageView(pathname);

		// Track page exit on unmount
		return () => {
			activityTracker.trackPageExit();
		};
	}, [pathname]);

	// Track visibility changes
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				activityTracker.trackPageExit();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	return null; // This component doesn't render anything
}
