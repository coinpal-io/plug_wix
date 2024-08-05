import * as paymentProvider from 'interfaces-psp-v1-payment-service-provider';

/** @returns {import('interfaces-psp-v1-payment-service-provider').PaymentServiceProviderConfig} */
export function getConfig() {

    var data = {
        title: 'Coinpal Payment',
        paymentMethods: [{
            hostedPage: {
                title: 'Pay Crypto with CoinPal',
                billingAddressMandatoryFields: [],
                logos: {
                    white: {
                        svg: 'https://www.coinpal.io/images/plug_coinpal.png',
                        png: 'https://www.coinpal.io/images/plug_coinpal.png'
                    },
                    colored: {
                        svg: 'https://www.coinpal.io/images/plug_coinpal.png',
                        png: 'https://www.coinpal.io/images/plug_coinpal.png'
                    }
                }
            }
        }],
        credentialsFields: [{
            simpleField: {
                name: 'merchant_no',
                label: 'Merchant No.'
            }
        },
            {
                simpleField: {
                    name: 'access_token',
                    label: 'Stroe Access Token'
                }
            }]
    };
    return data;
    //throw new Error('getConfig was not implemented');
}
