import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x76CA3eC4ceA7fCB4eDE0D1ad61cD4a4939Dd4CC7'
);

export default instance;