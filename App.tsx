import React, { useState, useEffect, useMemo } from 'react';
import { Song } from './types';
import Header from './components/Header';
import FilterControls from './components/FilterControls';
import SongGrid from './components/SongGrid';
import SongDetailModal from './components/SongDetailModal';

// Your app is now pointing to your live Google Sheet API
const SONGS_DATA_URL = 'https://script.google.com/macros/s/AKfycbxRd_UZpjwnFaGAjqtSsSIKb7wGjMUxUsaG3owqVRMtLiD8yEKfrseUZM64YNTbWZJR6g/exec';
const FALLBACK_DATA_URL = '/songs.json';


function App() {
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedArtist, setSelectedArtist] = useState('all');
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSongs = async () => {
            setIsLoading(true);
            setError(null);
            
            // Helper to clean and sanitize data from any source
            const cleanData = (data: any[]): Song[] => {
                return data.map((song, index) => ({
                    id: song.id || `fallback-${index}`,
                    title: song.title || 'No Title',
                    artist: song.artist || 'Unknown Artist',
                    level: song.level || '',
                    grammar: song.grammar || '',
                    vocab: song.vocab || '',
                    theme: song.theme || '',
                    youtubeLink: song.youtubeLink || '',
                    notes: song.notes || ''
                }));
            }

            try {
                const response = await fetch(SONGS_DATA_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAllSongs(cleanData(data));
            } catch (e) {
                console.error("Live URL failed, attempting fallback:", e);
                setError(`Could not load from live data. Attempting to load local backup...`);
                
                // Try fallback if the live URL failed
                try {
                    const fallbackResponse = await fetch(FALLBACK_DATA_URL);
                    if (!fallbackResponse.ok) {
                        throw new Error(`Fallback HTTP error! status: ${fallbackResponse.status}`);
                    }
                    const fallbackData = await fallbackResponse.json();
                    setAllSongs(cleanData(fallbackData));
                    setError(null); // Clear the error as fallback was successful
                } catch (fallbackError) {
                    console.error("Fallback fetch error:", fallbackError);
                    setError('Failed to load songs from live API and local fallback. Please check your connection and the app configuration.');
                }

            } finally {
                setIsLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const artists = useMemo(() => {
        const uniqueArtists = [...new Set(allSongs.map(song => song.artist))];
        return ['all', ...uniqueArtists.sort()];
    }, [allSongs]);

    const levels = useMemo(() => {
        const uniqueLevels = [...new Set(allSongs.map(song => song.level).filter(Boolean))];
        return ['all', ...uniqueLevels.sort()];
    }, [allSongs]);

    const filteredSongs = useMemo(() => {
        const searchTerms = searchTerm.toLowerCase().split(',').map(t => t.trim()).filter(Boolean);

        return allSongs.filter(song => {
            const levelMatch = selectedLevel === 'all' || song.level === selectedLevel;
            const artistMatch = selectedArtist === 'all' || song.artist === selectedArtist;

            const searchMatch = searchTerms.length === 0 || searchTerms.every(term => 
                (song.title && song.title.toLowerCase().includes(term)) ||
                (song.artist && song.artist.toLowerCase().includes(term)) ||
                (song.grammar && song.grammar.toLowerCase().includes(term)) ||
                (song.vocab && song.vocab.toLowerCase().includes(term)) ||
                (song.theme && song.theme.toLowerCase().includes(term))
            );
            
            return levelMatch && artistMatch && searchMatch;
        });
    }, [allSongs, searchTerm, selectedLevel, selectedArtist]);

    return (
        <>
            <div className="min-h-screen text-[#2C2F3B] p-4 sm:p-6 lg:p-8">
                <Header />
                <main className="max-w-7xl mx-auto mt-8 p-6 sm:p-8 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.07)]">
                    <FilterControls 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        levels={levels}
                        selectedLevel={selectedLevel} 
                        setSelectedLevel={setSelectedLevel}
                        artists={artists}
                        selectedArtist={selectedArtist}
                        setSelectedArtist={setSelectedArtist}
                    />
                    <SongGrid 
                        songs={filteredSongs} 
                        isLoading={isLoading} 
                        error={error}
                        onSongClick={(song) => setSelectedSong(song)}
                    />
                </main>
            </div>
            {selectedSong && (
                <SongDetailModal 
                    song={selectedSong} 
                    onClose={() => setSelectedSong(null)} 
                />
            )}
        </>
    );
}

export default App;