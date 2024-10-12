// SignatureField.js
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
            const parentWidth = document.querySelector('.signature-container').clientWidth; // Get the container width
            const newWidth = Math.min(parentWidth, 600); // Max width set to 600
            const newHeight = (newWidth * 200) / 400; // Maintain aspect ratio
            setCanvasSize({ width: newWidth, height: newHeight });
        };

        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize(); // Call it initially to set the right size

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

    return (
        <div className="flex flex-col items-center mt-10 w-3/4 mx-auto">
            <label className="block mb-2 text-left">Client Signature:</label>
            <div className="signature-container w-full max-w-[600px]"> {/* Set max width */}
                <SignatureCanvas
                    ref={signatureRef}
                    penColor='black'
                    canvasProps={{
                        width: canvasSize.width,  // Set dynamic width
                        height: canvasSize.height, // Set dynamic height
                        className: 'border border-gray-300 rounded w-full'
                    }}
                    onEnd={handleEnd} // Automatically save on drawing end
                />
            </div>
            <div className="signature-controls mt-2">
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
