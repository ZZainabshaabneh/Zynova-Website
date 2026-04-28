import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange }) => {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
