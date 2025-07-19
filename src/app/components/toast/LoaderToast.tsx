import React, {useState, useEffect} from "react";
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * SubmittingLoader component displays a loading spinner with a message indicating that the code is being submitted for verification.
 * @param text - Optional text to display alongside the spinner, defaults to "Submitting your code for verification...".
 */
export function LoaderToast({text = "Submitting your code for verification..."}: { text?: string }) {
    const [open, setOpen] = useState(true);
    const [showLongWait, setShowLongWait] = useState(false);

    // Show the "Still working, please wait..." message after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLongWait(true);
        }, 8000); // 8 seconds
        return () => clearTimeout(timer);
    }, []);

    // Close the snackbar when the user clicks the close button
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            sx={{zIndex: 9999}}
            onClose={handleClose}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: showLongWait ? 8 : 0,
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
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                    <CircularProgress
                        size={32}
                        thickness={4.5}
                        sx={{color: '#2563eb'}}
                        aria-label="Loading, please wait"
                        disableShrink
                    />
                    <span style={{marginLeft: 4}}>{text}</span>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        size="small"
                        sx={{marginLeft: 'auto', color: '#2563eb'}}
                    >
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </div>
                {showLongWait && (
                    <div style={{textAlign: 'center', color: '#d97706', fontSize: 14}}>
                        Still working, please wait…
                    </div>
                )}
            </div>
        </Snackbar>
    );
}
