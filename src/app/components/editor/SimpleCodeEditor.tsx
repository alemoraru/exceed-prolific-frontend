'use client';

import React, {useRef, useEffect, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';

/**
 * CodeEditor component provides a code editor interface using CodeMirror.
 * @param code - The initial code to display in the editor.
 * @param onChange - Optional callback function to handle changes in the code.
 * @param readOnly - Optional flag to make the editor read-only (default is false).
 */
export const SimpleCodeEditor = (
    {
        code,
        onChange,
        readOnly = false,
    }: {
        code: string;
        onChange?: (code: string) => void;
        readOnly?: boolean;
    }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            const el = containerRef.current;
            if (el) {
                setShowScroll(el.scrollHeight > el.clientHeight + 2);
            }
        };
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [code]);

    return (
        <div
            ref={containerRef}
            className="w-full border rounded-xl overflow-hidden shadow-sm text-left bg-gray-50 relative group focus-within:ring-2 focus-within:ring-blue-400"
        >
            <CodeMirror
                value={code}
                height="auto"
                maxHeight="600px"
                extensions={[python()]}
                readOnly={readOnly}
                theme="light"
                onChange={(val) => onChange?.(val)}
                style={{fontSize: '1.08rem', lineHeight: '1.7', padding: '1.5rem 1rem'}}
            />
            {showScroll && (
                <div
                    className="absolute top-2 right-4 text-xs text-gray-400 opacity-100 transition-opacity duration-200 select-none pointer-events-none">
                    Scroll for more
                </div>
            )}
        </div>
    );
};
