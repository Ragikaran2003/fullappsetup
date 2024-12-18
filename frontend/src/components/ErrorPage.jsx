

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="bg-red-600 p-6 rounded-full w-48 h-48 flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl font-bold">404</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-400 mb-6">
          Sorry, the page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <a 
          href="/" 
          className="px-6 py-2 bg-red-600 text-white text-lg rounded-lg hover:bg-red-500 transition duration-300"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
