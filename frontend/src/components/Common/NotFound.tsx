import { Link } from "@tanstack/react-router";
import { Exclamation } from "nui-react-icons";

const NotFound = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-content1">
                <div className="max-w-md mx-auto text-center">
                    <Exclamation className="w-20 h-20 mx-auto text-danger" />
                    <h1 className="text-3xl font-bold mt-6">Oops! Page Not Found</h1>
                    <p className="text-default-500 mt-4">{`The page you're looking for doesn't exist or has been moved.`}</p>
                    <Link className="bg-primary text-white font-semibold py-2 px-4 rounded mt-6 inline-block" to="/">
                        Go to Home
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotFound;
