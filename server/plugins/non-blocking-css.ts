/**
 * Makes the main entry stylesheet load non-blocking so it doesn't delay LCP.
 * Adds media="print" and onload="this.media='all'" to the first _nuxt entry CSS link.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:response", (response: { body?: string }) => {
    const body = response.body;
    if (typeof body !== "string") return;
    const linkRe = /<link[^>]+>/g;
    let match: RegExpExecArray | null;
    while ((match = linkRe.exec(body)) !== null) {
      const full = match[0];
      if (!/rel=["']stylesheet["']/i.test(full)) continue;
      if (!/href=["'][^"']*_nuxt\/[^"']*\.css["']/i.test(full)) continue;
      if (/media=["']print["']|onload=/.test(full)) break;
      const newTag = full.slice(0, -1) + ' media="print" onload="this.media=\'all\'">';
      response.body = body.replace(full, newTag);
      break;
    }
  });
});
