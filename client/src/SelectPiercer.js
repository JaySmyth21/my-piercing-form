import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const SelectPiercer = () => {
  const [availablePiercers, setAvailablePiercers] = useState([]);
  const [selectedPiercer, setSelectedPiercer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [waitTimes, setWaitTimes] = useState({});

  

  useEffect(() => {
    // ⏳ Fetch Wait Times
  const fetchWaitTimes = async () => {
  try {
    const res = await axios.get('https://my-piercing-form.onrender.com/api/location-status');
    const nested = res.data.results?.[0]?.waitByResource;

    if (!nested) {
      console.warn('⚠️ No waitByResource data found');
      return;
    }

    const flattened = {};
    for (const groupId in nested) {
      const group = nested[groupId];
      for (const resourceId in group) {
        if (resourceId !== 'firstAvailable') {
          const seconds = group[resourceId];
          if (typeof seconds === 'number') {
            flattened[resourceId] = Math.round(seconds / 60); // convert to minutes
          }
        }
      }
    }

    setWaitTimes(flattened);
  } catch (error) {
    console.error('❌ Error fetching wait times:', error.message);
  }
};


  const fetchPiercers = async () => {
  try {
    const response = await axios.get('https://my-piercing-form.onrender.com/api/piercers');
    console.log('✅ WaitWhile response:', response.data);

    const todayKey = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(); // e.g. 'fri'
    const todayDateKey = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // e.g. '20250725'

    const workingToday = response.data.results
      .filter((piercer) => {
        const hasDateOverride = piercer.hoursByDate?.[todayDateKey] !== undefined;
        const dateStatus = piercer.hoursByDate?.[todayDateKey]?.isOpen;
        const weeklyStatus = piercer.hours?.[todayKey]?.isOpen;

        const isOpenToday = hasDateOverride ? dateStatus === true : weeklyStatus === true;

        return (
          !piercer.isCategory &&
          piercer.name &&
          piercer.isActive &&
          isOpenToday
        );
      })
      .map((piercer) => ({
        id: piercer.id,
        name: piercer.name,
        description: piercer.description,
        hours: piercer.hours,
        photoUrl: piercer.photoUrl,
        supportedServiceIds: piercer.supportedServiceIds,
      }));

    setAvailablePiercers(workingToday);
  } catch (error) {
    console.error('❌ Error fetching piercers:', error);
  } finally {
    setLoading(false);
  }
};

fetchPiercers();
fetchWaitTimes();
}, []);


   const handleNext = () => {
  if (selectedPiercer) {
    navigate('/service-selection', { state: { piercer: selectedPiercer } });
  }
};

  return (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Select Your Piercer</h2>

      {loading ? (
        <p className="text-center text-gray-600">Checking who's available today...</p>
      ) : availablePiercers.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {availablePiercers.map((piercer) => {
  const wait = waitTimes?.[piercer.id];
  return (
    <label
      key={piercer.name}
      className="flex items-start space-x-4 bg-gray-100 p-4 rounded shadow"
    >
      <input
        type="radio"
        name="piercer"
        value={piercer.name}
        onChange={() => setSelectedPiercer(piercer)}
        className="mt-6"
      />
      <img
        src={piercer.photoUrl}
        alt={piercer.name}
        className="w-14 h-14 rounded-full object-cover border border-gray-300"
      />
      <div>
        <p className="font-semibold">{piercer.name}</p>
        <p className="text-sm text-gray-700">
          {piercer.description || 'No description provided.'}
        </p>
        {wait !== undefined && (
          <p className="text-sm text-blue-600 mt-1">
            Estimated wait: {wait === 0 ? 'No wait' : `${wait} minute${wait > 1 ? 's' : ''}`}
          </p>
        )}
      </div>
    </label>
  );
})}
        </div>
      ) : (
        <p className="text-center text-red-500">No piercers are working today.</p>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedPiercer}
          className={`py-2 px-4 rounded ${
            selectedPiercer
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
}

export default SelectPiercer;
