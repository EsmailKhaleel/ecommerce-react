import useImageUpload from "./useImageUpload";
import PlaceHolder from "../../assets/placeholder.jpg";
import { useAuth } from "../../Context/useAuth";

function ProfileAvatarUploader() {
    const { user } = useAuth();
    const { isUploading, handleImageUpload } = useImageUpload();

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className=" relative group flex flex-col items-center space-y-2">

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    id="imageUpload"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                />

                {/* Main Avatar Container */}
                <label
                    htmlFor="imageUpload"
                    className="relative block w-32 h-32 rounded-full cursor-pointer transform transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                    {/* Gradient Border */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary via-secondary to-background p-0.5">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                            {isUploading ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Uploading...</span>
                                </div>
                            ) : user.image ? (
                                <img
                                    src={user.image}
                                    alt={`${user.name}'s profile`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = PlaceHolder;
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hover Overlay with Camera Icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-full flex items-center justify-center transition-all duration-300">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                </label>

                {/* Upload Hint */}
                <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click avatar to update photo
                    </p>
                </div>
            </div>

            {/* User Info */}
            <div className="text-center space-y-1 mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {user.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{user.email}</p>
            </div>

        </div>
    );
}

export default ProfileAvatarUploader