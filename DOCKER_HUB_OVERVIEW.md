# SARIF Visualizer

A modern, responsive web application for visualizing Static Analysis Results Interchange Format (SARIF) files. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Pull and Run

```bash
# Pull the latest image
docker pull mykolaa25/sarifvisualizer:latest

# Run the container
docker run -d -p 99:80 --name sarifvisualizer mykolaa25/sarifvisualizer:latest
```

Access the application at **http://localhost:99**

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  sarifvisualizer:
    image: mykolaa25/sarifvisualizer:latest
    container_name: sarifvisualizer
    ports:
      - "99:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Then run:

```bash
docker-compose up -d
```

## 📋 Features

- **📁 File Upload**: Drag & drop or click to upload SARIF files
- **📊 Dashboard**: Rich visualizations with charts and statistics
- **📚 Rules Directory**: Browse and explore all analysis rules
- **🔍 Findings Explorer**: Advanced filtering and search capabilities
- **📄 Detailed Views**: Comprehensive issue details with code snippets
- **🔗 Vulnerability Enrichment**: Automatic CVE/CWE information lookup
- **⚡ Performance Optimized**: Web Workers for large file parsing
- **📱 Responsive Design**: Works perfectly on all devices
- **🎨 Modern UI**: Clean, intuitive interface with Tailwind CSS

## 🛠️ Supported SARIF Tools

This visualizer supports [SARIF 2.1.0](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html) specification and works with:

- ✅ ESLint
- ✅ Snyk
- ✅ CodeQL
- ✅ SonarQube
- ✅ Semgrep
- ✅ And many more...

## 📖 Usage

1. **Access the Application**
   - Open http://localhost:99 in your browser

2. **Upload SARIF File**
   - Drag & drop a `.sarif` or `.json` file
   - Or click "Choose File" to select manually

3. **Explore Your Results**
   - View dashboard with summary statistics
   - Browse all rules and their descriptions
   - Filter findings by severity, rule, or file
   - Investigate detailed issue information with CVE/CWE enrichment

## 🔧 Configuration

### Custom Port Mapping

To use a different host port (e.g., port 8080):

```bash
docker run -d -p 8080:80 --name sarifvisualizer mykolaa25/sarifvisualizer:latest
```

Access at http://localhost:8080

### Environment Variables

The container runs a static web application and requires no environment variables.

## 📦 Image Details

- **Base Image**: nginx:stable-alpine
- **Build Process**: Multi-stage build (Node 20 → nginx)
- **Platforms**: linux/amd64, linux/arm64 (multi-platform support)
- **Internal Port**: 80
- **Size**: Optimized for production
- **Healthcheck**: Built-in healthcheck on root endpoint

### Supported Architectures

This image supports multiple architectures:

- `linux/amd64` - Intel/AMD 64-bit (Windows, Linux, Mac Intel)
- `linux/arm64` - ARM 64-bit (Mac M1/M2/M3, Raspberry Pi, AWS Graviton)

Docker will automatically pull the correct image for your platform.

## 🔗 Links

- **GitHub Repository**: https://github.com/NickolaiA/SARIFVisualizer
- **Documentation**: https://github.com/NickolaiA/SARIFVisualizer#readme
- **Issues**: https://github.com/NickolaiA/SARIFVisualizer/issues

## 📄 License

This project is licensed under the MIT License.

## 💝 Support

If you find this tool useful, consider supporting the project:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/nick_a)

---

Made with ❤️ for the security community
