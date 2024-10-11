import React, { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FormLayout from './FormLayout'; // Import the layout

const ClientInformation = () => {
  const navigate = useNavigate();

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
    occupation: Yup.string().required('Occupation/Sport is required'),
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
    .when('accutaneOrHRT', (accutaneOrHRT, schema) => {
      // Check if accutaneOrHRT is 'yes'
      return accutaneOrHRT === 'yes'
        ? schema.oneOf([true], 'You must confirm that you will be taking Accutane or HRT.')
        : schema.notRequired();
    }),
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
        accutaneOrHRT: '', // Ensure this matches your form's field name
        takingAccutaneOrHRT: false,
    }}
    validationSchema={validationSchema}
    onSubmit={(values) => {
        console.log("Submitting values: ", values);
        navigate('/confirmation');
    }}
    >
      {({ errors, touched, setFieldValue }) => (
        <FormLayout>
          <Form>
            <h2 className="text-3xl font-bold mb-6 text-center">Client Information</h2>
            <div className="flex flex-col space-y-4">
              {[
                { name: 'preferredName', label: 'Preferred Name or First Name' },
                { name: 'lastName', label: 'Last Name' },
                { name: 'pronunciation', label: 'Pronunciation' },
                { name: 'pronouns', label: 'Pronouns' },
                { name: 'phoneNumber', label: 'Phone Number' },
                { name: 'email', label: 'Email' },
                { name: 'address', label: 'Address' },
                { name: 'city', label: 'City' },
                { name: 'postalCode', label: 'Postal Code' },
                { name: 'age', label: 'Age' },
                { name: 'occupation', label: 'Occupation/Sport' },
              ].map(({ name, label }) => (
                <div key={name} className="flex flex-col items-center">
                  <label className="block mb-2 text-left w-3/4">{label}</label>
                  <Field
                    type={name === 'age' ? 'number' : 'text'}
                    name={name}
                    className="border border-gray-300 p-2 rounded w-3/4"
                  />
                  <ErrorMessage name={name} component="div" className="text-red-500 mt-1" />
                </div>
              ))}
            </div>

            {/* First Camera Access Section */}
            <div className="flex flex-col items-center mt-4">
              <label className="block mb-2 text-left w-3/4">Take a Picture (Field 1)</label>
              <video ref={videoRef1} autoPlay className="border rounded w-3/4" style={{ display: imagePreview1 ? 'none' : 'block' }} />
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
              <canvas ref={canvasRef1} style={{ display: 'none' }} />
              <ErrorMessage name="photo1" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Image Preview for First Capture */}
            {imagePreview1 && (
              <div className="mt-4 flex flex-col items-center">
                <h3 className="text-lg font-medium">Preview (Field 1):</h3>
                <img src={imagePreview1} alt="Preview" className="mt-2 border rounded" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            )}

            {/* Second Camera Access Section */}
            <div className="flex flex-col items-center mt-4">
              <label className="block mb-2 text-left w-3/4">Take a Picture (Field 2)</label>
              <video ref={videoRef2} autoPlay className="border rounded w-3/4" style={{ display: imagePreview2 ? 'none' : 'block' }} />
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
            </div>

            {/* Image Preview for Second Capture */}
            {imagePreview2 && (
              <div className="mt-4 flex flex-col items-center">
                <h3 className="text-lg font-medium">Preview (Field 2):</h3>
                <img src={imagePreview2} alt="Preview" className="mt-2 border rounded" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            )}

            {/* Age of Consent Checkbox */}
            <div className="flex items-center mt-20 ml-44"> {/* Changed to flex */}
            <Field type="checkbox" name="consent" className="mr-2" />
            <label htmlFor="consent" className="text-left">
                I am of the age of consent as noted above or older or have parental consent for this service piercing
            </label>
            </div>
            <ErrorMessage name="consent" component="div" className="text-red-500 mt-1 text-center" />


            {/* Food Allergies Field */}
            <div className="flex flex-col items-center mt-10">
              <label className="block mb-2 text-left w-3/4">Do you have any food allergies? If yes, please specify:</label>
              <Field
                as="textarea"
                name="foodAllergies"
                className="border border-gray-300 p-2 rounded w-3/4"
                rows="3"
              />
            </div>

            {/* Reacted negatively to metal jewelry */}
            <div className="flex flex-col items-left mt-6 ml-44">
            <label className="block mb-2">Have you ever reacted negatively to metal jewelry?</label>
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

            {/* Fear of medical type procedures */}
            <div className="flex flex-col items-left mt-6 ml-44">
            <label className="block mb-2">Do you have any fear of medical type procedures?</label>
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

            {/* Prone to Fainting */}
            <div className="flex flex-col items-left mt-6 ml-44">
            <label className="block mb-2">Are you prone to fainting?</label>
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

            {/* Medical Conditions Checkbox Field */}
            <div className="flex flex-col items-left mt-6 ml-44">
            <label className="block mb-2">Do you have any medical conditions? (Select all that apply)</label>
            <div className="grid grid-cols-2 gap-4 w-3/4">
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
            <ErrorMessage name="medicalConditions" component="div" className="text-red-600" />
            </div>
            
            <div className="flex flex-col items-left mt-6 ml-44">
                        <label className="block mb-2">
                            Have you in the past six months, or will you be in the following six months be taking Accutane or Hormone Replacement Therapy (HRT)?
                        </label>
                        <label className="flex items-center mb-2">
                            <Field
                                type="radio"
                                name="accutaneOrHRT"
                                value="yes"
                                className="mr-2"
                                onChange={() => {
                                    setFieldValue('accutaneOrHRT', 'yes');
                                    setTakingAccutaneOrHRT(true);
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
                                    setTakingAccutaneOrHRT(false);
                                }}
                            />
                            No
                        </label>
                        {touched.accutaneOrHRT && errors.accutaneOrHRT ? (
                        <div className="text-red-500">{errors.accutaneOrHRT}</div>
                        ) : null}
                    </div>
                                
                    {/* Conditional Checkbox for Accutane or HRT */}
                    {takingAccutaneOrHRT && (
                        <div className="flex items-left mt-4 ml-44">
                            <label className="flex items-center mb-2">
                                <Field
                                    type="checkbox"
                                    name="takingAccutaneOrHRT"
                                    className="mr-2"
                                />
                                I confirm that I will be taking Accutane or HRT.
                            </label>
                            
                        </div>
                    )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => navigate('/service-selection')}
              >
                Previous
              </button>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
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
