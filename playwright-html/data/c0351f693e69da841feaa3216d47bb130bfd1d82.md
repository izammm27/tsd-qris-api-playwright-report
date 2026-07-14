# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\generate-qris-dynamic\generate-qris-dynamic.contract.spec.ts >> Generate QRIS Dynamic contract >> DYN-CON-001 - validasi response header / validate response header
- Location: tests\api\generate-qris-dynamic\generate-qris-dynamic.contract.spec.ts:8:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  1  | import { expect, test } from '../../fixtures/api.fixture';
  2  | 
  3  | import { reportTitle } from '../../../src/shared/utils/report-language';
  4  | import { isValidSnapTimestamp } from '../../../src/shared/utils/timestamp';
  5  | import { attachDynamicApiExchange, assertDynamicSuccessExchange, getHeader } from './helpers';
  6  | 
  7  | test.describe('Generate QRIS Dynamic contract', () => {
  8  |   test(
  9  |     reportTitle('DYN-CON-001', 'validasi response header', 'validate response header'),
  10 |     async ({ generateQrisDynamicClient, dynamicEnv }, testInfo) => {
  11 |       const exchange = await generateQrisDynamicClient.generateDynamicQris();
  12 | 
  13 |       await attachDynamicApiExchange(testInfo, 'DYN-CON-001', exchange);
  14 |       expect(getHeader(exchange.response.headers, 'content-type')).toContain('application/json');
> 15 |       expect(isValidSnapTimestamp(getHeader(exchange.response.headers, 'x-timestamp'))).toBe(true);
     |                                                                                         ^ Error: expect(received).toBe(expected) // Object.is equality
  16 |       assertDynamicSuccessExchange(exchange, dynamicEnv);
  17 |     }
  18 |   );
  19 | 
  20 |   test(
  21 |     reportTitle('DYN-CON-002', 'validasi JSON schema', 'validate JSON schema'),
  22 |     async ({ generateQrisDynamicClient, dynamicEnv }, testInfo) => {
  23 |       const exchange = await generateQrisDynamicClient.generateDynamicQris();
  24 | 
  25 |       await attachDynamicApiExchange(testInfo, 'DYN-CON-002', exchange);
  26 |       assertDynamicSuccessExchange(exchange, dynamicEnv);
  27 |     }
  28 |   );
  29 | 
  30 |   test(
  31 |     reportTitle('DYN-CON-003', 'validasi responseCode 2004700', 'validate responseCode 2004700'),
  32 |     async ({ generateQrisDynamicClient, dynamicEnv }, testInfo) => {
  33 |       const exchange = await generateQrisDynamicClient.generateDynamicQris();
  34 |       const body = exchange.response.body as Record<string, unknown>;
  35 | 
  36 |       await attachDynamicApiExchange(testInfo, 'DYN-CON-003', exchange);
  37 |       expect(body.responseCode).toBe('2004700');
  38 |       assertDynamicSuccessExchange(exchange, dynamicEnv);
  39 |     }
  40 |   );
  41 | 
  42 |   test(
  43 |     reportTitle(
  44 |       'DYN-CON-004',
  45 |       'partnerReferenceNo response sama dengan request',
  46 |       'response partnerReferenceNo equals request'
  47 |     ),
  48 |     async ({ generateQrisDynamicClient, dynamicEnv }, testInfo) => {
  49 |       const exchange = await generateQrisDynamicClient.generateDynamicQris();
  50 | 
  51 |       await attachDynamicApiExchange(testInfo, 'DYN-CON-004', exchange);
  52 |       assertDynamicSuccessExchange(exchange, dynamicEnv);
  53 |     }
  54 |   );
  55 | 
  56 |   test(
  57 |     reportTitle(
  58 |       'DYN-CON-005',
  59 |       'referenceNo dan qrContent tidak kosong',
  60 |       'referenceNo and qrContent are not empty'
  61 |     ),
  62 |     async ({ generateQrisDynamicClient, dynamicEnv }, testInfo) => {
  63 |       const exchange = await generateQrisDynamicClient.generateDynamicQris();
  64 |       const body = exchange.response.body as Record<string, unknown>;
  65 | 
  66 |       await attachDynamicApiExchange(testInfo, 'DYN-CON-005', exchange);
  67 |       expect(String(body.referenceNo)).not.toBe('');
  68 |       expect(String(body.qrContent)).not.toBe('');
  69 |       assertDynamicSuccessExchange(exchange, dynamicEnv);
  70 |     }
  71 |   );
  72 | 
  73 |   test(
  74 |     reportTitle(
  75 |       'DYN-CON-006',
  76 |       'response time berada dalam API_MAX_RESPONSE_MS',
  77 |       'response time is within API_MAX_RESPONSE_MS'
  78 |     ),
  79 |     async ({ generateQrisDynamicClient, dynamicEnv }, testInfo) => {
  80 |       const exchange = await generateQrisDynamicClient.generateDynamicQris();
  81 | 
  82 |       await attachDynamicApiExchange(testInfo, 'DYN-CON-006', exchange);
  83 |       expect(exchange.response.responseTimeMs).toBeLessThanOrEqual(dynamicEnv.apiMaxResponseMs);
  84 |       assertDynamicSuccessExchange(exchange, dynamicEnv);
  85 |     }
  86 |   );
  87 | });
  88 | 
```