const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('assigns the correct address to manager', async () => {
        const manager = await campaign.methods.manager().call();

        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert.ok(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '20',
                from: accounts[1]
            });
            assert(false);
        } catch (err){
            assert(err);
        }
    });

    it('allows a manager to make a spend request', async () => {
        await campaign.methods
            .createRequest("Buy raw materials", "100", accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        const request = await campaign.methods.requests(0).call();

        assert.equal("Buy raw materials", request.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        await campaign.methods
            .createRequest("Buy raw materials", web3.utils.toWei('1', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let previousBalance = await web3.eth.getBalance(accounts[1]);
        previousBalance = web3.utils.fromWei(previousBalance, 'ether');
        previousBalance = parseFloat(previousBalance);

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > previousBalance);
    });
});