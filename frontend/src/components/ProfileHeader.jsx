import { useState, useRef } from "react";
import {
  LogOutIcon,
  VolumeOffIcon,
  Volume2Icon,
  LoaderIcon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        try {
          const base64Img = reader.result;
          await updateProfile({ profilePic: base64Img });

          // update state only after successful upload
          setSelectedImage(base64Img);
        } catch (error) {
          console.error(error);
        }
      };
    }
  };

  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 border-b border-slate-700/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group ring-2 ring-slate-700/50"
              onClick={() => fileInputRef.current.click()}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <div className="flex items-center justify-center w-full h-full bg-slate-900">
                  <LoaderIcon className="size-5 animate-spin text-white" />
                </div>
              ) : (
                <>
                  <img
                    src={selectedImage || authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs">
                      {authUser.profilePic ? "Change" : "Add"}
                    </span>
                  </div>
                </>
              )}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE STATUS */}
          <div>
            <h3 className="text-slate-100 font-semibold text-base max-w-[180px] truncate">
              {authUser.fullname}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4  items-center">
          {/* LOGOUT BUTTON */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BUTTON */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
