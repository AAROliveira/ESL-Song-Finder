
import React from 'react';
import { Song } from '../types';

interface SongCardProps {
    song: Song;
    onSongClick: (song: Song) => void;
}

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-[#E8E7FB] text-[#4A47E0] text-xs font-medium mr-2 mb-2 px-3 py-1 rounded-full">
        {children}
    </span>
);

const SongCard: React.FC<SongCardProps> = ({ song, onSongClick }) => {
    const createTags = (tagString: string | undefined) => {
        if (!tagString) return null;
        return tagString.split(/,|–/)
            .map(t => t.trim())
            .filter(Boolean)
            .map((tag, index) => <Tag key={`${tag}-${index}`}>{tag}</Tag>);
    };

    const grammarTags = createTags(song.grammar);
    const vocabTags = createTags(song.vocab);
    const themeTags = createTags(song.theme);

    return (
        <div 
            onClick={() => onSongClick(song)}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSongClick(song)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${song.title} by ${song.artist}`}
            className="cursor-pointer bg-white border border-[#EAEBEE] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1.5 hover:shadow-xl flex flex-col p-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A47E0]"
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#2C2F3B] pr-2">{song.title}</h3>
                    <span className="flex-shrink-0 bg-[#4A47E0] text-white text-xs font-bold px-3 py-1 rounded-full">{song.level || 'N/A'}</span>
                </div>
                <h4 className="text-md font-medium text-[#6A6D7C] mb-4">{song.artist}</h4>

                {grammarTags && grammarTags.length > 0 && (
                    <div className="mb-4">
                        <h5 className="font-semibold text-sm text-[#2C2F3B] mb-2">Grammar Points</h5>
                        <div>{grammarTags}</div>
                    </div>
                )}

                {vocabTags && vocabTags.length > 0 && (
                    <div className="mb-4">
                        <h5 className="font-semibold text-sm text-[#2C2F3B] mb-2">Vocabulary Themes</h5>
                        <div>{vocabTags}</div>
                    </div>
                )}

                {themeTags && themeTags.length > 0 && (
                     <div className="mb-4">
                        <h5 className="font-semibold text-sm text-[#2C2F3B] mb-2">Themes</h5>
                        <div>{themeTags}</div>
                    </div>
                )}
            </div>
            
            {song.youtubeLink ? (
                <a 
                    href={song.youtubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="block text-center w-full mt-6 bg-[#4A47E0] text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-[#3A37B0] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A47E0]"
                >
                    Watch on YouTube
                </a>
            ) : (
                 <span className="block text-center w-full mt-6 bg-gray-200 text-gray-500 font-semibold py-2.5 px-4 rounded-lg cursor-not-allowed">
                    No Link Available
                </span>
            )}
        </div>
    );
};

export default SongCard;
