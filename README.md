# SARIF Visualizer

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/nick_a)

A modern, responsive web application for visualizing Static Analysis Results Interchange Format (SARIF) files. Built with React, TypeScript, and Tailwind CSS.

![SARIF Visualizer](https://img.shields.io/badge/SARIF-2.1.0-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-blue)

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

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

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

### Docker Deployment

**Using Docker Compose (recommended):**

```bash
docker-compose up -d
```

**Or build and run manually:**

```bash
# Build the image
docker build -t sarifvisualizer .

# Run the container (map host port 99 to container port 80)
docker run -d -p 99:80 --name sarifvisualizer sarifvisualizer
```

Access the application at `http://localhost:99`

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
