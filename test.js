import { scanWebsite } from "./src/scanner.js";
import { 
    checkSecurityHeaders, 
    checkHTTPS, 
    checkCookies,
    checkTLS 
} from "./src/checks.js";
import { calculateScore, generateReport } from "./src/report.js";

const result = await scanWebsite("https://futbaze.streamlit.app/");

const checks = checkSecurityHeaders(result.headers);

checks.unshift(checkHTTPS(result.url));
checks.push(checkCookies(result.headers));
checks.push(checkTLS(result.protocol));

const score = calculateScore(checks);

console.log("WEBGUARD SECURITY REPORT");
console.log("------------------------");
console.log("Website:", result.url);
console.log("Security Score:", score + " / 100");
console.log("");

generateReport(checks);