import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x760E68e305871317E76c050049F46CC5d17cACe6'
);

export default instance;