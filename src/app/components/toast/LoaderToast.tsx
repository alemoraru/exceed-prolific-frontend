import React, {useState} from "react";
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * SubmittingLoader component displays a loading spinner with a message indicating that the code is being submitted for verification.
 * @param text - Optional text to display alongside the spinner, defaults to "Submitting your code for verification...".
 */
export function LoaderToast({text = "Submitting your code for verification..."}: { text?: string }) {
    const [open] = useState(true);
    return (
        <Snackbar
            open={open}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            sx={{zIndex: 9999}}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: '#fff',
                    color: '#2563eb',
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                    border: '1.5px solid #2563eb',
                    padding: '18px 32px',
                    minWidth: 360,
                    maxWidth: '95vw',
                    fontWeight: 500,
                    fontSize: 16,
                }}
                role="status" aria-live="polite" aria-busy="true"
            >
                <CircularProgress
                    size={32}
                    thickness={4.5}
                    sx={{color: '#2563eb'}}
                    aria-label="Loading, please wait"
                    disableShrink
                />
                <span style={{marginLeft: 4}}>{text}</span>
            </div>
        </Snackbar>
    );
}
