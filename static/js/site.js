/**
 * This is the main JS script shared across whole site
 */
console.log("Welcome");

window.addEventListener("load", init);

const getAll = (a) => document.querySelectorAll(a);

const _runOnAll = (selector, fun) =>
  R.pipe(getAll, Array.from, R.map(fun))(selector);
const runOnAll =
  (selector) =>
  (...funs) => {
    const tappedFunPipe = (element) => R.forEach((fun) => fun(element), funs);
    return _runOnAll(selector, tappedFunPipe);
  };

const addListener = (event, fun) => (elem) => elem.addEventListener(event, fun);

const log = (key) => (s) => console.log(`${key}: `, s);

const after = (time, run) =>
  setTimeout(() => {
    log("after finished")(time);
    run();
  }, time);

const unmountHashes = () => R.pipe(getAll("[data-type=hash]"));

const svgSize = 28;

const createSvg = (element) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("fill", "none");
  svg.setAttribute("viewBox", "0 0 255 255");
  svg.setAttribute("width", svgSize);
  svg.setAttribute("height", svgSize);
  svg.setAttribute("id", `${element.id}-hash`);
  svg.setAttribute("class", "hash");
  return svg;
};

const strokeColour = "var(--colour-primary)";

const addPath = (svg, d, y) => {
  log("addpath")(d);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("d", d);
  path.setAttribute("stroke", strokeColour);
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-width", 22);
  path.setAttribute("data-axis", y ? "y" : "x");

  svg.appendChild(path);

  return path;
};

const mountHash = (element) => {
  if (document.getElementById(`${element.id}-hash`)) {
    return;
  }
  const hash = createSvg(element);
  hash.dataset.type = "hash";

  element.appendChild(hash);
  console.log(hash);

  after(0, () => addPath(hash, "M86 41C81.2 43.4 73 124 86 232", true));
  after(100, () =>
    addPath(hash, "M158 21C154.227 73.8611 148.945 182.467 158 194", true)
  );
  after(200, () => addPath(hash, "M31 109L142 78L211 51"));
  after(500, () => addPath(hash, "M44 171C89 144 183 111 222 106"));
};

const scrollToElement = (element) =>
  window.scrollTo({
    left: 0,
    top: element.offsetTop - 10,
    behavior: "smooth",
  });

function init() {
  const url = new URL(document.URL);

  if (url.hash && document.getElementById(url.hash.slice(1))) {
    scrollToElement(document.getElementById(url.hash.slice(1)));
  }

  runOnAll("h2")(
    addListener("click", (event) => {
      event.preventDefault();
      url.hash = event.target.id;
      history.pushState(null, document.title, url.href);
      scrollToElement(event.target);
    }),
    addListener("mouseover", (event) => {
      log("Mouseover")(event.target);
      unmountHashes();
      mountHash(event.target);
    })
  );
}
