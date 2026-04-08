const { chromium } = require('playwright');

const BASE = 'http://localhost:3000';
const SS = '/tmp/mooni-screenshots';
const EMAIL = 'amu6675@naver.com';
const PASS = '1234abcd';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const results = [];

  async function shot(name) {
    await page.screenshot({ path: `${SS}/${name}.png`, fullPage: false });
    console.log(`📸 ${name}`);
  }

  async function test(name, fn) {
    try {
      await fn();
      results.push({ name, ok: true });
    } catch (e) {
      results.push({ name, ok: false, err: e.message.slice(0, 100) });
      console.log(`❌ ${name}: ${e.message.slice(0, 80)}`);
    }
  }

  await test('01_landing', async () => {
    await page.goto(BASE, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await shot('01_landing');
  });

  await test('02_login', async () => {
    await page.goto(`${BASE}/login`, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await shot('02_login');
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  });

  await test('03_signup', async () => {
    await page.goto(`${BASE}/signup`, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await shot('03_signup');
  });

  await test('04_login_flow', async () => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(student|teacher)/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await shot('04_after_login');
  });

  await test('05_student_home', async () => {
    await page.goto(`${BASE}/student`);
    await page.waitForLoadState('networkidle');
    await shot('05_student_home');
  });

  await test('06_demo', async () => {
    await page.goto(`${BASE}/demo`);
    await page.waitForLoadState('networkidle');
    await shot('06_demo');
  });

  await test('07_demo_student', async () => {
    await page.goto(`${BASE}/demo/student`);
    await page.waitForLoadState('networkidle');
    await shot('07_demo_student');
  });

  await test('08_demo_teacher', async () => {
    await page.goto(`${BASE}/demo/teacher`);
    await page.waitForLoadState('networkidle');
    await shot('08_demo_teacher');
  });

  await test('09_teacher', async () => {
    await page.goto(`${BASE}/teacher`);
    await page.waitForLoadState('networkidle');
    await shot('09_teacher');
  });

  await test('10_unit_new', async () => {
    await page.goto(`${BASE}/teacher/units/new`);
    await page.waitForLoadState('networkidle');
    await shot('10_unit_new');
  });

  await browser.close();

  console.log('\n===== 결과 =====');
  results.forEach(r => console.log(`${r.ok ? '✅' : '❌'} ${r.name}${r.err ? ': ' + r.err : ''}`));
  const fails = results.filter(r => !r.ok);
  console.log(`\n${results.length}개 중 ${results.length - fails.length}개 통과, ${fails.length}개 실패`);
  process.exit(fails.length > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
