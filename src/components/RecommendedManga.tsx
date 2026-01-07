'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function RecommendedManga() {
  // 这些数据在实际应用中应该从API或数据库获取
  const recommendedManga = [
    {
      id: 1,
      title: "Solo Max-Level Newbie",
      coverImage: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?q=80&w=1170&auto=format&fit=crop",
      rating: 9.9,
      latestChapter: 205,
      genres: ["Action", "Adventure", "Fantasy"]
    },
    {
      id: 2,
      title: "Regressor Instruction Manual",
      coverImage: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=1170&auto=format&fit=crop",
      rating: 10,
      latestChapter: 134,
      genres: ["Action", "Adventure", "Fantasy"]
    },
    {
      id: 3,
      title: "The Hero Returns",
      coverImage: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=1170&auto=format&fit=crop",
      rating: 9.9,
      latestChapter: 122,
      genres: ["Action", "Adventure", "Fantasy"]
    },
    {
      id: 4,
      title: "Return of the Disaster-Class Hero",
      coverImage: "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=1170&auto=format&fit=crop",
      rating: 9.9,
      latestChapter: 126,
      genres: ["Action", "Adventure", "Fantasy"]
    }
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Manga</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedManga.map((manga) => (
            <Link key={manga.id} href={`/manga/${manga.id}`} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:scale-[1.02]">
                <div className="relative h-64 w-full">
                  <Image
                    src={manga.coverImage}
                    alt={manga.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{manga.title}</h3>
                  
                  <div className="mt-2 flex items-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="ml-1 text-sm font-bold text-gray-900">{manga.rating}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-600">Ch. {manga.latestChapter}</span>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {manga.genres.slice(0, 2).map((genre, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                        {genre}
                      </span>
                    ))}
                    {manga.genres.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                        +{manga.genres.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
