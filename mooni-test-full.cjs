const { chromium } = require('playwright');

const BASE = 'http://localhost:3000';
const SS = '/tmp/mooni-screenshots';
const STUDENT = { email: 'amu6675@naver.com', pass: '1234abcd' };
const TEACHER = { email: 'teacher@mooni.test', pass: 'teacher1234' };

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  async function test(name, fn, ctx) {
    try { await fn(ctx); results.push({ name, ok: true }); }
    catch(e) { results.push({ name, ok: false, err: e.message.slice(0,120) }); console.log(`❌ ${name}`); }
  }

  async function login(page, email, pass) {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', pass);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(student|teacher)/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  }

  // ── 비로그인 화면 ──
  const pub = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pubPage = await pub.newPage();

  await test('01_landing', async (p) => {
    await p.goto(BASE); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/01_landing.png` });
    // 무니 이미지 존재 확인
    const mooni = await p.$('img[src*="mooni"]');
    if (!mooni) throw new Error('랜딩에 무니 이미지 없음');
  }, pubPage);

  await test('02_login', async (p) => {
    await p.goto(`${BASE}/login`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/02_login.png` });
  }, pubPage);

  await test('03_signup', async (p) => {
    await p.goto(`${BASE}/signup`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/03_signup.png` });
  }, pubPage);

  await test('06_demo_select', async (p) => {
    await p.goto(`${BASE}/demo`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/06_demo.png` });
  }, pubPage);

  await test('07_demo_student', async (p) => {
    await p.goto(`${BASE}/demo/student`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/07_demo_student.png` });
    // PC 힌트 텍스트 없어야 함
    const hint = await p.$('text=Enter로 전송');
    if (hint) throw new Error('PC 키보드 힌트 텍스트 남아있음');
  }, pubPage);

  await test('08_demo_teacher', async (p) => {
    await p.goto(`${BASE}/demo/teacher`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/08_demo_teacher.png` });
  }, pubPage);
  await pub.close();

  // ── 학생 로그인 ──
  const stdCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const std = await stdCtx.newPage();
  await test('04_login_student', async (p) => {
    await login(p, STUDENT.email, STUDENT.pass);
    await p.screenshot({ path: `${SS}/04_student_login.png` });
  }, std);

  await test('05_student_home', async (p) => {
    await p.goto(`${BASE}/student`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/05_student_home.png` });
  }, std);
  await stdCtx.close();

  // ── 선생님 로그인 ──
  const tchCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const tch = await tchCtx.newPage();
  await test('09_login_teacher', async (p) => {
    await login(p, TEACHER.email, TEACHER.pass);
    await p.screenshot({ path: `${SS}/09_teacher_login.png` });
  }, tch);

  await test('10_teacher_dashboard', async (p) => {
    await p.goto(`${BASE}/teacher`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/10_teacher_dashboard.png` });
  }, tch);

  await test('11_unit_new', async (p) => {
    await p.goto(`${BASE}/teacher/units/new`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/11_unit_new.png` });
    // 폼 요소 확인
    await p.waitForSelector('input, textarea', { timeout: 5000 });
  }, tch);

  await test('12_teacher_students', async (p) => {
    await p.goto(`${BASE}/teacher/students`); await p.waitForLoadState('networkidle');
    await p.screenshot({ path: `${SS}/12_teacher_students.png` });
  }, tch);
  await tchCtx.close();

  await browser.close();

  console.log('\n===== 결과 =====');
  results.forEach(r => console.log(`${r.ok?'✅':'❌'} ${r.name}${r.err?': '+r.err:''}`));
  const fails = results.filter(r => !r.ok);
  console.log(`\n${results.length}개 중 ✅${results.length-fails.length} ❌${fails.length}`);
  process.exit(fails.length > 0 ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
