# Docker: Build & Run

This project can be built and served from a small nginx container.

Build the image from the repository root:

```powershell
# from project root
docker build -t sarifvisualizer:latest .
```

docker run --rm -p 99:90 --name sarifvisualizer sarifvisualizer:latest
Run the container and map host port 99 to the container's port 80:

```powershell
# map host port 99 to container port 80
docker run --rm -p 99:80 --name sarifvisualizer sarifvisualizer:latest
```

Open http://localhost:99

Notes:
- The image uses a multi-stage build: Node builds the app, nginx serves the `dist/` output.
- If the docker build fails because the app build fails, run `npm run build` locally to see errors and fix them first.
- The image includes a HEALTHCHECK that requests `/` to confirm the server is up.
