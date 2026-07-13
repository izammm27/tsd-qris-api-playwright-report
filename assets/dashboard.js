const dashboardData = JSON.parse(document.getElementById('dashboard-data').textContent);
const defaultState = {
  search: '',
  module: 'All modules',
  category: 'All categories',
  status: 'All statuses',
  sort: 'id',
  failedOnly: true,
  page: 1,
  pageSize: '25'
};
let state = { ...defaultState };

const statusClass = {
  PASSED: 'status-passed',
  FAILED: 'status-failed',
  UNSTABLE: 'status-unstable',
  passed: 'status-passed',
  failed: 'status-failed',
  flaky: 'status-flaky',
  skipped: 'status-skipped'
};

function formatMs(value) {
  if (typeof value !== 'number') return 'N/A';
  if (value >= 60000) return (value / 60000).toFixed(2) + 'm';
  if (value >= 1000) return (value / 1000).toFixed(2) + 's';
  return Math.round(value) + 'ms';
}

function escapeHtml(value) {
  return String(value ?? 'N/A')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function prettyJson(value) {
  if (value === undefined || value === null) return 'N/A';
  return JSON.stringify(value, null, 2);
}

function renderHeader() {
  const status = document.getElementById('overallStatus');
  status.textContent = dashboardData.metadata.status;
  status.className = 'status-pill ' + statusClass[dashboardData.metadata.status];

  const metadata = [
    ['Environment', dashboardData.metadata.environment],
    ['Base URL', dashboardData.metadata.baseUrl],
    ['Executed At Asia/Jakarta', dashboardData.metadata.executedAtJakarta],
    ['Branch', dashboardData.metadata.branch],
    ['Commit', dashboardData.metadata.commitSha],
    ['Build Number', dashboardData.metadata.buildNumber],
    ['Triggered By', dashboardData.metadata.triggeredBy],
    ['Workers', dashboardData.metadata.workers],
    ['Total Duration', formatMs(dashboardData.metadata.totalDurationMs)],
    ['Playwright', dashboardData.metadata.playwrightVersion],
    ['Node.js', dashboardData.metadata.nodeVersion]
  ];

  document.getElementById('metadata').innerHTML = metadata
    .map(([label, value]) => '<div class="metadata-card"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>')
    .join('');
}

function renderRecommendation() {
  const recommendation = dashboardData.recommendation;
  const className = recommendation.status === 'GO' ? 'status-passed' : recommendation.status === 'NO GO' ? 'status-failed' : 'status-unstable';
  document.getElementById('recommendation').innerHTML =
    '<div><h2>Release Recommendation</h2><p>' +
    escapeHtml(recommendation.reason) +
    '</p></div><span class="status-pill ' +
    className +
    '">' +
    escapeHtml(recommendation.status) +
    '</span>';
}

function renderSummary() {
  const summary = dashboardData.summary;
  const cards = [
    ['Total Tests', summary.total, 'info'],
    ['Passed', summary.passed, 'passed'],
    ['Failed', summary.failed, 'failed'],
    ['Flaky', summary.flaky, 'flaky'],
    ['Skipped', summary.skipped, 'skipped'],
    ['Pass Rate', summary.passRate + '%', 'info'],
    ['Total Duration', formatMs(summary.totalDurationMs), 'info'],
    ['Average Response Time', summary.averageResponseTimeMs ? formatMs(summary.averageResponseTimeMs) : 'N/A', 'info']
  ];

  document.getElementById('summaryCards').innerHTML = cards
    .map(([label, value, className]) => '<div class="summary-card ' + className + '"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>')
    .join('');
}

function renderChart(targetId, groups) {
  document.getElementById(targetId).innerHTML = groups
    .map((group) => {
      const total = group.total || 1;
      return (
        '<div class="chart-card"><div class="chart-title"><strong>' +
        escapeHtml(group.name) +
        '</strong><span>' +
        group.passRate +
        '% pass</span></div><div class="bar">' +
        '<span class="passed" style="width:' +
        (group.passed / total) * 100 +
        '%"></span>' +
        '<span class="failed" style="width:' +
        (group.failed / total) * 100 +
        '%"></span>' +
        '<span class="flaky" style="width:' +
        (group.flaky / total) * 100 +
        '%"></span>' +
        '<span class="skipped" style="width:' +
        (group.skipped / total) * 100 +
        '%"></span></div><div class="chart-meta">' +
        '<span>Total ' +
        group.total +
        '</span><span>Passed ' +
        group.passed +
        '</span><span>Failed ' +
        group.failed +
        '</span><span>Skipped ' +
        group.skipped +
        '</span><span>Duration ' +
        formatMs(group.durationMs) +
        '</span></div></div>'
      );
    })
    .join('');
}

function populateFilters() {
  fillSelect('moduleFilter', 'All modules', [...new Set(dashboardData.tests.map((test) => test.module))]);
  fillSelect('categoryFilter', 'All categories', [...new Set(dashboardData.tests.map((test) => test.category))]);
  fillSelect('statusFilter', 'All statuses', ['passed', 'failed', 'flaky', 'skipped']);
}

function fillSelect(id, first, values) {
  const select = document.getElementById(id);
  select.innerHTML = [first, ...values.sort()]
    .map((value) => '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + '</option>')
    .join('');
}

function filteredTests() {
  let tests = dashboardData.tests.slice();
  if (state.failedOnly) tests = tests.filter((test) => test.status === 'failed');
  if (state.search) {
    const search = state.search.toLowerCase();
    tests = tests.filter((test) => (test.id + ' ' + test.scenario).toLowerCase().includes(search));
  }
  if (state.module !== 'All modules') tests = tests.filter((test) => test.module === state.module);
  if (state.category !== 'All categories') tests = tests.filter((test) => test.category === state.category);
  if (state.status !== 'All statuses') tests = tests.filter((test) => test.status === state.status);

  tests.sort((left, right) => {
    if (state.sort === 'duration') return right.durationMs - left.durationMs;
    if (state.sort === 'responseTime') return (right.responseTimeMs || 0) - (left.responseTimeMs || 0);
    return left.id.localeCompare(right.id);
  });

  return tests;
}

function currentPageSize(total) {
  if (state.pageSize === 'all') return Math.max(total, 1);
  return Number(state.pageSize) || 25;
}

function paginatedTests() {
  const tests = filteredTests();
  const total = tests.length;
  const pageSize = currentPageSize(total);
  const totalPages = state.pageSize === 'all' ? 1 : Math.max(1, Math.ceil(total / pageSize));
  state.page = Math.min(Math.max(state.page, 1), totalPages);
  const start = total === 0 ? 0 : (state.page - 1) * pageSize;
  const end = state.pageSize === 'all' ? total : Math.min(start + pageSize, total);

  return {
    allFiltered: tests,
    pageItems: tests.slice(start, end),
    start,
    end,
    total,
    totalPages
  };
}

function updateFailedOnlyButton() {
  document.getElementById('failedOnlyButton').textContent = state.failedOnly ? 'Show All' : 'Show Failed Only';
}

function updatePagination(result) {
  const totalTests = dashboardData.tests.length;
  const visibleStart = result.total === 0 ? 0 : result.start + 1;
  document.getElementById('tableResultSummary').textContent =
    'Showing ' +
    visibleStart +
    '-' +
    result.end +
    ' of ' +
    result.total +
    ' filtered tests (' +
    totalTests +
    ' total)';
  document.getElementById('pageInfo').textContent = 'Page ' + state.page + ' of ' + result.totalPages;

  const isFirst = state.page <= 1;
  const isLast = state.page >= result.totalPages;
  document.getElementById('firstPageButton').disabled = isFirst;
  document.getElementById('prevPageButton').disabled = isFirst;
  document.getElementById('nextPageButton').disabled = isLast;
  document.getElementById('lastPageButton').disabled = isLast;
}

function resetPageAndRender() {
  state.page = 1;
  renderTable();
}

function renderTable() {
  const result = paginatedTests();
  const tests = result.pageItems;
  document.getElementById('failedTableBody').innerHTML =
    tests
      .map((test, index) => {
        const evidenceId = 'evidence-' + (result.start + index);
        return (
          '<tr><td><strong>' +
          escapeHtml(test.id) +
          '</strong></td><td>' +
          escapeHtml(test.module) +
          '</td><td>' +
          escapeHtml(test.category) +
          '</td><td class="wrap">' +
          escapeHtml(test.scenario) +
          '</td><td>' +
          escapeHtml(test.expectedHttpStatus) +
          '</td><td>' +
          escapeHtml(test.actualHttpStatus) +
          '</td><td>' +
          escapeHtml(test.expectedResponseCode) +
          '</td><td>' +
          escapeHtml(test.actualResponseCode) +
          '</td><td class="wrap">' +
          escapeHtml(test.expectedResponseMessage) +
          '</td><td class="wrap">' +
          escapeHtml(test.actualResponseMessage) +
          '</td><td class="wrap">' +
          escapeHtml(test.failureReason) +
          '</td><td>' +
          escapeHtml(formatMs(test.responseTimeMs)) +
          '</td><td class="wrap">' +
          escapeHtml(test.sourceFile + (test.line ? ':' + test.line : '')) +
          '</td><td><button type="button" data-toggle="' +
          evidenceId +
          '">Details</button></td><td><span class="pill ' +
          statusClass[test.status] +
          '">' +
          escapeHtml(test.status.toUpperCase()) +
          '</span></td></tr><tr id="' +
          evidenceId +
          '" class="evidence-row" hidden><td colspan="15">' +
          renderEvidence(test) +
          '</td></tr>'
        );
      })
      .join('') || '<tr><td colspan="15">No test cases match the current filter.</td></tr>';

  updatePagination(result);

  document.querySelectorAll('[data-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const row = document.getElementById(button.getAttribute('data-toggle'));
      row.hidden = !row.hidden;
    });
  });

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.getAttribute('data-copy'));
      await navigator.clipboard.writeText(target.textContent);
      button.textContent = 'Copied';
      setTimeout(() => (button.textContent = 'Copy'), 1200);
    });
  });
}

function renderEvidence(test) {
  const expected = test.evidence?.expected || {};
  const request = test.evidence?.request || {};
  const response = test.evidence?.response || {};
  const stack = test.stack || 'N/A';
  return (
    '<div class="evidence-grid">' +
    evidenceBlock('Expected', expected, test.id + '-expected') +
    evidenceBlock('Request', request, test.id + '-request') +
    evidenceBlock('Response', response, test.id + '-response') +
    '</div>' +
    '<details><summary>Failure stack</summary><pre id="' +
    test.id +
    '-stack">' +
    escapeHtml(stack) +
    '</pre><button class="copy-button" type="button" data-copy="' +
    test.id +
    '-stack">Copy</button></details>'
  );
}

function evidenceBlock(title, value, id) {
  return (
    '<details><summary>' +
    escapeHtml(title) +
    '</summary><pre id="' +
    id +
    '">' +
    escapeHtml(prettyJson(value)) +
    '</pre><button class="copy-button" type="button" data-copy="' +
    id +
    '">Copy</button></details>'
  );
}

function bindEvents() {
  document.getElementById('searchInput').addEventListener('input', (event) => {
    state.search = event.target.value;
    resetPageAndRender();
  });
  document.getElementById('moduleFilter').addEventListener('change', (event) => {
    state.module = event.target.value;
    resetPageAndRender();
  });
  document.getElementById('categoryFilter').addEventListener('change', (event) => {
    state.category = event.target.value;
    resetPageAndRender();
  });
  document.getElementById('statusFilter').addEventListener('change', (event) => {
    state.status = event.target.value;
    state.failedOnly = false;
    updateFailedOnlyButton();
    resetPageAndRender();
  });
  document.getElementById('sortSelect').addEventListener('change', (event) => {
    state.sort = event.target.value;
    resetPageAndRender();
  });
  document.getElementById('pageSizeSelect').addEventListener('change', (event) => {
    state.pageSize = event.target.value;
    resetPageAndRender();
  });
  document.getElementById('firstPageButton').addEventListener('click', () => {
    state.page = 1;
    renderTable();
  });
  document.getElementById('prevPageButton').addEventListener('click', () => {
    state.page -= 1;
    renderTable();
  });
  document.getElementById('nextPageButton').addEventListener('click', () => {
    state.page += 1;
    renderTable();
  });
  document.getElementById('lastPageButton').addEventListener('click', () => {
    const result = paginatedTests();
    state.page = result.totalPages;
    renderTable();
  });
  document.getElementById('failedOnlyButton').addEventListener('click', () => {
    state.failedOnly = !state.failedOnly;
    if (state.failedOnly) {
      state.status = 'All statuses';
      document.getElementById('statusFilter').value = state.status;
    }
    updateFailedOnlyButton();
    resetPageAndRender();
  });
  document.getElementById('resetButton').addEventListener('click', () => {
    state = { ...defaultState };
    document.getElementById('searchInput').value = '';
    document.getElementById('moduleFilter').value = state.module;
    document.getElementById('categoryFilter').value = state.category;
    document.getElementById('statusFilter').value = state.status;
    document.getElementById('sortSelect').value = state.sort;
    document.getElementById('pageSizeSelect').value = state.pageSize;
    updateFailedOnlyButton();
    renderTable();
  });
}

renderHeader();
renderRecommendation();
renderSummary();
renderChart('moduleChart', dashboardData.modules);
renderChart('categoryChart', dashboardData.categories);
populateFilters();
bindEvents();
updateFailedOnlyButton();
renderTable();
