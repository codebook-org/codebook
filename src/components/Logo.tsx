import { Book, Terminal } from 'lucide-react';

export default function Logo({
  className = "",
  color = "text-white"
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center w-6 h-6 ${color}`}>
        <Book className="w-6 h-6 stroke-current stroke-[2]" />
        <div className="absolute top-[3px] left-[5.8px] flex items-center justify-center">
          <Terminal className="w-3 h-3 stroke-current stroke-[5]" />
        </div>
      </div>
    </div>
  );
}
