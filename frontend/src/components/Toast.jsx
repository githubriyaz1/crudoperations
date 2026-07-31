import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

function Toast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer;

    const showToast = (event) => {
      setMessage(event.detail?.message || "");
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(""), 1800);
    };

    window.addEventListener("love2bazzar:toast", showToast);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("love2bazzar:toast", showToast);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[80] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-lg border border-[#d4af37]/45 bg-[#0d0902] px-4 py-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-center gap-3 text-sm font-bold">
        <FaCheckCircle className="shrink-0 text-[#d4af37]" />
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Toast;
