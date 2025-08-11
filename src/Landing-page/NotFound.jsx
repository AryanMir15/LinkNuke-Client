import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f6fcff] via-[#ebf9ff] to-[#e4f5fb] px-4">
      <h1 className="text-7xl font-extrabold text-[#1de4bf] mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">
        This link’s already been nuked. Or you just suck at typing.
      </p>
      <Link
        to="/"
        className="bg-[#1de4bf] text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200"
      >
        Go Home
      </Link>
    </div>
  );
}
