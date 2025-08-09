import React, {useEffect, useState} from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * SuccessToast component displays a success message when an action is completed successfully.
 * Uses MUI Alert for improved accessibility and appearance.
 * Once shown, it will disappear automatically after 4 seconds.
 * @param message - The success message to display
 */
export function SuccessToast({message}: { message: string }) {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setVisible(true);
        setProgress(100);
        const duration = 5000; // 5 seconds
        let animationFrame: number;
        const start = Date.now();

        function updateProgress() {
            const now = Date.now();
            const elapsedTime = now - start;
            const percent = Math.max(0, 100 - (elapsedTime / duration) * 100);
            setProgress(percent);
            if (elapsedTime < duration) {
                animationFrame = requestAnimationFrame(updateProgress);
            } else {
                setVisible(false);
            }
        }

        animationFrame = requestAnimationFrame(updateProgress);
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [message]);

    if (!visible) return null;

    return (
        <Snackbar
            open={visible}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            sx={{zIndex: 9999}}
            onClose={() => setVisible(false)}
        >
            <Alert
                severity="success"
                icon={<CheckCircleOutlineIcon fontSize="large" sx={{color: '#388e3c'}}/>}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 16,
                    bgcolor: '#e8f5e9',
                    color: '#1b5e20',
                    border: 'none',
                    boxShadow: 4,
                    py: 2.5,
                    px: 3,
                    minWidth: 540,
                    maxWidth: '98vw',
                    pointerEvents: 'auto',
                    position: 'relative',
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                        mt: 0.5,
                        mr: 2,
                    },
                    '& .MuiAlert-message': {
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    },
                }}
                role="status"
                aria-live="polite"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setVisible(false)}
                        sx={{ml: 1, mt: -0.5}}
                    >
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                }
            >
                <span className="text-sm text-green-900 leading-snug">{message}</span>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        height: 4,
                        bgcolor: '#c8e6c9',
                        borderRadius: '0 0 8px 8px',
                        '& .MuiLinearProgress-bar': {bgcolor: '#388e3c'},
                    }}
                />
            </Alert>
        </Snackbar>
    );
}
