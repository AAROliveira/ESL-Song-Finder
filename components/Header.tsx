
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2F3B]">
                <span role="img" aria-label="music note" className="mr-3">🎵</span>
                ESL Song Finder
            </h1>
            <p className="text-md sm:text-lg text-[#6A6D7C] mt-2">Find the perfect song for your English lesson</p>
        </header>
    );
};

export default Header;
