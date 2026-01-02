export default function SkeletonLoader({ isDark }) {
  return (
    <div className={`rounded-2xl shadow-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="space-y-6">
        {/* Playlist Details Skeleton */}
        <div>
          <div className={`h-6 w-40 rounded-lg mb-4 skeleton-base ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-5 w-64 rounded-lg mb-2 skeleton-base ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-4 w-48 rounded-lg skeleton-base ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
            >
              <div className={`h-4 w-20 rounded skeleton-base mb-3 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <div className={`h-8 w-12 rounded skeleton-base ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>

        {/* Speed Cards Skeleton */}
        <div className="space-y-4">
          <div className={`h-5 w-32 rounded skeleton-base ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}
              >
                <div className={`h-4 w-10 rounded mb-3 skeleton-base ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                <div className={`h-6 w-16 rounded skeleton-base ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
