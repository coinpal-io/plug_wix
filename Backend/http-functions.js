/*************************
 backend/http-functions.js
 *************************

 'backend/http-functions.js' is a reserved Velo file that lets you expose APIs that respond to fetch requests from external services.

 In this file you create APIs to expose the functionality of your site as a service. That is, other people can use
 the functionality of your site by writing code that calls your site's APIs, as defined by the functions you create here.

 Using the provided code (below this comment block) as an example, users of your HTTP functions can call your API using the following patterns:

 Production endpoints:

 • Premium site:
 https://mysite.com/_functions/multiply?leftOperand=3&rightOperand=4
 • Free sites:
 https://username.wixsite.com/mysite/_functions/multiply?leftOperand=3&rightOperand=4

 Test endpoints:
 • Premium sites:
 https://mysite.com/_functions-dev/multiply?leftOperand=3&rightOperand=4
 • Free sites:
 https://username.wixsite.com/mysite/_functions-dev/multiply?leftOperand=3&rightOperand=4

 ---
 About HTTP functions:
 https://support.wix.com/en/article/velo-exposing-a-site-api-with-http-functions

 API Reference:
 https://www.wix.com/velo/reference/wix-http-functions

 **********************/
// The following is an example of an HTTP function, which gets the product of 2 operands. Adapt the code below for your specific use case.

import * as Coinpal from "wix-coinpal"

/**
 * Notify from Coinapl
 * https://mysite.com/_functions/coinpal_notify?orderId=xxxxx
 */
export async function post_coinpal_notify(request) {
    try {
        return Coinpal.notify(request);
    } catch (error) {
        return Coinpal.return_failed(null, error)
    }
}