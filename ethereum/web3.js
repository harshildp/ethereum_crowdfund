import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // in the browser with metamask running
    web3 = new Web3(window.web3.currentProvider);
} else {
    // On the server OR user not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/SJYaUnXKPItGCKik1gGa'
    );
    web3 = new Web3(provider);
}

export default web3;