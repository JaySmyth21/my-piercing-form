import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation} from 'react-router-dom';
import FormLayout from './FormLayout'; // Import the layout
import SignatureField from './SignatureField'; // Import your signature field

const ClientInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef();

  const selectedServices = location.state?.selectedServices || [];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const jewelryChanges = [
    'Jewelry Change (One Change)', 'Jewelry Change (Two Changes)', 
    'Jewelry Change (Three Changes)', 'Jewelry Change (Four Changes)', 
    'Jewelry Change (Five Changes)', 'Jewelry Change (Six Changes)', 
    'Jewelry Change (Seven Changes)', 'Jewelry Change (Eight Changes)'
  ];

  const jewelryDownsizes = [
    'Jewelry Downsize (One)', 'Jewelry Downsize (Two)', 
    'Jewelry Downsize (Three)', 'Jewelry Downsize (Four)', 
    'Jewelry Downsize (Five)', 'Jewelry Downsize (Six)', 
    'Jewelry Downsize (Seven)', 'Jewelry Downsize (Eight)',
  ];

  const other = [
    'Embeded Jewelry', 'Jewelry Removal (General)', 
    'Jewelry Removal (Dermal)', 'General Checkup', 'Cheek/Dahlia Consultation'
  ];

  // Check if any selected service is from Jewelry Change, Downsize, or Other
  const shouldHideFields = selectedServices.some(service =>
    jewelryChanges.includes(service) ||
    jewelryDownsizes.includes(service) ||
    other.includes(service)
  );

  // States for the first photo capture
  const [imagePreview1, setImagePreview1] = useState(null);
  const [cameraOpened1, setCameraOpened1] = useState(false);
  const [photoCaptured1, setPhotoCaptured1] = useState(false);
  const videoRef1 = useRef(null);
  const canvasRef1 = useRef(null);
  const streamRef1 = useRef(null);

  // States for the second photo capture
  const [imagePreview2, setImagePreview2] = useState(null);
  const [cameraOpened2, setCameraOpened2] = useState(false);
  const [photoCaptured2, setPhotoCaptured2] = useState(false);
  const videoRef2 = useRef(null);
  const canvasRef2 = useRef(null);
  const streamRef2 = useRef(null);

  const [takingAccutaneOrHRT, setTakingAccutaneOrHRT] = useState(false);

  // Function to access the camera for the first capture
  const getVideo1 = async () => {
    try {
      streamRef1.current = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef1.current.srcObject = streamRef1.current;
      setCameraOpened1(true);
      setPhotoCaptured1(false);
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  // Function to capture the photo for the first capture
  const takePicture1 = (setFieldValue) => {
    const canvas = canvasRef1.current;
    const video = videoRef1.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    setImagePreview1(imageData);
    setPhotoCaptured1(true);

    // Set the captured photo value in Formik state
    setFieldValue('photo1', imageData);

    // Stop the camera stream after capturing the photo
    if (streamRef1.current) {
      streamRef1.current.getTracks().forEach(track => track.stop());
      setCameraOpened1(false);
    }
  };

  // Function to retake the photo for the first capture
  const retakePicture1 = (setFieldValue) => {
    setImagePreview1(null);
    setPhotoCaptured1(false);
    getVideo1();
    setFieldValue('photo1', ''); // Clear the photo value in Formik state
  };

  // Function to access the camera for the second capture
  const getVideo2 = async () => {
    try {
      streamRef2.current = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef2.current.srcObject = streamRef2.current;
      setCameraOpened2(true);
      setPhotoCaptured2(false);
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  // Function to capture the photo for the second capture
  const takePicture2 = (setFieldValue) => {
    const canvas = canvasRef2.current;
    const video = videoRef2.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    setImagePreview2(imageData);
    setPhotoCaptured2(true);

    // Set the captured photo value in Formik state
    setFieldValue('photo2', imageData);

    // Stop the camera stream after capturing the photo
    if (streamRef2.current) {
      streamRef2.current.getTracks().forEach(track => track.stop());
      setCameraOpened2(false);
    }
  };

  // Function to retake the photo for the second capture
  const retakePicture2 = (setFieldValue) => {
    setImagePreview2(null);
    setPhotoCaptured2(false);
    getVideo2();
    setFieldValue('photo2', ''); // Clear the photo value in Formik state
  };

  const validationSchema = Yup.object({
    preferredName: Yup.string().required('Preferred Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    pronunciation: Yup.string(),
    pronouns: Yup.string(),
    phoneNumber: Yup.string()
        .required('Phone Number is required')
        .matches(/^[0-9]+$/, 'Phone Number should contain only digits'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal Code is required'),
    age: Yup.number()
        .required('Age is required')
        .positive('Age must be a positive number')
        .integer('Age must be an integer'),
    photo1: Yup.string().required('A photo is required for the first field'),
    photo2: Yup.string().required('A photo is required for the second field'),
    consent: Yup.boolean().oneOf([true], 'You must confirm you are of the age of consent or have parental consent.'),
    negativeMetal: Yup.string().required('Please select if you have reacted negatively to metal jewelry.'),
    fearMedical: Yup.string().required('Please select if you have any fear of medical type procedures.'),
    proneToFainting: Yup.string().required('Please select if you are prone to fainting.'),
    medicalConditions: Yup.array().min(1, 'At least one medical condition must be selected.'),
    accutaneOrHRT: Yup.string()
    .oneOf(['yes', 'no'], 'Please select Yes or No for Accutane or HRT.')
    .required('Please select Yes or No for Accutane or HRT.'),
    takingAccutaneOrHRT: Yup.boolean()
    .nullable()
    .test(
      'is-accutane-confirmed',
      'You must confirm that you will be taking Accutane or HRT.',
      function (value) {
        const { accutaneOrHRT } = this.parent;
        return accutaneOrHRT === 'yes' ? value === true : true;
      }
    ),
    onAntibiotics: Yup.string().required('Please select if you are on antibiotics.'),
    submergeAgreement: Yup.boolean().oneOf([true], 'You must confirm you will not submerge you piercing for 3 months after getting pierced.'),
    termsAndConditions: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions.'),
    signature: Yup.string().required('Signature is required')
});



  return (
        <Formik
        initialValues={{
        preferredName: '',
        lastName: '',
        pronunciation: '',
        pronouns: '',
        phoneNumber: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        age: '',
        occupation: '',
        photo1: '',
        photo2: '',
        consent: false,
        negativeMetal: '',
        fearMedical: '',
        proneToFainting: '',
        medicalConditions: [],
        accutaneOrHRT: '', 
        takingAccutaneOrHRT: false,
        onAntibiotics: '',
        submergeAgreement: false,
        termsAndConditions: false,
        signature: '',
    }}
    
    
    validationSchema={validationSchema}
    
    onSubmit={(values) => {
        console.log('Formik values:', values); // Log all Formik values
        console.log('Form submitted:', values);
        navigate('/confirmation', { state: { formData: values } });  // Navigate to confirmation page

    }}
    >
        
        {({ validateForm, errors, setFieldValue, submitForm, touched, setTouched, values}) => (
            
        <FormLayout>
          <Form ref={formRef}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Client Information</h2>

            {/* Input Fields */}
            <div className="flex flex-col space-y-4">
            {[
                { name: 'preferredName', label: 'Preferred Name or First Name', required: true },
                { name: 'lastName', label: 'Last Name', required: true },
                { name: 'pronunciation', label: 'Pronunciation', required: false },
                { name: 'pronouns', label: 'Pronouns', required: false },
                { name: 'phoneNumber', label: 'Phone Number', required: true },
                { name: 'email', label: 'Email', required: true },
                { name: 'address', label: 'Address', required: true },
                { name: 'city', label: 'City', required: true },
                { name: 'postalCode', label: 'Postal Code', required: true },
                { name: 'age', label: 'Age', required: true },
                { name: 'occupation', label: 'Occupation/Sport', required: false },
                ].map(({ name, label, required }) => (
                <div key={name} className="flex flex-col items-center">
                <label className="block mb-2 text-left w-full sm:w-3/4">
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
                <Field
                    type={name === 'age' ? 'number' : 'text'}
                    name={name}
                    className="border border-gray-300 p-2 rounded w-full sm:w-3/4"
                />
                <ErrorMessage name={name} component="div" className="text-red-500 mt-1 text-left w-full sm:w-3/4" />
                </div>
            ))}
            </div>

      
            {/* Camera Sections */}
            <div className="flex flex-col items-center mt-10">
            <label className="block mb-2 text-left w-full sm:w-3/4">Government Issued ID<span className="text-red-600 ml-1">*</span></label> 

            {/* Video for Camera */}
            <video
                ref={videoRef1}
                autoPlay
                className="border rounded w-full sm:w-3/4"
                style={{ display: imagePreview1 ? 'none' : 'block' }}
            />

            {/* Image Preview for Captured Photo */}
            {imagePreview1 && (
                <img
                src={imagePreview1}
                alt="Captured Photo 1"
                className="border rounded w-full sm:w-3/4"
                />
            )}

            {/* Buttons for Camera */}
            {!cameraOpened1 && !photoCaptured1 && (
                <button
                type="button"
                onClick={getVideo1}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                Open Camera
                </button>
            )}

            {cameraOpened1 && !photoCaptured1 && (
                <button
                type="button"
                onClick={() => takePicture1(setFieldValue)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                Capture Photo
                </button>
            )}

            {photoCaptured1 && (
                <button
                type="button"
                onClick={() => retakePicture1(setFieldValue)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                Retake Photo
                </button>
            )}
            <Field
                type="hidden"
                name="photo1"
                value={imagePreview1 || ''} // Ensure it captures the image preview or is empty
            />
            <canvas ref={canvasRef1} style={{ display: 'none' }} />
            <ErrorMessage name="photo1" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Repeat for Second Camera */}
            <div className="flex flex-col items-center mt-10">
            <label className="block mb-2 text-left w-full sm:w-3/4">Government Issued ID Parent/Legal Guardian <b>(Required if under 16)</b></label>

            {/* Video for Camera */}
            <video
                ref={videoRef2}
                autoPlay
                className="border rounded w-full sm:w-3/4"
                style={{ display: imagePreview2 ? 'none' : 'block' }}
            />

            {/* Image Preview for Captured Photo */}
            {imagePreview2 && (
                <img
                src={imagePreview2}
                alt="Captured Photo 2"
                className="border rounded w-full sm:w-3/4"
                />
            )}

            {/* Buttons for Camera */}
            {!cameraOpened2 && !photoCaptured2 && (
                <button
                type="button"
                onClick={getVideo2}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                Open Camera
                </button>
            )}

            {cameraOpened2 && !photoCaptured2 && (
                <button
                type="button"
                onClick={() => takePicture2(setFieldValue)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                Capture Photo
                </button>
            )}

            {photoCaptured2 && (
                <button
                type="button"
                onClick={() => retakePicture2(setFieldValue)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                Retake Photo
                </button>
            )}
            <canvas ref={canvasRef2} style={{ display: 'none' }} />
            <ErrorMessage name="photo2" component="div" className="text-red-500 mt-1" />
            </div>

            
            {/* Age of Consent Checkbox */}
            <div className="flex flex-col items-center mt-10">
                <div className="flex items-center w-full sm:w-3/4">
                    <Field type="checkbox" name="consent" className="mr-2" />
                    <label htmlFor="consent" className="text-left text-sm sm:text-base">
                        I am of the age of consent or have parental consent for this service piercing <span className="text-red-600 ml-1">*</span>
                    </label>
                </div>
                <ErrorMessage name="consent" component="div" className="text-red-600 w-full sm:w-3/4 mt-2" />
            </div>



            {/* Food Allergies Field */}
            <div className="flex flex-col items-center mt-10">
            <label className="block mb-2 text-left w-full sm:w-3/4">Do you have any food allergies? If yes, please specify:</label>
            <Field
                as="textarea"
                name="foodAllergies"
                className="border border-gray-300 p-2 rounded w-full sm:w-3/4"
                rows="3"
            />
            </div>


            {/* Reacted negatively to metal jewelry */}
            <div className="flex flex-col items-center mt-10">
                <label className="block mb-2 text-left w-full sm:w-3/4"> Have you ever reacted negatively to metal jewelry? <span className="text-red-600 ml-1">*</span> </label> 
                <div className="w-full sm:w-3/4">
                    <label className="flex items-center mb-2">
                    <Field type="radio" name="negativeMetal" value="yes" className="mr-2" />
                    Yes
                    </label>
                    <label className="flex items-center mb-2">
                    <Field type="radio" name="negativeMetal" value="no" className="mr-2" />
                    No
                    </label>
                    <ErrorMessage name="negativeMetal" component="div" className="text-red-600" />
                </div>
            </div>



            {/* Fear of medical type procedures */}
            {!shouldHideFields && (
            <div className="flex flex-col items-center mt-10">
                <label className="block mb-2 text-left w-full sm:w-3/4">Do you have any fear of medical type procedures? <span className="text-red-600 ml-1">*</span> </label>
                <div className="w-full sm:w-3/4"> 
                    <label className="flex items-center mb-2">
                        <Field type="radio" name="fearMedical" value="yes" className="mr-2" />
                        Yes
                    </label>
                    <label className="flex items-center mb-2">
                        <Field type="radio" name="fearMedical" value="no" className="mr-2" />
                        No
                    </label>
                    <ErrorMessage name="fearMedical" component="div" className="text-red-600" />
                </div>
            </div>
            )}

            {/* Prone to Fainting */}
            {!shouldHideFields && (
            <div className="flex flex-col items-center mt-10">
                <label className="block mb-2 text-left w-full sm:w-3/4">Are you prone to fainting? <span className="text-red-600 ml-1">*</span> </label>
                <div className="w-full sm:w-3/4"> 
                    <label className="flex items-center mb-2">
                        <Field type="radio" name="proneToFainting" value="yes" className="mr-2" />
                        Yes
                    </label>
                    <label className="flex items-center mb-2">
                        <Field type="radio" name="proneToFainting" value="no" className="mr-2" />
                        No
                    </label>
                    <label className="flex items-center mb-2">
                        <Field type="radio" name="proneToFainting" value="maybe" className="mr-2" />
                        Maybe
                    </label>
                    <ErrorMessage name="proneToFainting" component="div" className="text-red-600" />
                </div>
            </div>
            )}

            {/* Medical Conditions Field */}
            {!shouldHideFields && (
            <div className="flex flex-col items-center mt-10">
            <label className="block mb-2 text-left w-full sm:w-3/4">
                Do you have any medical conditions? (Select all that apply) <span className="text-red-600 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-3/4">
                {[
                'None',
                'Diabetes',
                'Epilepsy',
                'Heart Disease',
                'Heavy Bleeding',
                'Hepatitis',
                'HIV/AIDS',
                'Keloiding',
                'Pregnancy'
                ].map((condition) => (
                <label key={condition} className="flex items-center">
                    <Field type="checkbox" name="medicalConditions" value={condition} className="mr-2" />
                    {condition}
                </label>
                ))}
            </div>
            <ErrorMessage name="medicalConditions" component="div" className="text-red-600 w-full sm:w-3/4" />
            </div>
            )}

            
             {/* Accutane or HRT */}
        {!shouldHideFields && (
          <div className="flex flex-col items-center mt-10">
          <label className="block mb-2 text-left w-full sm:w-3/4">
            Have you in the past six months, or will you be in the following six months, be taking Accutane or Hormone Replacement Therapy (HRT)? 
            <span className="text-red-600 ml-1">*</span>
          </label>
          <div className="flex flex-col items-start w-full sm:w-3/4">
            <label className="flex items-center mb-2">
              <Field
                type="radio"
                name="accutaneOrHRT"
                value="yes"
                className="mr-2"
                onChange={() => {
                  setFieldValue('accutaneOrHRT', 'yes');
                }}
              />
              Yes
            </label>
            <label className="flex items-center mb-2">
              <Field
                type="radio"
                name="accutaneOrHRT"
                value="no"
                className="mr-2"
                onChange={() => {
                  setFieldValue('accutaneOrHRT', 'no');
                  setFieldValue('takingAccutaneOrHRT', null); // Reset checkbox state if "no"
                }}
              />
              No
            </label>
            <ErrorMessage name="accutaneOrHRT" component="div" className="text-red-600" />
          </div>
  
          {values.accutaneOrHRT === 'yes' && (
            <div className="mt-4 w-full sm:w-3/4 text-center">
              <p className="text-blue-500 hover:underline mb-2">
                <a
                  href="https://www.lynnloheide.com/post/accutane-and-piercings"
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Please review our Accutane and HRT guidelines
                </a>.
              </p>
            </div>
          )}
  
          {values.accutaneOrHRT === 'yes' && (
            <div className="flex flex-col items-start w-full sm:w-3/4 mt-4">
              <label className="flex items-center mb-2">
                <Field
                  type="checkbox"
                  name="takingAccutaneOrHRT"
                  className="mr-2"
                />
                I confirm that I will be taking Accutane or HRT. <span className="text-red-600 ml-1">*</span>
              </label>
              <ErrorMessage name="takingAccutaneOrHRT" component="div" className="text-red-600" />
            </div>
          )}
        </div>
        )}

            {/* On Antibiotics */}
            {!shouldHideFields && (
            <div className="flex flex-col items-center mt-10">
            <label className="block mb-2 text-left w-full sm:w-3/4">Are you currently on Antibiotics? <span className="text-red-600 ml-1">*</span> </label>
                <div className="flex flex-col items-start w-full sm:w-3/4">
                <label className="flex items-center mb-2">
                    <Field type="radio" name="onAntibiotics" value="yes" className="mr-2" />
                    Yes
                </label>
                <label className="flex items-center mb-2">
                    <Field type="radio" name="onAntibiotics" value="no" className="mr-2" />
                    No
                </label>
                <ErrorMessage name="onAntibiotics" component="div" className="text-red-600 " />
                </div>
            </div>
            )}

            {/* Submerge Agreement */}
            {!shouldHideFields && (
            <div className="flex flex-col items-center mt-10">
            <div className="flex items-center w-full sm:w-3/4">
                <Field type="checkbox" name="submergeAgreement" className="mr-2" />
                <label htmlFor="submergeAgreement" className="text-left">
                I will not submerge my piercing in any water for 3 months after getting pierced. <span className="text-red-600 ml-1">*</span>
                </label>
            </div>
            <ErrorMessage name="submergeAgreement" component="div" className="text-red-600 w-full sm:w-3/4 mt-2" />
            </div>
            )}


           

            {/* Terms and Conditions Text Field */}
            <div className="flex flex-col items-center mt-10">
            <label className="block mb-2 text-left w-full sm:w-3/4">Terms and Conditions:</label>
            <Field
                as="textarea"
                name="termsAndConditionsText"
                className="border border-gray-300 p-2 rounded w-full sm:w-3/4"
                rows="5"
                readOnly
                defaultValue={`This is to certify that I, the above signed and undersigned, do give my permission to be pierced at INK FX TATTOO AND PIERCING LTD. I have answered all the above questions truthfully. I am fully aware of and take full responsibility for the healing and daily aftercare procedures. As well as the face that there is a chance of an adverse reaction or infection even when all appropriate sanitary and professional measures were taken by the above-named business, and they shall not be liable for such an event.
                `}
            />
            </div>


           {/* Terms and Conditions Checkbox */}
            <div className="flex flex-col items-center mt-10">
                <div className="flex items-center w-full sm:w-3/4">
                    <Field type="checkbox" name="termsAndConditions" className="mr-2" />
                    <label htmlFor="termsAndConditions" className="text-left">
                        I accept the Terms and Conditions. <span className="text-red-600 ml-1">*</span>
                    </label>
                </div>
                <ErrorMessage name="termsAndConditions" component="div" className="text-red-600 w-full sm:w-3/4 mt-2" />
            </div>



            <div>
                <SignatureField onChange={signature => setFieldValue('signature', signature)} />
            </div>
           

            {/* Previous page Button */}
            <div className="flex flex-col sm:flex-row justify-between mt-6 mx-4 sm:mx-auto sm:w-3/4">
            <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mb-2 sm:mb-0 sm:mr-4"
            onClick={() => navigate('/service-selection')}
            >
            Previous
            </button>

              

            <button
                type="button"
                className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
                onClick={() => {
                    validateForm().then((errors) => {
                        console.log('Errors:', errors); // Log errors
                
                        if (Object.keys(errors).length > 0) {
                            // Mark all fields as touched dynamically
                            setTouched(
                                Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
                            );
                
                            // Log first error field for debugging
                            const firstErrorField = Object.keys(errors)[0];
                            console.log('First error field:', firstErrorField);
                
                            // General scroll logic for the first error
                            const firstErrorElement = formRef.current?.querySelector(
                                `[name="${firstErrorField}"]`
                            );
                
                            if (firstErrorElement) {
                                console.log('First error element:', firstErrorElement); // Check if element exists
                                firstErrorElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center',
                                });
                                
                            }
                
                            // Custom handling for photo1
                            if (firstErrorField === 'photo1') {
                                const cameraElement = formRef.current?.querySelector(`[name="photo1"]`);
                                if (cameraElement) {
                                    cameraElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                                const cameraSection = videoRef1.current || canvasRef1.current;
                                if (cameraSection) {
                                    cameraSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }
                
                            // Custom handling for photo2
                            if (firstErrorField === 'photo2') {
                                const cameraElement = formRef.current?.querySelector(`[name="photo2"]`);
                                if (cameraElement) {
                                    cameraElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                                const cameraSection = videoRef2.current || canvasRef2.current;
                                if (cameraSection) {
                                    cameraSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }
                        }
                
                        if (Object.keys(errors).length === 0) {
                            submitForm(); // Only submit if no errors
                        }
                    });
                }}
                
                
                  
                  
            >
                Submit
            </button>
            </div>
          </Form>
        </FormLayout>
      )}
    </Formik>
  );
};

export default ClientInformation;