# set env variables
export AZURE_CLIENT_ID="cb49ae21-2811-467c-896b-1acfe2cdf7b0"
export AZURE_CLIENT_SECRET="c1t7Q~U4N4KCpeIuXZY_7lZ4_GOYHH.lCMfnU"
export AZURE_TENANT_ID="a50762c4-c5ad-413a-a05e-9ffe15752882"





# run
uvicorn app.main:app --reload --host 'https://napster-api.azurewebsites.net'
