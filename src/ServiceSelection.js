import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import FormLayout from './FormLayout';

const ServiceSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPiercer = location.state?.piercer || 'Other';

  const piercings = [
    // List of allowed piercings...
    'Conch Piercing', 'Helix Piercing', 'Hidden Helix Piercing', // Jennica's allowed piercings
    'Angel Fangs Piercing', 'Bridge Piercing', 'Cheek or Dahlia Piercing', 'Christina Piercing',
    'Daith Piercing', 'Dermal Piercing', 'Eyebrow Piercing', 'Fangs Piercing',
    'Flat/Scapha Piercing', 'Forward Helix Piercing', 'Industrial Piercing', 'Jestrum (Vertical Philtrum) Piercing',
    'Labia Piercing', 'Labret Piercing', 'Lobe Piercing (Single)', 'Lobe Piercing (Pair)', 
    'Lobe Piercing Ages 5-12 (Single)', 'Lobe Piercing Ages 5-12 (Pair)', 'Mantis (Forward Facing Nostrils) Piercing',
    'Monroe or Madonna Piercing', 'Navel Piercing', 'Nipple Piercing (Single)', 'Nipple Piercing (Pair)', 
    'Nostril Piercing', 'Orbital Piercing', 'Philtrum/Medusa Piercing', 'Rook Piercing', 'Septum Piercing', 
    'Snake Bites Piercing', 'Tongue Piercing', 'Tongue Web Piercing', 'Tragus Piercing', 'VCH Piercing', 
    'Vertical Labret Piercing'
  ];

  const jewelryChanges = [
    // List of jewelry changes...
    'Jewelry Change (One Change)', 'Jewelry Change (Two Changes)', 'Jewelry Change (Three Changes)',
    'Jewelry Change (Four Changes)', 'Jewelry Change (Five Changes)', 'Jewelry Change (Six Changes)',
    'Jewelry Change (Seven Changes)', 'Jewelry Change (Eight Changes)'
  ];

  let jewelryDownsizes = [
    // List of jewelry downsizing...
    'Jewelry Downsize (One)', 'Jewelry Downsize (Two)', 'Jewelry Downsize (Three)',
    'Jewelry Downsize (Four)', 'Jewelry Downsize (Five)', 'Jewelry Downsize (Six)',
    'Jewelry Downsize (Seven)', 'Jewelry Downsize (Eight)', 'Jewelry Removal (Dermal)', 
    'Jewelry Removal (General)', 'General Checkup', 'Cheek/Dahlia Consultation'
  ];

  if (selectedPiercer === 'Jennica') {
    jewelryDownsizes = jewelryDownsizes.filter(service => !['Jewelry Removal (Dermal)', 'Cheek/Dahlia Consultation'].includes(service));
  }

  const filteredPiercings = selectedPiercer === 'Jennica'
    ? piercings.filter(piercing => ['Conch Piercing', 'Helix Piercing', 'Hidden Helix Piercing'].includes(piercing))
    : piercings;

  const validationSchema = Yup.object({
    services: Yup.array()
      .min(1, 'Please select at least one service.')
      .max(3, 'You cannot select more than 3 services.')
  });

  const validateForm = (values) => {
    const errors = {};
    
    const nonPiercingSelected = values.services.some(service =>
      jewelryChanges.includes(service) || jewelryDownsizes.includes(service)
    );

    if (nonPiercingSelected && !values.selectedPiercing) {
      errors.selectedPiercing = "Please specify which piercing's jewelry is being changed or downsized.";
    }

    return errors;
  };

  return (
    <Formik
      initialValues={{ services: [], selectedPiercing: '' }}
      validationSchema={validationSchema}
      validate={validateForm}
      onSubmit={(values) => {
        console.log('Form values:', values); // Check if this gets logged
        navigate('/client-info'); // Navigate to client info
      }}
    >
      {({ errors, touched, values }) => (
        <FormLayout>
            <Form>
          <h2 className="text-3xl font-bold mb-6 text-center">Select Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Piercings Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Piercings</h3>
              <div className="space-y-2">
                {filteredPiercings.map((service, index) => (
                  <label key={index} className="flex items-center">
                    <Field 
                      type="checkbox" 
                      name="services" 
                      value={service} 
                      className="mr-2" 
                      disabled={values.services.length >= 3 && !values.services.includes(service)}
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>

            {/* Jewelry Changes Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Jewelry Changes</h3>
              <div className="space-y-2">
                {jewelryChanges.map((service, index) => (
                  <label key={index} className="flex items-center">
                    <Field 
                      type="checkbox" 
                      name="services" 
                      value={service} 
                      className="mr-2" 
                      disabled={values.services.length >= 3 && !values.services.includes(service)}
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>

            {/* Jewelry Downsizing Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Jewelry Downsizing</h3>
              <div className="space-y-2">
                {jewelryDownsizes.map((service, index) => (
                  <label key={index} className="flex items-center">
                    <Field 
                      type="checkbox" 
                      name="services" 
                      value={service} 
                      className="mr-2" 
                      disabled={values.services.length >= 3 && !values.services.includes(service)}
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Show text box if non-piercing service is selected */}
          {values.services.some(service => jewelryChanges.includes(service) || jewelryDownsizes.includes(service)) && (
            <div className="mt-4">
              <label className="block text-lg font-medium">Specify which piercing is getting changed, downsized, removed, etc.</label>
              <Field 
                type="text" 
                name="selectedPiercing" 
                placeholder="Specify each piercing" 
                className="mt-2 p-2 border border-gray-300 rounded w-full"
              />
              <ErrorMessage name="selectedPiercing" component="div" className="text-red-500 mt-2" />
            </div>
          )}

          {/* Display errors */}
          {errors.services && touched.services ? (
            <div className="text-red-500 mt-2">{errors.services}</div>
          ) : null}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={() => navigate('/')} // Adjust the previous button if necessary
            >
              Previous
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Next
            </button>
          </div>
          </Form>
        </FormLayout>
      )}
    </Formik>
  );
};

export default ServiceSelection;
