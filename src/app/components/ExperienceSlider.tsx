import React from 'react';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';

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
            <div className="w-full flex flex-col items-center">
                <div className="flex w-full items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">0</span>
                    <span className="text-xs text-gray-500">35</span>
                </div>
                <Slider
                    value={value}
                    onChange={(_, v) => onChange(Number(v))}
                    min={0}
                    max={35}
                    step={1}
                    marks={[{value: 0, label: ''}, {value: 35, label: ''}]}
                    valueLabelDisplay="auto"
                    sx={{width: '100%', color: '#2563eb'}}
                    aria-label="Python experience in years"
                />
                <div className="flex flex-col items-center mt-2">
                    <div className="flex items-baseline gap-1">
                        <input
                            type="number"
                            min={0}
                            max={35}
                            value={value}
                            onChange={e => onChange(Number(e.target.value))}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                            aria-label="Python experience in years (number input)"
                        />
                        <span className="text-gray-700 text-base">years</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
