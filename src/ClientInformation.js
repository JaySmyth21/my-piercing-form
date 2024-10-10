import React, { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FormLayout from './FormLayout'; // Import the layout

const ClientInformation = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraOpened, setCameraOpened] = useState(false); // Track if the camera is opened
  const [photoCaptured, setPhotoCaptured] = useState(false); // Track if a photo has been captured
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraOpened(true); // Set camera opened state to true
      setPhotoCaptured(false); // Reset photo captured state
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const takePicture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    setImagePreview(imageData);
    setPhotoCaptured(true); // Set photo captured state to true
  };

  const retakePicture = () => {
    setImagePreview(null); // Clear the previous image preview
    setPhotoCaptured(false); // Set photo captured state to false
    setCameraOpened(true); // Reopen the camera
    getVideo(); // Reinitialize the video stream
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
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
        navigate('/confirmation'); // Change to your confirmation route
      }}
    >
      {({ errors, touched }) => (
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

            {/* Camera Access Section */}
            <div className="flex flex-col items-center mt-4">
              <label className="block mb-2 text-left w-3/4">Take a Picture</label>
              <video ref={videoRef} autoPlay className="border rounded w-3/4" style={{ display: imagePreview ? 'none' : 'block' }} />
              {/* Open Camera Button */}
              {!cameraOpened && (
                <button
                  type="button"
                  onClick={getVideo} // Request camera access
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                  Open Camera
                </button>
              )}
              {/* Capture Photo Button */}
              {cameraOpened && !photoCaptured && (
                <button
                  type="button"
                  onClick={takePicture}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                  Capture Photo
                </button>
              )}
              {/* Retake Photo Button */}
              {photoCaptured && (
                <button
                  type="button"
                  onClick={retakePicture}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                >
                  Retake Photo
                </button>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 flex flex-col items-center">
                <h3 className="text-lg font-medium">Preview:</h3>
                <img src={imagePreview} alt="Preview" className="mt-2 border rounded" style={{ maxWidth: '100%', height: 'auto' }} />
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
