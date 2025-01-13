# drumPad
### The ultimate notepad for writing and managing drum machine patterns.

This project is a web-based drum pattern creator that allows users to create and play drum patterns using a grid of buttons. Each button represents a step in the sequence, and users can toggle different states for each button to create various drum sounds.

## Project Structure

- `index.html`: The main HTML file that contains the structure of the drum pattern creator.
- `styles.css`: The CSS file that styles the drum pattern creator.
- `scripts.js`: The JavaScript file that contains the logic for the drum pattern creator.
- `README.md`: This file, which contains documentation for the project.

## Features

- **Play/Pause**: Start and stop the sequencer.
- **Button States**: Toggle between different states (off, on, roll, flare, light, light-roll, light-flare) for each button.
- **Reset Buttons**: Reset individual rows, columns, or the entire pattern.
- **Light Mode**: Toggle light mode for different button states.
- **Page Navigation**: Switch between different pages of the pattern.

## Usage

1. Open `index.html` in a web browser.
2. Use the grid of buttons to create your drum pattern. Click on a button to toggle its state.
3. Use the "Play" button to start the sequencer and the "Pause" button to stop it.
4. Use the "Reset pattern" button to reset the entire pattern.
5. Use the "Light Mode" checkbox to toggle light mode.
6. Use the page buttons to switch between different pages of the pattern.

## Button States

- **off**: The button is inactive.
- **on**: The button is active and will play a sound.
- **roll**: The button is active and will play a roll sound.
- **flare**: The button is active and will play a flare sound.
- **light**: The button is active in light mode.
- **light-roll**: The button is active in light mode and will play a roll sound.
- **light-flare**: The button is active in light mode and will play a flare sound.

## Sounds

The following sounds are available in the drum pattern creator:

- **Open Hi-Hat (OH)**
- **Closed Hi-Hat (CH)**
- **Hand Clap (HC)**
- **Low Tom (LT)**
- **Snare Drum (SD)**
- **Kick Drum (BD)**
- **Accent (ACC)**

## Development

To modify the project, edit the `index.html`, `styles.css`, and `scripts.js` files as needed. The JavaScript file contains functions for creating and playing different drum sounds, updating button states, and handling user interactions.

## License

This project is currently licensed under the MIT License.
