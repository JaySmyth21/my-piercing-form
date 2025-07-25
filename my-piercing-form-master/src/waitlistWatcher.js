import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WaitlistWatcher = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const startTime = Date.now();
    const maxRuntime = 10 * 60 * 1000; // 10 minutes

    const checkWaitlistStatus = async () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > maxRuntime) {
        console.warn("⛔ WaitlistWatcher stopped after 10 minutes");
        clearInterval(interval);
        return;
      }

      try {
        // 🔹 1. Fetch location metadata
        const metadataRes = await axios.get("http://localhost:5000/api/location-metadata");
        const locationMeta = metadataRes.data.results.find(
          loc => loc.id === "C54Z3Pj94nj6gTSTpCxD"
        );
        if (!locationMeta) return;

        const waitlistHours = locationMeta.hours;

        // 🕒 2. Calculate today’s closing time
        const today = new Date();
        const dayKey = today.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
        const todayHours = waitlistHours?.[dayKey];
        let closingTime = null;

        if (todayHours?.isOpen && Array.isArray(todayHours.periods) && todayHours.periods.length > 0) {
          const lastPeriod = todayHours.periods[todayHours.periods.length - 1];
          const [hh, mm] = lastPeriod.to.split(":");
          closingTime = new Date(today);
          closingTime.setHours(parseInt(hh), parseInt(mm), 0, 0);
        }

        // 🌅 3. Tomorrow’s opening time
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowKey = tomorrow.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
        const tomorrowHours = waitlistHours?.[tomorrowKey];
        let reopenTime = null;
        let reopenLabel = null;

        if (tomorrowHours?.isOpen && Array.isArray(tomorrowHours.periods) && tomorrowHours.periods.length > 0) {
          const firstPeriod = tomorrowHours.periods[0];
          if (firstPeriod?.from) {
            const [openH, openM] = firstPeriod.from.split(":");
            reopenTime = new Date(tomorrow);
            reopenTime.setHours(parseInt(openH), parseInt(openM), 0, 0);

            reopenLabel = `${reopenTime.toLocaleDateString("en-US", { weekday: "long" })} at ${reopenTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}`;
            console.log("🌅 Reopen time:", reopenLabel);
          }
        } else {
          console.warn(`⚠️ Tomorrow’s hours missing or closed: ${tomorrowKey}`);
        }

        // 🔹 4. Check current waitlist status
        const statusRes = await axios.get("http://localhost:5000/api/location-status");
        const locationStatus = statusRes.data.results.find(
          loc => loc.id === "C54Z3Pj94nj6gTSTpCxD"
        );
        if (!locationStatus) return;

        const {
          isWaitlistFull,
          naEstWaitReason,
          nextAvailableWaitlistTime
        } = locationStatus;

        const nextSlot = new Date(nextAvailableWaitlistTime);
        const isTooLate = closingTime && nextSlot > closingTime;

        const shouldRedirect =
          isWaitlistFull ||
          naEstWaitReason === "WAIT_EXCEEDS_HOURS" ||
          naEstWaitReason === "WAITLIST_DISABLED" ||
          naEstWaitReason === "LOCATION_CLOSED" ||
          isTooLate;

        if (shouldRedirect) {
          navigate("/waitlistStatus", {
            state: {
              reason: naEstWaitReason || (isTooLate ? "TIME_EXCEEDS_CLOSING" : "FULL"),
              nextSlotTime: reopenTime?.toISOString() || nextAvailableWaitlistTime,
              closingTime: closingTime?.toLocaleTimeString(),
              reopenLabel
            }
          });
        }
      } catch (err) {
        console.error("❌ WaitlistWatcher error:", err.message);
      }
    };

    const interval = setInterval(checkWaitlistStatus, 15000);
    checkWaitlistStatus(); // 🟢 Run once immediately

    return () => clearInterval(interval);
  }, [navigate]);

  return children;
};

export default WaitlistWatcher;