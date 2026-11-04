// Marks each .art image as "loaded" once it finishes downloading.
// While it isn't loaded, the CSS shows a shimmer instead.
(function () {
  document.querySelectorAll('img.art').forEach(function (img) {
    function done() { img.classList.add('loaded'); }

    if (img.complete && img.naturalWidth > 0) {
      done();                          // already cached
    } else {
      img.addEventListener('load', done);
      img.addEventListener('error', done);   // stop the shimmer even if the image is broken
    }
  });
})();