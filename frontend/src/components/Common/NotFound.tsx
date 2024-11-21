import { Link } from "@tanstack/react-router"

const NotFound = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
          <h2 className="text-6xl font-semibold text-gray-800 mb-4 text-center">
            404
          </h2>
          <p className="text-gray-600 text-center text-xl">Oops!</p>
          <p className="text-gray-600 mb-6 text-center text-xl">
            Page not found.
          </p>
          <Link
            to="/"
            className="mt-4 text-center w-full bg-secondary text-secondary-foreground block py-2 rounded-md"
          >
            Go back
          </Link>
        </div>
      </div>
    </>
  )
}

export default NotFound
