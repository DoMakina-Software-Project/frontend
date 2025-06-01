# Do Makina? Frontend Project

This repository contains the frontend code for our application, built with Vite for fast and optimized development. Below, you'll find instructions for setting up the project, installing dependencies, and running it locally.

## Table of Contents

-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Running the Project](#running-the-project)
-   [Building for Production](#building-for-production)
-   [Environment Variables](#environment-variables)

## Prerequisites

Ensure you have the following software installed on your system:

-   [Node.js](https://nodejs.org/) (version 16 or above)
-   [npm](https://www.npmjs.com/) (version 7 or above)

## Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/DoMakina/frontend.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd frontend
    ```

3. **Install Dependencies**
   Run the following command to install the necessary packages:
    ```bash
    npm install
    ```

## Running the Project

To start the development server, use the following command:

```bash
npm run dev
```

This will start Vite's development server, which supports hot-reloading, enabling you to see changes in real-time. By default, the project runs at `http://localhost:5173`, though you can check the terminal for the exact URL.

## Building for Production

When you're ready to build the project for production, use the following command:

```bash
npm run build
```

This command compiles the project into an optimized production-ready bundle located in the `dist` directory.

## Environment Variables

The project relies on environment variables stored in a `.env` file. A sample configuration file, `.env.sample`, is included for reference. To configure environment variables:

1. Copy `.env.sample` to `.env`:

    ```bash
    cp .env.sample .env
    ```

2. Open `.env` and update the values as needed for your local setup.

## Additional Notes

This README provides all the steps you need to get the project running locally. If you have any questions, feel free to reach out!

---
