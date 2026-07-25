'use client';

import { Package, MapPin, Clock, CheckCircle, XCircle, Truck, AlertCircle } from 'lucide-react';

interface TrackingCheckpoint {
    checkpoint_date: string;
    checkpoint_delivery_status: string;
    checkpoint_delivery_substatus?: string;
    tracking_detail: string;
    location?: string;
    city?: string;
    state?: string;
    country_iso2?: string;
}

interface TrackingInfo {
    courier_code?: string;
    courier_phone?: string;
    weblink?: string;
    trackinfo: TrackingCheckpoint[];
}

interface TrackingData {
    id: string;
    tracking_number: string;
    courier_code: string;
    order_number?: string;
    created_at: string;
    update_at: string;
    delivery_status: string;
    destination_country?: string;
    destination_state?: string;
    destination_city?: string;
    origin_country?: string;
    origin_state?: string;
    origin_city?: string;
    customer_name?: string;
    latest_event?: string;
    latest_checkpoint_time?: string;
    transit_time?: number;
    scheduled_delivery_date?: string;
    signed_by?: string;
    substatus?: string;
    destination_info?: TrackingInfo;
    origin_info?: TrackingInfo;
}

interface TrackingDetailsProps {
    trackingData: TrackingData | null;
    orderId?: string;
    error?: string;
}

const statusIcons: Record<string, any> = {
    delivered: CheckCircle,
    transit: Truck,
    pickup: Package,
    undelivered: XCircle,
    exception: AlertCircle,
    expired: XCircle,
    pending: Clock,
    default: Package,
};

// Semantic colors kept distinct (delivered = success, undelivered/exception = alert)
// but shifted onto the brand palette instead of generic Tailwind hues.
const statusColors: Record<string, string> = {
    delivered: 'text-basil bg-basil/8 border-basil/25',
    transit: 'text-clay bg-turmeric/10 border-turmeric/25',
    pickup: 'text-clay bg-turmeric/10 border-turmeric/25',
    undelivered: 'text-clay bg-clay/10 border-clay/30',
    exception: 'text-clay bg-clay/10 border-clay/30',
    expired: 'text-ink/50 bg-ink/5 border-ink/15',
    pending: 'text-ink/50 bg-ink/5 border-ink/15',
    default: 'text-ink/50 bg-ink/5 border-ink/15',
};

function formatDate(dateString: string) {
    try {
        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(dateString));
    } catch {
        return dateString;
    }
}

export default function TrackingDetails({ trackingData, orderId, error }: TrackingDetailsProps) {
    if (error) {
        return (
            <div className="bg-clay/10 border border-clay/25 rounded-xl p-4 text-sm text-clay">
                <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Unable to fetch live tracking</p>
                        <p className="mt-1 opacity-90">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!trackingData) {
        return (
            <div className="bg-ink/5 border border-ink/10 rounded-xl p-6 text-center text-ink/50">
                <Package size={32} className="mx-auto mb-2 text-ink/25" />
                <p>No tracking information available</p>
            </div>
        );
    }

    const StatusIcon = statusIcons[trackingData.delivery_status] || statusIcons.default;
    const statusColorClass = statusColors[trackingData.delivery_status] || statusColors.default;

    const trackInfo = trackingData.destination_info?.trackinfo || trackingData.origin_info?.trackinfo || [];
    const courierLink = trackingData.destination_info?.weblink || trackingData.origin_info?.weblink;

    return (
        <div className="space-y-6">
            {/* Tracking Header */}
            <div className={`rounded-xl border-2 p-6 ${statusColorClass}`}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <StatusIcon size={28} className="shrink-0 mt-1" />
                        <div>
                            <h3 className="font-display italic text-lg capitalize">
                                {trackingData.delivery_status.replace(/_/g, ' ')}
                            </h3>
                            {trackingData.substatus && (
                                <p className="text-sm opacity-90 mt-1 capitalize">
                                    {trackingData.substatus.replace(/_/g, ' ')}
                                </p>
                            )}
                            {trackingData.latest_event && (
                                <p className="text-sm mt-2 opacity-90">{trackingData.latest_event}</p>
                            )}
                        </div>
                    </div>
                    {trackingData.signed_by && (
                        <div className="text-right">
                            <p className="text-xs opacity-75">Signed by</p>
                            <p className="font-semibold">{trackingData.signed_by}</p>
                        </div>
                    )}
                </div>

                {trackingData.scheduled_delivery_date && (
                    <div className="mt-4 pt-4 border-t border-current/20">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock size={16} />
                            <span>Expected delivery: {formatDate(trackingData.scheduled_delivery_date)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tracking Details */}
            <div className="bg-white/60 rounded-xl border border-ink/10 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-ink/40 mb-1">Tracking Number</p>
                        <p className="font-label font-semibold text-ink">{trackingData.tracking_number}</p>
                    </div>
                    <div>
                        <p className="text-ink/40 mb-1">Courier</p>
                        <p className="font-semibold text-ink uppercase">{trackingData.courier_code}</p>
                    </div>
                    {orderId && (
                        <div>
                            <p className="text-ink/40 mb-1">Order ID</p>
                            <p className="font-semibold text-ink">{orderId}</p>
                        </div>
                    )}
                    {trackingData.transit_time !== undefined && trackingData.transit_time > 0 && (
                        <div>
                            <p className="text-ink/40 mb-1">Transit Time</p>
                            <p className="font-semibold text-ink">{trackingData.transit_time} days</p>
                        </div>
                    )}
                </div>

                {(trackingData.origin_city || trackingData.destination_city) && (
                    <div className="mt-4 pt-4 border-t border-ink/10">
                        <div className="flex items-center justify-between text-sm">
                            {trackingData.origin_city && (
                                <div className="flex items-start gap-2">
                                    <MapPin size={16} className="text-ink/30 mt-0.5" />
                                    <div>
                                        <p className="text-ink/40 text-xs">From</p>
                                        <p className="font-medium text-ink">
                                            {trackingData.origin_city}
                                            {trackingData.origin_state && `, ${trackingData.origin_state}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {trackingData.destination_city && (
                                <div className="flex items-start gap-2 text-right">
                                    <div>
                                        <p className="text-ink/40 text-xs">To</p>
                                        <p className="font-medium text-ink">
                                            {trackingData.destination_city}
                                            {trackingData.destination_state && `, ${trackingData.destination_state}`}
                                        </p>
                                    </div>
                                    <MapPin size={16} className="text-ink/30 mt-0.5" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {courierLink && (
                    <div className="mt-4">
                        <a
                            href={courierLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-turmeric hover:text-clay font-semibold hover:underline"
                        >
                            Track on courier website →
                        </a>
                    </div>
                )}
            </div>

            {/* Timeline */}
            {trackInfo.length > 0 && (
                <div className="bg-white/60 rounded-xl border border-ink/10 p-6">
                    <h4 className="font-display italic text-ink mb-4 flex items-center gap-2 text-lg">
                        <Truck size={18} />
                        Tracking History
                    </h4>
                    <ol className="relative border-l-2 border-ink/15 ml-3 space-y-6">
                        {trackInfo.map((checkpoint, idx) => (
                            <li key={`${checkpoint.checkpoint_date}-${idx}`} className="ml-6">
                                <div className="absolute -left-[9px] w-4 h-4 bg-parchment border-2 border-turmeric rounded-full" />
                                <div>
                                    <p className="font-semibold text-ink text-sm">
                                        {checkpoint.tracking_detail}
                                    </p>
                                    {checkpoint.checkpoint_delivery_substatus && (
                                        <p className="text-xs text-ink/50 mt-0.5 capitalize">
                                            {checkpoint.checkpoint_delivery_substatus.replace(/_/g, ' ')}
                                        </p>
                                    )}
                                    {checkpoint.location && (
                                        <p className="text-xs text-ink/40 mt-1 flex items-center gap-1">
                                            <MapPin size={12} />
                                            {checkpoint.location}
                                            {checkpoint.city && `, ${checkpoint.city}`}
                                            {checkpoint.state && `, ${checkpoint.state}`}
                                        </p>
                                    )}
                                    <p className="text-xs text-ink/30 mt-2">
                                        {formatDate(checkpoint.checkpoint_date)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}