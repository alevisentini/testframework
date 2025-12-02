import { execSync } from 'child_process';

export const runArtillery = () => {
  execSync('npx artillery run tests/performance/artillery/login-performance.yml', {
    stdio: 'inherit'
  });
};

export const runJMeter = () => {
  execSync('jmeter -n -t tests/performance/jmeter/login.jmx -l jmeter-results.jtl', {
    stdio: 'inherit'
  });
};
