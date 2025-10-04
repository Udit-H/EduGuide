## 1. Navigate to the Project Folder ##

First, you need to open your terminal (like PowerShell, which you were using, or Command Prompt/Bash) and move into the main directory of your frontend code (the folder that contains the package.json file).

Bash
   
    cd C:\Users\user\Documents\EduGuide\frontend
2. Install Dependencies

        npm i
       npm install 
Frontend projects rely on numerous libraries and packages (like React, Tailwind, Next.js, etc.) that must be downloaded before the project can run.

Run one of the following commands:
Package Manager	Command	Purpose
npm (Node Package Manager)	npm install (or npm i)	Reads the package.json file and downloads all necessary libraries into the local node_modules folder.
Yarn	yarn install (or yarn)	Performs the same function as npm install.

3. Start the Development Server

The final step is to run the project's start script. This command compiles your code (JavaScript, CSS, etc.) and launches a local web server, which usually opens automatically in your browser.

Look at the scripts section inside your package.json file to find the correct command, but the most common one is:
Bash

npm run dev

    Tip: npm start is a special shortcut that doesn't require the run keyword. For all other scripts defined in package.json (like npm run dev or npm run build), you need to include run.
