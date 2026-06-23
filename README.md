# PRITECH React Native Task

A task manager built with React Native, TypeScript, and Expo. Includes an **Explore Space** section powered by NASA's Astronomy Picture of the Day API.

## What I built

I built a personal task manager where users can add, view, edit status, and delete tasks with title, description, status, and created date. Tasks are saved on the device with AsyncStorage, and the home screen supports search and filtering by status. I also added stack navigation across task screens and a NASA APOD section that fetches today's astronomy image from a public API, with caching for faster repeat loads.

## Screenshots

| Home | Add Task | NASA Detail |
|---|---|---|
| ![Home screen](docs/screenshots/home.png?v=3) | ![Add task screen](docs/screenshots/add-task.png?v=3) | ![NASA detail screen](docs/screenshots/nasa-detail.png?v=3) |

## Features

- Create, view, update, and delete tasks
- Search tasks by title
- Filter by All / Pending / Completed
- Tasks saved locally with AsyncStorage
- Stack navigation across Home, Add Task, Task Details, and NASA Detail
- NASA APOD card with today's image, date, 16:9 preview, and detail screen

## Tech stack

- React Native 0.81 + Expo 54
- TypeScript
- React Navigation (native stack)
- AsyncStorage
- expo-image, expo-web-browser

## Run the app

```bash
npm install
cp .env.example .env
```

On Windows (PowerShell):

```bash
copy .env.example .env
```

**NASA API key (required for reliable Explore Space loading):**

1. Copy `.env.example` to `.env` as shown above.
2. Get a free key at [api.nasa.gov](https://api.nasa.gov/).
3. Paste it into `.env`:

```
EXPO_PUBLIC_NASA_API_KEY=your_key_here
```

4. Restart Expo after changing `.env` (use `npx expo start -c` so Metro picks up the new value).

Without your own key, the app falls back to NASA's `DEMO_KEY`, which is heavily rate-limited and Explore Space may load slowly or fail.

Start the app:

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `w` for web.

## Project structure

```
src/
├── components/     TaskCard, TaskList, ExploreSpaceCard, NASAImageCard, …
├── constants/      Colors, NASA config, storage keys
├── context/        ApodContext, TaskContext, ThemeContext
├── hooks/          useThemedStyles
├── navigation/     Stack navigator and route types
├── screens/        Home, AddTask, TaskDetails, NASADetail
├── services/       NASA APOD fetch (nasaService)
├── storage/        Task and APOD persistence (AsyncStorage)
├── types/          Task and NASA types
└── utils/          Validation, dates, NASA helpers, link opener
```

## NASA API

`src/services/nasaService.ts` fetches today's APOD from NASA (with cache), retries on failure, and only shows images from today's date.
