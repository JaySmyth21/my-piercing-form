import { useLocation } from "react-router-dom";
import WaitlistReopenWatcher from "./waitlistReopenWatcher";

const WaitlistStatusPage = () => {
  const { state } = useLocation();
  const { reason, nextSlotTime, reopenLabel } = state || {};

  const reopenTime =
    nextSlotTime && !isNaN(Date.parse(nextSlotTime))
      ? new Date(nextSlotTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const renderMessage = () => {
    switch (reason) {
      case "WAIT_EXCEEDS_HOURS":
      case "TIME_EXCEEDS_CLOSING":
      case "LOCATION_IS_CLOSED_FOR_DAY":
        return (
          <>
            <p className="text-xl font-semibold text-red-700 mb-2">
              The Queue has closed for the day
            </p>
            <p className="text-gray-700">
              Today’s estimated wait time exceeds our business hours.
            </p>
            {reopenLabel && (
              <p className="text-sm text-gray-600 mt-2">
                The queue reopens: <strong>{reopenLabel}</strong>.
              </p>
            )}
          </>
        );

      case "CAPACITY_EXCEEDED":
      case "FULL":
        return (
          <>
            <p className="text-xl font-semibold text-red-700 mb-2">
              We're at full capacity
            </p>
            <p className="text-gray-700">
              The queue has reached capacity at the moment. Please check back later and see if any space opens up.
            </p>
            {reopenLabel && (
              <p className="text-sm text-gray-600 mt-2">
                The queue reopens: <strong>{reopenLabel}</strong>.
              </p>
            )}
          </>
        );

      case "WAITLIST_DISABLED":
      case "LOCATION_CLOSED":
        return (
          <>
            <p className="text-xl font-semibold text-red-700 mb-2">
              Queue is currently closed 🚫
            </p>
            <p className="text-gray-700">
              Our team has temporarily closed the queue. This may be due to staff availability or a manual override.
              Please check back later or contact us directly if needed.
            </p>
            {reopenLabel && (
              <p className="text-sm text-gray-600 mt-2">
                The queue reopens: <strong>{reopenLabel}</strong>.
              </p>
            )}
          </>
        );

      default:
        return (
          <>
            <p className="text-xl font-semibold text-red-700 mb-2">
              Waitlist is unavailable 🚧
            </p>
            <p className="text-gray-700">
              We’re currently unable to accept new guests. Please check back later!
            </p>
          </>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <WaitlistReopenWatcher />
      {renderMessage()}
    </div>
  );
};

export default WaitlistStatusPage;