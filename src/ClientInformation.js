import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FormLayout from './FormLayout'; // Import the layout

const ClientInformation = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    preferredName: Yup.string().required('Preferred Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    pronunciation: Yup.string(),
    pronouns: Yup.string(),
    phoneNumber: Yup.string().required('Phone Number is required').matches(/^[0-9]+$/, "Phone Number should contain only digits"),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal Code is required'),
    age: Yup.number().required('Age is required').positive('Age must be a positive number').integer('Age must be an integer'),
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
              { name: "preferredName", label: "Preferred Name or First Name" },
              { name: "lastName", label: "Last Name" },
              { name: "pronunciation", label: "Pronunciation" },
              { name: "pronouns", label: "Pronouns" },
              { name: "phoneNumber", label: "Phone Number" },
              { name: "email", label: "Email" },
              { name: "address", label: "Address" },
              { name: "city", label: "City" },
              { name: "postalCode", label: "Postal Code" },
              { name: "age", label: "Age" },
              { name: "occupation", label: "Occupation/Sport" },
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
