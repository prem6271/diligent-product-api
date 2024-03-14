// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------
import dotenv from 'dotenv';
dotenv.config()
import * as msal from "@azure/msal-node";

const getAccessToken = async function () {
    // Create a config variable that store credentials from config.json

    // Use MSAL.js for authentication

    const msalConfig = {
        auth: {
            clientId: process.env.CLIENTID,
            authority:  process.env.AUTH_URL + "/" + process.env.TENANTID,
        }
    };

    console.log("msalConfig => "  +  msalConfig);

    // Check for the MasterUser Authentication
    if (process.env.AUTH_TYPE.toLowerCase() === "masteruser") {
        const clientApplication = new msal.PublicClientApplication(msalConfig);

        const usernamePasswordRequest = {
            scopes: [process.env.SCOPE],
            username: process.env.UNAME,
            password: process.env.PASSWD
        };

        return clientApplication.acquireTokenByUsernamePassword(usernamePasswordRequest);

    };

    // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
    if (process.env.AUTH_TYPE.toLowerCase() === "serviceprincipal") {

        console.log("Service Principal")

        msalConfig.auth.clientSecret =  process.env.CLIENTSECRET
        const clientApplication = new msal.ConfidentialClientApplication(msalConfig);

        const clientCredentialRequest = {
            scopes: [process.env.SCOPE],
        };

        return clientApplication.acquireTokenByClientCredential(clientCredentialRequest);
    }
}

export { getAccessToken } ;