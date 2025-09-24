//Wrap HTML code for Arduino
function wrapAsHFile(htmlContent) {
  return `const char webpage[] PROGMEM = R"rawliteral(
${htmlContent}
)rawliteral";`;
}

//Device base snippets
const deviceBase = {
  led: `<h3>LED</h3>`,
  relay: `<h3>Relay</h3>`,
  motor: `<h3>Motor</h3>`,
  fan: `<h3>Fan</h3>`,
  servo: `<h3>Servo</h3><input type="range" min="0" max="180" id="servoControl"><p>Angle: <span id="servoValue">90</span>°</p>`,
  buzzer: `<h3>Buzzer</h3>`,

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

//Indicator snippets
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

//Device category map
const deviceCategory = {
  actuators: ["led","relay","motor","fan","servo","buzzer"],
  sensors: ["tempSensor","humiditySensor","lightSensor","motionSensor","distanceSensor","gasSensor","soilSensor","customSensor"],
  controls: ["toggleBtn","momentaryBtn","slider","switch"],
  misc: ["chart","camera","dropdown","textInput","numberInput"]
};

//Template layouts
function buildTemplate(template, sections, pageTitle, pageHeading) {
  const safeTitle = pageTitle || "ESP32 IoT Preview";
  const safeHeading = pageHeading || "ESP32 IoT Preview";

  const baseHead = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${safeTitle}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<h1>${safeHeading}</h1>
`;

  const tail = `</body></html>`;

  if (template === "dashboard") {
    return `${baseHead}
    <h2>Actuators</h2><div class="grid">${sections.actuators.map(s => `<div class="panel">${s}</div>`).join("")}</div>
    <h2>Sensors</h2><div class="grid">${sections.sensors.map(s => `<div class="panel">${s}</div>`).join("")}</div>
    <h2>Controls</h2><div class="grid">${sections.controls.map(s => `<div class="panel">${s}</div>`).join("")}</div>
    <h2>Misc</h2><div class="grid">${sections.misc.map(s => `<div class="panel">${s}</div>`).join("")}</div>
    ${tail}`;
  }

  if (template === "card") {
    return `${baseHead}
    <div class="grid card-layout">
      ${[...sections.actuators, ...sections.sensors, ...sections.controls, ...sections.misc]
        .map(s => `<div class="panel">${s}</div>`).join("")}
    </div>
    ${tail}`;
  }

  return `${baseHead}
    ${sections.actuators.length ? `<h2>Actuators</h2><ul class="simple-list">${sections.actuators.map(s => `<li>${s}</li>`).join("")}</ul>` : ""}
    ${sections.sensors.length ? `<h2>Sensors</h2><ul class="simple-list">${sections.sensors.map(s => `<li>${s}</li>`).join("")}</ul>` : ""}
    ${sections.controls.length ? `<h2>Controls</h2><ul class="simple-list">${sections.controls.map(s => `<li>${s}</li>`).join("")}</ul>` : ""}
    ${sections.misc.length ? `<h2>Misc</h2><ul class="simple-list">${sections.misc.map(s => `<li>${s}</li>`).join("")}</ul>` : ""}
    ${tail}`;
}

//DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const previewFrame = document.getElementById("previewFrame");

  //Auto-build device UI (checkbox + count input + dropdown)
  document.querySelectorAll(".device-block").forEach(block => {
    const device = block.dataset.device;
    const options = (block.dataset.options || "").split(",").map(opt => {
      const [value, label] = opt.split(":");
      return { value: value.trim(), label: label.trim() };
    });

    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="device" value="${device}"> ${device.replace(/([A-Z])/g, ' $1')}`;

    const countInput = document.createElement("input");
    countInput.type = "number";
    countInput.classList.add("device-count");
    countInput.dataset.device = device;
    countInput.value = "1";
    countInput.min = "1";

    const dropdown = document.createElement("div");
    dropdown.classList.add("custom-dropdown");
    dropdown.innerHTML = `
      <div class="selected-options"><span class="placeholder">Select indicator...</span></div>
      <div class="options-list">
        ${options.map(o => `<div class="option" data-value="${o.value}">${o.label}</div>`).join("")}
      </div>
    `;

    block.appendChild(label);
    block.appendChild(countInput);
    block.appendChild(dropdown);
  });

  // === Generate Code ===
  generateBtn.addEventListener("click", () => {
    const selectedDevices = [...document.querySelectorAll("input[name='device']:checked")];
    const templateEl = document.querySelector("input[name='template']:checked");
    const template = templateEl ? templateEl.value : 'simple';
    const pageTitle = document.getElementById("pageTitleInput").value.trim();
    const pageHeading = document.getElementById("pageHeadingInput").value.trim();

    const sections = { actuators: [], sensors: [], controls: [], misc: [] };

    selectedDevices.forEach(deviceInput => {
      const device = deviceInput.value;
      const count = parseInt(document.querySelector(`.device-count[data-device="${device}"]`)?.value || "1", 10);
      const baseHTML = deviceBase[device] || "";

      let indicatorsHTML = "";
      const dropdownSelected = document.querySelector(`[data-device='${device}'] .selected-options`);
      if (dropdownSelected) {
        dropdownSelected.querySelectorAll(".tag").forEach(tag => {
          const indType = tag.getAttribute("data-value");
          if (indicatorSnippets[indType]) indicatorsHTML += indicatorSnippets[indType];
        });
      }

      for (let i = 1; i <= count; i++) {
        let deviceHTML = `<div class="panel">${baseHTML}`;

        if (deviceCategory.actuators.includes(device)) {
          deviceHTML += `
            <label class="switch">
              <input type="checkbox" id="${device}${i}Toggle">
              <span class="slider"></span>
            </label>
          `;
        }

        deviceHTML += indicatorsHTML;
        deviceHTML += `</div>`;

        let category = Object.keys(deviceCategory).find(cat => deviceCategory[cat].includes(device));
        sections[category].push(deviceHTML);
      }
    });

    const htmlContent = buildTemplate(template, sections, pageTitle, pageHeading);
    previewFrame.srcdoc = htmlContent;

    // === Build Summary ===
    const summaryDiv = document.getElementById("summaryContent");
    const deviceList = selectedDevices.map(d => d.value);
    const indicatorsByDevice = {};

    selectedDevices.forEach(deviceInput => {
      const device = deviceInput.value;
      const count = parseInt(document.querySelector(`.device-count[data-device="${device}"]`)?.value || "1", 10);
      const dropdownSelected = document.querySelector(`[data-device='${device}'] .selected-options`);
      const chosenIndicators = [];
      if (dropdownSelected) {
        dropdownSelected.querySelectorAll(".tag").forEach(tag => {
          chosenIndicators.push(tag.innerText.replace("×","").trim());
        });
      }
      indicatorsByDevice[device] = { count, chosenIndicators };
    });

    const libMap = {
      chart: "Chart.js (served from CDN or stored locally)",
      camera: "ESP32-CAM support",
      servo: "ESP32Servo.h",
      tempSensor: "DHT.h",
      humiditySensor: "DHT.h",
      distanceSensor: "NewPing.h",
    };

    const requiredLibs = [...new Set(deviceList.map(d => libMap[d]).filter(Boolean))];

    let htmlSummary = `<p><strong>Filename:</strong> webpage.h</p>`;
    htmlSummary += `<h3>Devices & Indicators</h3><ul>`;
    deviceList.forEach(d => {
      const info = indicatorsByDevice[d];
      htmlSummary += `<li><strong>${d} (x${info.count})</strong>${info.chosenIndicators.length ? ": " + info.chosenIndicators.join(", ") : ""}</li>`;
    });
    htmlSummary += `</ul>`;

    if (requiredLibs.length) {
      htmlSummary += `<h3>Required Libraries</h3><ul>`;
      requiredLibs.forEach(lib => htmlSummary += `<li>${lib}</li>`);
      htmlSummary += `</ul>`;
    } else {
      htmlSummary += `<p><em>No extra libraries required (basic GPIO only).</em></p>`;
    }

    summaryDiv.innerHTML = htmlSummary;

    window.generatedContent = wrapAsHFile(htmlContent);
    downloadBtn.disabled = false;
  });

  // === Download Code ===
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
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  // === Custom dropdown logic ===
  document.addEventListener("click", e => {
    document.querySelectorAll(".custom-dropdown").forEach(dropdown => {
      const selectedArea = dropdown.querySelector(".selected-options");
      const optionsList = dropdown.querySelector(".options-list");

      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
        return;
      }

      if (e.target === selectedArea) {
        dropdown.classList.toggle("active");
      }

      if (e.target.classList.contains("option")) {
        const value = e.target.dataset.value;
        const text = e.target.innerText;

        const placeholder = selectedArea.querySelector(".placeholder");
        if (placeholder) placeholder.remove();

        if (!selectedArea.querySelector(`.tag[data-value="${value}"]`)) {
          const tag = document.createElement("div");
          tag.classList.add("tag");
          tag.setAttribute("data-value", value);
          tag.innerHTML = `${text} <span class="remove-tag" title="Remove">&times;</span>`;
          tag.querySelector(".remove-tag").addEventListener("click", ev => {
            ev.stopPropagation();
            tag.remove();
            if (selectedArea.querySelectorAll(".tag").length === 0) {
              selectedArea.innerHTML = `<span class="placeholder">Select indicator...</span>`;
            }
          });
          selectedArea.appendChild(tag);
        }
        dropdown.classList.remove("active");
      }
    });
  });

}); // DOMContentLoaded
// === Scroll-to-top button ===
const toTopBtn = document.getElementById("toTopBtn");

window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    toTopBtn.style.display = "block";
  } else {
    toTopBtn.style.display = "none";
  }
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

