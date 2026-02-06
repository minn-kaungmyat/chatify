import React, { useState, useRef } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { XIcon, SendIcon, ImageIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (text.trim() === "" && !imagePreview) return;
    if (isSoundEnabled) {
      playRandomKeyStrokeSound();
    }
    try {
      sendMessage({ text, image: imagePreview });
      setText("");
      removeImage();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="p-2.5 sm:p-4 border-t border-slate-700/40 bg-slate-900/30">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center px-1">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex w-full items-center gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          placeholder="Type your message..."
          className="chat-input min-w-0"
        />

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`shrink-0 bg-slate-900/60 border px-2.5 sm:px-4 py-3 border-slate-700/50 text-slate-400 hover:text-slate-200 rounded-xl transition-colors ${
            imagePreview ? "text-sky-300 border-sky-400/30" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="shrink-0 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl px-2.5 sm:px-4 py-3 font-medium hover:from-sky-600 hover:to-sky-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_28px_-16px_rgba(59,130,246,0.7)]"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
