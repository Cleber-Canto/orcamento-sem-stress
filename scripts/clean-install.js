import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';

const projectDir = '/vercel/share/v0-project';

console.log('Removing node_modules...');
try {
  rmSync(join(projectDir, 'node_modules'), { recursive: true, force: true });
  console.log('node_modules removed.');
} catch (e) {
  console.log('No node_modules to remove or error:', e.message);
}

console.log('Removing package-lock.json...');
try {
  rmSync(join(projectDir, 'package-lock.json'), { force: true });
  console.log('package-lock.json removed.');
} catch (e) {
  console.log('No package-lock.json to remove.');
}

console.log('Running npm install --legacy-peer-deps...');
try {
  const output = execSync('npm install --legacy-peer-deps', {
    cwd: projectDir,
    encoding: 'utf-8',
    timeout: 120000,
    stdio: 'pipe'
  });
  console.log(output);
  console.log('Install completed successfully!');
} catch (e) {
  console.log('npm install output:', e.stdout || '');
  console.log('npm install errors:', e.stderr || '');
  console.log('Exit code:', e.status);
}
