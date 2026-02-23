/* Deferred loaders for Goftino chat and Yektanet analytics to avoid blocking initial render */
(function () {
  "use strict";
  function goftinoLoader() {
    if (window.isGoftinoAdded) return;
    window.isGoftinoAdded = 1;
    var i = "DfL38U",
      d = document,
      g = d.createElement("script"),
      s = "https://www.goftino.com/widget/" + i,
      l = localStorage.getItem("goftino_" + i);
    g.type = "text/javascript";
    g.async = true;
    g.src = l ? s + "?o=" + l : s;
    d.getElementsByTagName("head")[0].appendChild(g);
  }
  ["keydown", "touchmove", "touchstart", "mouseover"].forEach(function (v) {
    window.addEventListener(v, goftinoLoader);
  });

  function loadYektanet() {
    if (window.yektanetLoaded) return;
    var t = document,
      a = t.getElementsByTagName("head")[0],
      r = new Date(),
      c = "https://cdn.yektanet.com/superscript/LFcYdvcQ/native-vakilvakil.com-45548/yn_pub.js?v=" + r.getFullYear().toString() + "0" + r.getMonth() + "0" + r.getDate() + "0" + r.getHours();
    for (var i = 0, scripts = t.getElementsByTagName("script"); i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf("yektanet.com") !== -1) return;
    }
    window.yektanetLoaded = 1;
    var e = window, n = "yektanet";
    e.yektanetAnalyticsObject = n;
    e[n] = e[n] || function () { e[n].q.push(arguments); };
    e[n].q = e[n].q || [];
    var l = t.createElement("script");
    l.async = true;
    l.src = c;
    a.appendChild(l);
  }
  if ("requestIdleCallback" in window) {
    requestIdleCallback(function () { loadYektanet(); }, { timeout: 5000 });
  } else {
    setTimeout(loadYektanet, 2500);
  }
  ["keydown", "touchmove", "touchstart", "mouseover"].forEach(function (v) {
    window.addEventListener(v, loadYektanet, { passive: true, once: true });
  });
})();
