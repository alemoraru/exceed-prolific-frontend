import {useEffect} from "react";

/**
 * Hook to log cheating-related events (tab/window switching, copy/paste/cut) to the backend.
 * Only active while the survey is running.
 * @param active - Whether cheating detection should be active
 */
export function useCheatingDetection(active: boolean) {
    useEffect(() => {
        if (!active) return;

        const participant_id = localStorage.getItem('participant_id');
        if (!participant_id) return;

        const logEvent = (event_type: string) => {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/events/event`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    participant_id,
                    event_type: event_type,
                    timestamp: Date.now().toString(),
                })
            }).then(r =>
                r.ok ? null : console.error(`Failed to log event: ${event_type}`, r.statusText)
            );
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') logEvent('tab_switch');
        };
        const handleBlur = () => logEvent('window_blur');
        const handleCopy = () => logEvent('copy');
        const handlePaste = () => logEvent('paste');
        const handleCut = () => logEvent('cut');
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('cut', handleCut);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('cut', handleCut);
        };
    }, [active]);
}
