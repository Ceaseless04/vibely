import { SidebarProps } from '@/types';

export default function Sidebar({ chats, selectedChatId, onSelect }: SidebarProps) {
  // New palette: bg-[#22223b] (sidebar), accent-[#c9ada7], text-[#f2e9e4], selected-[#9a8c98], chat bg-[#4a4e69]
  return (
    <div className="w-64 bg-[#22223b] border-r border-[#c9ada7] overflow-y-auto flex flex-col h-full">
      <div className="p-6 font-bold text-[#c9ada7] text-xl border-b border-[#c9ada7]">Chats</div>
      <div className="flex-1 flex flex-col gap-2 p-4">
        {chats.length === 0 ? (
          <div className="text-[#9a8c98] text-center mt-8">No chats yet</div>
        ) : (
          chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition font-medium shadow-sm border border-transparent
                ${selectedChatId === chat.id
                  ? 'bg-[#9a8c98] text-[#22223b] border-[#c9ada7]'
                  : 'bg-[#22223b] text-[#f2e9e4] hover:bg-[#4a4e69] hover:text-[#c9ada7]'}
              `}
            >
              {chat.title}
            </button>
          ))
        )}
      </div>
      <div className="p-4 text-xs text-[#9a8c98] text-center border-t border-[#c9ada7]">Vibely &copy; 2025</div>
    </div>
  );
}
