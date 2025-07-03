import React, {useEffect, useState} from 'react';

/**
 * ErrorToggle component to show/hide error details.
 * @param label - The label for the toggle button, indicating what error details are being shown/hidden.
 * @param initialOpen - (optional) Whether the toggle should be open by default.
 * @param onToggle - (optional) Callback to expose the open state to parent.
 */
export function ErrorToggle({label, initialOpen = false, onToggle}: {
    label: string,
    initialOpen?: boolean,
    onToggle?: (open: boolean) => void
}) {
    const [open, setOpen] = useState(initialOpen);
    useEffect(() => {
        if (onToggle) onToggle(open);
    }, [open, onToggle]);
    return (
        <button
            className={`w-full cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400 bg-white text-red-700 font-semibold text-base shadow-sm focus:outline-none transition-all duration-200 group ${open ? 'ring-2 ring-red-300' : ''}`}
            style={{
                borderColor: open ? '#dc2626' : '#f87171',
                color: open ? '#b91c1c' : '#dc2626',
                background: open ? '#fff1f2' : '#fff',
                boxShadow: open ? '0 2px 8px 0 rgba(220,38,38,0.08)' : undefined,
                transition: 'all 0.2s cubic-bezier(.4,0,.2,1)'
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#fee2e2';
                (e.currentTarget as HTMLElement).style.borderColor = '#dc2626';
                (e.currentTarget as HTMLElement).style.color = '#b91c1c';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = open ? '#fff1f2' : '#fff';
                (e.currentTarget as HTMLElement).style.borderColor = open ? '#dc2626' : '#f87171';
                (e.currentTarget as HTMLElement).style.color = open ? '#b91c1c' : '#dc2626';
            }}
            onClick={() => setOpen(o => !o)}
            type="button"
            aria-expanded={open}
        >
            <span
                style={{
                    display: 'inline-block',
                    transition: 'transform 0.3s',
                    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: open ? '#dc2626' : '#f87171',
                }}
            >
                ▶
            </span>
            <span className="font-mono tracking-tight text-base">
                {label}
            </span>
            <span
                className="ml-2 text-xs font-normal text-red-400 group-hover:text-red-600 transition-colors duration-200">{open ? '(click to hide)' : '(click to show)'}
            </span>
        </button>
    );
}
