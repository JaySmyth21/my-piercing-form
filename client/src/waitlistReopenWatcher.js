import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const WaitlistReopenWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const startTime = Date.now();
    const maxRuntime = 10 * 60 * 1000; // 10 minutes
    let intervalId;

    const checkWaitlistStatus = async () => {
      const elapsed = Date.now() - startTime;

      if (elapsed > maxRuntime) {
        toast("⏳ Still full after 10 minutes — check back later!");
        console.warn("⛔ Stopping waitlist check after timeout");
        clearInterval(intervalId);
        return;
      }

      try {
        const res = await axios.get("https://my-piercing-form.onrender.com/api/location-status");
        const location = res.data.results.find(
          (loc) => loc.id === "C54Z3Pj94nj6gTSTpCxD"
        );

        if (!location) return;

        const { isWaitlistFull, naEstWaitReason } = location;

        const hasReopened =
          !isWaitlistFull &&
          !["WAITLIST_DISABLED", "WAIT_EXCEEDS_HOURS", "LOCATION_CLOSED"].includes(naEstWaitReason);

        if (hasReopened) {
          console.log("✅ Waitlist reopened — redirecting!");
          clearInterval(intervalId);
          navigate("/");
        }
      } catch (err) {
        console.error("❌ Reopen watcher failed:", err.message);
      }
    };

    intervalId = setInterval(checkWaitlistStatus, 15000);
    checkWaitlistStatus();

    return () => clearInterval(intervalId);
  }, [navigate]);

  return null;
};

export default WaitlistReopenWatcher;