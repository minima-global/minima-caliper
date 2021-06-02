/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const {CaliperUtils, ConfigUtil, ConnectorBase, TxStatus} = require('@hyperledger/caliper-core');
const logger = CaliperUtils.getLogger('minima-connector');

const axios = require('axios');
const {Minima, Token} = require("minima");

/**
 * @typedef {Object} MinimaInvoke
 *
 * @property {string} api_name Required. The name of the API
 * @property {string} method Required. The name of the method to call
 * @property {string} params Required. Parameters of the method to call
 * @property {string} readOnly Optional. Is method read only, or requires transaction
 */

const MinimaConnector = class extends ConnectorBase {

    constructor(workerIndex) {
        super();
        this.bcType = 'minima';


        let configPath = CaliperUtils.resolvePath(ConfigUtil.get(ConfigUtil.keys.NetworkConfig));
        let minimaConfig = require(configPath).minima;

        this.checkConfig(minimaConfig);

        this.minimaConfig = minimaConfig;
        this.clientIndex = workerIndex;
        this.context = undefined;

        this.expirationOffset = 0;

        logger.info('Connecting to Minima endpoint ' + this.minimaConfig.rpchost);

        Minima.rpchost = minimaConfig.rpchost;
        Minima.wshost = minimaConfig.wshost;
        Minima.webhost = minimaConfig.webhost;

        Minima.debug = minimaConfig.debug;

        //Minima.init(function (msg) {
        //    console.log("Minima event", msg)
        //    if (msg.event == "connected") {
        //        console.log("connected");
        //    }
        //});
    }

    checkConfig(minimaConfig) {
        if (!minimaConfig.rpchost) {
            throw new Error('No RPC host given');
        }
        if (!minimaConfig.wshost) {
            throw new Error('No WS host given');
        }
        if (!minimaConfig.webhost) {
            throw new Error('No HTTP host given');
        }
    }

    async init(workerInit) {
        logger.info('MinimaConnector.init');
    }

    async installSmartContract() {
        logger.info('MinimaConnector.installSmartContract');
    }

    async getContext(roundIndex, args) {
        let context = {
            clientIndex: this.clientIndex,
            config: this.minimaConfig,
            roundIndex: roundIndex,
            args: args
        };

        this.context = context;
        return context;
    }

    async releaseContext() {
        logger.info('MinimaConnector.releaseContext');
    }

    async _sendSingleRequest(request) {
        const context = this.context;
        let status = new TxStatus();

        const onFailure = (err) => {
            status.SetStatusFail();
            logger.error('Failed Minima call: ' + JSON.stringify(request));
            logger.error(err);
        };

        const onSuccess = (rec) => {
            status.SetID(rec.transactionHash);
            status.SetResult(rec);
            status.SetVerification(true);
            status.SetStatusSuccess();
        };

        const urlOptions = {
            method: 'POST',
            url: Minima.rpchost,
            headers: {
                'Content-Type': 'application/json'
            },
            data: request.method
        };

        try {
            const response = await axios(urlOptions);
            onSuccess(response);
        } catch (error) {
            onFailure(error);
        }

        return status;
    }

    async prepareWorkerArguments(number) {
        let result = [];
        for (let i = 0; i < number; i++) {
            result[i] = {}; // as default, return an empty object for each client
        }
        return result;
    }

}

module.exports = MinimaConnector;
