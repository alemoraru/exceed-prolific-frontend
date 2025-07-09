import React from "react";
import CircularProgress from '@mui/material/CircularProgress';

/**
 * SubmittingLoader component displays a loading spinner with a message indicating that the code is being submitted for verification.
 * @param text - Optional text to display alongside the spinner, defaults to "Submitting your code for verification...".
 */
export function SubmittingLoader({text = "Submitting your code for verification..."}: { text?: string }) {
    return (
        <div
            className="flex flex-row items-center justify-center gap-3 text-blue-700 my-4 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm w-full mx-auto animate-fade-in"
            style={{maxWidth: '100%'}}
            role="status" aria-live="polite" aria-busy="true">
            <CircularProgress
                size={36}
                thickness={4.5}
                sx={{color: '#2563eb'}}
                aria-label="Loading, please wait"
                disableShrink
            />
            <span className="font-medium text-base tracking-tight text-left mt-0">{text}</span>
        </div>
    );
}
