import * as paymentProvider from 'interfaces-psp-v1-payment-service-provider';

/** @returns {import('interfaces-psp-v1-payment-service-provider').PaymentServiceProviderConfig} */
export function getConfig() {

    var data = {
        title: 'Coinpal Payment',
        paymentMethods: [{
            hostedPage: {
                title: 'Pay With Coinpal',
                billingAddressMandatoryFields: [],
                logos: {
                    white: {
                        svg: 'https://card.coinpal.io/assets/logo-a64c3844.svg',
                        png: 'https://docs.coinpal.io/static/images/coinpal-logo.png'
                    },
                    colored: {
                        svg: 'https://card.coinpal.io/assets/logo-a64c3844.svg',
                        png: 'https://docs.coinpal.io/static/images/coinpal-logo.png'
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
