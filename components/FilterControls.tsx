
import React from 'react';

interface FilterControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    levels: string[];
    selectedLevel: string;
    setSelectedLevel: (level: string) => void;
    artists: string[];
    selectedArtist: string;
    setSelectedArtist: (artist: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
    searchTerm, setSearchTerm, 
    levels, selectedLevel, setSelectedLevel,
    artists, selectedArtist, setSelectedArtist
}) => {
    const commonSelectStyles = "w-full bg-[#F4F7FE] border border-[#DDE2E7] rounded-[10px] py-3 px-4 text-[#2C2F3B] focus:outline-none focus:ring-2 focus:ring-[#4A47E0]/50 transition-shadow duration-200 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5em_1.5em]";
    const selectBgImage = {backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`};

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="lg:col-span-2 search-wrapper">
                <label htmlFor="search-bar" className="block text-sm font-medium text-[#6A6D7C] mb-1">Search (use ',' for multiple terms)</label>
                <input 
                    type="text" 
                    id="search-bar" 
                    placeholder="e.g., 'simple past, relationships'" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#F4F7FE] border border-[#DDE2E7] rounded-[10px] py-3 px-4 text-[#2C2F3B] focus:outline-none focus:ring-2 focus:ring-[#4A47E0]/50 transition-shadow duration-200"
                />
            </div>
            <div className="filter-wrapper">
                <label htmlFor="level-filter" className="block text-sm font-medium text-[#6A6D7C] mb-1">CEFR Level</label>
                <select 
                    id="level-filter"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className={commonSelectStyles}
                    style={selectBgImage}
                >
                   {levels.map(level => (
                       <option key={level} value={level}>
                           {level === 'all' ? 'All Levels' : level}
                       </option>
                   ))}
                </select>
            </div>
            <div className="filter-wrapper">
                <label htmlFor="artist-filter" className="block text-sm font-medium text-[#6A6D7C] mb-1">Artist</label>
                <select 
                    id="artist-filter"
                    value={selectedArtist}
                    onChange={(e) => setSelectedArtist(e.target.value)}
                    className={commonSelectStyles}
                    style={selectBgImage}
                >
                    {artists.map(artist => (
                        <option key={artist} value={artist}>
                            {artist === 'all' ? 'All Artists' : artist}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};

export default FilterControls;
