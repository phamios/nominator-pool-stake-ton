const {funcer} = require("./funcer");
const {
    FC, VALIDATOR_ADDR, ELECTOR_ADDR, ANYBODY_ADDR, NOMINATOR_1_ADDR, NOMINATOR_2_ADDR, makeNominator, makeStorage,
    TON, CONFIG_PARAMS
} = require("./utils");

const storage = (votes) => {
    return makeStorage({
        votes,
        config: {
            validator_address: '0x' + VALIDATOR_ADDR,
            validator_reward_share: 4000,
            max_nominators_count: 100,
            min_validator_stake: 100000 * TON,
            min_nominator_stake: 100000 * TON
        },
        nominators: {
            ['0x' + NOMINATOR_1_ADDR]: makeNominator(400000 * TON, 0),
            ['0x' + NOMINATOR_2_ADDR]: makeNominator(0, 400000 * TON)
        },
        withdraw_requests: {
            ['0x' + NOMINATOR_2_ADDR]: []
        }
    });
}


funcer({'logVmOps': false, 'logFiftCode': false}, {
    'path': './func/',
    'fc': FC,
    "configParams": CONFIG_PARAMS,
    'data': storage({
        321: ['uint256->any', {
            ['0x' + VALIDATOR_ADDR]: ['int1', -1, 'int32', 1628090356],
            ['0x' + NOMINATOR_2_ADDR]: ['int1', 0, 'int32', 1628090356]
        }, 'int32', 100]
    }),
    'in_msgs': [
        {
            "sender": '0:' + ANYBODY_ADDR,
            "amount": 8 * TON,
            "body": [
                "uint32", 7, // clean old votes
                "uint64", 123, // query_id
            ],
            "new_data": storage({}),
            "out_msgs": [
                {
                    "type": "Internal",
                    "to": "0:" + ANYBODY_ADDR,
                    "amount": 0,
                    "sendMode": 64 + 2,
                    "body": [],
                }
            ]
        },
    ],
});
