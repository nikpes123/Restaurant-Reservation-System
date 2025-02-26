export default function HomePage() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75"
        style={{ backgroundImage: "url('/homepage.jpg')" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <button className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all">
          Get Started
        </button>
      </div>
    </div>
  );
}
