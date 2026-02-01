export default function SearchPanel() {
  return (
    <div className="min-h-dvh w-full max-w-80 border-r border-r-gray-800 px-4 py-9 fixed">
      <h1 className="text-xl font-bold text-white mb-5">Tìm kiếm</h1>
      <input
        type="search"
        className="w-full h-10 rounded-full bg-[#25292e] text-white placeholder:text-gray-400 px-3"
        placeholder="Tìm kiếm..."
      />
    </div>
  );
}
