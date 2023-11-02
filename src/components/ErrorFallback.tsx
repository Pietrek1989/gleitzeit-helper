import { Link } from "react-router-dom";

const ErrorFallback: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="text-center h-screen p-4 flex justify-center flex-col relative ">
      <img
        src="/cat-7705903_1280.png"
        alt="Sad Cat"
        className="absolute -z-10  left-20 h-screen overflow-hidden"
      />
      <div className="bg-white w-auto mx-auto rounded p-5 opacity-80 ">
        <h1>Oh noes.</h1>
        <h2 className="text-xl">Something went wrong ;( </h2>
        <p>{message}</p>
        <Link to="/" className="text-blue-500 hover:underline">
          click here to return to the main page.
        </Link>
      </div>
    </div>
  );
};

export default ErrorFallback;
