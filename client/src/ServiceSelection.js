import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import FormLayout from "./FormLayout";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";

const ServiceSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPiercer = location.state?.piercer;
  console.log("🧩 Selected piercer:", selectedPiercer);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const preselectedServices = location.state?.selectedServices || [];
  const preselectedPiercing = location.state?.piercingDescription || "";
  const [servicesGrouped, setServicesGrouped] = useState({});
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [piercingServiceNames, setPiercingServiceNames] = useState([]);


  const specialServices = ["I lost a part of my jewelry", "Shop Jewelry"];

  const wordToNumber = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await axios.get("https://my-piercing-form.onrender.com/api/services");
      const allServices = res.data;
      


      // ✅ Filter active, non-category services supported by the selected piercer
      const filtered = allServices
  .filter(
    (service) =>
      service.isActive &&
      service.isPublic &&
      !service.isCategory &&
      !service.isActiveBooking && // ❌ exclude booking-only services
      selectedPiercer.supportedServiceIds.includes(service.id)
  )
  .sort((a, b) =>
    (a.displayName || a.name).localeCompare(b.displayName || b.name)
  );


      // ✅ Get all categories
      const categories = allServices.filter((s) => s.isCategory);

      // ✅ Find the "Piercing" category
      const piercingCategory = categories.find((c) =>
        c.name.toLowerCase().includes("piercings")
      );

      // ✅ Get all service names under the "Piercing" category
      const piercingServiceNames = allServices
        .filter((s) => s.parentId === piercingCategory?.id)
        .map((s) => s.name);

      setPiercingServiceNames(piercingServiceNames); // ✅ Store in state

      // ✅ Group services by category
      const grouped = {};
      filtered.forEach((service) => {
        const categoryId = service.parentId || "uncategorized";
        if (!grouped[categoryId]) grouped[categoryId] = [];
        grouped[categoryId].push(service);
      });
      
      setServicesGrouped(grouped);
      setCategories(categories);
      setServices(filtered);
    } catch (err) {
      console.error("❌ Error fetching services:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (selectedPiercer?.supportedServiceIds) {
    fetchServices();
  }
}, [selectedPiercer]);

  

  

  return (
   <Formik
  initialValues={{
    services: preselectedServices,
    selectedPiercing: preselectedPiercing,
  }}
  validationSchema={Yup.object({
    services: Yup.array()
      .min(1, "Please select at least one service.")
      .max(3, "You cannot select more than 3 services."),
    selectedPiercing: Yup.string().when("services", {
      is: (services) =>
        services?.some((s) => !piercingServiceNames.includes(s)),
      then: (schema) =>
        schema.required("Please specify which piercing this is for."),
      otherwise: (schema) => schema.notRequired(),
    }),
  })}
  validateOnChange={true}
  validateOnBlur={true}
  onSubmit={(values) => {
    navigate("/client-info", {
  state: {
    selectedServices: values.services,
    selectedPiercer,
    piercingDescription: values.selectedPiercing,
    piercingServiceNames, // ✅ pass this too
  },
});

  }}
>
  {({ values, setFieldValue, errors, touched }) => {
    const toggleCategory = (categoryId) => {
      setOpenCategories((prev) => ({
        ...prev,
        [categoryId]: !prev[categoryId],
      }));
    };

    const isNonPiercingSelected = values.services.some(
      (s) => !piercingServiceNames.includes(s)
    );

    const handleServiceSelection = (serviceName) => {
      const updated = values.services.includes(serviceName)
        ? values.services.filter((s) => s !== serviceName)
        : [...values.services, serviceName];

      setFieldValue("services", updated, true);
    };

    return (
      <Form className="space-y-6">
        <FormLayout>
          <h2 className="text-2xl font-bold text-center mb-8">
            Select Your Services
          </h2>

          {loading ? (
            <p>Loading services...</p>
          ) : services.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(servicesGrouped).map(
                ([categoryId, servicesInCategory]) => {
                  const category = categories.find(
                    (c) => c.id === categoryId
                  );
                  const categoryName =
                    categoryId === "uncategorized"
                      ? "Other Services"
                      : category?.displayName ||
                        category?.name ||
                        `Unknown (${categoryId})`;

                  const isOpen = openCategories[categoryId];

                  const isSpecialSortCategory = ["jewelry change", "jewelry downsize"].some(
                    (keyword) =>
                      categoryName.toLowerCase().includes(keyword)
                  );

                  const sortedServices = [...servicesInCategory].sort(
                    (a, b) => {
                      if (isSpecialSortCategory) {
                        const extractWord = (str) =>
                          str?.toLowerCase().match(/\((\w+)/)?.[1] || "";
                        const numA =
                          wordToNumber[
                            extractWord(a.displayName || a.name)
                          ] || 0;
                        const numB =
                          wordToNumber[
                            extractWord(b.displayName || b.name)
                          ] || 0;
                        return numA - numB;
                      }
                      return (a.displayName || a.name).localeCompare(
                        b.displayName || b.name
                      );
                    }
                  );

                  return (
                    <div key={categoryId} className="mb-4 border rounded">
  <button
    type="button"
    onClick={() => toggleCategory(categoryId)}
    className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold flex justify-between items-center"
  >
    <span>{categoryName}</span>
    <span>{isOpen ? "−" : "+"}</span>
  </button>

  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="p-4 space-y-4">
          {sortedServices.map((service) => {
            const isChecked = values.services.includes(service.name);

            const disableOtherServices = values.services.some((s) =>
              specialServices.includes(s)
            );
            const disableSpecialServices = values.services.some(
              (s) => !specialServices.includes(s)
            );

            const isDisabled =
              (disableOtherServices && !specialServices.includes(service.name)) ||
              (disableSpecialServices && specialServices.includes(service.name));

            const disableExtra = values.services.length >= 3 && !isChecked;

            return (
              <label
                key={service.id}
                className={`block border rounded p-4 shadow-sm cursor-pointer ${
                  isDisabled || disableExtra
                    ? "opacity-50 pointer-events-none"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  name="services"
                  value={service.name}
                  checked={isChecked}
                  onChange={() => handleServiceSelection(service.name)}
                  disabled={isDisabled || disableExtra}
                  className="mr-2"
                />
                <span className="font-medium">
                  {service.displayName || service.name}
                </span>
                <p className="text-sm text-gray-600">{service.description}</p>
              </label>
            );
          })}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

                  );
                }
              )}

              {touched.services && errors.services && (
                <p className="text-red-600 text-sm">{errors.services}</p>
              )}

              {isNonPiercingSelected && (
                <div className="mt-6">
                  <label
                    htmlFor="selectedPiercing"
                    className="block font-medium"
                  >
                    Please specify which piercing(s) this is for?
                  </label>
                 <Field
                    name="selectedPiercing"
                    type="text"
                    onChange={(e) => {
                      const raw = e.target.value;
                      const clean = DOMPurify.sanitize(raw.trim(), {
                        ALLOWED_TAGS: [],
                        ALLOWED_ATTR: [],
                      });
                      setFieldValue("selectedPiercing", clean);
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  />


                  <ErrorMessage
                    name="selectedPiercing"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
              )}
               <div className="flex flex-col sm:flex-row justify-between mt-6 mx-4 sm:mx-auto sm:w-3/4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 mt-8"
                  onClick={() =>
                    navigate("/select-piercer", {
                      
                    })
                  }
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-8"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p>No services available.</p>
          )}
        </FormLayout>
      </Form>
    );
  }}
</Formik>
  );
};

export default ServiceSelection;
