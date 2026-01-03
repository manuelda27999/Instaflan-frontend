"use client"

import { useState, useEffect } from "react";

function LoadingModal() {

  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      {seconds > 0 ? <p className="loader"></p> :
        <div className="flex flex-col items-center p-6">
          <p className="loader"></p>
          <p className="text-center text-xl font-bold">The server is waking up, please somes extra seconds to load the page</p>
        </div>}
    </div>
  );
}

export default LoadingModal;
