"use strict";
module.exports = {
    key: "miclaveultrasecreta123*",
    mongo: {
        conectionString: "mongodb://app-picking-dev2:NoyyhjzfxK7kXFbZ0Ca0VWbnA6FbHvpggpE9hRDRVkBBn58bglXM6xx81si6wffSDW9rDYmrVQg5fTQ7hffoEg==@app-picking-dev2.mongo.cosmos.azure.com:10255/picking-dev?ssl=true&appName=@app-picking-dev2@",
        user: "app-picking-dev2",
        pass: "NoyyhjzfxK7kXFbZ0Ca0VWbnA6FbHvpggpE9hRDRVkBBn58bglXM6xx81si6wffSDW9rDYmrVQg5fTQ7hffoEg==",
        dbname: "picking-dev2"
    },
    profilesApp: ["2", "3"],
    profilesOms: ["5", "4", "0", "6"],
    sqlConfig: {
        server: 'srvreportes01pd.database.windows.net',
        authentication: {
            type: 'default',
            options: {
                userName: 'sessionadmin',
                password: 'SR2020..Pdxyz..' //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: true,
            database: 'SRReportPrimeDEV' //update me
        }
    }
};
