# English Quest - Project Structure Documentation

## Overview

This project follows a **modular monorepo architecture** with complete dependency isolation between frontend, backend, and shared modules. Each module maintains its own `node_modules` directory, ensuring clean separation and easy portability across platforms.

## Directory Structure

```
ENGLISH-AI/
├── frontend/                 # React + Vite frontend application
│   ├── node_modules/        # Frontend-specific dependencies (isolated)
│   ├── src/                 # Frontend source code
│   ├── package.json         # Frontend dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
│   ├── vite.config.ts       # Vite configuration
│   └── .env.example         # Environment variables template
│
├── backend/                  # Node.js + Express backend API
│   ├── node_modules/        # Backend-specific dependencies (isolated)
│   ├── src/                 # Backend source code
│   ├── package.json         # Backend dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
│   └── .env.example         # Environment variables template
│
├── shared/                   # Shared code between frontend and backend
│   ├── node_modules/        # Shared module dependencies (isolated)
│   └── package.json         # Shared dependencies
│
├── database/                 # Database schemas and migrations
├── docs/                     # Project documentation
├── Design_Manage/           # Design and management documents
│
├── node_modules/            # Root-level dev tools only (isolated)
├── package.json             # Root package.json (project management only)
├── .gitignore               # Git ignore rules
│
├── install.sh               # Unix/Linux/Mac installation script
├── install.bat              # Windows installation script
├── start.sh                 # Unix/Linux/Mac startup script
├── start.bat                # Windows startup script
│
├── README.md                # Project overview
├── SETUP.md                 # Setup instructions
├── PROJECT_STRUCTURE.md     # This file
└── LICENSE                  # License information
```

## Dependency Isolation Strategy

### Why Isolated Dependencies?

1. **Clean Separation**: Each module has its own dependencies, preventing version conflicts
2. **Easy Portability**: Modules can be moved or deployed independently
3. **Clear Boundaries**: Dependencies are explicit for each module
4. **Better Security**: Vulnerabilities in one module don't affect others
5. **Flexible Deployment**: Deploy frontend and backend to different platforms

### How It Works

- **Root `package.json`**: Contains only project management tools (npm-run-all, rimraf, cross-env)
- **Frontend `package.json`**: Contains React, Vite, and frontend-specific dependencies
- **Backend `package.json`**: Contains Express, database drivers, and backend-specific dependencies
- **Shared `package.json`**: Contains utilities and types shared between frontend and backend

Each directory has its own `node_modules/` folder, completely isolated from others.

## Cross-Platform Support

### Path Handling

All scripts use cross-platform compatible approaches:

- **Scripts**: Use `cross-env` for environment variables
- **File Operations**: Use `rimraf` for cross-platform file deletion
- **Parallel Execution**: Use `npm-run-all` for running multiple scripts

### Installation Scripts

#### Windows
```bash
install.bat
```

#### Unix/Linux/Mac
```bash
chmod +x install.sh
./install.sh
```

#### Using npm (all platforms)
```bash
npm run install:all
```

### Startup Scripts

#### Windows
```bash
start.bat
```

#### Unix/Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

#### Using npm (all platforms)
```bash
npm run dev
```

## Package.json Scripts

### Root Level Scripts

```json
{
  "install:all": "Install all dependencies (root, frontend, backend)",
  "install:frontend": "Install frontend dependencies only",
  "install:backend": "Install backend dependencies only",
  "dev": "Start both frontend and backend in development mode",
  "dev:frontend": "Start frontend development server only",
  "dev:backend": "Start backend development server only",
  "build": "Build both frontend and backend",
  "build:frontend": "Build frontend only",
  "build:backend": "Build backend only",
  "start": "Start both frontend and backend in production mode",
  "lint": "Lint both frontend and backend",
  "clean": "Remove node_modules and build artifacts from all modules",
  "clean:all": "Remove all node_modules including root",
  "test": "Run all tests"
}
```

### Frontend Scripts

```json
{
  "dev": "Start Vite dev server on port 5173",
  "build": "Type-check and build for production",
  "preview": "Preview production build on port 4173",
  "lint": "Run ESLint",
  "lint:fix": "Run ESLint with auto-fix",
  "type-check": "Run TypeScript type checking",
  "clean": "Remove node_modules and build artifacts",
  "reinstall": "Clean and reinstall dependencies"
}
```

### Backend Scripts

```json
{
  "dev": "Start development server with hot reload",
  "build": "Build TypeScript to JavaScript",
  "start": "Start production server",
  "lint": "Run ESLint",
  "lint:fix": "Run ESLint with auto-fix",
  "test": "Run tests",
  "test:watch": "Run tests in watch mode",
  "test:coverage": "Run tests with coverage",
  "db:migrate": "Run database migrations",
  "db:seed": "Seed database with initial data",
  "clean": "Remove node_modules and build artifacts",
  "reinstall": "Clean and reinstall dependencies"
}
```

## Development Workflow

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ENGLISH-AI
   ```

2. **Install dependencies**

   Windows:
   ```bash
   install.bat
   ```

   Unix/Linux/Mac:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

   Or using npm:
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env

   # Backend
   cp backend/.env.example backend/.env
   ```

   Edit the `.env` files with your configuration.

4. **Start development servers**

   Windows:
   ```bash
   start.bat
   ```

   Unix/Linux/Mac:
   ```bash
   ./start.sh
   ```

   Or using npm:
   ```bash
   npm run dev
   ```

### Daily Development

```bash
# Start both servers
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend

# Run linting
npm run lint

# Run tests
npm run test
```

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Build only frontend
npm run build:frontend

# Build only backend
npm run build:backend
```

### Cleaning Up

```bash
# Clean all modules (keep root node_modules)
npm run clean

# Clean everything including root
npm run clean:all

# Reinstall frontend dependencies
cd frontend && npm run reinstall

# Reinstall backend dependencies
cd backend && npm run reinstall
```

## Port Configuration

- **Frontend Development**: http://localhost:5173
- **Frontend Preview**: http://localhost:4173
- **Backend API**: http://localhost:3000

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/english_quest
REDIS_URL=redis://localhost:6379
MONGODB_URL=mongodb://localhost:27017/english_quest
JWT_SECRET=your-secret-key
```

## Git Workflow

The `.gitignore` is configured to exclude:

- All `node_modules/` directories (root, frontend, backend, shared)
- All `package-lock.json` files
- Build artifacts (`dist/`, `build/`)
- Environment files (`.env`, `.env.local`, etc.)
- IDE configurations
- OS-specific files
- Backup files (`*.bak`)

## Troubleshooting

### Dependencies Not Installing

```bash
# Clean everything and reinstall
npm run clean:all
npm run install:all
```

### Port Already in Use

Edit the port in the respective `package.json`:

- Frontend: Change `--port 5173` in `frontend/package.json`
- Backend: Change `PORT` in `backend/.env`

### TypeScript Errors

```bash
# Run type checking
cd frontend && npm run type-check
cd backend && npm run type-check
```

### Cross-Platform Issues

- Always use the provided scripts (install.sh/bat, start.sh/bat)
- Use `cross-env` for environment variables in scripts
- Use `rimraf` instead of `rm -rf` or `del`
- Use forward slashes in paths when possible

## Best Practices

1. **Never commit `node_modules/`**: Always in `.gitignore`
2. **Keep dependencies isolated**: Install in the correct module
3. **Use environment variables**: Never hardcode secrets
4. **Run linting before commits**: `npm run lint`
5. **Test before pushing**: `npm run test`
6. **Document changes**: Update relevant documentation
7. **Use cross-platform tools**: Ensure scripts work on all platforms

## Adding New Dependencies

### Frontend Dependency
```bash
cd frontend
npm install <package-name>
```

### Backend Dependency
```bash
cd backend
npm install <package-name>
```

### Shared Dependency
```bash
cd shared
npm install <package-name>
```

### Root Dev Tool
```bash
npm install --save-dev <package-name>
```

## Migration from Monolithic Structure

If migrating from a monolithic structure:

1. Move frontend code to `frontend/`
2. Move backend code to `backend/`
3. Split `package.json` into module-specific files
4. Run `npm run install:all`
5. Update import paths if necessary
6. Test thoroughly

## Additional Resources

- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [frontend/README.md](./frontend/README.md) - Frontend documentation
- [backend/README.md](./backend/README.md) - Backend documentation

## Support

For issues or questions:
1. Check this documentation
2. Review the README files in each module
3. Check the issue tracker
4. Contact the development team

---

**Last Updated**: 2026-01-31
**Version**: 0.1.0
