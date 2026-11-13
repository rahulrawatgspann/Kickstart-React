import DOMPurify from "dompurify";

interface VideoBlockProps {
  variation?: string;
  heading?: string;
  description?: string;
  video_description?: string;
  youtube_url?: {
    title?: string;
    href?: string;
  } | null;
  autoplay?: boolean;
  $?: Record<string, Record<string, string>>;
}

function getYouTubeVideoId(href: string) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0];
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") return url.searchParams.get("v");

      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
      return match?.[1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

const VideoBlock = ({
  variation,
  heading,
  description,
  video_description,
  youtube_url,
  autoplay = false,
  $: editableTags,
}: VideoBlockProps) => {
  const isVideoOnly = variation === "video_only_autoplay";
  const isVideoLeft = variation === "youtube_video_left_text_right";
  const autoplayEnabled = autoplay;
  const youtubeVideoId = youtube_url?.href
    ? getYouTubeVideoId(youtube_url.href)
    : undefined;
  const layoutClass = isVideoOnly
    ? "video-block--video-only"
    : isVideoLeft
      ? "video-block--video-left"
      : variation === "dam_text_left_video_right"
        ? "video-block--dam-text-left-video-right"
        : "video-block--text-left";
  const isDamTextRightVariation = variation === "dam_text_left_video_right";
  const descriptionText = description
    ? new DOMParser()
      .parseFromString(DOMPurify.sanitize(description), "text/html")
      .body.textContent?.trim()
    : undefined;
  const showDescription = Boolean(
    description && descriptionText !== heading?.trim(),
  );
  const showVideoDescription = Boolean(
    isDamTextRightVariation && video_description?.trim(),
  );
  const showVariationHeading =
    (isDamTextRightVariation || isVideoLeft || isVideoOnly) && heading;

  return (
    <>
      {showVariationHeading && (
        <div
          className={`video-block__variation-heading ${
            isVideoOnly ? "video-block__variation-heading--video-only" : ""
          }`}
        >
          <h2 {...editableTags?.heading}>{heading}</h2>
        </div>
      )}
      <section className={`video-wrapper video-block ${layoutClass}`}>
        <div className="video-container">
          {!isVideoOnly && (
            <div className="video-text">
              {!showVariationHeading && heading && (
                <h2
                  className="video-text__heading"
                  {...editableTags?.heading}
                >
                  {heading}
                </h2>
              )}
              {showDescription && (
                <div
                  className="video-text__description"
                  {...editableTags?.description}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(description),
                  }}
                />
              )}
            </div>
          )}

          <div className="video-media">
            {youtubeVideoId ? (
              <iframe
                className="video-player"
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeVideoId)}?${new URLSearchParams({
                  autoplay: autoplayEnabled ? "1" : "0",
                  mute: autoplayEnabled ? "1" : "0",
                  controls: isVideoOnly && autoplayEnabled ? "0" : "1",
                })}`}
                title={heading || youtube_url?.title || "YouTube video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : youtube_url?.href ? (
              <a
                className="text-blue-700 underline"
                href={youtube_url.href}
                target="_blank"
                rel="noreferrer"
              >
                {youtube_url.title || "Watch video on YouTube"}
              </a>
            ) : null}
            {showVideoDescription && (
              <div
                className="video-media__caption"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(video_description || ""),
                }}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoBlock;
