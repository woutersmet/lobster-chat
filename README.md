# Drawer Hello

A full-stack mobile application project consisting of an Expo-based React Native mobile app and a Node.js backend server.

## Project Structure

This repository contains two main components:

### 📱 Mobile App (`/mobile-app`)
A React Native mobile application built with Expo, featuring:
- Drawer navigation
- Chat interface
- Settings management
- Cross-platform support (iOS, Android, Web)

[View Mobile App Documentation](./mobile-app/README.md)

### 🖥️ Server (`/server`)
A Node.js/Express backend API server providing:
- Session management endpoints
- Message handling for chat sessions
- RESTful API architecture
- CORS-enabled for mobile app integration

[View Server Documentation](./server/README.md)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for mobile testing)

### Running the Project

1. **Start the Server**
   ```bash
   cd server
   npm install
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Start the Mobile App**
   ```bash
   cd mobile-app
   npm install
   npm start
   ```
   Follow the Expo CLI instructions to run on your device or emulator

## Development

- The mobile app and server can be developed independently
- The server provides a REST API that the mobile app can consume
- Both projects have their own dependencies and can be run simultaneously

## Technologies

**Mobile App:**
- React Native
- Expo
- React Navigation

**Server:**
- Node.js
- Express.js
- CORS

## License

Private

