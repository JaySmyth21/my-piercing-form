import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import './App.css';

// Components
import FormLayout from "./FormLayout";
import SignatureField from "./SignatureField";
import PhotoCaptureOrUpload from "./PhotoCaptureOrUpload";
import FormField from "./FormField";
import RadioGroupField from "./RadioGroupField";
import CheckboxField from "./CheckboxField";
import CheckboxGroupField from "./CheckboxFieldGroup";
import sanitizeClientFormValues from "./sanitizeClientFormValues";

// Schema
import getClientInformationSchema from "./schemas/clientInformationSchema";

const ClientInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);


  const initialValues = {
    preferredName: "",
    lastName: "",
    pronunciation: "",
    pronouns: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    age: "",
    occupation: "",
    photo1: "",
    photo2: "",
    consent: false,
    foodAllergies: "",
    negativeMetal: "",
    fearMedical: "",
    proneToFainting: "",
    medicalConditions: [],
    accutaneOrHRT: "",
    takingAccutaneOrHRT: false,
    onAntibiotics: "",
    submergeAgreement: false,
    termsAndConditions: false,
    signature: "",
    eaten: "",
  };

  const ConditionalSection = ({ show, children }) =>
    show ? <>{children}</> : null;

  const selectedServices = location.state?.selectedServices || [];
  const selectedPiercer = location.state?.selectedPiercer || null;
  const piercingServiceNames = location.state?.piercingServiceNames || [];
  const piercingDescription = location.state?.piercingDescription || null;
  console.log(selectedServices);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasOnlyRestrictedServices = selectedServices.every(
    (service) => !piercingServiceNames.includes(service),
  );

  const shouldHideFields = hasOnlyRestrictedServices;

  // States for the photo capture

  

const [imagePreview1, setImagePreview1] = useState(null);
const videoRef1 = useRef(null);
const canvasRef1 = useRef(null);

const [imagePreview2, setImagePreview2] = useState(null);
const videoRef2 = useRef(null);
const canvasRef2 = useRef(null);


  const schema = getClientInformationSchema(shouldHideFields);

 
const [countryPrefix, setCountryPrefix] = useState("+1"); // default
const [localPhone, setLocalPhone] = useState(""); // input field only

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      validationContext={{ shouldHideFields }}
    >
      {(formik) => {
        if (!formik) return null;

        const { values, setFieldValue } = formik;
         

const handleCountryChange = (value) => {
  const match = value?.match(/^\+[\d]+/) || [];
  const prefix = match[0] || "+1";
  setCountryPrefix(prefix);
  setFieldValue("phoneNumber", `${prefix}${localPhone}`);
};
const InvisibleInput = React.forwardRef((props, ref) => (
  <input
    ref={ref}
    {...props}
    type="text"
    style={{
      position: "absolute",
      opacity: 0,
      pointerEvents: "none",
      width: "1px",
      height: "1px",
    }}
    aria-hidden="true"
    tabIndex={-1}
  />
));


const handleLocalPhoneChange = (e) => {
  const value = e.target.value.replace(/^\+[\d]+/, "");
  setLocalPhone(value);
  setFieldValue("phoneNumber", `${countryPrefix}${value}`);
};

       const handleCustomSubmit = async () => {
  const errors = await formik.validateForm();

  formik.setTouched(
    Object.fromEntries(
      Object.keys(formik.initialValues).map((key) => [key, true])
    )
  );

  if (Object.keys(errors).length > 0) {
    console.warn("⛔ Validation failed — not submitting");
    console.log(errors);

    const firstField = Object.keys(errors)[0];
    let node = document.querySelector(`[name="${firstField}"]`);

    if (!node) {
      node = document.querySelector(`[data-field="${firstField}"]`);
    }
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return;
  }

  // 🧼 Sanitize values before submitting
  const cleanedValues = sanitizeClientFormValues(formik.values);

  const fullFormData = {
    ...cleanedValues,
    selectedServices,
    selectedPiercerName: selectedPiercer.name,
    piercingDescription,
  };
  console.log("🔍 Raw values:", formik.values);
console.log("🧼 Sanitized values:", sanitizeClientFormValues(formik.values));
  navigate("/confirmation", { state: { formData: fullFormData } });
};
        return (
          <FormLayout>
            <Form ref={formRef}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Client Information
              </h2>

              {/* Input Fields */}
              <div className="flex flex-col space-y-6 mt-10">
  {[
    { name: "preferredName", label: "Preferred Name or First Name", required: true },
    { name: "lastName", label: "Last Name", required: true },
    { name: "pronunciation", label: "Pronunciation" },
    { name: "pronouns", label: "Pronouns" },
    { name: "phoneNumber", label: "Phone Number", required: true },
    { name: "email", label: "Email", required: true },
    { name: "address", label: "Address", required: true },
    { name: "city", label: "City", required: true },
    { name: "postalCode", label: "Postal Code", required: true },
    { name: "age", label: "Age", required: true, type: "number" },
    { name: "occupation", label: "Occupation/Sport" },
  ].map((field) => (
   <div key={field.name} className="w-full">
  {field.name === "phoneNumber" ? (
    <div className="flex flex-col items-center">
      <label className="block mb-2 text-left w-full sm:w-3/4">
        Phone Number <span className="text-red-600 ml-1">*</span>
      </label>

      <div className="w-full sm:w-3/4 overflow-x-visible">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 h-auto w-full">
          {/* 🌐 Country Selector */}
          <PhoneInput
            international
            defaultCountry="CA"
            value={countryPrefix}
            onChange={handleCountryChange}
            inputComponent={InvisibleInput}
            countrySelectProps={{
              className:
                "!w-[100px] !min-w-[100px] !max-w-[100px] h-[44px] text-sm border border-gray-300 rounded bg-white",
            }}
            className="!m-0 !p-0 !w-[100px] !min-w-[100px] !max-w-[100px] overflow-hidden flex-shrink-0"
          />

          {/* 🔒 Locked Country Prefix */}
          <span className="px-3 border border-gray-300 bg-gray-100 text-gray-600 rounded text-sm flex items-center h-[44px] !min-w-[44px] !max-w-[60px] flex-shrink-0">
            {countryPrefix}
          </span>

          {/* 📱 Local Phone Number Input */}
          <div className="flex w-full sm:flex-1 min-w-0 mt-2 sm:mt-0">
            <input
              type="tel"
              name={field.name}
              value={localPhone}
              onChange={handleLocalPhoneChange}
              onBlur={formik.handleBlur}
              placeholder="Your phone number"
              className="flex-1 h-[44px] text-lg px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none min-w-0"
            />
          </div>
        </div>
      </div>

     
    </div>
  ) : (
    <FormField {...field} />
  )}
  <div className="flex flex-col items-center">
  <ErrorMessage
        name={field.name}
        component="div"
        className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
        data-field={field.name}
      />
      </div>
</div>


  ))}
</div>


              {/* Camera Sections */}
              <PhotoCaptureOrUpload
  label="Government Issued ID"
  fieldName="photo1"
  imagePreview={imagePreview1}
  setImagePreview={setImagePreview1}
  setFieldValue={setFieldValue}
  videoRef={videoRef1}
  canvasRef={canvasRef1}
/>

              <div className="flex flex-col items-center" data-field="photo1">
                <ErrorMessage
                  name="photo1"
                  component="div"
                  className="text-red-600 w-full sm:w-3/4"
                />
              </div>
              <ConditionalSection
                show={
                  !shouldHideFields &&
                  values.age !== "" &&
                  values.age !== undefined &&
                  Number(values.age) <= 15
                }
              >
              <PhotoCaptureOrUpload
  label="Government Issued ID Parent/Legal Guardian"
  fieldName="photo2"
  imagePreview={imagePreview2}
  setImagePreview={setImagePreview2}
  setFieldValue={setFieldValue}
  videoRef={videoRef2}
  canvasRef={canvasRef2}
/>

              <div className="flex flex-col items-center" data-field="photo2">
                <ErrorMessage
                  name="photo2"
                  component="div"
                  className="text-red-600 w-full sm:w-3/4"
                />
              </div>
              </ConditionalSection>


              {/* Age of Consent Checkbox */}
              <CheckboxField
                name="consent"
                label="I am of the age of consent or have parental consent for this service piercing"
                required
              />
              <div className="flex flex-col items-center ">
                <div className="flex items-center w-full sm:w-3/4">
                  <ErrorMessage
                    name="consent"
                    component="div"
                    className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                    data-field="consent"
                  />
                </div>
              </div>

              {/* Food Allergies Field */}
              <div className="flex flex-col items-center mt-10">
                <label className="block mb-2 text-left w-full sm:w-3/4">
                  Do you have any food allergies? If yes, please specify:
                </label>
                <Field
                  as="textarea"
                  name="foodAllergies"
                  className="border border-gray-300 p-2 rounded w-full sm:w-3/4"
                  rows="3"
                />
              </div>

              {/* Eaten in the past 4 hours */}
              <RadioGroupField
                name="eaten"
                label="Have you eaten within in the past four hours?"
                options={["yes", "no"]}
                required
              />
                <div className="flex flex-col items-center ">
                <div className="flex items-center w-full sm:w-3/4">
                  <ErrorMessage
                    name="eaten"
                    component="div"
                    className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                    data-field="eaten"
                  />
                </div>
              </div>

              {/* Reacted negatively to metal jewelry */}
              <ConditionalSection show={!shouldHideFields}>
                <RadioGroupField
                  name="negativeMetal"
                  label="Have you reacted negatively to metal jewelry?"
                  options={["yes", "no"]}
                  required
                />
                <div className="flex flex-col items-center ">
                  <div className="flex items-center w-full sm:w-3/4">
                    <ErrorMessage
                      name="negativeMetal"
                      component="div"
                      className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                      data-field="negativeMetal"
                    />
                  </div>
                </div>
              </ConditionalSection>

              {/* Fear of medical type procedures */}
              <ConditionalSection show={!shouldHideFields}>
                <RadioGroupField
                  name="fearMedical"
                  label="Do you have fear of any medical type procedures?"
                  options={["yes", "no"]}
                  required
                />
                <div className="flex flex-col items-center ">
                  <div className="flex items-center w-full sm:w-3/4">
                    <ErrorMessage
                      name="fearMedical"
                      component="div"
                      className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                      data-field="fearMedical"
                    />
                  </div>
                </div>
              </ConditionalSection>

              {/* Prone to Fainting */}
              <ConditionalSection show={!shouldHideFields}>
                <RadioGroupField
                  name="proneToFainting"
                  label="Are you prone to fainting?"
                  options={["yes", "no", "maybe"]}
                  required
                />
                <div className="flex flex-col items-center ">
                  <div className="flex items-center w-full sm:w-3/4">
                    <ErrorMessage
                      name="proneToFainting"
                      component="div"
                      className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                      data-field="proneToFainting"
                    />
                  </div>
                </div>
              </ConditionalSection>

              {/* Medical Conditions Field */}
              <ConditionalSection show={!shouldHideFields}>
                <CheckboxGroupField
                  name="medicalConditions"
                  label="Do you have any medical conditions? (Select all that apply)"
                  options={[
                    "None",
                    "Diabetes",
                    "Epilepsy",
                    "Heart Disease",
                    "Heavy Bleeding",
                    "Hepatitis",
                    "HIV/AIDS",
                    "Keloiding",
                    "Pregnancy",
                  ]}
                  required
                />
                <div className="flex flex-col items-center ">
                  <div className="flex items-center w-full sm:w-3/4">
                    <ErrorMessage
                      name="medicalConditions"
                      component="div"
                      className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                      data-field="medicalConditions"
                    />
                  </div>
                </div>
              </ConditionalSection>

              {/* Accutane or HRT */}
              <ConditionalSection show={!shouldHideFields}>
                <RadioGroupField
                  name="accutaneOrHRT"
                  label="Have you in the past six months, or will you be in the following six months, be taking Accutane or Hormone Replacement Therapy (HRT)?"
                  options={["yes", "no"]}
                  required
                />
                <div className="flex flex-col items-center ">
                  <div className="flex items-center w-full sm:w-3/4">
                    <ErrorMessage
                      name="accutaneOrHRT"
                      component="div"
                      className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                      data-field="accutaneOrHRT"
                    />
                  </div>
                </div>
                {values.accutaneOrHRT === "yes" && (
                  <>
                    <div className="mt-4 w-full sm:w-3/4 text-center">
                      <p className="text-blue-500 hover:underline mb-2">
                        <a
                          href="https://www.lynnloheide.com/post/accutane-and-piercings"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          Risks that come along with being pierced on HRT or
                          Accutane.
                        </a>
                      </p>
                    </div>

                    <CheckboxField
                      name="takingAccutaneOrHRT"
                      label="I understand the risks that come along with being pierced on either Accutane or HRT."
                      required
                    />
                    <div className="flex flex-col items-center ">
                      <div className="flex items-center w-full sm:w-3/4">
                        <ErrorMessage
                          name="takingAccutaneOrHRT"
                          component="div"
                          className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                          data-field="takingAccutaneOrHRT"
                        />
                      </div>
                    </div>
                  </>
                )}
              </ConditionalSection>

              {/* On Antibiotics */}
              <ConditionalSection show={!shouldHideFields}>
                <RadioGroupField
                  name="onAntibiotics"
                  label="Are you on antibiotics?"
                  options={["yes", "no"]}
                  required
                />
                <div className="flex flex-col items-center ">
                  <div className="flex items-center w-full sm:w-3/4">
                    <ErrorMessage
                      name="onAntibiotics"
                      component="div"
                      className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                      data-field="onAntibiotics"
                    />
                  </div>
                </div>
              </ConditionalSection>

              {/* Submerge Agreement */}
              <ConditionalSection show={!shouldHideFields}>
                <CheckboxField
                  name="submergeAgreement"
                  label="I will not submerge my piercing in any water for 3 months after being pierced"
                  required
                />
                <div className="flex flex-col items-center ">
                  <div className="flex items-center w-full sm:w-3/4">
                    <ErrorMessage
                      name="submergeAgreement"
                      component="div"
                      className="form-error text-red-600 mt-2 text-left w-full sm:w-3/4"
                      data-field="submergeAgreement"
                    />
                  </div>
                </div>
              </ConditionalSection>

              {/* Terms and Conditions Text Field */}
              <div className="flex flex-col items-center mt-10">
                <label className="block mb-2 text-left w-full sm:w-3/4">
                  Terms and Conditions:
                </label>
                <textarea
                  className="border border-gray-300 p-2 rounded w-full sm:w-3/4"
                  rows="5"
                  readOnly
                  value={`This is to certify that I, the above signed and undersigned, do give my permission to be pierced at INK FX TATTOO AND PIERCING LTD. I have answered all the above questions truthfully. I am fully aware of and take full responsibility for the healing and daily aftercare procedures. I understand there is a chance of an adverse reaction or infection even when all appropriate sanitary and professional measures were taken by the above-named business, and they shall not be liable for such an event.`}
                />
              </div>

              {/* Terms and Conditions Checkbox */}
              <CheckboxField
                name="termsAndConditions"
                label="I accept the Terms and Conditions."
                required
              />
              <div className="flex flex-col items-center ">
                <div className="flex items-center w-full sm:w-3/4">
                  <ErrorMessage
                    name="termsAndConditions"
                    component="div"
                    className="form-error text-red-600 "
                    data-field="termsAndConditions"
                  />
                </div>
              </div>



              <RadioGroupField
              name="decisionImpare"
              label="Is there any reason why your decision-making abilities may be impaired? for example, by the recent consumption of certain medications, non-prescribed drugs or alcohol? (Required)?"
              options={["yes", "no"]}
              required
              />
              {/* Signature */}
              <SignatureField
                onChange={(value) => setFieldValue("signature", value)}
              />
              <div className="flex flex-col items-center ">
                <div className="flex items-center w-full sm:w-3/4">
                  <ErrorMessage
                    name="signature"
                    component="div"
                    className="text-red-500 mt-2"
                  />
                </div>
              </div>

              {/* Next and Previous Button */}
              <div className="flex flex-col sm:flex-row justify-between mt-6 mx-4 sm:mx-auto sm:w-3/4">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mb-2 sm:mb-0 sm:mr-4"
                  onClick={() =>
                    navigate("/service-selection", {
                      state: {
                        piercer: selectedPiercer,
                      },
                    })
                  }
                >
                  Previous
                </button>

                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2 sm:mb-0 sm:mr-4"
                  onClick={handleCustomSubmit}
                >
                  Submit
                </button>
              </div>
            </Form>
          </FormLayout>
        );
      }}
    </Formik>
  );
};

export default ClientInformation;
