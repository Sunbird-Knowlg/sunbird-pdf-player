# Sunbird PDF Player (Lit Web Component)

The Sunbird PDF Player is a modern, lightweight web component built with **Lit**, **PDF.js**, and **Tailwind CSS**. It is designed to be highly portable, themeable, and easy to integrate into any web application regardless of the framework.

## Features

- **Direct PDF Rendering**: Renders PDF pages directly onto canvases using PDF.js (no `viewer.html` or iframe required).
- **Lightweight**: Built with Lit for minimal overhead and standard web component compatibility.
- **Telemetry Integration**: Uses Sunbird Telemetry SDK 2.0.1 (TypeScript based) for detailed event logging.
- **Themeable**: Uses Tailwind CSS and inherits styles from the parent application.
- **Responsive Controls**: Includes zoom, rotation, pagination, and navigation controls.
- **State Management**: Handles start, play, and end states with statistics.

## Getting Started

### Usage as a Web Component

You can integrate the PDF player by including the built JavaScript file and using the `<sunbird-pdf-player>` tag.

#### 1. Include the Library
```html
<script type="module" src="dist/sunbird-pdf-player.js"></script>
```

#### 2. Add the Player Tag
```html
<sunbird-pdf-player id="pdf-player"></sunbird-pdf-player>
```

#### 3. Pass Configuration
The player requires a `player-config` attribute passed as a JSON string.

```javascript
const playerConfig = {
  context: {
    mode: 'play',
    sid: 'session-id',
    did: 'device-id',
    uid: 'user-id',
    channel: 'channel-id',
    pdata: { id: 'producer-id', ver: '1.0.0' }
  },
  config: {
    startFromPage: 1,
    zoom: 100,
    rotation: 0
  },
  metadata: {
    identifier: 'content-id',
    name: 'Sample PDF',
    artifactUrl: 'https://example.com/sample.pdf'
  }
};

const playerElement = document.getElementById('pdf-player');
playerElement.setAttribute('player-config', JSON.stringify(playerConfig));
```

#### 4. Listen to Events
The player emits two main events: `playerEvent` and `telemetryEvent`.

```javascript
playerElement.addEventListener('playerEvent', (event) => {
  console.log('Player Event:', event.detail);
});

playerElement.addEventListener('telemetryEvent', (event) => {
  console.log('Telemetry Event:', event.detail);
});
```

## Configuration (playerConfig)

| Property | Description | Mandatory |
|----------|-------------|-----------|
| `context` | Contains environment information (mode, sid, did, uid, channel, pdata). | Yes |
| `config` | Player behavior settings (startFromPage, zoom, rotation). | No |
| `metadata`| Information about the PDF content (identifier, name, artifactUrl). | Yes |

## Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Setup
1. Navigate to the project directory:
   ```bash
   cd projects/sunbird-pdf-player-lit
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running in Development Mode
Start the Vite development server with hot module replacement:
```bash
npm run dev
```

### Building for Production
Build the component and generate the distribution files in the `dist` directory:
```bash
npm run build
```

### Project Structure
- `src/sunbird-pdf-player.ts`: Main entry point and state management.
- `src/components/`: Individual Lit components (Header, Navigation, Start/End Pages, etc.).
- `src/services/`: Services for telemetry and other core logic.
- `src/interfaces.ts`: TypeScript interfaces for configuration and events.
- `src/index.css`: Global Tailwind CSS and theme variables.

## Styling and Themes
The component uses **Tailwind CSS** and is rendered in the **Light DOM** to facilitate style inheritance.

### CSS Variables
You can customize the player's appearance using the following CSS variables defined in your parent application:

```css
:root {
  --player-primary: #2563eb; /* Primary theme color */
  --player-bg: #f3f4f6;      /* Background color */
}
```

The component will also inherit fonts from the parent container.
