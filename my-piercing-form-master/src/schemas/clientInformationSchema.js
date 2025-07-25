import * as Yup from 'yup';
import parsePhoneNumberFromString from 'libphonenumber-js/max';


// Helper to require only when the field is visible
export const requiredWhenVisible = (message, shouldHideFields) =>
  Yup.mixed().test('required-when-visible', message, function (value) {
    const isVisible = shouldHideFields === false;

    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      value === false;

    if (isVisible && isEmpty) {
      return this.createError({ message });
    }

    return true;
  });

// Schema factory
const getClientInformationSchema = (shouldHideFields) =>
  Yup.object({
    preferredName: Yup.string().nullable().required('Preferred Name is required'),
    lastName: Yup.string().nullable().required('Last Name is required'),
    pronunciation: Yup.string().nullable(),
    pronouns: Yup.string().nullable(),
    phoneNumber: Yup.string()
  .required("Phone number is required")
  .test("valid-global", "Enter a valid phone number", value => {
    try {
      const phone = parsePhoneNumberFromString(value || "");
      return phone?.isValid();
    } catch {
      return false;
    }
  }),







    email: Yup.string().nullable().email('Invalid email format').required('Email is required'),
    address: Yup.string().nullable().required('Address is required'),
    city: Yup.string().nullable().required('City is required'),
    postalCode: Yup.string().nullable().required('Postal Code is required'),
    age: Yup.number()
      .nullable()
      .typeError("Age must be a number")
      .required('Age is required')
      .positive('Age must be a positive number')
      .integer('Age must be an integer')
      .min(5, "You must be at least 5 years old to book a visit")
      .max(110, "Please enter a valid age"),
    eaten: Yup.string()
    .required("Please let us know if you’ve eaten in the past four hours")
    .oneOf(["yes", "no"], "Must select either 'yes' or 'no'"),

    photo1: Yup.string().nullable().required('A photo is required for the first field'),
    photo2: Yup.string()
  .nullable()
  .when(['age'], (age, schema, context) => {
    const shouldRequire =
      age !== undefined &&
      age !== "" &&
      Number(age) <= 15 &&
      context?.shouldHideFields === false;

    return shouldRequire
      ? schema.required("A photo is required for the second field")
      : schema;
  }),
    


    consent: Yup.boolean()
      .nullable()
      .oneOf([true], 'You must confirm you are of the age of consent or have parental consent.'),

    negativeMetal: requiredWhenVisible('Please select if you have reacted negatively to metal jewelry.', shouldHideFields).nullable(),
    fearMedical: requiredWhenVisible('Please select if you have any fear of medical type procedures.', shouldHideFields).nullable(),
    proneToFainting: requiredWhenVisible('Please select if you are prone to fainting.', shouldHideFields).nullable(),
    medicalConditions: requiredWhenVisible('At least one medical condition must be selected.', shouldHideFields).nullable(),
    accutaneOrHRT: requiredWhenVisible('Please select Yes or No for Accutane or HRT.', shouldHideFields).nullable(),
    onAntibiotics: requiredWhenVisible('Please select if you are on antibiotics.', shouldHideFields).nullable(),

    takingAccutaneOrHRT: Yup.boolean()
      .nullable()
      .test('accutane-confirmed-if-yes', 'You must confirm that you will be taking Accutane or HRT.', function (value) {
        const isVisible = shouldHideFields === false;
        const { accutaneOrHRT } = this.parent;
        if (isVisible && accutaneOrHRT === 'yes') {
          return value === true;
        }
        return true;
      }),

    submergeAgreement: Yup.boolean()
      .nullable()
      .test(
        'submerge-agreement-visible',
        'You must confirm you will not submerge your piercing for 3 months after getting pierced.',
        function (value) {
          const isVisible = shouldHideFields === false;
          if (isVisible && value !== true) {
            return this.createError({ message: this.message });
          }
          return true;
        }
      ),

    termsAndConditions: Yup.boolean()
      .nullable()
      .oneOf([true], 'You must agree to the terms and conditions.'),

    signature: Yup.string().nullable().required('Signature is required'),
  });

export default getClientInformationSchema;