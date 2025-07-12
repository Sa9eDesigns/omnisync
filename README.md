# OmniSync - Real-time P2P Audio Streaming

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)
[![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org/)

A modern, real-time peer-to-peer audio streaming system built with WebRTC, designed for low-latency audio transmission between mobile and desktop devices.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd omnisync

# Run setup script
./scripts/setup.sh

# Start development
pnpm dev
```

## 📁 Monorepo Structure

This project uses a modern monorepo architecture with PNPM workspaces and Turborepo:

```
omnisync/
├── apps/
│   ├── desktop/            # Electron desktop app
│   ├── mobile/             # React Native/Expo mobile app
│   └── signaling-server/   # WebSocket signaling server
├── packages/
│   ├── shared/             # Common types & utilities
│   ├── webrtc-core/        # WebRTC functionality
│   ├── ui/                 # Shared UI components
│   └── config/             # Configuration management
└── tools/                  # Development tools & configs
```

## 🛠️ Technology Stack

- **Frontend**: React, React Native, Electron
- **Backend**: Node.js, Socket.IO
- **Audio**: WebRTC, Web Audio API
- **Build**: Turborepo, TypeScript, Vite
- **Package Management**: PNPM Workspaces
- **Code Quality**: ESLint, Prettier, Changesets

## 📱 Applications

### Desktop App (Electron)
- Receives audio streams from mobile devices
- Routes audio to virtual microphone devices
- Cross-platform support (Windows, macOS, Linux)

### Mobile App (React Native/Expo)
- Captures microphone audio
- Streams to desktop via WebRTC
- iOS and Android support

### Signaling Server (Node.js)
- WebSocket-based signaling for WebRTC
- Device discovery and pairing
- Connection management

## 🎯 Key Features

- **Low Latency**: <100ms end-to-end audio delay
- **High Quality**: 48kHz/16-bit audio with noise suppression
- **Cross-Platform**: Works on Windows, macOS, Linux, iOS, Android
- **P2P Architecture**: Direct device-to-device streaming
- **Virtual Audio**: System-wide microphone integration
- **Real-time Metrics**: Connection quality monitoring

## Architecture and Overview

The system adopts a **peer-to-peer (P2P) WebRTC** model for real-time audio, with a fallback to server-assisted relaying when direct connections fail. Each mobile/desktop pair creates a direct RTCPeerConnection and exchanges audio streams, minimizing latency by avoiding middlemen. A central signaling server (e.g. a WebSocket/Socket.IO service) is used only to exchange SDP offers/answers and ICE candidates (via STUN/TURN) during connection setup.  In practice, the mobile app captures microphone audio and encodes it (Opus) for WebRTC transmission; the desktop app’s WebRTC peer decodes and plays it back in real time.  If NAT traversal or direct P2P fails, a TURN relay server can fallback to relay the audio.  This basic flow is shown below:

&#x20;*Figure: Typical P2P WebRTC architecture (each node sends audio directly to the other).*

## Mobile Component (React Native/Expo)

* **Capture Microphone:** Use `react-native-webrtc` (with Expo config plugin) to access the mic. For example, call `mediaDevices.getUserMedia({ audio: true })` to obtain an audio `MediaStream`. Expo’s latest config plugins let you install and use `react-native-webrtc` without ejecting. (If Expo Go lacks WebRTC support, switch to a custom dev build with the plugin.)
* **Streaming:** Once captured, attach the audio track to an `RTCPeerConnection`. The mobile app signals its SDP offer to the desktop via a signaling server (WebSocket). Use standard WebRTC ICE with STUN/TURN servers for NAT traversal.
* **Libraries:** Key libraries include `react-native-webrtc` (or third-party wrappers like Daily.co’s SDK) for WebRTC functionality on iOS/Android. We may use `expo-av` or other Expo modules for any auxiliary audio control, but the core streaming is done via WebRTC.
* **Audio Processing (Mobile):** For low-latency audio, enable any built-in echo-cancellation/noise-suppression via media constraints (e.g. `audio: { noiseSuppression: true, echoCancellation: true }`). WebRTC’s audio engine natively supports these DSP features. Additional mobile-side DSP (like VAD) can be applied in JavaScript or via native modules if needed.

## Desktop Component (Electron Forge)

* **WebRTC Receiver:** Electron (Chromium + Node) can run standard WebRTC in its renderer. Use an `RTCPeerConnection` in the UI or background page to receive the audio stream from the mobile. Since Electron’s Chromium has WebRTC built-in, we simply add the remote audio `MediaStream` to an `<audio>` element or Web Audio context. The Electron app can handle signaling (WebSockets) similarly, exchanging SDP with the mobile.
* **Audio Output:** After decoding, playback must be routed to a virtual microphone. Options include using a Node audio library (e.g. `node-speaker`/`node-portaudio`) to write PCM to the virtual device, or simply using HTML audio with the system’s default output set to the virtual cable. The main task is to output the incoming audio into the OS’s audio system in such a way that the virtual input sees it.
* **Libraries:** On the renderer side, use standard WebRTC APIs (`navigator.mediaDevices`, `RTCPeerConnection`). On the Node side, use audio output libraries if manual routing is needed. Tools like **node-speaker** can write PCM to an audio output, but often configuring the OS virtual device is simpler. Electron Forge handles cross-platform packaging (Win/Mac/Linux), and you may need native modules (e.g. audio or driver utilities) depending on the virtual audio solution.
* **User Interface:** Provide UI to start/stop streaming, show connection status, select network mode (LAN vs Internet), and toggle features (e.g. noise suppression on/off). The Electron app will also include settings to select which virtual input device to populate.

## Signaling and Transport Design

A **signaling server** is needed to coordinate connections. We will implement a simple Node.js server (e.g. with Socket.IO) that relays SDP offers/answers and ICE candidates between the mobile and desktop clients.  During signaling, each peer gathers ICE candidates. STUN servers (e.g. Google’s  `stun:stun.l.google.com:19302`) are used to discover public-facing IPs. If direct peer-to-peer fails (e.g. symmetric NAT or restrictive firewall), a TURN server (e.g. coturn) can be used to relay audio.  The design is primarily P2P (low-latency): only session setup uses the server, and media flows directly (or via TURN) once connected.  For LAN use, NAT/traversal might be simpler, while Internet mode uses STUN/TURN and possibly port forwarding. We will allow an option to switch networks.  Encryption is inherent: WebRTC media is encrypted with SRTP/DTLS by default. Optional authentication can be added at signaling (e.g. tokens or login before connection) for security.

## Virtual Audio Device Setup

To make the received stream available system-wide as a microphone, each OS requires a virtual audio driver or loopback setup:

* **Linux (Arch/Ubuntu):** Use PulseAudio or PipeWire to create a *null sink* and loopback. For example, `pactl load-module module-null-sink sink_name=VirtualMic` creates a virtual audio output. Then route the Electron app’s output into that sink, and load a `module-loopback` to feed the sink’s monitor into the system input. In practice, commands like:

  ```bash
  pactl load-module module-null-sink sink_name=VirtualMic
  pactl load-module module-loopback sink=VirtualMic
  ```

  will create a “VirtualMic” device that apps see as an input. (On PipeWire, `pw-loopback` or GUI tools can likewise connect an application’s output to a virtual source.) This makes the streamed audio selectable as a system microphone.
* **Windows:** Install a virtual audio driver such as **Virtual Audio Cable (VAC)** or **VB-Audio Cable**. These create paired playback/input devices. For example, VB-Cable (free) installs “Cable Input” and “Cable Output”. If the Electron app plays audio to “Cable Output”, the OS exposes a corresponding “Cable Input” that looks like a microphone. This is a standard solution: “Virtual Audio Cable … let\[s] you route sound from outputs to inputs”. Streamers commonly use these cables to pipe audio into Zoom/OBS. (An alternative on Windows is to use WASAPI loopback or write a custom driver via the Core Audio API, but using VAC/VB-Cable is simpler.)
* **macOS:** Use a loopback audio driver like **BlackHole** (or Soundflower). BlackHole is a modern open-source driver that creates virtual audio devices, allowing applications to pass audio to other apps with virtually zero latency. Installing BlackHole (e.g. via Homebrew) provides a virtual interface (e.g. “BlackHole 2ch”) that can be set as the system output. The Electron app plays to this output, and BlackHole’s input can be selected by other applications as a microphone. (CoreAudio also allows creating aggregate devices in software, but BlackHole is a ready-made solution.)

These setups can be summarized:

| OS          | Virtual-Audio Approach                                          |
| ----------- | --------------------------------------------------------------- |
| **Linux**   | PulseAudio null sink + loopback (`pactl module-null-sink` etc.) |
| **Windows** | Virtual Audio Cable / VB-Cable driver (creates paired I/O)      |
| **macOS**   | BlackHole or Soundflower virtual audio driver                   |

Once installed, the Electron app’s audio output should be directed into the virtual device. On Windows, one can also use the “Advanced Sound Options” to set the app’s output device to the virtual cable. On Linux/macOS, selecting the virtual sink as the default or using audio APIs to target it accomplishes the same effect.  Other applications (OBS, Zoom, Discord) can then select the virtual device as if it were a mic.  In sum, the streamed audio is looped back as a system input.

## Advanced Audio Features

To improve audio quality and add functionality, we will incorporate the following:

* **Noise Suppression & Echo Cancellation:** Enable WebRTC’s built-in audio processing. When calling `getUserMedia`, set `echoCancellation: true` and `noiseSuppression: true` in the constraints. Modern WebRTC stacks automatically apply these filters. If further control is needed, custom DSP libraries (e.g. [WebRTC Audio Processor](https://webrtc.googlesource.com/src/+/refs/heads/main/sdk/README.md)) can be invoked in JS or native code.
* **Voice Activity Detection (VAD):** Use a VAD algorithm to detect speech vs silence, which can help reduce bandwidth or trigger voice-based controls. Libraries like [webrtc-vad](https://github.com/wiseman/py-webrtcvad) (originally from WebRTC) can be integrated in Node or React Native to flag active speech frames.
* **Audio Effects/Filters:** Provide optional filters on the audio stream. For example, implement an equalizer, gain control, or reverb using Web Audio API (in Electron) or native modules. We can allow the user to apply an EQ or adjust gain to improve signal clarity. If using Web Audio, the received stream can be routed through BiquadFilterNodes or convolution effects.
* **Voice Control / APIs:** Integrate voice-command functionality on the mobile side. For example, libraries like [`@react-native-voice/voice`](https://github.com/react-native-voice/voice) allow speech-to-text on Android/iOS. The app could listen for specific commands (e.g. “mute microphone”, “start stream”, or music control), enabling hands-free control. These voice APIs run on-device or via cloud (e.g. Google/Apple speech services) and interface with the app logic.

All processing should aim to maintain low latency. For musician use-cases, we may allow disabling some filters for raw audio, or use higher-quality codecs (Opus) and higher sample rates to preserve fidelity.  We will also consider supporting “software acoustic echo cancellation” if needed when playing back on the same device.

## Security and Connectivity

WebRTC inherently encrypts media with DTLS-SRTP, so the audio stream is secure in transit. For further security: we can restrict access via the signaling channel (e.g. require a login or pairing code between the mobile and desktop apps). If the desktop acts as a guest or server, it could authenticate clients before enabling streaming. In Internet mode, ensure the STUN/TURN servers are hardened and optionally use authenticated TURN (long-term credentials).

For connectivity, the system will work both **locally (LAN)** and over the **Internet**. On LAN, we can use mDNS or manual IP entry to connect peers. Over the Internet, ICE will try to use public endpoints, and fallback to TURN relay if necessary. We will select STUN/TURN servers (public or self-hosted) and allow configuration. The fallback server (TURN) ensures connectivity when P2P is blocked. If maximum reliability is needed, one could also design a simple cloud relay (SFU), but for one-to-one audio this is usually not required.

## Development Plan and Timeline

We propose an iterative development timeline (approx. 3–4 months total):

1. **Phase 1 (2 weeks): Proof-of-Concept.** Investigate React Native audio capture (use Expo dev build with `react-native-webrtc`), and establish a simple WebRTC P2P link to an Electron app. Test capturing `{audio: true}` and streaming to a basic webpage in Electron. Verify that `RTCPeerConnection` can send/receive raw audio in both directions.
2. **Phase 2 (2 weeks): Signaling & P2P Integration.** Build the signaling server (Node.js with WebSocket) and integrate complete offer/answer flow. Ensure ICE/STUN setup works in local network and internet scenarios (possibly deploy a temporary STUN/TURN). Handle connection lifecycle (join/leave).
3. **Phase 3 (2 weeks): Desktop Playback & Virtual Audio.** In Electron, take the received audio stream and play it. Then configure virtual audio devices per OS: on Linux test with a PulseAudio null sink, on Windows test VB-Cable, on macOS test BlackHole. Write code or instructions to route audio output into the virtual device on each platform. Test with external apps (OBS, Zoom) capturing from the virtual mic.
4. **Phase 4 (3 weeks): Audio Processing Features.** Implement noise suppression, echo cancellation, and basic effects. Expose toggles in UI. Add voice activity detection and optional voice-command integration (e.g. using `@react-native-voice`). Ensure these do not add significant latency.
5. **Phase 5 (2 weeks): UI & UX polishing.** Develop a clean UI in React Native and Electron for user controls. Handle permissions (mic access), device selection, status indicators. Package Electron app (using Forge) and build mobile app (Expo or native build if needed).
6. **Phase 6 (2 weeks): Testing & Optimization.** Perform latency and quality tests (see below), fix bugs. Optimize encoding settings, codec choices, and network buffering to minimize lag. Test on target Linux distros (Arch, Ubuntu) and on Windows/macOS. Ensure the virtual device setup is user-friendly (e.g. include scripts or UI steps to install/configure).
7. **Phase 7 (1 week): Documentation & Deployment.** Write user/developer docs (setup guides per OS, API references). Prepare final builds. (Optional: prepare a minimal TURN server or instructions if a public one is not used.)

At each milestone, perform integration tests to verify end-to-end audio flow and stability.

## Testing Latency and Audio Quality

To ensure low latency/high quality, we will:

* **Measure End-to-End Delay:** Generate a known audio pattern (e.g. a tone pulse or timestamped chirp) on the mobile mic, and measure when it is heard/output on the desktop/virtual mic (using a scope or loopback recording). Calculate round-trip audio delay. Aim for <100ms total latency.
* **WebRTC Statistics:** Use `RTCPeerConnection.getStats()` to monitor packet latency, jitter, and loss in real time. WebRTC internals (chrome://webrtc-internals) can provide detailed metrics.
* **Network Emulation:** Test under different network conditions (LAN vs slow wifi vs Internet with packet loss). Use tools (e.g. Linux `tc` or WAN emulators) to simulate bandwidth limits or jitter, and observe audio quality.
* **Subjective Listening Tests:** Have users listen to the streamed audio and rate the clarity and delay. Identify any echo or artifacts. Verify that noise suppression and filters are effective.
* **Compatibility Checks:** Confirm that common apps (OBS, Zoom, Discord) accept the virtual mic input and that no resampling or distortion occurs.

## Future Enhancements

Possible future improvements:

* **Mobile-to-Mobile Streaming:** Extend to streaming between two mobiles (React Native to React Native) by running signaling via a central server or P2P mesh.
* **Group Calls (SFU):** Add multi-party support using an SFU (e.g. Jitsi or Janus) if simultaneous multiple streams are needed.
* **Advanced DSP:** Integrate AI noise suppression (e.g. RNNoise, Google's NS3) or automatic equalization. Add auto-gain control or stereo imaging.
* **Bluetooth/Headset Support:** Capture from Bluetooth headsets on mobile, ensuring low-latency audio.
* **Open-Source Virtual Driver:** Develop or bundle open-source virtual audio drivers for each OS to simplify installation (e.g. automatically installing BlackHole or PulseAudio modules).
* **Encryption/Auth Options:** Support OAuth or key exchange for authenticated sessions. Possibly add SRTP key pinning if extreme security is required.
* **Cross-Platform Mobile UI:** Provide a React Native UI for controlling filters, VAD thresholds, and streaming parameters.

By following this plan, the system will achieve robust real-time audio streaming from mobile to desktop across platforms with minimal latency and high quality, suitable for streaming, collaboration, and creative uses.

**Sources:** WebRTC P2P architecture and performance; React Native WebRTC usage; virtual audio solutions on each OS; signaling and encryption details.
