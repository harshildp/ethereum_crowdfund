import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of the Manager',
                description: 'Creator of the campaign which may also make requests to withdraw money.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution in Wei',
                description: 'Required contribution to become an approver.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request withdraws money from the campaign. Requests must be approved by approver majority.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already contributed to this campaign.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance in Ether',
                description: 'Amount of money remaining to fund this campaign',
                style: { overflowWrap: 'break-word' }
            }
        ];

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>
                <Grid>
                    <Grid.Column width={10}>
                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm />
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;