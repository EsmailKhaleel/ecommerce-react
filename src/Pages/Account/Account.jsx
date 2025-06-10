import { useAuth } from "../../Context/AuthProvider";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import Spinner from "../../Components/Spinner";

function Account() {
    const { user } = useAuth();

    if (!user || user === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <Spinner/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Account Details</h2>

                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-semibold">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <FaUserCircle />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {user.displayName || user.email.split('@')[0]}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">User ID: {user.uid}</p>
                    </div>
                </div>

                {/* User Info */}
                <div className="mt-6 space-y-4">
                    <UserInfo 
                        label="Email" 
                        value={user.email} 
                        icon={<FaEnvelope />} 
                    />
                    <UserInfo 
                        label="Account Created" 
                        value={formatDate(user.metadata.creationTime)} 
                        icon={<FaCalendarAlt />} 
                    />
                    <UserInfo 
                        label="Last Sign In" 
                        value={formatDate(user.metadata.lastSignInTime)} 
                        icon={<FaCalendarAlt />} 
                    />
                    <UserInfo 
                        label="Email Verified" 
                        value={user.emailVerified ? "Verified" : "Not Verified"} 
                        icon={<FaCheckCircle />} 
                        isVerified={user.emailVerified}
                    />
                </div>
            </div>
        </div>
    );
}

const UserInfo = ({ label, value, icon, isVerified }) => (
    <div className="flex items-center space-x-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
        <div className="text-primary dark:text-secondary text-lg">{icon}</div>
        <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className={`text-md font-semibold ${isVerified ? "text-green-600" : "text-gray-900 dark:text-white"}`}>
                {value}
            </p>
        </div>
    </div>
);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default Account;
