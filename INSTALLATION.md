# Installation Guide

Complete guide to install and set up DevTools Hub locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org)
  - Verify installation: `node --version`

- **npm**: Usually comes with Node.js
  - Verify installation: `npm --version`

- **Git**: For cloning the repository
  - Download from [git-scm.com](https://git-scm.com)
  - Verify installation: `git --version`

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/maman/devtools-hub.git
cd devtools-hub
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

Or using pnpm:
```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` if needed (most defaults should work):

```env
# Optional: Add your configuration here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### 5. Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the DevTools Hub homepage
3. Try clicking on a tool to verify everything is working

## Build for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm start
```

The application will run on [http://localhost:3000](http://localhost:3000)

## Docker Installation

### Build Docker Image

```bash
docker build -t devtools-hub .
```

### Run Docker Container

```bash
docker run -p 3000:3000 devtools-hub
```

Access the application at [http://localhost:3000](http://localhost:3000)

### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  devtools-hub:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

Run with:
```bash
docker-compose up
```

## Troubleshooting

### Issue: Port 3000 Already in Use

**Solution**: Use a different port:
```bash
npm run dev -- -p 3001
```

### Issue: Module Not Found

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors

**Solution**: Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

### Issue: Out of Memory

**Solution**: Increase Node memory:
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Issue: Slow Installation

**Solution**: Use npm cache clean:
```bash
npm cache clean --force
npm install
```

## System Requirements

### Minimum Requirements
- **RAM**: 2GB
- **Disk Space**: 500MB
- **CPU**: Dual-core processor

### Recommended Requirements
- **RAM**: 4GB or more
- **Disk Space**: 1GB or more
- **CPU**: Quad-core processor or better

## Supported Operating Systems

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 18.04+
- ✅ Debian 10+
- ✅ CentOS 7+

## Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Next Steps

After installation:

1. **Explore Tools**: Visit [http://localhost:3000](http://localhost:3000) and try different tools
2. **Read Documentation**: Check [README.md](README.md) for detailed information
3. **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
4. **Deploy**: Follow deployment guides for production setup

## Getting Help

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Search [GitHub Issues](https://github.com/maman/devtools-hub/issues)
3. Create a new issue with details
4. Ask in [GitHub Discussions](https://github.com/maman/devtools-hub/discussions)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Uninstallation

To completely remove DevTools Hub:

```bash
# Remove the directory
rm -rf devtools-hub

# If using Docker, remove the image
docker rmi devtools-hub
```

---

**Happy coding! 🚀**
