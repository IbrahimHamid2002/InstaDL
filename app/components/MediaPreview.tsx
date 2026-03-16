"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink, Play } from "lucide-react";
import Image from "next/image";

export interface MediaData {
    type: "image" | "video" | "carousel";
    url: string; // The URL to download/display
    carouselItems?: { type: "image" | "video"; url: string; thumbnail?: string }[];
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
    const getProxyUrl = (url: string, itemType?: "image" | "video", isDownload = false, index = 0) => {
        const params = new URLSearchParams({
            url: url,
            mediaType: itemType || (data.type === "video" ? "video" : "image"),
        });

        if (isDownload) {
            params.set("download", "true");
            params.set("filename", `insta-dl-${Date.now()}-${index}`);
        }

        return `/api/proxy?${params.toString()}`;
    };

    const isCarousel = data.type === "carousel" && data.carouselItems && data.carouselItems.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 glass-card p-4 w-full max-w-md mx-auto overflow-hidden"
        >
            {isCarousel ? (
                <div className="flex overflow-x-auto snap-x snap-mandatory rounded-xl h-[400px] w-full bg-black/50 overflow-y-hidden border border-white/10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {data.carouselItems!.map((item, idx) => (
                        <div key={idx} className="relative min-w-full h-full snap-center flex items-center justify-center shrink-0">
                            {item.type === "video" ? (
                                <video
                                    src={getProxyUrl(item.url, "video")}
                                    controls
                                    poster={item.thumbnail ? getProxyUrl(item.thumbnail, "image") : undefined}
                                    className="w-full h-full object-contain"
                                    controlsList="nodownload"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <img
                                    src={getProxyUrl(item.url, "image")}
                                    alt={`Instagram content ${idx + 1}`}
                                    className="w-full h-full object-contain"
                                />
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                                {idx + 1} / {data.carouselItems!.length}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
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
            )}

            <div className="mt-4 flex flex-col gap-3">
                <div className="flex gap-3">
                    {!isCarousel && (
                        <a
                            href={getProxyUrl(data.url, data.type === "video" ? "video" : "image", true)}
                            download
                            className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Download
                        </a>
                    )}
                    
                    {isCarousel && (
                        <button
                           onClick={() => {
                               data.carouselItems!.forEach((item, idx) => {
                                   const link = document.createElement('a');
                                   link.href = getProxyUrl(item.url, item.type, true, idx);
                                   link.download = `insta-dl-${Date.now()}-${idx}`;
                                   document.body.appendChild(link);
                                   link.click();
                                   document.body.removeChild(link);
                               });
                           }}
                           className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Download All ({data.carouselItems!.length})
                        </button>
                    )}

                    {data.originalUrl && (
                        <a
                            href={data.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    )}
                </div>

                {isCarousel && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {data.carouselItems!.map((item, idx) => (
                            <a
                                key={idx}
                                href={getProxyUrl(item.url, item.type, true, idx)}
                                download
                                className="bg-white/10 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors text-sm"
                            >
                                <Download className="w-4 h-4" />
                                {item.type === "video" ? "Video" : "Image"} {idx + 1}
                            </a>
                        ))}
                    </div>
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
