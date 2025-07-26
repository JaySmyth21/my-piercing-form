import validator from "validator";
import DOMPurify from "dompurify";
import parsePhoneNumberFromString from "libphonenumber-js/max";

// Helper to remove all HTML tags and attributes
const stripHTML = (input) =>
  DOMPurify.sanitize(input || "", { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

const sanitizeClientFormValues = (values) => {
  // Normalize phone number
  const phoneRaw = values.phoneNumber?.trim() || "";
  const parsedPhone = parsePhoneNumberFromString(phoneRaw);
  const phoneNumber = parsedPhone?.isValid() ? parsedPhone.format("E.164") : "";

  return {
    preferredName: values.preferredName?.trim() || "",
    lastName: values.lastName?.trim() || "",
    pronunciation: stripHTML(values.pronunciation?.trim() || ""),
    pronouns: values.pronouns?.trim() || "",
    phoneNumber, // ✅ now in E.164 format
    email: validator.isEmail(values.email || "")
      ? validator.normalizeEmail(values.email || "")
      : "",
    address: values.address?.trim() || "",
    city: values.city?.trim() || "",
    postalCode: values.postalCode?.trim().toUpperCase() || "",
    age: values.age ? Number(values.age) : null,

    eaten: values.eaten || "",
    photo1: values.photo1 || "",
    photo2: values.photo2 || "",

    consent: values.consent === true,
    negativeMetal: values.negativeMetal ?? null,
    fearMedical: values.fearMedical ?? null,
    proneToFainting: values.proneToFainting ?? null,
    medicalConditions: values.medicalConditions ?? null,
    accutaneOrHRT: values.accutaneOrHRT ?? null,
    onAntibiotics: values.onAntibiotics ?? null,
    takingAccutaneOrHRT: values.takingAccutaneOrHRT === true,
    submergeAgreement: values.submergeAgreement === true,
    termsAndConditions: values.termsAndConditions === true,

    signature: stripHTML(values.signature?.trim() || ""),
  };
};

export default sanitizeClientFormValues;