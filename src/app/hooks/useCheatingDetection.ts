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
                    event_type: event_type
                })
            }).then(r =>
                r.ok ? null : console.error(`Failed to log event: ${event_type}`, r.statusText)
            );
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') logEvent('tab_switch');
        };
        let suppressNextBlur = false;

        // Prevent default actions for copy, paste, and cut events
        const blockEvent = (e: ClipboardEvent | KeyboardEvent | InputEvent, type: string) => {
            e.preventDefault();
            e.returnValue = false;
            suppressNextBlur = true;
            alert('Copy-pasting is not allowed during the survey. This will be logged and you will be disqualified if you continue.');
            logEvent(type);
        };

        const handleCopy = (e: ClipboardEvent) => blockEvent(e, 'copy');
        const handlePaste = (e: ClipboardEvent) => blockEvent(e, 'paste');
        const handleCut = (e: ClipboardEvent) => blockEvent(e, 'cut');
        // Block keyboard shortcuts for copy/paste/cut
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
                blockEvent(e, e.key === 'c' ? 'copy' : e.key === 'v' ? 'paste' : 'cut');
            }
        };
        // Block beforeinput for paste/cut
        const handleBeforeInput = (e: InputEvent) => {
            if (e.inputType === 'insertFromPaste' || e.inputType === 'deleteByCut') {
                blockEvent(e, e.inputType === 'insertFromPaste' ? 'paste' : 'cut');
            }
        };

        const handleBlur = () => {
            if (suppressNextBlur) {
                suppressNextBlur = false;
                return;
            }
            logEvent('window_blur');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('cut', handleCut);
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('beforeinput', handleBeforeInput, true);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('cut', handleCut);
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('beforeinput', handleBeforeInput, true);
        };
    }, [active]);
}
