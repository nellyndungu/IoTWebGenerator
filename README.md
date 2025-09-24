# IoT Web Generator
## Inspiration
Repetitive tasks often slow down development, especially when setting up similar components across multiple projects. 
Automating these common patterns leads to efficiency and consistency.
This project was inspired by the need for a simple tool that reduces duplication of work when building IoT dashboards.
It is still a basic implementation, but with ongoing improvements it can evolve into a more robust and flexible solution.

## Overview
This project provides a web-based generator for IoT dashboards and ESP32/Arduino web interfaces. 
The generator produces ready-to-use .h files containing embedded HTML, CSS, and JavaScript (to be included) for IoT devices.

### Key Features
- **Device & Indicator Selection.** Choose from actuators, sensors, and UI controls.

- **Page Customization**. Configure the webpage title and heading before generation.
- **Default Actuator Controls.** Each actuator automatically includes a modern toggle switch for on/off control, styled like dark/light mode toggles.
- **Indicators.** Add multiple status indicators such as text, icons, gauges, and animations.
- **Templates.** Choose between simple list, card layout, or dashboard grid for layout styling.
- **Live Preview.** Instantly view the generated web interface in an embedded preview panel.
- **Summary Panel.** Review selected devices, indicators, filename, and required libraries before export.
- **Export.** Download the generated .h file for direct inclusion in Arduino/ESP32 projects.

### How It Works

1. Select Devices. Check boxes for actuators, sensors, or controls.
2. Use dropdown menus to pick one or more indicators per device.
3. Configure Page Settings.
4. Input a custom webpage title and main heading.
5. Choose Layout Template.
6. Pick from a simple list, card layout, or grid-based dashboard.
7. Generate and Preview.
8. Click Generate Code to build the page.
9. The preview updates live in an iframe.
10. Review Summary. A summary panel lists selected devices, indicators, filename, and required external libraries.
11. Download .h File. Export the generated code and include it directly in Arduino IDE projects.

### Future Improvements
1. Enhanced interactivity for preview (live indicator updates when toggles are switched).
2. Additional device and sensor support.
