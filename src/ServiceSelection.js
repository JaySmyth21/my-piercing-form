import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import FormLayout from './FormLayout';

const ServiceSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPiercer = location.state?.piercer || 'Other';

  const piercings = {
    'Ear - Lobe': [
      'Lobe Piercing (Single) (13+)', 'Lobe Piercing (Pair) (13+)', 
      'Lobe Piercing (Single) (5-12)', 'Lobe Piercing (Pair) (5-12)'
    ],
    'Ear - Cartilage': [
      'Helix Piercing (13+)', 'Hidden Helix Piercing (16+)', 'Forward Helix Piercing (16+)', 
      'Flat Piercing (16+)', 'Conch Piercing (14+)', 'Tragus Piercing (14+)', 'Rook Piercing (14+)',
      'Daith Piercing (16+)', 'Orbital Piercing (16+)', 'Industrial Piercing (16+)'  
    ],
    'Face': [
      'Nostril Piercing (12+)', 'Septum Piercing (12+)', 'Mantis (Forward Facing Nostrils) Piercing (16+)', 
      'Eyebrow Piercing (16+)', 'Bridge Piercing (16+)'
    ],
    'Oral': [
      'Labret Piercing (16+)', 'Vertical Labret Piercing (16+)', 'Philtrum/Medusa Piercing (16+)', 'Vertical Philtrum (Jestrum) Piercing (16+)',
      'Madonna Piercing (16+)', 'Monroe Piercing (16+)', 'Cheek Piercing (16+)', 'Dahlia Piercing (16+)', 'Snake Bites Piercing (16+)', 'Angel Bites Piercing (16+)',
      'Inverted Fangs Piercing (16+)', 'Tongue Piercing (16+)', 'Tongue Web Piercing (16+)',
    ],
    
    'Body': [
        'Navel Piercing (13+)','Nipple Piercing (Single) (16+)', 'Nipple Piercing (Pair) (16+)', 'Dermal Piercing (16+)', 
      ],
    
    'Below the Belt': [
        'VCH Piercing (18+)', 'Christina Piercing (18+)', 'Labia Piercing (18+)',   
    ]
  };

  const jewelryChanges = [
    'Jewelry Change (One Change)', 'Jewelry Change (Two Changes)', 
    'Jewelry Change (Three Changes)', 'Jewelry Change (Four Changes)', 
    'Jewelry Change (Five Changes)', 'Jewelry Change (Six Changes)', 
    'Jewelry Change (Seven Changes)', 'Jewelry Change (Eight Changes)'
  ];

  let jewelryDownsizes = [
    'Jewelry Downsize (One Downsize)', 'Jewelry Downsize (Two Downsize)', 
    'Jewelry Downsize (Three Downsize)', 'Jewelry Downsize (Four Downsize)', 
    'Jewelry Downsize (Five Downsize)', 'Jewelry Downsize (Six Downsize)', 
    'Jewelry Downsize (Seven Downsize)', 'Jewelry Downsize (Eight Downsize)', 

  ];

  let other = [
    'Embeded Jewelry', 'Jewelry Removal (General)', 'Jewelry Removal (Dermal)', 'General Checkup',
    'Cheek/Dahlia Consultation', 'I lost a part of my jewelry', 'Shop Jewelry'
  ];

  let specificOther = [ 'Embeded Jewelry', 'Jewelry Removal (General)', 'Jewelry Removal (Dermal)', 'General Checkup' ];

  if (selectedPiercer === 'Jennica') {
    other = other.filter(service => 
      !['Jewelry Removal (Dermal)', 'Cheek/Dahlia Consultation', 'Embeded Jewelry'].includes(service));
  }

  const validationSchema = Yup.object({
    services: Yup.array()
      .min(1, 'Please select at least one service.')
      .max(3, 'You cannot select more than 3 services.')
  });

  const validateForm = (values) => {
    const errors = {};
    const nonPiercingSelected = values.services.some(service =>
      jewelryChanges.includes(service) || jewelryDownsizes.includes(service) || specificOther.includes(service)
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
      // Pass the selected services to ClientInformation
      navigate('/client-info', { state: { selectedServices: values.services } });
    }}
  >
  
  {({ errors, touched, values, setFieldValue}) => {
  const isMaxServicesSelected = values.services.length >= 3;
  const lostJewelrySelected = values.services.includes('I lost a part of my jewelry');
  const shopJewelrySelected = values.services.includes('Shop Jewelry');
  
  // Check if any other checkbox is selected, excluding "I lost a part of my jewelry" and "Shop Jewelry"
  const otherCheckboxSelected = values.services.some(service => 
    !['I lost a part of my jewelry', 'Shop Jewelry'].includes(service)
  );

  // Disable all services if "I lost a part of my jewelry" or "Shop Jewelry" is selected, except those two
  const disableOtherServices = lostJewelrySelected || shopJewelrySelected;

  // Disable "I lost a part of my jewelry" and "Shop Jewelry" if any other service is selected
  const disableSpecialServices = otherCheckboxSelected;

  // Handler to allow toggling of "I lost a part of my jewelry" or "Shop Jewelry" checkboxes
  const handleServiceSelection = (service) => {
    if (values.services.includes(service)) {
      setFieldValue('services', values.services.filter(s => s !== service)); // Unselect if selected
    } else {
      setFieldValue('services', [...values.services, service]); // Select if not selected
    }
  };

    return (
      <FormLayout>
        <Form>
          <h2 className="text-3xl font-bold mb-6 text-center">Select Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            
            {/* First Column: Ear - Lobe, Ear - Cartilage, Face */}
            <div className="col-span-1 px-2">
              <h3 className="text-xl font-semibold mb-4">Piercings</h3>
              <div className="space-y-6">
                {Object.entries(piercings).slice(0, 3).map(([category, services]) => (
                  <div key={category}>
                    <h4 className="text-lg font-semibold mb-2">{category}</h4>
                    <div className="space-y-2">
                      {services.map((service, index) => (
                        <label key={index} className="flex items-center">
                          <Field
                            type="checkbox"
                            name="services"
                            value={service}
                            className="mr-2"
                            disabled={ disableOtherServices ||
                              (isMaxServicesSelected && !values.services.includes(service)) ||
                              (selectedPiercer === 'Jennica' &&
                                !['Conch Piercing (14+)', 'Helix Piercing (13+)', 'Hidden Helix Piercing (16+)'].includes(service))
                            }
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Column: Oral, Body, Below the Belt */}
            <div className="col-span-1 px-2">
              <div className="mt-10"></div>
              <div className="space-y-6">
                {Object.entries(piercings).slice(3).map(([category, services]) => (
                  <div key={category}>
                    <h4 className="text-lg font-semibold mb-2">{category}</h4>
                    <div className="space-y-2">
                      {services.map((service, index) => (
                        <label key={index} className="flex items-center">
                          <Field
                            type="checkbox"
                            name="services"
                            value={service}
                            className="mr-2"
                            disabled={ disableOtherServices ||
                              (isMaxServicesSelected && !values.services.includes(service)) ||
                              (selectedPiercer === 'Jennica' &&
                                !['Conch Piercing (14+)', 'Helix Piercing (13+)', 'Hidden Helix Piercing (16+)'].includes(service))
                            }
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Third Column: Jewelry Changes and Downsizes */}
            <div className="col-span-1 px-2">
                <div className="mt-10"></div>
              <div className="space-y-6">
                <h4 className="text-lg font-semibold mb-2">Jewelry Changes</h4>
                <div className="space-y-2">
                  {jewelryChanges.map((service, index) => (
                    <label key={index} className="flex items-center">
                      <Field
                        type="checkbox"
                        name="services"
                        value={service}
                        className="mr-2"
                        disabled={disableOtherServices || (isMaxServicesSelected && !values.services.includes(service))}
                      />
                      {service}
                    </label>
                  ))}
                </div>

                <h4 className="text-lg font-semibold mb-2">Jewelry Downsizing</h4>
                <div className="space-y-2">
                  {jewelryDownsizes.map((service, index) => (
                    <label key={index} className="flex items-center">
                      <Field
                        type="checkbox"
                        name="services"
                        value={service}
                        className="mr-2"
                        disabled={disableOtherServices || (isMaxServicesSelected && !values.services.includes(service))}
                      />
                      {service}
                    </label>
                  ))}
                </div>

                <h4 className="text-lg font-semibold mb-2">Other</h4>
                <div className="space-y-2">
                  {other.map((service, index) => (
                    <label key={index} className="flex items-center">
                    <Field
                    type="checkbox"
                    name="services"
                    value={service}
                    className="mr-2"
                    disabled={
                        // Disable "I lost a part of my jewelry" if "Shop Jewelry" is selected
                        (values.services.includes('Shop Jewelry') && service === 'I lost a part of my jewelry') ||

                        // Disable "Shop Jewelry" if "I lost a part of my jewelry" is selected
                        (values.services.includes('I lost a part of my jewelry') && service === 'Shop Jewelry') ||

                        // If either service is selected, disable all other services except these two
                        (lostJewelrySelected || shopJewelrySelected) && 
                        !['I lost a part of my jewelry', 'Shop Jewelry'].includes(service) ||

                        // Disable other services if any other service is selected
                        (otherCheckboxSelected && ['I lost a part of my jewelry', 'Shop Jewelry'].includes(service)) ||

                        // Disable other services if the maximum limit is reached
                        (isMaxServicesSelected && !values.services.includes(service)) ||

                        // For services in the other array, disable if the limit of selected services from this array has been reached
                        (other.includes(service) && 
                            values.services.filter(s => other.includes(s)).length >= 3 &&
                            !values.services.includes(service))
                    }
                    onChange={() => handleServiceSelection(service)}
                />

                      {service}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Show text box if non-piercing service is selected */}
          {values.services.some(service => jewelryChanges.includes(service) || jewelryDownsizes.includes(service) || specificOther.includes(service)) && (
            <div className="mt-4">
              <label className="block text-lg font-medium">
                Specify which piercing is getting changed, downsized, removed, etc.
              </label>
              <Field
                type="text"
                name="selectedPiercing"
                placeholder="Specify each piercing"
                className="mt-2 p-2 border border-gray-300 rounded w-full"
              />
              <ErrorMessage name="selectedPiercing" component="div" className="text-red-500 mt-2" />
            </div>
          )}

            {/* Conditionally show text box if "I lost a part of my jewelry" is selected */}
            {lostJewelrySelected && (
            <div className="mt-4">
                <label className="block text-lg font-medium">Please describe the missing jewelry part</label>
                <Field
                type="text"
                name="lostJewelryDetails"
                placeholder="E.g., I lost the ball or backing"
                className="mt-2 p-2 border border-gray-300 rounded w-full"
                />
                <ErrorMessage name="lostJewelryDetails" component="div" className="text-red-500 mt-2" />
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
              onClick={() => navigate('/')}
            >
              Previous
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Next
            </button>
          </div>
        </Form>
      </FormLayout>
    );
  }}
</Formik>
  );
};

export default ServiceSelection;
