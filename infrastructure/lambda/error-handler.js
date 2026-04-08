/**
 * CloudWatch → Lambda → Claude API → GitHub PR
 *
 * 트리거: CloudWatch Logs Subscription Filter (ERROR 패턴)
 * 역할: 에러 로그 분석 → GitHub Issue 생성 → 수정 PR 자동 생성
 */

const https = require('https')
const zlib = require('zlib')

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = 'GOOHAESEUNG/Moni'

exports.handler = async (event) => {
  try {
    // CloudWatch 로그 디코딩
    const payload = Buffer.from(event.awslogs.data, 'base64')
    const decompressed = zlib.gunzipSync(payload).toString()
    const logData = JSON.parse(decompressed)

    const errorLogs = logData.logEvents
      .filter(e => e.message.includes('ERROR') || e.message.includes('Error'))
      .map(e => e.message)
      .join('\n')

    if (!errorLogs) return { statusCode: 200, body: 'No errors found' }

    console.log('에러 감지:', errorLogs.substring(0, 200))

    // Claude API로 에러 분석
    const analysis = await analyzeWithClaude(errorLogs)

    // GitHub Issue 생성
    const issueNumber = await createGitHubIssue(analysis, errorLogs)

    console.log(`Issue #${issueNumber} 생성 완료`)

    return {
      statusCode: 200,
      body: JSON.stringify({ issueNumber, analysis: analysis.summary })
    }
  } catch (err) {
    console.error('Lambda 처리 실패:', err)
    return { statusCode: 500, body: err.message }
  }
}

async function analyzeWithClaude(errorLogs) {
  const body = JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Next.js 16 + Supabase 프로덕션 에러를 분석해줘.

에러 로그:
${errorLogs}

다음 JSON 형식으로만 응답해:
{
  "severity": "CRITICAL|ERROR|WARNING",
  "summary": "에러 한 줄 요약",
  "rootCause": "근본 원인",
  "affectedFile": "src/... 경로 (추정)",
  "fixSuggestion": "구체적인 수정 방향"
}`
    }]
  })

  const response = await callAPI('api.anthropic.com', '/v1/messages', 'POST', {
    'x-api-key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  }, body)

  const text = response.content[0].text
  return JSON.parse(text)
}

async function createGitHubIssue(analysis, rawLog) {
  const body = JSON.stringify({
    title: `fix: ${analysis.summary}`,
    body: `## 에러 심각도
**${analysis.severity}**

## 에러 로그
\`\`\`
${rawLog.substring(0, 1000)}
\`\`\`

## 근본 원인 (AI 분석)
${analysis.rootCause}

## 영향 받는 파일 (추정)
\`${analysis.affectedFile}\`

## 수정 방향
${analysis.fixSuggestion}

---
*이 이슈는 CloudWatch 에러 감지 → Lambda → Claude API 파이프라인으로 자동 생성됐습니다.*`,
    labels: ['fix']
  })

  const response = await callAPI('api.github.com', `/repos/${GITHUB_REPO}/issues`, 'POST', {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'mooni-error-handler'
  }, body)

  return response.number
}

function callAPI(host, path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request({ host, path, method, headers }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error(`JSON 파싱 실패: ${data.substring(0, 100)}`)) }
      })
    })
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}
