import React from 'react';

/**
 * ExperienceSlider component allows users to select their years of experience with Python.
 * @param value - The current value of the slider (years of experience).
 * @param onChange - Callback function to handle changes in the slider value.
 */
export function ExperienceSlider({value, onChange}: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="mb-8 w-full">
            <label className="block font-semibold mb-2 text-gray-800 text-base">
                How many years of experience do you have with Python?
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <input
                    type="range"
                    min={0}
                    max={35}
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 rounded-lg appearance-none bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    aria-label="Python experience in years"
                />
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        max={35}
                        value={value}
                        onChange={e => {
                            const v = Number(e.target.value);
                            if (!isNaN(v) && v >= 0 && v <= 50) onChange(v);
                        }}
                        className="w-16 text-center font-mono border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                        aria-label="Python experience in years (number input)"
                    />
                    <span className="text-gray-500">years</span>
                </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                <span>0</span>
                <span>35</span>
            </div>
        </div>
    );
}
