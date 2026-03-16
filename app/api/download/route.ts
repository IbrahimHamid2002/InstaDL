import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        const rapidApiKey = process.env.RAPIDAPI_KEY;
        const rapidApiHost = process.env.RAPIDAPI_HOST || "instagram-downloader-download-instagram-videos-stories.p.rapidapi.com";

        if (!rapidApiKey) {
            return NextResponse.json(
                { error: "Server configuration error: RapidAPI Key missing" },
                { status: 500 }
            );
        }

        // Determine type (optional logic, API might handle it)
        const isReel = url.includes("/reel/");
        const isPost = url.includes("/p/");

        // Using a common endpoint structure for Instagram Downloader APIs on RapidAPI
        // Adjust 'https://${rapidApiHost}/index' based on the specific API documentation chosen by the user
        // Many use GET with 'url' param, or POST. 
        // Example: https://rapidapi.com/majhcc/api/instagram-downloader-download-instagram-videos-stories

        // Using the host from env, usually the endpoint is /index or just /
        // For "Instagram Downloader & Stories" (host ending in 'stories5'), the endpoint is often just /
        // But let's try a standard construction. The user's snippet used /getThreads for threads.
        // We'll assume the root path or /index for Instagram. 
        // SAFEST BET based on similar APIs: https://{host}/index?url={url}
        const apiUrl = `https://${rapidApiHost}/getPost?url=${encodeURIComponent(url)}`;
        console.log("Fetching from:", apiUrl);

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-rapidapi-key": rapidApiKey,
                "x-rapidapi-host": rapidApiHost,
            },
        });

        if (!response.ok) {
            if (response.status === 429) {
                return NextResponse.json({ error: "API Rate limit exceeded" }, { status: 429 });
            }
            return NextResponse.json({ error: "Failed to fetch from Instagram API" }, { status: response.status });
        }

        const data = await response.json();

        // Parse the response based on common API structures
        // This part assumes a specific structure but adds checks

        // Check for private account error (API dependent, but often checks 'private' or 'error' fields)
        if (data.error || (data.detail && data.detail.includes("private"))) {
            return NextResponse.json({ error: "Cannot download from private accounts" }, { status: 400 });
        }

        // Adapt this to the actual API response structure
        // Example common structure: result: { url: ..., thumb: ... } or just returning flat JSON
        // We'll normalize it to our MediaData interface

        // Example handling for "Instagram Downloader & Stories" API
        // It often returns { media: string (url), type: 'video'|'image', ... } or { video_url: ... }

        // Fallback normalization (User might need to adjust based on specific API)
        // Specific parsing for the "Instagram Downloader & Stories" API (stories5 host) based on user logs
        let downloadUrl = data.video_url;
        let type: "image" | "video" | "carousel" = "image";
        let carouselItems: { type: "image" | "video"; url: string; thumbnail?: string }[] = [];

        if (data.is_video) {
            type = "video";
            downloadUrl = data.video_url;
        } else {
            type = "image";
            downloadUrl = data.src || data.display_url || data.image_url;
        }

        // Fallback checks and Carousel support
        if (data.media && Array.isArray(data.media) && data.media.length > 0) {
            if (data.media.length > 1) {
                type = "carousel";
                carouselItems = data.media.map((item: any) => ({
                    type: item.is_video ? "video" : "image",
                    url: item.video_url || item.src || item.display_url || item.url,
                    thumbnail: item.thumbnail_src || item.thumb || item.thumbnail || null
                })).filter((item: any) => item.url);
                
                if (carouselItems.length > 0 && !downloadUrl) {
                    downloadUrl = carouselItems[0].url; // fallback to first item
                }
            } else {
                const item = data.media[0];
                if (item.is_video) {
                    type = "video";
                    downloadUrl = item.video_url;
                } else {
                    type = "image";
                    downloadUrl = item.src || item.display_url || item.url;
                }
            }
        }

        // Handling for generic fallbacks if specific fields fail
        if (!downloadUrl) {
            downloadUrl = data.url || data.media; // older fallbacks
        }

        if (!downloadUrl && carouselItems.length === 0) {
            return NextResponse.json({ error: "Media not found or API format changed" }, { status: 404 });
        }

        return NextResponse.json({
            type,
            url: downloadUrl,
            carouselItems: carouselItems.length > 0 ? carouselItems : undefined,
            thumbnail: data.thumbnail_src || data.thumb || data.thumbnail || null,
            originalUrl: url,
            caption: data.description || data.title || data.caption || ""
        });

    } catch (error: any) {
        console.error("Download API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
