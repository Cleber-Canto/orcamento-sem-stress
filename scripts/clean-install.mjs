import { execSync } from 'child_process';

console.log('Cleaning node_modules and npm cache...');
try {
  execSync('rm -rf /vercel/share/v0-project/node_modules', { stdio: 'inherit' });
  console.log('Removed node_modules');
} catch (e) {
  console.log('Error removing node_modules:', e.message);
}

try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('Cleaned npm cache');
} catch (e) {
  console.log('Error cleaning cache:', e.message);
}

try {
  execSync('cd /vercel/share/v0-project && npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('npm install completed successfully');
} catch (e) {
  console.log('Error during npm install:', e.message);
}

// Verify date-fns version
try {
  const result = execSync('cd /vercel/share/v0-project && node -e "console.log(require(\'date-fns/package.json\').version)"', { encoding: 'utf-8' });
  console.log('date-fns version installed:', result.trim());
} catch (e) {
  console.log('Could not verify date-fns version:', e.message);
}
