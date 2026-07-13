# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\get-token\get-token.header-negative.spec.ts >> Get Token B2B header negative >> GT-HDR-025 - X-signature multiple spasi kosong / X-SIGNATURE multiple whitespace
- Location: tests\api\get-token\get-token.header-negative.spec.ts:16:9

# Error details

```
Error: GT-HDR-025: responseCode tidak sesuai. Expected: 4007301; Actual: 4007302 / GT-HDR-025: responseCode mismatch. Expected: 4007301; Actual: 4007302
```

# Test source

```ts
  302 |   expect(
  303 |     Object.prototype.hasOwnProperty.call(body, 'tokenType'),
  304 |     reportText(
  305 |       'Response error tidak boleh menampilkan tokenType',
  306 |       'Error response must not expose tokenType'
  307 |     )
  308 |   ).toBe(false);
  309 | }
  310 | 
  311 | export function assertClientSideHeaderRejection(error: unknown): void {
  312 |   const message = error instanceof Error ? error.message : String(error);
  313 |   expect(
  314 |     /invalid character|invalid header|header value|ERR_INVALID_CHAR|ERR_HTTP_INVALID_HEADER_VALUE/i.test(
  315 |       message
  316 |     ),
  317 |     reportText(
  318 |       `Ekspektasi error validasi HTTP header di sisi client, aktual: ${message}`,
  319 |       `Expected client-side HTTP header validation error, got: ${message}`
  320 |     )
  321 |   ).toBe(true);
  322 | }
  323 | 
  324 | export function getHeader(headers: Record<string, string>, headerName: string): string {
  325 |   const target = headerName.toLowerCase();
  326 |   const found = Object.entries(headers).find(([name]) => name.toLowerCase() === target);
  327 |   return found?.[1] ?? '';
  328 | }
  329 | 
  330 | export function asRecord(value: unknown, message: string): Record<string, unknown> {
  331 |   expect(isRecord(value), message).toBe(true);
  332 |   return value as Record<string, unknown>;
  333 | }
  334 | 
  335 | function sanitizeRawBody(rawBody: string): unknown {
  336 |   try {
  337 |     return sanitizeObject(JSON.parse(rawBody));
  338 |   } catch {
  339 |     return '<non-json raw body redacted>';
  340 |   }
  341 | }
  342 | 
  343 | function isRecord(value: unknown): value is Record<string, unknown> {
  344 |   return typeof value === 'object' && value !== null && !Array.isArray(value);
  345 | }
  346 | 
  347 | function httpStatusFromResponseCode(responseCode: string): number {
  348 |   if (!/^\d{7}$/.test(responseCode)) {
  349 |     throw new Error(
  350 |       reportText(
  351 |         `responseCode tidak valid untuk mengambil HTTP status: ${responseCode}`,
  352 |         `Invalid responseCode for HTTP status derivation: ${responseCode}`
  353 |       )
  354 |     );
  355 |   }
  356 | 
  357 |   return Number(responseCode.slice(0, 3));
  358 | }
  359 | 
  360 | function assertHttpStatusMatchesResponseCode(input: {
  361 |   testCaseId: string;
  362 |   actualHttpStatus: number;
  363 |   responseCode: string;
  364 | }): void {
  365 |   const expectedHttpStatus = httpStatusFromResponseCode(input.responseCode);
  366 | 
  367 |   expect(
  368 |     input.actualHttpStatus,
  369 |     reportText(
  370 |       `${input.testCaseId}: HTTP status harus sama dengan 3 digit awal responseCode. Expected HTTP status: ${expectedHttpStatus}; Actual HTTP status: ${input.actualHttpStatus}; Actual responseCode: ${input.responseCode}`,
  371 |       `${input.testCaseId}: HTTP status must match the first 3 digits of responseCode. Expected HTTP status: ${expectedHttpStatus}; Actual HTTP status: ${input.actualHttpStatus}; Actual responseCode: ${input.responseCode}`
  372 |     )
  373 |   ).toBe(expectedHttpStatus);
  374 | }
  375 | 
  376 | function assertAllowedValue<T extends string | number>(input: {
  377 |   testCaseId: string;
  378 |   labelId: string;
  379 |   labelEn: string;
  380 |   actual: T;
  381 |   expectedValues: T[];
  382 | }): void {
  383 |   const pass = input.expectedValues.includes(input.actual);
  384 |   if (!pass) {
  385 |     throw new Error(
  386 |       reportText(
  387 |         `${input.testCaseId}: ${input.labelId} tidak sesuai. Expected: ${formatExpectedValues(input.expectedValues)}; Actual: ${input.actual}`,
  388 |         `${input.testCaseId}: ${input.labelEn} mismatch. Expected: ${formatExpectedValues(input.expectedValues)}; Actual: ${input.actual}`
  389 |       )
  390 |     );
  391 |   }
  392 | }
  393 | 
  394 | function assertExactValue<T extends string | number>(input: {
  395 |   testCaseId: string;
  396 |   labelId: string;
  397 |   labelEn: string;
  398 |   actual: T;
  399 |   expected: T;
  400 | }): void {
  401 |   if (input.actual !== input.expected) {
> 402 |     throw new Error(
      |           ^ Error: GT-HDR-025: responseCode tidak sesuai. Expected: 4007301; Actual: 4007302 / GT-HDR-025: responseCode mismatch. Expected: 4007301; Actual: 4007302
  403 |       reportText(
  404 |         `${input.testCaseId}: ${input.labelId} tidak sesuai. Expected: ${input.expected}; Actual: ${input.actual}`,
  405 |         `${input.testCaseId}: ${input.labelEn} mismatch. Expected: ${input.expected}; Actual: ${input.actual}`
  406 |       )
  407 |     );
  408 |   }
  409 | }
  410 | 
  411 | function assertExpectedHttpStatusIsConsistent(expected: ExpectedApiError): void {
  412 |   const statusDerivedFromResponseCode = httpStatusFromResponseCode(expected.expectedResponseCode);
  413 | 
  414 |   if (expected.expectedHttpStatus !== statusDerivedFromResponseCode) {
  415 |     throw new Error(
  416 |       reportText(
  417 |         `${expected.testCaseId}: konfigurasi test tidak konsisten. expectedHttpStatus harus mengikuti prefix expectedResponseCode. expectedHttpStatus eksplisit: ${expected.expectedHttpStatus}; HTTP status dari expectedResponseCode: ${statusDerivedFromResponseCode}`,
  418 |         `${expected.testCaseId}: inconsistent test configuration. expectedHttpStatus must follow expectedResponseCode prefix. Explicit expectedHttpStatus: ${expected.expectedHttpStatus}; HTTP status from expectedResponseCode: ${statusDerivedFromResponseCode}`
  419 |       )
  420 |     );
  421 |   }
  422 | }
  423 | 
  424 | function formatExpectedValues(values: Array<string | number>): string {
  425 |   return `[${values.join(', ')}]`;
  426 | }
  427 | 
  428 | function assertResponseMessageMatchesResponseCode(input: {
  429 |   testCaseId: string;
  430 |   responseCode: string;
  431 |   responseMessage: string;
  432 |   expectedMessage: string;
  433 | }): void {
  434 |   const actual = normalizeResponseMessage(input.responseMessage);
  435 |   const matchedMessage = normalizeResponseMessage(input.expectedMessage) === actual;
  436 | 
  437 |   if (!matchedMessage) {
  438 |     throw new Error(
  439 |       reportText(
  440 |         `${input.testCaseId}: responseMessage tidak sesuai TSD untuk responseCode ${input.responseCode}. Expected responseMessage: ${input.expectedMessage}; Actual responseMessage: ${input.responseMessage}`,
  441 |         `${input.testCaseId}: responseMessage does not match TSD for responseCode ${input.responseCode}. Expected responseMessage: ${input.expectedMessage}; Actual responseMessage: ${input.responseMessage}`
  442 |       )
  443 |     );
  444 |   }
  445 | }
  446 | 
  447 | function expectedResponseMessageForCode(responseCode: string, field?: string): string {
  448 |   const template = expectedResponseMessageTemplate(responseCode);
  449 |   if (!template) {
  450 |     return '';
  451 |   }
  452 | 
  453 |   if (requiresFieldPlaceholder(responseCode)) {
  454 |     return template.replace('{...}', `{${field ?? '...'}}`);
  455 |   }
  456 | 
  457 |   return template;
  458 | }
  459 | 
  460 | function expectedResponseMessageTemplate(responseCode: string): string {
  461 |   if (/^200\d{4}$/.test(responseCode)) {
  462 |     return 'Request has been processed successfully';
  463 |   }
  464 | 
  465 |   if (/^400\d{2}00$/.test(responseCode)) {
  466 |     return 'Bad Request';
  467 |   }
  468 | 
  469 |   if (/^400\d{2}01$/.test(responseCode)) {
  470 |     return 'Invalid Field Format {...}';
  471 |   }
  472 | 
  473 |   if (/^400\d{2}02$/.test(responseCode)) {
  474 |     return 'Missing Mandatory Field {...}';
  475 |   }
  476 | 
  477 |   if (/^400\d{2}04$/.test(responseCode)) {
  478 |     return 'Transaction Cancelled';
  479 |   }
  480 | 
  481 |   if (/^400\d{2}13$/.test(responseCode)) {
  482 |     return 'Invalid Amount';
  483 |   }
  484 | 
  485 |   if (/^400\d{2}18$/.test(responseCode)) {
  486 |     return 'Inconsistent Request';
  487 |   }
  488 | 
  489 |   if (/^401\d{2}00$/.test(responseCode)) {
  490 |     return 'Unauthorized Signature';
  491 |   }
  492 | 
  493 |   if (/^401\d{2}01$/.test(responseCode)) {
  494 |     return 'Access Token Invalid';
  495 |   }
  496 | 
  497 |   if (/^404\d{2}00$/.test(responseCode)) {
  498 |     return 'Invalid Transaction Status';
  499 |   }
  500 | 
  501 |   if (/^404\d{2}01$/.test(responseCode)) {
  502 |     return 'Transaction not found';
```