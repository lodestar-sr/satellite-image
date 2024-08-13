### Project Setup and Configuration Guide
This guide will walk you through three different methods to run the project. The methods involve configuring specific variables in the `constants/api.constant.js` file.

#### Configuration Variables
- <b>host</b>: The API host URL.
- <b>enable</b>: Set to `true` to enable API calls to the backend.
- <b>enableGetImage</b>: Set to `true` to fetch satellite images from the backend. If set to false, the project will use local files.
- <b>demoUrl</b>: The URL for the demo satellite image.
- <b>DEFAULT_SATELLITE_FILE</b>: The name of the satellite file to be used when running from local files.

#### Method 1: Integrated with Backend API
1. Set CONFIG_API.enable = true.
2. Set CONFIG_API.enableGetImage = true.
3. Set CONFIG_API.host to your backend API host URL.
This configuration will fully integrate your project with the backend API for both data and satellite images.

#### Method 2: Using Satellite Image Demo URL
1. Set CONFIG_API.enable = true.
2. Set CONFIG_API.enableGetImage = false.
3. (Optional) Modify the demoUrl variable to point to the satellite image URL you want to display on the map.
This configuration will fetch data from the backend API but use the demo URL for the satellite image.

#### Method 3: Using Local Files (Recommended)
1. Download the desired satellite image file and place it in the public directory of the project.
2. Set DEFAULT_SATELLITE_FILE to the name of your downloaded file (e.g., "TCI.tif").
3. Set CONFIG_API.enable = false.
This configuration allows the project to run fully offline, using a local satellite image file stored in the public directory.

### Install Dependencies

To install packages, run the following command:

```
fnm install 20.16.0
fnm use 20
pnpm install
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm start
```
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Build

To build all apps and packages, run the following command:

```
pnpm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!