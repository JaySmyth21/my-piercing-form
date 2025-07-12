import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { storage } from "./firebaseConfig";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const uploadBase64Image = async (base64Data, path) => {
    const storageRef = ref(storage, path);
    await uploadString(storageRef, base64Data, "data_url");
    return await getDownloadURL(storageRef); // ✅ returns the viewable link
  };

  const handleSubmit = useCallback(async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await axios.get("http://localhost:5000/api/services");
      const serviceMap = {};
      response.data.forEach(service => {
        serviceMap[service.name] = service.id;
      });

      const serviceIds = formData.selectedServices
        .map(name => serviceMap[name])
        .filter(Boolean);

      const { photo1, photo2, signature, ...cleanFormData } = formData;
      const fullName = `${formData.preferredName} ${formData.lastName}`.trim();
      const timestamp = Date.now();
      const folderName = `${fullName}_${timestamp}`;
      const basePath = `photos/${folderName}`;

      let photo1URL = "";
let photo2URL = "";
let signatureURL = "";

try {
  // Upload photo1 and get URL
  await uploadBase64Image(photo1, `${basePath}/photo1.jpg`);
  photo1URL = await getDownloadURL(ref(storage, `${basePath}/photo1.jpg`));

  // Upload photo2 (if provided) and get URL
  if (photo2) {
    await uploadBase64Image(photo2, `${basePath}/photo2.jpg`);
    photo2URL = await getDownloadURL(ref(storage, `${basePath}/photo2.jpg`));
  }

  // Upload signature and get URL
  await uploadBase64Image(signature, `${basePath}/signature.jpg`);
  signatureURL = await getDownloadURL(ref(storage, `${basePath}/signature.jpg`));
} catch (err) {
  console.log("❌ Upload error:", err);
}

      await axios.post("http://localhost:5000/api/create-visit", {
        ...cleanFormData,
        serviceIds,
        locationId: "C54Z3Pj94nj6gTSTpCxD",
        name: fullName,
        photo1URL,
        photo2URL,
        signatureURL,
      });

      setSubmitSuccess(true);
    } catch (error) {
      console.error("❌ Visit creation error:", error);
      setSubmitError("Something went wrong creating your visit.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!formData) {
      navigate("/");
      return;
    }

    handleSubmit(); // ✅ auto-submit on load
  }, [formData, handleSubmit, navigate]);



  return (
  <div className="max-w-3xl mx-auto p-6 space-y-6 text-center">
    <h1 className="text-2xl font-bold">Submitting Your Visit</h1>

    {isSubmitting && (
      <div className="flex items-center justify-center space-x-2 text-blue-600">
        <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span>Submitting your visit...</span>
      </div>
    )}

    {submitSuccess && (
      <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4">
        <p className="text-green-700 font-semibold text-lg">✅ You've been added to the queue!</p>
        <p className="text-green-700">📱 You'll receive a text message when you're next in line!</p>
        <p className="text-green-700">View the queue here:</p><p><strong> https://waitwhile.com/locations/inkfx/waitlist</strong></p>

      </div>
    )}

    {submitError && (
      <p className="mt-6 text-red-600">
        Something went wrong creating your visit. Please try again or contact support.
      </p>
    )}
  </div>
);

};

export default Confirmation;