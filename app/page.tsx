"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MediaPreview, { MediaData } from "./components/MediaPreview";
import { motion } from "framer-motion";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setMediaData(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch media");
      }

      setMediaData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            Download
          </span>{" "}
          Instagram Reels & Posts
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
          Save your favorite moments in high quality. Fast, free, and secure.
        </p>
      </motion.div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200"
        >
          {error}
        </motion.div>
      )}

      <MediaPreview data={mediaData} />
    </div>
  );
}
