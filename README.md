# e-Manifest Workflow
This application provides documentation and interactive tools to assist with implementing the electronic workflow for the EPA Uniform Hazardous Waste Manifest.

## Requirements
NodeJS [Download](https://nodejs.org/en/download)

## Installation
```shell
npm install
```
## Running the Project Locally
```shell
npm run dev
```
The application will be available in your browser at `http://localhost:3000/`

## Linting
```shell
npm run lint
```
## Buidling and Previewing
To initiate a build, run:
```shell
npm run build
```
After the build is complete, run:
```shell
npm run preview
```
The application will be available in your browser at the default Vite port  `http://localhost:4173`

## Deploying to GitHub Pages
The project uses a package to deploy to GitHub pages ([gh-pages](https://www.npmjs.com/package/gh-pages)).
Run the below to both build and deploy to GitHub pages
```shell
npm run deploy
```