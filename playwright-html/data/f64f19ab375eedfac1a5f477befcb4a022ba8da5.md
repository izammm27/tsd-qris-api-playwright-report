# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\get-token\get-token.header-negative.spec.ts >> Get Token B2B header negative >> GT-HDR-034 - tidak dikirim Content-Type dengan raw JSON body / Missing Content-Type with raw JSON body
- Location: tests\api\get-token\get-token.header-negative.spec.ts:16:9

# Error details

```
Error: Error schema response error untuk GT-HDR-034 / Error response schema errors for GT-HDR-034

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "/accessToken boolean schema is false",
+   "/tokenType boolean schema is false",
+ ]
```

# Test source

```ts
  132 |     actual: String(body.responseCode),
  133 |     expectedValues: ['2007300']
  134 |   });
  135 |   assertAllowedValue({
  136 |     testCaseId: 'SUCCESS',
  137 |     labelId: 'HTTP status sukses berdasarkan prefix responseCode',
  138 |     labelEn: 'Success HTTP status based on responseCode prefix',
  139 |     actual: exchange.response.status,
  140 |     expectedValues: [httpStatusFromResponseCode('2007300')]
  141 |   });
  142 |   expect(
  143 |     typeof body.responseMessage,
  144 |     reportText('Tipe responseMessage sukses', 'Success responseMessage type')
  145 |   ).toBe('string');
  146 |   expect(
  147 |     String(body.responseMessage).length,
  148 |     reportText('Panjang maksimum responseMessage sukses', 'Success responseMessage max length')
  149 |   ).toBeLessThanOrEqual(150);
  150 |   expect(
  151 |     body.responseMessage,
  152 |     reportText(
  153 |       'responseMessage sukses tidak boleh kosong',
  154 |       'Success responseMessage must not be empty'
  155 |     )
  156 |   ).not.toBe('');
  157 |   assertResponseMessageMatchesResponseCode({
  158 |     testCaseId: 'SUCCESS',
  159 |     responseCode: String(body.responseCode),
  160 |     responseMessage: String(body.responseMessage),
  161 |     expectedMessage: expectedResponseMessageForCode(String(body.responseCode))
  162 |   });
  163 |   expect(
  164 |     body.accessToken,
  165 |     reportText('accessToken sukses tidak boleh kosong', 'Success accessToken must not be empty')
  166 |   ).not.toBe('');
  167 |   expect(
  168 |     String(body.accessToken).length,
  169 |     reportText('Panjang maksimum accessToken', 'accessToken max length')
  170 |   ).toBeLessThanOrEqual(2048);
  171 |   expect(body.tokenType, reportText('tokenType sukses', 'Success tokenType')).toBe('Bearer');
  172 |   expect(
  173 |     typeof body.expiresIn,
  174 |     reportText(
  175 |       'expiresIn default berupa numeric string sesuai sample response',
  176 |       'expiresIn defaults to numeric string per sample response'
  177 |     )
  178 |   ).toBe('string');
  179 |   expect(
  180 |     String(body.expiresIn),
  181 |     reportText('expiresIn harus numeric string', 'expiresIn must be numeric string')
  182 |   ).toMatch(/^\d+$/);
  183 |   expect(
  184 |     Number(body.expiresIn),
  185 |     reportText('expiresIn harus bernilai positif', 'expiresIn must be positive')
  186 |   ).toBeGreaterThan(0);
  187 | 
  188 |   if (env.expectedTokenExpiresIn !== undefined) {
  189 |     expect(
  190 |       body.expiresIn,
  191 |       reportText(
  192 |         'expiresIn harus sesuai EXPECTED_TOKEN_EXPIRES_IN',
  193 |         'expiresIn must match EXPECTED_TOKEN_EXPIRES_IN'
  194 |       )
  195 |     ).toBe(env.expectedTokenExpiresIn);
  196 |   }
  197 | 
  198 |   if (Object.prototype.hasOwnProperty.call(body, 'additionalInfo')) {
  199 |     expect(
  200 |       isRecord(body.additionalInfo),
  201 |       reportText(
  202 |         'additionalInfo harus berupa object jika ada',
  203 |         'additionalInfo must be an object when present'
  204 |       )
  205 |     ).toBe(true);
  206 |   }
  207 | }
  208 | 
  209 | export function assertErrorExchange(exchange: GetTokenExchange, expected: ExpectedApiError): void {
  210 |   expect(
  211 |     getHeader(exchange.response.headers, 'content-type'),
  212 |     reportText(
  213 |       `Content-Type response error untuk ${expected.testCaseId}`,
  214 |       `Error response Content-Type for ${expected.testCaseId}`
  215 |     )
  216 |   ).toContain('application/json');
  217 | 
  218 |   const body = asRecord(
  219 |     exchange.response.body,
  220 |     reportText(
  221 |       'Body response error harus berupa JSON object',
  222 |       'Error response body must be a JSON object'
  223 |     )
  224 |   );
  225 |   const schemaResult = validateJsonSchema(getTokenErrorResponseSchema, body);
  226 |   expect(
  227 |     schemaResult.errors,
  228 |     reportText(
  229 |       `Error schema response error untuk ${expected.testCaseId}`,
  230 |       `Error response schema errors for ${expected.testCaseId}`
  231 |     )
> 232 |   ).toEqual([]);
      |     ^ Error: Error schema response error untuk GT-HDR-034 / Error response schema errors for GT-HDR-034
  233 | 
  234 |   expect(
  235 |     typeof body.responseCode,
  236 |     reportText(
  237 |       `Tipe responseCode untuk ${expected.testCaseId}`,
  238 |       `responseCode type for ${expected.testCaseId}`
  239 |     )
  240 |   ).toBe('string');
  241 |   expect(
  242 |     String(body.responseCode).length,
  243 |     reportText(
  244 |       `Panjang responseCode untuk ${expected.testCaseId}`,
  245 |       `responseCode length for ${expected.testCaseId}`
  246 |     )
  247 |   ).toBe(7);
  248 | 
  249 |   assertExpectedHttpStatusIsConsistent(expected);
  250 |   assertExactValue({
  251 |     testCaseId: expected.testCaseId,
  252 |     labelId: 'HTTP status berdasarkan expected responseCode',
  253 |     labelEn: 'HTTP status based on expected responseCode',
  254 |     actual: exchange.response.status,
  255 |     expected: httpStatusFromResponseCode(expected.expectedResponseCode)
  256 |   });
  257 |   assertExactValue({
  258 |     testCaseId: expected.testCaseId,
  259 |     labelId: 'responseCode',
  260 |     labelEn: 'responseCode',
  261 |     actual: String(body.responseCode),
  262 |     expected: expected.expectedResponseCode
  263 |   });
  264 | 
  265 |   assertHttpStatusMatchesResponseCode({
  266 |     testCaseId: expected.testCaseId,
  267 |     actualHttpStatus: exchange.response.status,
  268 |     responseCode: String(body.responseCode)
  269 |   });
  270 | 
  271 |   expect(
  272 |     typeof body.responseMessage,
  273 |     reportText(
  274 |       `Tipe responseMessage untuk ${expected.testCaseId}`,
  275 |       `responseMessage type for ${expected.testCaseId}`
  276 |     )
  277 |   ).toBe('string');
  278 |   expect(
  279 |     String(body.responseMessage).length,
  280 |     reportText(
  281 |       `Panjang maksimum responseMessage untuk ${expected.testCaseId}`,
  282 |       `responseMessage max length for ${expected.testCaseId}`
  283 |     )
  284 |   ).toBeLessThanOrEqual(150);
  285 | 
  286 |   assertResponseMessageMatchesResponseCode({
  287 |     testCaseId: expected.testCaseId,
  288 |     responseCode: String(body.responseCode),
  289 |     responseMessage: String(body.responseMessage),
  290 |     expectedMessage:
  291 |       expected.expectedResponseMessage ??
  292 |       expectedResponseMessageForCode(expected.expectedResponseCode)
  293 |   });
  294 | 
  295 |   expect(
  296 |     Object.prototype.hasOwnProperty.call(body, 'accessToken'),
  297 |     reportText(
  298 |       'Response error tidak boleh menampilkan accessToken',
  299 |       'Error response must not expose accessToken'
  300 |     )
  301 |   ).toBe(false);
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
```