
import React from 'react';
import { Song } from '../types';
import SongCard from './SongCard';

interface SongGridProps {
    songs: Song[];
    isLoading: boolean;
    error: string | null;
    onSongClick: (song: Song) => void;
}

const SongGrid: React.FC<SongGridProps> = ({ songs, isLoading, error, onSongClick }) => {
    
    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (isLoading) {
        return <div className="text-center py-10 text-[#6A6D7C]">Loading songs...</div>;
    }

    if (songs.length === 0) {
        return <div className="text-center py-10 text-[#6A6D7C]">
            <p className="text-lg font-semibold">No songs found!</p>
            <p>Try adjusting your search or filter.</p>
        </div>;
    }

    return (
        <section id="results-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {songs.map(song => (
                <SongCard key={song.id} song={song} onSongClick={onSongClick} />
            ))}
        </section>
    );
};

export default SongGrid;
