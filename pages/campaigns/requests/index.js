import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Button, Table, Icon } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
import _ from 'lodash';

class RequestIndex extends Component {
    state = {
        column: null,
        direction: null,
    }

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill()
                .map((element, index) => {
                    return campaign.methods.requests(index).call();
                })
        );

        return { address, requests, requestCount, approversCount };
    }

    handleSort = clickedColumn => () => {
        const { column, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                direction: 'ascending',
            })

            _.sortBy(this.props.requests, [clickedColumn]);

            return
        }

        this.setState({
            data: this.props.requests.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}           
                    id={index + 1}           
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
            );
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        const { column, direction } = this.state

        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}`}>
                    <a>
                        <Button
                            animated
                            floated='right'
                            size='mini'
                            secondary
                        >
                            <Button.Content visible>Back</Button.Content>
                            <Button.Content hidden>
                                <Icon name='chevron left' />
                            </Button.Content>
                        </Button>
                    </a>
                </Link>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated='right' style={{ marginBottom: 10 }}>Add Request</Button>
                    </a>
                </Link>
                <Table sortable>
                    <Header>
                        <Row textAlign='center'>
                            <HeaderCell>Id</HeaderCell>                        
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell sorted={column === 'amount' ? direction : null} onClick={this.handleSort('amount')}>Amount (Ether)</HeaderCell>
                            <HeaderCell sorted={column === 'recipient' ? direction : null} onClick={this.handleSort('recipient')}>Recipient</HeaderCell>
                            <HeaderCell sorted={column === 'approversCount' ? direction : null} onClick={this.handleSort('approversCount')}>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>                          
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests. {this.state.column ? (<span>Sorted by {this.state.column} {this.state.direction}</span>) : null}</div> 
            </Layout>
        );
    }
}

export default RequestIndex;