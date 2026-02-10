"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink, Play } from "lucide-react";
import Image from "next/image";

export interface MediaData {
    type: "image" | "video" | "carousel";
    url: string; // The URL to download/display
    thumbnail?: string; // For video preview
    caption?: string;
    originalUrl?: string; // Link to original post
}

interface MediaPreviewProps {
    data: MediaData | null;
}

export default function MediaPreview({ data }: MediaPreviewProps) {
    if (!data) return null;

    // Determine mediaType from data.type
    const mediaType = data.type === "video" ? "video" : "image";

    // Helper function to build proxy URL
    const getProxyUrl = (url: string, isDownload = false) => {
        const params = new URLSearchParams({
            url: url,
            mediaType: mediaType, // NEW: Pass media type
        });

        if (isDownload) {
            params.set("download", "true");
            params.set("filename", `insta-dl-${Date.now()}`);
        }

        return `/api/proxy?${params.toString()}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 glass-card p-4 w-full max-w-md mx-auto overflow-hidden"
        >
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black/50 group">
                {data.type === "video" ? (
                    <video
                        // USE PROXY for video source to avoid CORS/CORB blocks
                        src={getProxyUrl(data.url)}
                        controls
                        poster={data.thumbnail ? getProxyUrl(data.thumbnail) : undefined}
                        className="w-full h-full object-contain"
                        controlsList="nodownload"
                        crossOrigin="anonymous"
                    />
                ) : (
                    <div className="relative w-full h-full">
                        {data.url ? (
                            // USE PROXY for image source to avoid CORS/CORB blocks
                            <img
                                src={getProxyUrl(data.url)}
                                alt="Instagram content"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/50">
                                No Image Available
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-3">
                <a
                    // USE PROXY with download=true for instant download
                    href={`/api/proxy?url=${encodeURIComponent(data.url)}&filename=insta-dl-${Date.now()}&download=true`}
                    download
                    className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Download
                </a>

                {data.originalUrl && (
                    <a
                        href={data.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                )}
            </div>

            {data.caption && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/70 line-clamp-3">{data.caption}</p>
                </div>
            )}
        </motion.div>
    );
}
