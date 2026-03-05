import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <h1 className="text-7xl font-extrabold text-[#1de4bf] mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8 text-center">
        This link's already been nuked. Or you just suck at typing.
      </p>
      <div className="relative inline-flex items-center justify-center gap-4 group">
        <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
        <Link
          to="/"
          className="group relative inline-flex items-center justify-center text-sm rounded-xl bg-gray-900 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
        >
          Go Home
          <svg
            aria-hidden="true"
            viewBox="0 0 10 10"
            height={10}
            width={10}
            fill="none"
            className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
          >
            <path
              d="M0 5h7"
              className="transition opacity-0 group-hover:opacity-100"
            />
            <path
              d="M1 1l4 4-4 4"
              className="transition group-hover:translate-x-[3px]"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
