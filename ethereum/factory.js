import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xEf0A6C20a5B9cE7c2696bdb3897FaAC39bf91d49'
);

export default instance;