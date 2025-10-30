
import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { GoogleGenAI } from '@google/genai';

interface SongDetailModalProps {
    song: Song;
    onClose: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-indigo-300 animate-pulse delay-0"></div>
        <div className="w-3 h-3 rounded-full bg-indigo-300 animate-pulse delay-200"></div>
        <div className="w-3 h-3 rounded-full bg-indigo-300 animate-pulse delay-400"></div>
    </div>
);


const SongDetailModal: React.FC<SongDetailModalProps> = ({ song, onClose }) => {
    const [educationalValue, setEducationalValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateEducationalValue = async () => {
            if (!song) return;

            setIsLoading(true);
            setError(null);
            setEducationalValue('');

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let prompt = `For the song "${song.title}" by ${song.artist}, briefly explain its educational value for an ESL lesson for students at a ${song.level || 'mixed'} CEFR level.`;
                if (song.grammar) {
                    prompt += ` Focus on the grammar points: ${song.grammar}.`;
                }
                if (song.vocab) {
                    prompt += ` And vocabulary themes: ${song.vocab}.`;
                }
                if (song.theme) {
                    prompt += ` Also consider the theme: ${song.theme}.`;
                }
                prompt += ` Present the information clearly in a few short paragraphs for a teacher planning a lesson.`;


                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-pro',
                    contents: prompt,
                    config: {
                        thinkingConfig: {
                            thinkingBudget: 8192
                        }
                    }
                });
                
                setEducationalValue(response.text);

            } catch (err) {
                console.error("Error generating content:", err);
                setError('Failed to get AI-powered insights. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        generateEducationalValue();
    }, [song]);

    // Handle Escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="song-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="song-title" className="text-2xl font-bold text-[#2C2F3B]">{song.title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-[#6A6D7C] hover:text-[#2C2F3B] transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <p className="text-lg text-[#6A6D7C] mb-6">{song.artist}</p>
                
                <div className="bg-[#F4F7FE] p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-[#2C2F3B] mb-3">Educational Insights</h3>
                    {isLoading && (
                         <div className="flex flex-col items-center justify-center p-6 text-center">
                            <LoadingSpinner />
                            <p className="mt-4 text-md font-medium text-[#4A47E0]">AI is thinking...</p>
                            <p className="text-sm text-[#6A6D7C]">Generating lesson ideas for you.</p>
                        </div>
                    )}
                    {error && (
                        <p className="text-red-500">{error}</p>
                    )}
                    {!isLoading && !error && (
                        <div className="text-[#2C2F3B] space-y-3 whitespace-pre-wrap leading-relaxed">
                            {educationalValue}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SongDetailModal;
