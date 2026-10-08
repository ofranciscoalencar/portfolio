/**
 * Start a muted background <video> reliably. Returns a cleanup function for
 * use in a React effect.
 *
 * Why not just `video.play()`: Chrome can reject play() on a silent
 * ("video-only") element that has no data yet (readyState 0) with
 *   AbortError: The play() request was interrupted because video-only
 *   background media was paused to save power.
 * That is exactly the state of a freshly mounted <video key={src}> when a
 * slate swaps backgrounds. The rejection was previously swallowed, leaving a
 * frozen first frame. So: try now, and if the element is still paused,
 * try again once it has data, and again when the page becomes visible.
 */
export function playWhenReady(video: HTMLVideoElement): () => void {
  const attempt = () => {
    if (!video.paused) return;
    void video.play().catch(() => {
      /* retried by the listeners below */
    });
  };

  attempt();
  video.addEventListener("loadeddata", attempt);
  video.addEventListener("canplay", attempt);
  const onVisible = () => {
    if (document.visibilityState === "visible") attempt();
  };
  document.addEventListener("visibilitychange", onVisible);

  return () => {
    video.removeEventListener("loadeddata", attempt);
    video.removeEventListener("canplay", attempt);
    document.removeEventListener("visibilitychange", onVisible);
  };
}
