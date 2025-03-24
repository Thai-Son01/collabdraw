## Collaborative drawing web app
A fullstack project to learn ReactJS and Java Springboot.


## Built With
ReactJS,
Java Springboot and Websockets,
Typescript

## Getting started locally
1. Clone the repo
   ```sh
   git clone git@github.com:Thai-Son01/collabdraw.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the project in the terminal
   ```sh
   npm run dev
   ```
4. Run the java springboot server
## Known bugs and performance issues
- [ ] Eraser syncing between users has a significant delay
- [ ] Pen exiting canvas but mouse still held down draws a straight line on the borders between the exit point and the entry point
- [ ] Syncing canvas between users fails when there's a lot drawn on the canvas already because payload is too big for the websocket

## Features / QOL I want to do
- [ ] Zoomable canvas
- [ ] Refactor drawing canvas component
- [ ] Add different colour pens
- [ ] Deploy client and server
