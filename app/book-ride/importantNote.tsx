import React from 'react';
import { X, Clock, Navigation, MapPin, Users, Car } from 'lucide-react';

interface InfoItem {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    description: string;
}

interface ImportantInfoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    infoItems?: InfoItem[];
    title?: string;
    buttonText?: string;
}

// Default content if none provided
const defaultInfoItems: InfoItem[] = [
    {
        icon: <Clock size={18}/>,
        title: 'Service Duration',
        subtitle: '2 hours (includes up to 40 km / 24 miles)',
        description:
            'The service begins at the pickup time specified by the customer and covers a distance allowance of 20 km (12 miles) per hour, calculated from the starting point to the final drop-off. Any additional time requested beyond the booked duration must be arranged directly with the driver. Chauffeurio is not liable for any extra hours not pre-agreed.',
    },
    {
        icon: <Navigation size={18} />,
        title: 'Distance Included',
        description:
            'Your ride includes 20 km per hour booked. Extra distance or time will result in additional charges.',
    },
    {
        icon: <MapPin size={18}  />,
        title: 'Return Location',
        description:
            'Bookings must end in the same city or metropolitan area as the pickup location, or a vehicle return fee will apply. For inter-city travel, choose one-way.',
    },
    {
        icon: <Users size={18} />,
        title: 'Capacity Limits',
        description:
            'Exceeding passenger or luggage limits is unsafe. Choose a larger class if necessary — chauffeurs may decline if limits are exceeded.',
    },
    {
        icon: <Car size={18} />,
        title: 'Vehicle Assignment',
        description:
            'Vehicle images are examples. A similar or higher quality vehicle may be assigned.',
    },
];

export const ImportantInfoPopup: React.FC<ImportantInfoPopupProps> = ({
    isOpen,
    onClose,
    infoItems = defaultInfoItems,
    title = 'Important Information',
    buttonText = 'GOT IT',
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white  shadow-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gray-100 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            aria-label="Close"
                        >
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 py-4 sm:px-6 sm:py-5 space-y-5 sm:space-y-6">
                    {infoItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 flex items-start pt-2">{item.icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-2xl text-gray-900">
                                    {item.title}
                                </p>
                                {item.subtitle && (
                                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        {item.subtitle}
                                    </p>
                                )}
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="w-full bg-teal-800 hover:bg-teal-900 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};
