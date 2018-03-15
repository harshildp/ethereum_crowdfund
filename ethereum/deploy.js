const HDWalletProvider = require('truffle-hdwallet-provider'); // access provider from your Rinkeby account
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
 
// account mnemonic and infura URL
const provider = new HDWalletProvider(
    'much unit raccoon cheap try round hunt also loop purity chalk unknown',
    'https://rinkeby.infura.io/SJYaUnXKPItGCKik1gGa'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting deployment from', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] });
        
    console.log('Contract deployed to', result.options.address);
};
deploy();