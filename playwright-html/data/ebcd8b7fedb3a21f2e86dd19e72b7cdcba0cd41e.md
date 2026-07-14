# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\cancel-qris\cancel-qris.header-negative.spec.ts >> Cancel QRIS header negative >> CNL-HDR-023 - X-PARTNER-ID karakter tab / X-PARTNER-ID tab character
- Location: tests\api\cancel-qris\cancel-qris.header-negative.spec.ts:15:9

# Error details

```
Error: Ekspektasi error validasi HTTP header Cancel di sisi client, aktual: CNL-HDR-023: responseCode tidak sesuai. Expected: 4007701; Actual: 4007702 / CNL-HDR-023: responseCode mismatch. Expected: 4007701; Actual: 4007702 / Expected Cancel client-side HTTP header validation error, got: CNL-HDR-023: responseCode tidak sesuai. Expected: 4007701; Actual: 4007702 / CNL-HDR-023: responseCode mismatch. Expected: 4007701; Actual: 4007702

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  168 | ): void {
  169 |   const responseTimestamp = getHeader(exchange.response.headers, 'x-timestamp');
  170 |   expect(
  171 |     responseTimestamp,
  172 |     reportText(
  173 |       `Response header Cancel X-TIMESTAMP wajib ada sesuai TSD untuk ${testCaseId}`,
  174 |       `Cancel response header X-TIMESTAMP is mandatory in TSD for ${testCaseId}`
  175 |     )
  176 |   ).toBeTruthy();
  177 |   expect(
  178 |     responseTimestamp.length,
  179 |     reportText(
  180 |       `Panjang response Cancel X-TIMESTAMP harus <= 64 untuk ${testCaseId}`,
  181 |       `Cancel response X-TIMESTAMP length must be <= 64 for ${testCaseId}`
  182 |     )
  183 |   ).toBeLessThanOrEqual(64);
  184 |   expect(
  185 |     isValidSnapTimestamp(responseTimestamp, env.expectedTimestampOffset),
  186 |     reportText(
  187 |       `Response Cancel X-TIMESTAMP harus sesuai YYYY-MM-DDTHH:mm:ss${env.expectedTimestampOffset} untuk ${testCaseId}`,
  188 |       `Cancel response X-TIMESTAMP must match YYYY-MM-DDTHH:mm:ss${env.expectedTimestampOffset} for ${testCaseId}`
  189 |     )
  190 |   ).toBe(true);
  191 | }
  192 | 
  193 | export function assertCancelErrorExchange(
  194 |   exchange: CancelQrisExchange,
  195 |   expected: ExpectedCancelApiError
  196 | ): void {
  197 |   expect(
  198 |     getHeader(exchange.response.headers, 'content-type'),
  199 |     reportText(
  200 |       `Content-Type response error Cancel untuk ${expected.testCaseId}`,
  201 |       `Cancel error response Content-Type for ${expected.testCaseId}`
  202 |     )
  203 |   ).toContain('application/json');
  204 | 
  205 |   const body = asRecord(
  206 |     exchange.response.body,
  207 |     reportText(
  208 |       'Body response error Cancel harus berupa JSON object',
  209 |       'Cancel error response body must be a JSON object'
  210 |     )
  211 |   );
  212 | 
  213 |   assertExpectedHttpStatusIsConsistent(expected);
  214 |   assertExactValue({
  215 |     testCaseId: expected.testCaseId,
  216 |     labelId: 'responseCode',
  217 |     labelEn: 'responseCode',
  218 |     actual: String(body.responseCode),
  219 |     expected: expected.expectedResponseCode
  220 |   });
  221 |   assertExactValue({
  222 |     testCaseId: expected.testCaseId,
  223 |     labelId: 'HTTP status berdasarkan expected responseCode',
  224 |     labelEn: 'HTTP status based on expected responseCode',
  225 |     actual: exchange.response.status,
  226 |     expected: httpStatusFromResponseCode(expected.expectedResponseCode)
  227 |   });
  228 | 
  229 |   assertHttpStatusMatchesResponseCode({
  230 |     testCaseId: expected.testCaseId,
  231 |     actualHttpStatus: exchange.response.status,
  232 |     responseCode: String(body.responseCode)
  233 |   });
  234 | 
  235 |   assertResponseMessageMatchesResponseCode({
  236 |     testCaseId: expected.testCaseId,
  237 |     responseCode: String(body.responseCode),
  238 |     responseMessage: String(body.responseMessage),
  239 |     expectedMessage:
  240 |       expected.expectedResponseMessage ??
  241 |       expectedResponseMessageForCode(expected.expectedResponseCode)
  242 |   });
  243 | 
  244 |   const schemaResult = validateJsonSchema(cancelQrisErrorResponseSchema, body);
  245 |   expect(
  246 |     schemaResult.errors,
  247 |     reportText(
  248 |       `Error schema response error Cancel untuk ${expected.testCaseId}`,
  249 |       `Cancel error response schema errors for ${expected.testCaseId}`
  250 |     )
  251 |   ).toEqual([]);
  252 | 
  253 |   expect(Object.prototype.hasOwnProperty.call(body, 'accessToken')).toBe(false);
  254 |   expect(Object.prototype.hasOwnProperty.call(body, 'qrContent')).toBe(false);
  255 |   expect(exchange.response.rawText).not.toMatch(/stack trace|sql syntax|SQLException|ORA-\d+/i);
  256 | }
  257 | 
  258 | export function assertClientSideHeaderRejection(error: unknown): void {
  259 |   const message = error instanceof Error ? error.message : String(error);
  260 |   expect(
  261 |     /invalid character|invalid header|header value|ERR_INVALID_CHAR|ERR_HTTP_INVALID_HEADER_VALUE/i.test(
  262 |       message
  263 |     ),
  264 |     reportText(
  265 |       `Ekspektasi error validasi HTTP header Cancel di sisi client, aktual: ${message}`,
  266 |       `Expected Cancel client-side HTTP header validation error, got: ${message}`
  267 |     )
> 268 |   ).toBe(true);
      |     ^ Error: Ekspektasi error validasi HTTP header Cancel di sisi client, aktual: CNL-HDR-023: responseCode tidak sesuai. Expected: 4007701; Actual: 4007702 / CNL-HDR-023: responseCode mismatch. Expected: 4007701; Actual: 4007702 / Expected Cancel client-side HTTP header validation error, got: CNL-HDR-023: responseCode tidak sesuai. Expected: 4007701; Actual: 4007702 / CNL-HDR-023: responseCode mismatch. Expected: 4007701; Actual: 4007702
  269 | }
  270 | 
  271 | export function getHeader(headers: Record<string, string>, headerName: string): string {
  272 |   const target = headerName.toLowerCase();
  273 |   const found = Object.entries(headers).find(([name]) => name.toLowerCase() === target);
  274 |   return found?.[1] ?? '';
  275 | }
  276 | 
  277 | export function asRecord(value: unknown, message: string): Record<string, unknown> {
  278 |   expect(isRecord(value), message).toBe(true);
  279 |   return value as Record<string, unknown>;
  280 | }
  281 | 
  282 | export function mutateOneCharacter(value: string): string {
  283 |   if (value.length === 0) {
  284 |     return 'x';
  285 |   }
  286 | 
  287 |   const replacement = value[0] === 'a' ? 'b' : 'a';
  288 |   return `${replacement}${value.slice(1)}`;
  289 | }
  290 | 
  291 | function sanitizeRawBody(rawBody: string): unknown {
  292 |   try {
  293 |     return sanitizeObject(JSON.parse(rawBody));
  294 |   } catch {
  295 |     return '<non-json raw body redacted>';
  296 |   }
  297 | }
  298 | 
  299 | function redactStringToSign(stringToSign: string, accessToken: string): string {
  300 |   return stringToSign.replace(accessToken, maskSecret(accessToken));
  301 | }
  302 | 
  303 | function httpStatusFromResponseCode(responseCode: string): number {
  304 |   if (!/^\d{7}$/.test(responseCode)) {
  305 |     throw new Error(
  306 |       reportText(
  307 |         `responseCode Cancel tidak valid untuk mengambil HTTP status: ${responseCode}`,
  308 |         `Invalid Cancel responseCode for HTTP status derivation: ${responseCode}`
  309 |       )
  310 |     );
  311 |   }
  312 | 
  313 |   return Number(responseCode.slice(0, 3));
  314 | }
  315 | 
  316 | function assertHttpStatusMatchesResponseCode(input: {
  317 |   testCaseId: string;
  318 |   actualHttpStatus: number;
  319 |   responseCode: string;
  320 | }): void {
  321 |   const expectedHttpStatus = httpStatusFromResponseCode(input.responseCode);
  322 | 
  323 |   if (input.actualHttpStatus !== expectedHttpStatus) {
  324 |     throw new Error(
  325 |       reportText(
  326 |         `${input.testCaseId}: HTTP status Cancel harus sama dengan 3 digit awal responseCode. Expected HTTP status: ${expectedHttpStatus}; Actual HTTP status: ${input.actualHttpStatus}; Actual responseCode: ${input.responseCode}`,
  327 |         `${input.testCaseId}: Cancel HTTP status must match the first 3 digits of responseCode. Expected HTTP status: ${expectedHttpStatus}; Actual HTTP status: ${input.actualHttpStatus}; Actual responseCode: ${input.responseCode}`
  328 |       )
  329 |     );
  330 |   }
  331 | }
  332 | 
  333 | function assertExactValue<T extends string | number>(input: {
  334 |   testCaseId: string;
  335 |   labelId: string;
  336 |   labelEn: string;
  337 |   actual: T;
  338 |   expected: T;
  339 | }): void {
  340 |   if (input.actual !== input.expected) {
  341 |     throw new Error(
  342 |       reportText(
  343 |         `${input.testCaseId}: ${input.labelId} tidak sesuai. Expected: ${input.expected}; Actual: ${input.actual}`,
  344 |         `${input.testCaseId}: ${input.labelEn} mismatch. Expected: ${input.expected}; Actual: ${input.actual}`
  345 |       )
  346 |     );
  347 |   }
  348 | }
  349 | 
  350 | function assertExpectedHttpStatusIsConsistent(expected: ExpectedCancelApiError): void {
  351 |   const statusDerivedFromResponseCode = httpStatusFromResponseCode(expected.expectedResponseCode);
  352 | 
  353 |   if (expected.expectedHttpStatus !== statusDerivedFromResponseCode) {
  354 |     throw new Error(
  355 |       reportText(
  356 |         `${expected.testCaseId}: konfigurasi test Cancel tidak konsisten. expectedHttpStatus harus mengikuti prefix expectedResponseCode. expectedHttpStatus eksplisit: ${expected.expectedHttpStatus}; HTTP status dari expectedResponseCode: ${statusDerivedFromResponseCode}`,
  357 |         `${expected.testCaseId}: inconsistent Cancel test configuration. expectedHttpStatus must follow expectedResponseCode prefix. Explicit expectedHttpStatus: ${expected.expectedHttpStatus}; HTTP status from expectedResponseCode: ${statusDerivedFromResponseCode}`
  358 |       )
  359 |     );
  360 |   }
  361 | }
  362 | 
  363 | function assertResponseMessageMatchesResponseCode(input: {
  364 |   testCaseId: string;
  365 |   responseCode: string;
  366 |   responseMessage: string;
  367 |   expectedMessage: string;
  368 | }): void {
```