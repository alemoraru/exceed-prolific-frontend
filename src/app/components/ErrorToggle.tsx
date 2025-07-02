import React, {useState} from 'react';

/**
 * ErrorToggle component to show/hide error details.
 * @param label - The label for the toggle button, indicating what error details are being shown/hidden.
 * @param children - The content to display when the toggle is open, typically error details or messages.
 * @param initialOpen - (optional) Whether the toggle should be open by default.
 */
export function ErrorToggle({label, children, initialOpen = false}: {
    label: string,
    children: React.ReactNode,
    initialOpen?: boolean
}) {
    const [open, setOpen] = useState(initialOpen);
    return (
        <div className="mt-4">
            <button
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400 bg-white text-red-700 font-semibold text-base shadow-sm focus:outline-none transition-all duration-200 group ${open ? 'ring-2 ring-red-300' : ''}`}
                style={{
                    borderColor: open ? '#dc2626' : '#f87171', // Tailwind red-600 or red-400
                    color: open ? '#b91c1c' : '#dc2626', // Tailwind red-700 or red-600
                    background: open ? '#fff1f2' : '#fff', // Tailwind red-50 or white
                    boxShadow: open ? '0 2px 8px 0 rgba(220,38,38,0.08)' : undefined,
                    transition: 'all 0.2s cubic-bezier(.4,0,.2,1)'
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#fee2e2'; // Tailwind red-100
                    (e.currentTarget as HTMLElement).style.borderColor = '#dc2626'; // Tailwind red-600
                    (e.currentTarget as HTMLElement).style.color = '#b91c1c'; // Tailwind red-700
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
                        color: open ? '#dc2626' : '#f87171', // Tailwind red-600 or red-400
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
            <div
                className={`transition-all duration-400 overflow-hidden ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                style={{borderRadius: open ? '0 0 0.75rem 0.75rem' : undefined}}
            >
                {open && <div className="mt-3">{children}</div>}
            </div>
        </div>
    );
}
