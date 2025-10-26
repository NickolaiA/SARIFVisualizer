# SARIF Visualizer

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/nick_a)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-mykolaa25%2Fsarifvisualizer-blue?logo=docker)](https://hub.docker.com/r/mykolaa25/sarifvisualizer)

A modern, responsive web application for visualizing Static Analysis Results Interchange Format (SARIF) files. Built with React, TypeScript, and Tailwind CSS.

![SARIF Visualizer](https://img.shields.io/badge/SARIF-2.1.0-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-blue)

## 🚀 Quick Start with Docker (Recommended)

**No Node.js installation required!** Get started in seconds with our pre-built Docker image:

```bash
# Pull and run the latest image
docker pull mykolaa25/sarifvisualizer:latest
docker run -d -p 99:80 --name sarifvisualizer mykolaa25/sarifvisualizer:latest

# Or use Docker Compose
docker-compose up -d
```

**Access the application at http://localhost:99**

### Why Use Docker?

✅ **No Build Required** - Pre-built image ready to use  
✅ **No Dependencies** - No Node.js, npm, or build tools needed  
✅ **Multi-Platform** - Works on Windows (Intel/AMD), Mac (Intel/M1/M2/M3), Linux (x64/ARM)  
✅ **Instant Setup** - From download to running in under 1 minute  
✅ **Production Ready** - Optimized nginx-based image  
✅ **Consistent Environment** - Same experience across all platforms  
✅ **Isolated** - Runs in its own container, no system conflicts  

**Docker Hub:** [https://hub.docker.com/r/mykolaa25/sarifvisualizer](https://hub.docker.com/r/mykolaa25/sarifvisualizer)

## 🚀 Features

### Core Functionality
- **📁 File Upload**: Drag & drop or click to upload SARIF files
- **📊 Dashboard**: Rich visualizations with charts and statistics
- **📚 Rules Directory**: Browse and explore all analysis rules
- **🔍 Findings Explorer**: Advanced filtering and search capabilities
- **📄 Detailed Views**: Comprehensive issue details with code snippets

### Advanced Features
- **🔗 Vulnerability Enrichment**: Automatic CVE/CWE information lookup
- **⚡ Performance Optimized**: Web Workers for large file parsing
- **📱 Responsive Design**: Works perfectly on all devices
- **🎨 Modern UI**: Clean, intuitive interface with Tailwind CSS
- **🔒 Security**: Input sanitization and validation

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Zustand for lightweight state management
- **Routing**: React Router for navigation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for modern icons
- **Markdown**: ReactMarkdown for rich text rendering
- **Build Tool**: Vite for fast development and building

## 📦 Installation

### Option 1: Docker (Recommended - No Setup Required)

**Ready to use! No Node.js, npm, or compilation needed.**

Pre-built Docker images are available at [Docker Hub](https://hub.docker.com/r/mykolaa25/sarifvisualizer) for instant deployment:

```bash
# Pull and run in one command
docker run -d -p 99:80 --name sarifvisualizer mykolaa25/sarifvisualizer:latest
```

Or use Docker Compose:

```bash
# Create docker-compose.yml (or use the one in this repo)
docker-compose up -d
```

**That's it!** Open http://localhost:99 and start visualizing SARIF files.

**Benefits:**
- 🚀 Zero configuration - works out of the box
- ⚡ Fast deployment - from zero to running in seconds
- 🔄 Auto-updates - pull the latest version anytime
- 🛡️ Isolated - won't interfere with other software
- 📦 Portable - same image works everywhere

### Option 2: Local Development (For Contributors)

If you want to modify the code or contribute to the project:

#### Prerequisites
- Node.js 18+ 
- npm or yarn

#### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/NickolaiA/SARIFVisualizer.git
   cd SARIFVisualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🐳 Docker Deployment Details

### Using Pre-Built Image (Recommended)

**No compilation or build tools required!** Just pull and run:

**Using Docker Compose (recommended):**

```bash
docker-compose up -d
```

**Or run directly:**

```bash
# Pull the latest image
docker pull mykolaa25/sarifvisualizer:latest

# Run the container (map host port 99 to container port 80)
docker run -d -p 99:80 --name sarifvisualizer mykolaa25/sarifvisualizer:latest

# Check it's running
docker ps

# View logs
docker logs sarifvisualizer

# Stop the container
docker stop sarifvisualizer

# Restart the container
docker start sarifvisualizer
```

Access the application at `http://localhost:99`

**Use a Different Port:**

```bash
# Run on port 8080 instead
docker run -d -p 8080:80 --name sarifvisualizer mykolaa25/sarifvisualizer:latest
```

**Update to Latest Version:**

```bash
docker pull mykolaa25/sarifvisualizer:latest
docker stop sarifvisualizer
docker rm sarifvisualizer
docker run -d -p 99:80 --name sarifvisualizer mykolaa25/sarifvisualizer:latest
```

### Building Your Own Image (For Customization)

If you want to build your own Docker image from source:

```bash
# Build the image
docker build -t sarifvisualizer .

# Run your custom build
docker run -d -p 99:80 --name sarifvisualizer sarifvisualizer
```

**Docker Hub Publishing:**

To publish this image to Docker Hub, use the provided scripts that build multi-platform images (linux/amd64, linux/arm64):

**PowerShell (Windows):**
```powershell
# Push with version tag (e.g., v1.0.0)
.\docker-push.ps1 1.0.0

# Or push as latest
.\docker-push.ps1
```

**Bash (Linux/Mac):**
```bash
# Make script executable (first time only)
chmod +x docker-push.sh

# Push with version tag (e.g., v1.0.0)
./docker-push.sh 1.0.0

# Or push as latest
./docker-push.sh
```

The scripts will:
1. Authenticate with Docker Hub (login prompt)
2. Set up Docker Buildx for multi-platform builds
3. Build the Docker image for **linux/amd64** and **linux/arm64** platforms
4. Push both platform variants to Docker Hub with your specified version tag
5. Also tag and push as `latest` (if version is specified)
6. Verify the multi-platform manifest

**Prerequisites for Multi-Platform Builds:**
- Docker Desktop with BuildKit enabled (Windows/Mac)
- Docker with buildx plugin (Linux)
- For Docker Desktop: Enable "Use containerd for pulling and storing images" in Settings

**Manual Publishing:**

```bash
# Login to Docker Hub
docker login

# Build and push multi-platform image
docker buildx build --platform linux/amd64,linux/arm64 \
  --tag mykolaa25/sarifvisualizer:latest \
  --push .

# Or with a specific version
docker buildx build --platform linux/amd64,linux/arm64 \
  --tag mykolaa25/sarifvisualizer:v1.0.0 \
  --tag mykolaa25/sarifvisualizer:latest \
  --push .
```

**Pull and run from Docker Hub:**

```bash
docker pull mykolaa25/sarifvisualizer:latest
docker run -d -p 99:80 --name sarifvisualizer mykolaa25/sarifvisualizer:latest
```

**Docker Notes:**
- Multi-stage build: Node 20 builds the app, nginx serves the static files
- Container runs on port 80 internally, mapped to host port 99
- Includes healthcheck endpoint at `/`
- If build fails, run `npm run build` locally to see detailed errors

## 📖 Usage

### 1. Upload SARIF File
- Visit the application homepage
- Drag & drop a `.sarif` or `.json` file
- Or click "Choose File" to select manually
- Try the sample file to explore features

### 2. Explore Dashboard
- View summary statistics
- Analyze issue distribution by severity
- Identify top problematic rules
- See most affected files

### 3. Browse Rules
- Complete rule directory with descriptions
- External documentation links
- Category and CWE information
- Issue counts per rule

### 4. Investigate Findings
- Filter by severity, rule, or file
- Search across issue descriptions
- Navigate to detailed views
- Access suggested fixes

### 5. Detailed Analysis
- Complete issue information
- Code locations and snippets
- Related locations
- Vulnerability enrichment (CVE/CWE)
- Remediation guidance

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── store/              # State management
├── services/           # External services
├── hooks/              # Custom React hooks
└── workers/            # Web Workers
```

## 🧪 Testing

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## 📚 SARIF Format

This visualizer supports [SARIF 2.1.0](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html) specification.

### Supported Tools
- ✅ ESLint
- ✅ Snyk  
- ✅ CodeQL
- ✅ SonarQube
- ✅ Semgrep
- ✅ And many more...

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ for the security community
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
