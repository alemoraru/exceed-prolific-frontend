import React, {useEffect, useState} from "react";
import Alert from '@mui/material/Alert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * SubmissionError component displays an error message when there is an issue with form submission.
 * Uses MUI Alert for improved accessibility and appearance.
 * Once shown, it will disappear automatically after 10 seconds.
 */
export function SubmissionError({message}: { message: string }) {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 10000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!visible) return null;

    return (
        <Alert
            severity="error"
            icon={<ErrorOutlineIcon fontSize="medium" sx={{color: '#d32f2f'}}/>}
            className="my-4 animate-fade-in w-full"
            sx={{
                alignItems: 'flex-start',
                fontSize: 16,
                bgcolor: '#fff0f1',
                color: '#b71c1c',
                border: '1px solid #f44336',
                boxShadow: 3,
                borderRadius: 3,
                py: 2.5,
                px: 3,
                maxWidth: '100%',
                mx: 0,
                mb: 2,
                '& .MuiAlert-icon': {
                    mt: 0.5,
                },
                '& .MuiAlert-message': {
                    width: '100%',
                },
            }}
            role="alert"
            aria-live="assertive"
        >
            <span className="font-bold text-base mr-2">Submission Error:</span>
            <span className="text-sm text-red-900 leading-snug">{message}</span>
        </Alert>
    );
}
