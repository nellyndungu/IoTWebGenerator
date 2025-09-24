// ====== Wrap HTML code for Arduino ======
function wrapAsHFile(htmlContent) {
  return `const char webpage[] PROGMEM = R"rawliteral(
${htmlContent}
)rawliteral";`;
}

// ====== Device base snippets ======
const deviceBase = {
  led: `<h3>LED</h3><button onclick="toggleLED()">Toggle LED</button>`,
  relay: `<h3>Relay</h3><button onclick="toggleRelay()">Toggle Relay</button>`,
  motor: `<h3>Motor</h3><button onclick="toggleMotor()">Start Motor</button>`,
  fan: `<h3>Fan</h3><button onclick="toggleFan()">Toggle Fan</button>`,
  servo: `<h3>Servo</h3><input type="range" min="0" max="180" id="servoControl"><p>Angle: <span id="servoValue">90</span>°</p>`,
  buzzer: `<h3>Buzzer</h3><button onclick="toggleBuzzer()">Buzzer</button>`,

  tempSensor: `<h3>Temperature</h3>`,
  humiditySensor: `<h3>Humidity</h3>`,
  lightSensor: `<h3>Light</h3>`,
  motionSensor: `<h3>Motion</h3>`,
  distanceSensor: `<h3>Distance</h3>`,
  gasSensor: `<h3>Gas</h3>`,
  soilSensor: `<h3>Soil Moisture</h3>`,
  customSensor: `<h3>Custom Sensor</h3>`,

  toggleBtn: `<h3>Toggle</h3><button onclick="toggleDevice()">Toggle</button>`,
  momentaryBtn: `<h3>Momentary</h3><button onmousedown="startAction()" onmouseup="stopAction()">Hold</button>`,
  slider: `<h3>Slider</h3><input type="range" min="0" max="100" value="50" id="slider">`,
  switch: `<h3>Switch</h3><label class="switch"><input type="checkbox" id="switch"><span class="slider"></span></label>`,

  chart: `<h3>Chart</h3><canvas id="chartCanvas" width="300" height="150"></canvas>`,
  camera: `<h3>Camera</h3><img src="/camera" id="cameraFeed" width="300">`,
  dropdown: `<h3>Dropdown</h3><select id="dropdown"><option>Option 1</option><option>Option 2</option></select>`,
  textInput: `<h3>Text Input</h3><input type="text" id="textInput" placeholder="Enter text">`,
  numberInput: `<h3>Number Input</h3><input type="number" id="numberInput" value="0">`
};

// ====== Indicator snippets ======
const indicatorSnippets = {
  text: `<p>Status: <span id="statusText">--</span></p>`,
  numeric: `<p>Value: <span id="numericValue">--</span></p>`,
  bar: `<progress value="0" max="100" id="barIndicator"></progress>`,
  colorCircle: `<div class="indicator-circle" style="background:red;"></div>`,
  glow: `<div class="glow-box"></div>`,
  rotation: `<div class="rotation-icon">⟳</div>`,
  speedBar: `<progress value="0" max="100" class="speed-bar"></progress>`,
  switchSymbol: `<span>⎋</span>`,
  powerIcon: `<span>⚡</span>`,
  angle: `<p>Angle: <span>0</span>°</p>`,
  dial: `<div class="dial-indicator"></div>`,
  needle: `<div class="needle-gauge"></div>`,
  wave: `<div class="wave-animation"></div>`,
  soundIcon: `<span>🔊</span>`,
  spin: `<div class="spin-icon">🌀</div>`,
  speedDial: `<div class="speed-dial"></div>`,
  thermometerIcon: `<span>🌡️</span>`,
  gauge: `<div class="gauge"></div>`,
  dropletIcon: `<span>💧</span>`,
  bulb: `<span>💡</span>`,
  brightnessBar: `<progress value="0" max="100" class="brightness-bar"></progress>`,
  icon: `<span>🚶</span>`,
  alertFlash: `<div class="alert-flash">⚠️</div>`,
  radar: `<div class="radar-sweep">🔄</div>`,
  alert: `<span>⚠️</span>`,
  colorScale: `<div class="color-scale"></div>`,
  drop: `<span>💧</span>`,
  soilBar: `<progress value="0" max="100" class="soil-bar"></progress>`,
  custom: `<div class="custom-visual"></div>`,
  chart: `<canvas></canvas>`
};

// ====== Template layouts ======
function buildTemplate(template, sections) {
  // base head + common styles (keeps preview consistent)
  const baseHead = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ESP32 IoT Preview</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;padding:16px;background:#f6f8fb;color:#111}
  h1,h2{color:#103256}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
  .panel{background:#fff;padding:12px;border-radius:8px;box-shadow:0 1px 6px rgba(0,0,0,0.08);text-align:center}
  .indicator-circle{width:20px;height:20px;border-radius:50%;display:inline-block;margin-top:5px}
  .glow-box{width:20px;height:20px;background:yellow;box-shadow:0 0 8px yellow;border-radius:50%}
  .speed-bar,.soil-bar,.brightness-bar{width:100%;height:10px}
  .alert-flash{animation:flash 1s infinite}
  @keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}
</style>
</head>
<body>
<h1>ESP32 IoT Preview</h1>
`;

  const tail = `</body></html>`;

  if (template === "dashboard") {
    return `${baseHead}
<h2>Actuators</h2><div class="grid">${sections.actuators.join("")}</div>
<h2>Sensors</h2><div class="grid">${sections.sensors.join("")}</div>
<h2>Controls</h2><div class="grid">${sections.controls.join("")}</div>
<h2>Misc</h2><div class="grid">${sections.misc.join("")}</div>
${tail}`;
  }

  if (template === "card") {
    return `${baseHead}
<div class="grid">
  ${[...sections.actuators, ...sections.sensors, ...sections.controls, ...sections.misc].map(s => `<div class="panel">${s}</div>`).join('')}
</div>
${tail}`;
  }

  // simple list
  return `${baseHead}
${sections.actuators.length ? `<h2>Actuators</h2>${sections.actuators.join("")}` : ''}
${sections.sensors.length ? `<h2>Sensors</h2>${sections.sensors.join("")}` : ''}
${sections.controls.length ? `<h2>Controls</h2>${sections.controls.join("")}` : ''}
${sections.misc.length ? `<h2>Misc</h2>${sections.misc.join("")}` : ''}
${tail}`;
}

// ===== Main logic =====
document.addEventListener('DOMContentLoaded', () => {

  // GENERATE
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const previewFrame = document.getElementById("previewFrame");

  generateBtn.addEventListener("click", () => {
    const selectedDevices = [...document.querySelectorAll("input[name='device']:checked")];
    const templateEl = document.querySelector("input[name='template']:checked");
    const template = templateEl ? templateEl.value : 'simple';

    const sections = { actuators: [], sensors: [], controls: [], misc: [] };

    selectedDevices.forEach(deviceInput => {
      const device = deviceInput.value;
      const baseHTML = deviceBase[device] || "";

      // Collect selected indicators from tags
      const dropdownSelected = document.getElementById(`${device}Selected`);
      let indicatorsHTML = "";
      if (dropdownSelected) {
        dropdownSelected.querySelectorAll(".tag").forEach(tag => {
          const indType = tag.getAttribute("data-value");
          if (indicatorSnippets[indType]) indicatorsHTML += indicatorSnippets[indType];
        });
      }

      const deviceHTML = `<div class="panel">${baseHTML}${indicatorsHTML}</div>`;

      if (["led","relay","motor","fan","servo","buzzer"].includes(device)) sections.actuators.push(deviceHTML);
      else if (["tempSensor","humiditySensor","lightSensor","motionSensor","distanceSensor","gasSensor","soilSensor","customSensor"].includes(device)) sections.sensors.push(deviceHTML);
      else if (["toggleBtn","momentaryBtn","slider","switch"].includes(device)) sections.controls.push(deviceHTML);
      else sections.misc.push(deviceHTML);
    });

    const htmlContent = buildTemplate(template, sections);

    previewFrame.srcdoc = htmlContent;
    window.generatedContent = wrapAsHFile(htmlContent);
    downloadBtn.disabled = false;
  });

  // DOWNLOAD
  downloadBtn.addEventListener("click", () => {
    if (!window.generatedContent) return;
    const blob = new Blob([window.generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "webpage.h";
    document.body.appendChild(link);
    link.click();
    link.remove();
    // release the blob URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  // ===== Custom dropdown logic =====
  document.querySelectorAll(".custom-dropdown").forEach(dropdown => {
    const selectedArea = dropdown.querySelector(".selected-options");
    const optionsList = dropdown.querySelector(".options-list");

    // if no selectedArea or optionsList, skip
    if (!selectedArea || !optionsList) return;

    selectedArea.addEventListener("click", (e) => {
      dropdown.classList.toggle("active");
    });

    optionsList.querySelectorAll(".option").forEach(option => {
      option.addEventListener("click", (e) => {
        const value = option.getAttribute("data-value");
        const text = option.innerText;

        // remove placeholder if present
        const placeholder = selectedArea.querySelector(".placeholder");
        if (placeholder) placeholder.remove();

        if (!selectedArea.querySelector(`.tag[data-value="${value}"]`)) {
          const tag = document.createElement("div");
          tag.classList.add("tag");
          tag.setAttribute("data-value", value);
          tag.innerHTML = `${text} <span class="remove-tag" title="Remove">&times;</span>`;
          const rem = tag.querySelector(".remove-tag");
          rem.addEventListener("click", (ev) => {
            ev.stopPropagation(); // don't re-open/close dropdown
            tag.remove();
            // restore placeholder if no tags left
            if (selectedArea.querySelectorAll(".tag").length === 0) {
              const ph = document.createElement("span");
              ph.classList.add("placeholder");
              ph.innerText = "Select indicator...";
              selectedArea.appendChild(ph);
            }
          });
          selectedArea.appendChild(tag);
        }
        dropdown.classList.remove("active");
      });
    });
  });

  // click outside to close
  document.addEventListener("click", e => {
    document.querySelectorAll(".custom-dropdown").forEach(dropdown => {
      if (!dropdown.contains(e.target)) dropdown.classList.remove("active");
    });
  });

}); // DOMContentLoaded
