function setColorScheme(scheme) {
  document.documentElement.setAttribute("data-bs-theme", scheme)
}

function getPreferredColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    return 'dark';
  else
    return 'light';
}

function updateColorScheme() {
  setColorScheme(getPreferredColorScheme());
}

if (window.matchMedia) {
  var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQuery.addEventListener('change', updateColorScheme);
  window.addEventListener('load', updateColorScheme);
  updateColorScheme();
}
