import requests
from django.conf import settings


class BscApi():
    def __init__(self, sso_server, api_server):
        self.sso_server = sso_server
        self.api_server = api_server

    def _get_header(self, access_token):
        header = {'Content-Type': 'application/json',
                  'Authorization': 'Bearer {}'.format(access_token)}
        return header

    def get_token(self, code):
        data = {
            "client_id": settings.BSC_API["CLIENT_ID"],
            "client_secret": settings.BSC_API["CLIENT_SECRET"],
            "grant_type": settings.BSC_API["AUTH_GRANT_TYPE"],
            "redirect_uri": settings.BSC_API["REDIRECT_URI"],
            "code": code
        }
        response = requests.post(self.sso_server, data)
        return response.json()

    def refresh_token(self, refresh_code):
        data = {
            "client_id": settings.BSC_API["CLIENT_ID"],
            "client_secret": settings.BSC_API["CLIENT_SECRET"],
            "grant_type": settings.BSC_API["REFRESH_GRANT_TYPE"],
            "refresh_token": refresh_code
        }
        response = requests.post(self.sso_server, data)
        return response.json()

    def get_config(self, bsc_token):
        data = {}
        response = requests.get(
            self.api_server + "config/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_mapping(self, bsc_token):
        data = {}
        response = requests.get(
            self.api_server + "mapping/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_accounts(self, bsc_token):
        data = {}
        response = requests.get(
            self.api_server + "accounts/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_state(self, bsc_token, account_id):
        data = {}
        response = requests.get(
            self.api_server + "accounts/" + account_id + "/state/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_orders(self, bsc_token, account_id):
        data = {}
        response = requests.get(
            self.api_server + "accounts/" + account_id + "/orders/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_positions(self, bsc_token, account_id):
        data = {}
        response = requests.get(
            self.api_server + "accounts/" + account_id + "/positions/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_executions(self, bsc_token, account_id, instrument_id):
        data = {"instrument": instrument_id}
        response = requests.get(
            self.api_server + "accounts/" + account_id + "/executions/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_orders_history(self, bsc_token, account_id):
        data = {}
        response = requests.get(
            self.api_server + "accounts/" + account_id + "/ordersHistory/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_instruments(self, bsc_token, account_id):
        data = {}
        response = requests.get(
            self.api_server + "accounts/" + account_id + "/instruments/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_quotes(self, bsc_token, symbol):
        data = {"symbols": symbol}
        response = requests.get(
            self.api_server + "quotes/", data, headers=self._get_header(bsc_token))
        return response.json()

    def get_depth(self, bsc_token, symbol):
        data = {"symbols": symbol}
        response = requests.get(
            self.api_server + "depth/", data, headers=self._get_header(bsc_token))
        return response.json()

    def place_order(self, bsc_token, account_id, instrument_id, quantity, side, type):
        data = {"accountId": account_id, "instrument": instrument_id,
                "qty": quantity, "side": side, "type": type}
        print(data)
        response = requests.get(
            self.api_server + "accounts/" + account_id + "/orders/", data, headers=self._get_header(bsc_token))
        print(response)
        return response.json()
