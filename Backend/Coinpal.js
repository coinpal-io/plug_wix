import crypto from 'crypto-js'
import {ok, badRequest} from 'wix-http-functions';
import {orderTransactions, orders} from "wix-ecom-backend"
import {elevate} from "wix-auth";
import {getSecret} from 'wix-secrets-backend';

const elevatedAddPayments = elevate(orderTransactions.addPayments);
const getOrder = elevate(orders.getOrder);

/**
 * connect for Coinpal
 */
export async function connect(request) {
    return {
        credentials: request.credentials,
        accountName: "tech@coinpal.io",
    };
}

export async function createTransaction(options) {
    try {
        const response = await fetch('https://pay.coinpal.io/gateway/wix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const orderInfo = await getOrder(options.order._id);
        return {
            pluginTransactionId: responseData.reference,
            redirectUrl: responseData.nextStepContent,
        };
    } catch (error) {
        return return_failed(null,error.message)
    }
}

/**
 * Refunded order transaction for Coinpal
 */
export async function refundedTransaction(request) {
    return true;
}


export async function notify(request) {
    try {

        const {orderId} = request.query;
        const body = await request.body.json();
        const secret = await getSecret("coinpal_secret_key");
        const orderInfo = await getOrder(orderId);
        if (body.paidOrderAmount <= 0) {
            return return_ok(null, "unpaid");
        }
        //Get the current paid amount of the order
        const paidAmount = orderInfo.balanceSummary.paid.amount | 0;
        //Get the amount of this payment
        body.balance = parseFloat(body.paidOrderAmount) - parseFloat(paidAmount);
        //If Underpayment or Overpayment is set, as long as the payment amount is within this range, we will consider it a successful transaction. For specific links, please see https://portal.coinpal.io/#/admin/myAccount/Payments
        if (body.status == 'paid') {
            body.balance = parseFloat(body.orderAmount) - parseFloat(paidAmount);
        }

        if (body.balance <= 0) {
            return return_ok(null, "The order has been updated！");
        }
        if (sign(body, secret) !== true) {
            return return_failed(null, "sign error");
        }
        const paymentInfo = formatPaymentInfo(body);
        const result = await elevatedAddPayments(orderId, paymentInfo.payments);
        return return_ok(result);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

/**
 * Coinapl notify sign
 * https://docs.coinpal.io/#/en/interface/notify
 */
export function sign(data, secret) {
    const signString = secret + data['requestId'] + data['merchantNo'] + data['orderNo'] + data['orderAmount'] + data['orderCurrency'];
    var currSignStr = crypto.SHA256(signString).toString(crypto.enc.Hex);
    console.log(data, secret, currSignStr, data.sign);
    if (currSignStr == data.sign) {
        return true;
    }
    return false;
}


export function formatPaymentInfo(data) {
    const paymenntInfo = {
        "payments": [
            {
                "amount": {
                    "amount": data.balance.toString()
                },
                "refundDisabled": false,
                "regularPaymentDetails": {
                    "paymentOrderId": data.orderNo,
                    "gatewayTransactionId": data.reference + data.confirmedTime,
                    "paymentMethod": "Coinpal",
                    //"providerTransactionId": "pi_3Nma8hD7mauJ7ZJt0bKKZkRT",
                    //"offlinePayment": false,
                    "status": "APPROVED"
                }
            }
        ]
    };
    return paymenntInfo;
}


export function return_ok(data = null, message = "successful") {
    let res = {
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            'message': message,
            "data": data
        }
    };
    return ok(res);
}


export function return_failed(data = null, message = "faild") {
    let res = {
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            'message': message,
            "data": data
        }
    };
    return badRequest(res);
}

