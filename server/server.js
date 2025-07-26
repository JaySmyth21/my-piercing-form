console.log("Axios path:", require.resolve("axios"));
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require("dotenv").config();
const fieldMap = require("./waitwhileFieldMap");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors({ origin: "https://your-frontend.vercel.app" }));



// ✅ Convert formData into WaitWhile dataFields
const buildDataFields = (formData = {}) => {
  return Object.entries(fieldMap).reduce((acc, [key, fieldId]) => {
    const value = formData[key];
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      acc.push({
        id: fieldId,
        values: Array.isArray(value) ? value : [String(value)],
      });
    }
    return acc;
  }, []);
};

// 🧠 API endpoint: GET /location-metadata
app.get("/api/location-metadata", async (req, res) => {
  try {
    const response = await axios.get("https://api.waitwhile.com/v2/locations?limit=20", {
      headers: {
        Authorization: `Bearer ${process.env.WAITWHILE_API_KEY}`
      }
    });

    res.json(response.data); // Send the full location array back
  } catch (error) {
    console.error("❌ Failed to fetch location metadata:", error.message);
    res.status(500).json({ error: "Failed to fetch location metadata" });
  }
});

// ✅ Fetch all active services from WaitWhile
const fetchServiceMap = async () => {
  const response = await axios.get("https://api.waitwhile.com/v2/services?limit=100", {
    headers: {
      Authorization: `Bearer ${process.env.WAITWHILE_API_KEY}`,
    },
  });

  const activeServices = response.data.results.filter(s => s.isActive);
  const serviceMap = {};
  activeServices.forEach(service => {
    serviceMap[service.name] = service.id;
  });

  return serviceMap;
};

// ✅ Convert service names to service IDs
const mapServiceNamesToIds = async (names = []) => {
  const serviceMap = await fetchServiceMap();
  return names.map(name => serviceMap[name]).filter(Boolean);
};

// 🧠 API endpoint: GET /piercers
app.get('/api/piercers', async (req, res) => {
  try {
    const response = await axios.get('https://api.waitwhile.com/v2/resources', {
      headers: {
        Authorization: `Bearer ${process.env.WAITWHILE_API_KEY}`,
      },
    });
    res.json({ results: response.data.results });
  } catch (err) {
    console.error('❌ Error fetching piercers:', err.message);
    res.status(500).json({ error: 'Failed to fetch piercers' });
  }
});

// 🧠 API endpoint: GET /location-status
app.get('/api/location-status', async (req, res) => {
  try {
    const response = await axios.get('https://api.waitwhile.com/v2/location-status?limit=20', {
      headers: {
        Authorization: `Bearer ${process.env.WAITWHILE_API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch location status' });
  }
});

// 🧠 API endpoint: GET /services
app.get('/api/services', async (req, res) => {
  try {
    const response = await axios.get('https://api.waitwhile.com/v2/services?limit=100', {
      headers: {
        Authorization: `Bearer ${process.env.WAITWHILE_API_KEY}`,
      },
    });
    const filtered = response.data.results.filter(service => service.isActive);
    res.json(filtered);
  } catch (err) {
    console.error('❌ Error fetching services:', err.message);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// ✅ API endpoint: POST /create-visit
app.post("/api/create-visit", async (req, res) => {
  const formData = req.body;
  console.log("🔎 Received formData:", formData);

  if (!formData || typeof formData !== "object") {
    return res.status(400).json({ error: "Missing or invalid form data" });
  }

  const dataFields = buildDataFields(formData);
  const serviceIds = await mapServiceNamesToIds(formData.selectedServices || []);

  try {
    const response = await axios.post("https://api.waitwhile.com/v2/visits", {
      locationId: formData.locationId,
      name: formData.name || formData.preferredName,
      phone: formData.phoneNumber,
      email: formData.email,
      serviceIds,
      dataFields,
      state: "WAITING",
      policyConsent: formData.termsAndConditions,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.WAITWHILE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Error creating visit:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create visit" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});