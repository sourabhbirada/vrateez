import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

// Cookie names
const VISITOR_ID_COOKIE = "vrateez_visitor_id";
const SESSION_ID_COOKIE = "vrateez_session_id";
const COOKIE_CONSENT_COOKIE = "vrateez_cookie_consent";

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export type ActivityType =
	| "page_view"
	| "product_view"
	| "add_to_cart"
	| "remove_from_cart"
	| "search"
	| "order_placed"
	| "cookie_accepted"
	| "cookie_rejected";

export interface TrackActivityData {
	activityType: ActivityType;
	pagePath?: string;
	pageTitle?: string;
	productId?: string;
	productSlug?: string;
	searchQuery?: string;
	orderId?: string;
	metadata?: Record<string, unknown>;
	duration?: number;
}

class ActivityTracker {
	private visitorId: string | null = null;
	private sessionId: string | null = null;
	private cookieConsent: boolean = false;
	private pageStartTime: number = Date.now();

	constructor() {
		if (typeof window !== "undefined") {
			this.initializeTracker();
		}
	}

	private initializeTracker() {
		// Check cookie consent
		const consent = Cookies.get(COOKIE_CONSENT_COOKIE);
		this.cookieConsent = consent === "true";

		if (this.cookieConsent) {
			// Get or create visitor ID
			this.visitorId = Cookies.get(VISITOR_ID_COOKIE) || null;
			if (!this.visitorId) {
				this.visitorId = uuidv4();
				Cookies.set(VISITOR_ID_COOKIE, this.visitorId, { expires: 365 }); // 1 year
			}

			// Get or create session ID
			this.sessionId = Cookies.get(SESSION_ID_COOKIE) || null;
			if (!this.sessionId || this.isSessionExpired()) {
				this.createNewSession();
			}
		}
	}

	private isSessionExpired(): boolean {
		const sessionTimestamp = localStorage.getItem("vrateez_session_timestamp");
		if (!sessionTimestamp) return true;

		const elapsed = Date.now() - parseInt(sessionTimestamp, 10);
		return elapsed > SESSION_TIMEOUT;
	}

	private createNewSession() {
		this.sessionId = uuidv4();
		Cookies.set(SESSION_ID_COOKIE, this.sessionId, { expires: 1 }); // 1 day
		localStorage.setItem("vrateez_session_timestamp", Date.now().toString());
	}

	public acceptCookies() {
		Cookies.set(COOKIE_CONSENT_COOKIE, "true", { expires: 365 });
		this.cookieConsent = true;
		this.initializeTracker();
		this.track({ activityType: "cookie_accepted" });
	}

	public rejectCookies() {
		Cookies.set(COOKIE_CONSENT_COOKIE, "false", { expires: 365 });
		this.cookieConsent = false;
		this.track({ activityType: "cookie_rejected" });
	}

	public getCookieConsent(): boolean | null {
		const consent = Cookies.get(COOKIE_CONSENT_COOKIE);
		if (consent === "true") return true;
		if (consent === "false") return false;
		return null;
	}

	private updateSessionTimestamp() {
		if (this.cookieConsent) {
			localStorage.setItem("vrateez_session_timestamp", Date.now().toString());
		}
	}

	public async track(data: TrackActivityData): Promise<void> {
		try {
			// For cookie consent events, always track
			const shouldTrack = this.cookieConsent || data.activityType === "cookie_accepted" || data.activityType === "cookie_rejected";

			if (!shouldTrack) {
				console.log("Tracking skipped: No cookie consent");
				return;
			}

			// For consent events, create temporary IDs
			let visitorId = this.visitorId;
			let sessionId = this.sessionId;

			if (!visitorId || !sessionId) {
				visitorId = `temp_${uuidv4()}`;
				sessionId = `temp_${uuidv4()}`;
			}

			this.updateSessionTimestamp();

			const payload = {
				visitorId,
				sessionId,
				activityType: data.activityType,
				pagePath: data.pagePath || window.location.pathname,
				pageTitle: data.pageTitle || document.title,
				productId: data.productId,
				productSlug: data.productSlug,
				searchQuery: data.searchQuery,
				orderId: data.orderId,
				cookieConsent: this.cookieConsent,
				metadata: data.metadata,
				duration: data.duration,
			};

			// Send to backend using relative URL (goes through Next.js rewrite)
			await fetch('/api/activity/track', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
		} catch (error) {
			console.error("Failed to track activity:", error);
		}
	}

	public trackPageView(pagePath?: string, pageTitle?: string) {
		this.pageStartTime = Date.now();
		this.track({
			activityType: "page_view",
			pagePath: pagePath || window.location.pathname,
			pageTitle: pageTitle || document.title,
		});
	}

	public trackPageExit() {
		const duration = Math.floor((Date.now() - this.pageStartTime) / 1000);
		if (duration > 0) {
			this.track({
				activityType: "page_view",
				duration,
			});
		}
	}

	public trackProductView(productId: string, productSlug: string) {
		this.track({
			activityType: "product_view",
			productId,
			productSlug,
		});
	}

	public trackAddToCart(productId: string, metadata?: Record<string, unknown>) {
		this.track({
			activityType: "add_to_cart",
			productId,
			metadata,
		});
	}

	public trackRemoveFromCart(productId: string, metadata?: Record<string, unknown>) {
		this.track({
			activityType: "remove_from_cart",
			productId,
			metadata,
		});
	}

	public trackSearch(searchQuery: string) {
		this.track({
			activityType: "search",
			searchQuery,
		});
	}

	public trackOrderPlaced(orderId: string, metadata?: Record<string, unknown>) {
		this.track({
			activityType: "order_placed",
			orderId,
			metadata,
		});
	}
}

// Export singleton instance
export const activityTracker = new ActivityTracker();
