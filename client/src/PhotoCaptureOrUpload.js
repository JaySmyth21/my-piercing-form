import React, { useRef, useState } from 'react';
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const PhotoCaptureOrUpload = ({ label, fieldName, imagePreview, setImagePreview, setFieldValue }) => {
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOpened, setCameraOpened] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const getVideo = async () => {
  if (!isMobile) {
    alert('Camera access is only supported on mobile devices.');
    return;
  }

  try {
    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;
    setCameraOpened(true);
    setPhotoCaptured(false);
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
    setFieldValue(fieldName, imageData);
    setPhotoCaptured(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setCameraOpened(false);
    }
  };

  const retakePicture = () => {
    setImagePreview(null);
    setPhotoCaptured(false);
    setFieldValue(fieldName, '');
    getVideo();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFieldValue(fieldName, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <label className="block mb-2 text-left w-full sm:w-3/4">
        {label}<span className="text-red-600 ml-1">*</span>
      </label>

      <video
        ref={videoRef}
        autoPlay
        className="border rounded w-full sm:w-3/4"
        style={{ display: imagePreview ? 'none' : 'block' }}
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Captured"
          className="border rounded w-full sm:w-3/4"
        />
      )}

      {!cameraOpened && !photoCaptured && (
        <div className="flex flex-col items-center space-y-2 mt-2">
          <button
            type="button"
            onClick={getVideo}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Open Camera
          </button>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="text-sm"
          />
        </div>
      )}

      {cameraOpened && !photoCaptured && (
        <button
          type="button"
          onClick={takePicture}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
        >
          Capture Photo
        </button>
      )}

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
  );
};

export default PhotoCaptureOrUpload;