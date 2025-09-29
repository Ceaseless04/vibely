import React from 'react';

interface ShowMapSectionProps {
  eventList: any[];
  onShowMap: () => void;
}

const ShowMapSection: React.FC<ShowMapSectionProps> = ({ eventList, onShowMap }) => {
  if (!eventList.length) return null;
  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="mb-2 text-lg text-[#c9ada7]">Would you like to see these events on a map?</div>
      <button
        className="px-4 py-2 bg-[#9a8c98] text-[#f2e9e4] rounded-lg font-semibold shadow hover:bg-[#c9ada7] hover:text-[#22223b] transition"
        onClick={onShowMap}
      >
        Show Map
      </button>
    </div>
  );
};

export default ShowMapSection;
