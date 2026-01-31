# Quick Start Guide - English Quest

## Installation

### Windows
```bash
install.bat
```

### Unix/Linux/Mac
```bash
chmod +x install.sh
./install.sh
```

### Using npm (all platforms)
```bash
npm run install:all
```

## Starting Development Servers

### Windows
```bash
start.bat
```

### Unix/Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Using npm (all platforms)
```bash
npm run dev
```

## Access Points

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Common Commands

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm run test

# Clean all dependencies
npm run clean:all
```

## Project Structure

```
ENGLISH-AI/
├── frontend/          # React + Vite (port 5173)
├── backend/           # Node.js + Express (port 3000)
├── shared/            # Shared utilities
├── database/          # Database schemas
├── docs/              # Documentation
└── Design_Manage/     # Design documents
```

## Key Features

- **Dependency Isolation**: Each module has its own node_modules
- **Cross-Platform**: Works on Windows, Mac, and Linux
- **Easy Setup**: One-command installation
- **Parallel Development**: Run frontend and backend simultaneously

## Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Complete structure documentation
- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Detailed setup instructions

## Need Help?

Check the documentation files or run:
```bash
npm run --help
```
