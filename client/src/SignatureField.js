import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureField = ({ onChange }) => {
    const signatureRef = useRef({});
    const [canvasSize, setCanvasSize] = useState({ width: 400, height: 200 });

    const clearSignature = () => {
        signatureRef.current.clear();
        onChange(''); // Clear the signature state in the parent form
    };

    // Automatically save the signature when drawing ends
    const handleEnd = () => {
        const signatureData = signatureRef.current.toDataURL();
        onChange(signatureData); // Send the signature data back to the parent form
    };

    // Update canvas size based on the window size
    useEffect(() => {
        const updateCanvasSize = () => {
            const parent = document.querySelector('.signature-container'); // Get the parent container
            if (parent) {
                const parentWidth = parent.clientWidth; // Get the container width
                const aspectRatio = 2; // Width to height ratio (e.g., 2:1)
                const newWidth = parentWidth; // Use full width of the container
                const newHeight = newWidth / aspectRatio; // Calculate height based on aspect ratio
                setCanvasSize({ width: newWidth, height: newHeight });
            }
        };

        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize(); // Call it initially to set the right size

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

    return (
        <div className="flex flex-col items-center mt-10 w-full">
            <label className="block mb-2 text-left w-full sm:w-3/4">Client Signature: <span className="text-red-600 ml-1">*</span></label>
            <div className="signature-container w-full sm:w-3/4"> {/* Full width container */}
                <SignatureCanvas
                    ref={signatureRef}
                    penColor="black"
                    canvasProps={{
                        width: canvasSize.width,
                        height: canvasSize.height,
                        className: 'border border-gray-300 p-2 rounded w-full'
                    }}
                    onEnd={handleEnd}
                />
            </div>
            
            <div className="signature-controls mt-2 w-full sm:w-3/4 flex justify-center">
                <button
                    type="button"
                    onClick={clearSignature}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SignatureField;
