#!/usr/bin/env node

/**
 * DreamDwelling Development Server Runner
 * Runs both frontend and backend with colored, prefixed output
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// Configuration
const projectRoot = __dirname;
const backendPath = path.join(projectRoot, "backend");
const frontendPath = path.join(projectRoot, "frontend");
const venvPath = path.join(projectRoot, "venv");
const venvActivate = path.join(venvPath, "Scripts", "activate.bat");

// Helper functions
function colorLog(message, prefix, color) {
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
  console.log(
    `${colors.gray}[${timestamp}]${colors.reset} ${color}[${prefix}]${colors.reset} ${message}`
  );
}

function checkPaths() {
  const errors = [];

  if (!fs.existsSync(venvActivate)) {
    errors.push(`Virtual environment not found at: ${venvActivate}`);
  }

  if (!fs.existsSync(backendPath)) {
    errors.push(`Backend directory not found at: ${backendPath}`);
  }

  if (!fs.existsSync(frontendPath)) {
    errors.push(`Frontend directory not found at: ${frontendPath}`);
  }

  if (errors.length > 0) {
    console.log(`${colors.red}[ERROR]${colors.reset} Setup validation failed:`);
    errors.forEach((error) => console.log(`  - ${error}`));
    process.exit(1);
  }
}

function killExistingServers() {
  colorLog("Checking for existing servers...", "INFO", colors.yellow);

  // On Windows, we'll skip the port killing for simplicity
  // Users can manually kill processes if needed
}

function startBackend() {
  return new Promise((resolve) => {
    colorLog("Starting Django backend server...", "BACKEND", colors.green);

    const backend = spawn(
      "cmd",
      [
        "/c",
        `cd /d "${backendPath}" && "${venvActivate}" && python manage.py runserver`,
      ],
      {
        stdio: ["pipe", "pipe", "pipe"],
        shell: true,
      }
    );

    let started = false;

    backend.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");
      lines.forEach((line) => {
        if (line.trim()) {
          colorLog(line.trim(), "BACKEND", colors.green);

          if (line.includes("Starting development server") && !started) {
            started = true;
            console.log(
              `\n${colors.green}✅ Django backend is ready!${colors.reset}`
            );
            console.log(
              `${colors.green}   🔗 Main site: http://127.0.0.1:8000/${colors.reset}`
            );
            console.log(
              `${colors.green}   🔧 Admin: http://127.0.0.1:8000/admin/${colors.reset}`
            );
            console.log(
              `${colors.green}   📚 API docs: http://127.0.0.1:8000/swagger/${colors.reset}\n`
            );
          }
        }
      });
    });

    backend.stderr.on("data", (data) => {
      const lines = data.toString().split("\n");
      lines.forEach((line) => {
        if (line.trim()) {
          colorLog(line.trim(), "BACKEND", colors.red);
        }
      });
    });

    backend.on("close", (code) => {
      colorLog(
        `Django process exited with code ${code}`,
        "BACKEND",
        colors.red
      );
    });

    resolve(backend);
  });
}

function startFrontend() {
  return new Promise((resolve) => {
    colorLog("Starting Next.js frontend server...", "FRONTEND", colors.blue);

    const frontend = spawn("npm", ["run", "dev"], {
      cwd: frontendPath,
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });

    let started = false;

    frontend.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");
      lines.forEach((line) => {
        if (line.trim()) {
          colorLog(line.trim(), "FRONTEND", colors.blue);

          if (line.includes("localhost:3000") && !started) {
            started = true;
            console.log(
              `\n${colors.blue}✅ Next.js frontend is ready!${colors.reset}`
            );
            console.log(
              `${colors.blue}   🔗 Main site: http://localhost:3000/${colors.reset}\n`
            );
          }
        }
      });
    });

    frontend.stderr.on("data", (data) => {
      const lines = data.toString().split("\n");
      lines.forEach((line) => {
        if (line.trim()) {
          colorLog(line.trim(), "FRONTEND", colors.red);
        }
      });
    });

    frontend.on("close", (code) => {
      colorLog(
        `Next.js process exited with code ${code}`,
        "FRONTEND",
        colors.red
      );
    });

    resolve(frontend);
  });
}

// Main execution
async function main() {
  console.log(
    `\n${colors.magenta}🏠 DreamDwelling Development Server${colors.reset}`
  );
  console.log(
    `${colors.magenta}===================================${colors.reset}\n`
  );

  // Validate setup
  checkPaths();

  // Kill existing servers
  killExistingServers();

  colorLog("Starting development servers...", "INFO", colors.yellow);

  // Start both servers
  const backendProcess = await startBackend();

  // Wait a bit before starting frontend
  setTimeout(async () => {
    const frontendProcess = await startFrontend();

    // Handle cleanup on exit
    const cleanup = () => {
      colorLog("Stopping development servers...", "INFO", colors.yellow);

      if (backendProcess && !backendProcess.killed) {
        backendProcess.kill("SIGTERM");
      }

      if (frontendProcess && !frontendProcess.killed) {
        frontendProcess.kill("SIGTERM");
      }

      setTimeout(() => {
        colorLog("Development servers stopped.", "INFO", colors.yellow);
        process.exit(0);
      }, 1000);
    };

    // Handle various exit scenarios
    process.on("SIGINT", cleanup); // Ctrl+C
    process.on("SIGTERM", cleanup); // Termination
    process.on("exit", cleanup); // Normal exit

    // Show instructions
    colorLog("🚀 Development servers are running!", "INFO", colors.cyan);
    colorLog("Press Ctrl+C to stop all servers", "INFO", colors.cyan);
  }, 3000);
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${error.message}`);
    process.exit(1);
  });
}
