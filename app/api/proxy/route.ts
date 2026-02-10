import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "instagram-media";
    const isDownload = searchParams.get("download") === "true";
    const mediaType = searchParams.get("mediaType"); // NEW: Force media type from frontend

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://www.instagram.com/"
            }
        });

        if (!response.ok) {
            console.error(`Proxy fetch failed: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: "Failed to fetch media" },
                { status: response.status }
            );
        }

        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const contentLength = response.headers.get("content-length");
        const contentLengthNum = contentLength ? parseInt(contentLength, 10) : 0;

        // Buffer small responses (<2KB) to check for text errors
        if (contentLengthNum > 0 && contentLengthNum < 2048) {
            const buffer = await response.arrayBuffer();
            const text = new TextDecoder().decode(buffer);

            // Check if it looks like an error message
            if (contentType.includes("text/") ||
                contentType.includes("application/json") ||
                text.trim().startsWith("{") ||
                text.trim().startsWith("<")) {
                console.error(`Proxy received error response: ${text.substring(0, 200)}`);
                return NextResponse.json(
                    { error: "File not available or server returned an error" },
                    { status: 404 }
                );
            }

            // Valid small file, return it
            const headers = new Headers();
            headers.set("Content-Type", contentType);
            headers.set("Content-Length", contentLength || buffer.byteLength.toString());
            headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

            if (isDownload) {
                const extension = getFileExtension(contentType, mediaType, url);
                const safeFilename = sanitizeFilename(filename);
                const finalFilename = safeFilename.endsWith(extension) ? safeFilename : `${safeFilename}${extension}`;
                headers.set("Content-Disposition", `attachment; filename="${finalFilename}"`);
            }

            return new NextResponse(buffer, {
                status: 200,
                headers: headers,
            });
        }

        // Validate content type for downloads to avoid serving error pages as files
        if (isDownload && (contentType.includes("text/html") ||
            (contentType.includes("text/") && !contentType.includes("text/plain")))) {
            console.error(`Proxy received invalid content type for download: ${contentType}`);
            return NextResponse.json(
                { error: "File not available or invalid response from server" },
                { status: 404 }
            );
        }

        const headers = new Headers();
        headers.set("Content-Type", contentType);
        if (contentLength) {
            headers.set("Content-Length", contentLength);
        }
        headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

        if (isDownload) {
            const extension = getFileExtension(contentType, mediaType, url);
            const safeFilename = sanitizeFilename(filename);
            const finalFilename = safeFilename.endsWith(extension) ? safeFilename : `${safeFilename}${extension}`;
            headers.set("Content-Disposition", `attachment; filename="${finalFilename}"`);
        }

        // Stream large responses directly
        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers,
        });
    } catch (error: any) {
        console.error("Proxy Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Helper function to determine file extension
function getFileExtension(contentType: string, mediaType: string | null, url: string): string {
    // 1. Use mediaType parameter if provided (frontend knows best)
    if (mediaType) {
        if (mediaType === "video") return ".mp4";
        if (mediaType === "image") {
            // Check URL for specific image format
            if (url.includes(".png")) return ".png";
            if (url.includes(".webp")) return ".webp";
            return ".jpg"; // default for images
        }
    }

    // 2. Use Content-Type header
    if (contentType.includes("video/mp4")) return ".mp4";
    if (contentType.includes("video")) return ".mp4";
    if (contentType.includes("image/jpeg")) return ".jpg";
    if (contentType.includes("image/jpg")) return ".jpg";
    if (contentType.includes("image/png")) return ".png";
    if (contentType.includes("image/webp")) return ".webp";
    if (contentType.includes("image/gif")) return ".gif";
    if (contentType.includes("image")) return ".jpg"; // default for images

    // 3. Detect from URL if Content-Type is generic
    if (contentType === "application/octet-stream" || contentType === "binary/octet-stream") {
        const urlLower = url.toLowerCase();
        if (urlLower.includes(".mp4")) return ".mp4";
        if (urlLower.includes(".jpg") || urlLower.includes(".jpeg")) return ".jpg";
        if (urlLower.includes(".png")) return ".png";
        if (urlLower.includes(".webp")) return ".webp";
        if (urlLower.includes(".gif")) return ".gif";
    }

    // 4. Default fallback
    return ".jpg";
}

// Helper function to sanitize filename
function sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9-_.]/g, "_");
}

// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//     const { searchParams } = new URL(request.url);
//     const url = searchParams.get("url");
//     const filename = searchParams.get("filename") || "instagram-media";
//     const isDownload = searchParams.get("download") === "true";

//     if (!url) {
//         return NextResponse.json({ error: "URL is required" }, { status: 400 });
//     }

//     try {
//         const response = await fetch(url, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
//                 "Referer": "https://www.instagram.com/"
//             }
//         });

//         if (!response.ok) {
//             console.error(`Proxy fetch failed: ${response.status} ${response.statusText}`);
//             return NextResponse.json(
//                 { error: "Failed to fetch media" },
//                 { status: response.status }
//             );
//         }

//         const contentType = response.headers.get("content-type") || "application/octet-stream";

//         // Validate content type for downloads to avoid serving error pages as files
//         if (isDownload && (contentType.includes("text/") || contentType.includes("application/json"))) {
//             console.error(`Proxy received invalid content type: ${contentType}`);
//             return NextResponse.json(
//                 { error: "File not available or invalid response from server" },
//                 { status: 404 }
//             );
//         }

//         const contentLength = response.headers.get("content-length");

//         const headers = new Headers();
//         headers.set("Content-Type", contentType);
//         if (contentLength) {
//             headers.set("Content-Length", contentLength);
//         }
//         // Remove strict caching while debugging or set to revalidate
//         headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

//         if (isDownload) {
//             let extension = "";
//             if (contentType.includes("video")) extension = ".mp4";
//             else if (contentType.includes("image/jpeg")) extension = ".jpg";
//             else if (contentType.includes("image/png")) extension = ".png";

//             // Ensure filename handles spaces/special chars safely
//             const safeFilename = filename.replace(/[^a-zA-Z0-9-_]/g, "_");
//             const finalFilename = safeFilename.endsWith(extension) ? safeFilename : `${safeFilename}${extension}`;

//             headers.set("Content-Disposition", `attachment; filename="${finalFilename}"`);
//         }

//         // Return the stream directly instead of buffering
//         return new NextResponse(response.body, {
//             status: response.status,
//             statusText: response.statusText,
//             headers: headers,
//         });
//     } catch (error: any) {
//         console.error("Proxy Error:", error);
//         return NextResponse.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }
