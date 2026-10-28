# MAHI SHARE — beginner starter

## What this starter does
- Hosts a web UI and WebSocket signaling server.
- Pairs two browsers with a room code / QR link.
- Transfers one file at a time over WebRTC DataChannel in 16 KiB chunks.
- Does not upload file bytes to the signaling server.

## Requirements
- Node.js 18+
- A GitHub account
- A Render account (free tier is for testing and can sleep)
- HTTPS/WSS hosting for use from phones and PCs

## Deploy on Render (beginner route)
1. Create a GitHub repository named `mahi-share`.
2. Upload `server.js`, `package.json`, and the `public` folder to the repository root.
3. On Render choose **New + → Web Service**, connect that repository.
4. Runtime should detect Node. Build command: `npm install`. Start command: `npm start`.
5. Choose Free if available and deploy. Wait for a URL like `https://your-service.onrender.com`.
6. Open that URL on PC and phone. Create a room on one device; scan the QR or open the same link on the second.
7. For Blogger, add a link to this hosted URL from the Services menu or a Blogger page. Do not paste `server.js` into Blogger.

## Local test on Windows
1. Install Node.js LTS from https://nodejs.org/
2. Extract the ZIP; open Command Prompt in the extracted `mahi-share` folder.
3. Run `npm install`
4. Run `npm start`
5. Open `http://localhost:3000` on PC. For phone-on-same-Wi-Fi, use the PC's LAN IPv4 address, e.g. `http://192.168.1.5:3000` (replace with your real address; allow Node through Windows Firewall if prompted).
6. For phone use, browsers may restrict some APIs on plain HTTP; the hosted HTTPS URL is the recommended route.

## Important limits
- Free Render services can sleep after inactivity and take about a minute to wake.
- This demo uses STUN only. Some networks need a TURN relay; add a trusted TURN provider for more reliable internet-wide connectivity.
- Public rooms are not authenticated. Anyone who gets the room link may join before the room is full. Share links privately; close the room after use.
- This is a starter, not a production-secure public service. Add room expiry, rate limits, abuse controls, robust transfer acknowledgements, checksums, and TURN configuration before broad public launch.
