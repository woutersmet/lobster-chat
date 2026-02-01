# Drawer Hello - Mobile App

This is the mobile application for the Drawer Hello project, built with React Native and Expo.

## Features

- React Navigation with Drawer navigation
- Chat interface
- Settings screen
- Home screen

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

## Installation

1. Navigate to the mobile-app directory:
   ```bash
   cd mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

Start the Expo development server:

```bash
npm start
```

This will open the Expo Developer Tools in your browser. From there, you can:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with the Expo Go app on your physical device

### Other Commands

- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## Project Structure

- `App.js` - Main application component with navigation setup
- `screens/` - Screen components (Home, Chat, Settings)
- `components/` - Reusable components (ChatInput, CustomDrawerContent)
- `services/` - Service layer for business logic
- `assets/` - Images and other static assets

## Technologies Used

- React Native
- Expo
- React Navigation (Drawer Navigator)
- React Native Gesture Handler
- React Native Reanimated

