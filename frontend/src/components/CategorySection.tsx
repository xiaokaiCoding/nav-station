interface Bookmark {
  id: number;
  title: string;
  url: string;
  description: string;
  icon: string;
}

interface Props {
  category: {
    id: number;
    name: string;
    icon: string;
    bookmarks: Bookmark[];
  };
}

export default function CategorySection({ category }: Props) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">{category.icon}</span>
        {category.name}
        <span className="text-sm font-normal text-gray-400">({category.bookmarks.length})</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {category.bookmarks.map(bm => (
          <a
            key={bm.id}
            href={bm.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition border border-gray-100 group"
          >
            <div className="w-12 h-12 flex items-center justify-center mb-2 bg-gray-100 rounded-full overflow-hidden">
              {bm.icon ? (
                <img src={bm.icon} alt="" className="w-8 h-8 object-contain" onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.textContent = bm.title.charAt(0);
                }} />
              ) : (
                <span className="text-xl font-medium text-gray-500">{bm.title.charAt(0)}</span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 truncate w-full text-center group-hover:text-blue-500">
              {bm.title}
            </span>
            {bm.description && (
              <span className="text-xs text-gray-400 truncate w-full text-center mt-1 hidden sm:block">
                {bm.description}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
