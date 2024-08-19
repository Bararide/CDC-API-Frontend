import axios from 'axios';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

interface Connector {
    id: string;
    name: string;
    database: string;
    status: string;
    lastUpdated: string;
}

interface Request {
    id: string;
    query: string;
    processingTime: number;
    operationType: string;
    status: string;
}

const ShowConnector = ({ id }: { id: string }) => {
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [connector, setConnector] = useState<Connector | null>(null);
    const [requests, setRequests] = useState<Request[]>([]);

    useEffect(() => {
        const fetchConnectorData = async () => {
            try {
                const params = new URLSearchParams();
                params.append('id', id);

                const connectorResponse = await axios.post('http://localhost:8080/api/connector', params);
                setConnector(connectorResponse.data);

                const requestsResponse = await axios.post('http://localhost:8080/api/connector/requests', params);
                setRequests(requestsResponse.data);
            } catch (err) {
                setError(new Error(String(err)));
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectorData();
    }, [id]);

    if (isLoading) {
        return <div>Loading connector information</div>;
    }

    if (error) {
        return <div>Error fetching connectors: {error.message}</div>;
    }

    if (!connector) {
        return <div>No connector information available</div>;
    }

    const requestsData = [
        ['Request ID', 'Query', 'Processing Time (ms)', 'Operation Type', 'Status'],
        ...requests.map((request) => [
            request.id,
            request.query,
            request.processingTime,
            request.operationType,
            request.status,
        ]),
    ];

    const requestCountData = [
        ['Time', 'Requests'],
        ...requests.reduce((acc, request) => {
            // Group requests by time period (e.g., hour)
            const time = new Date(request.processingTime).getHours();
            const existingEntry = acc.find((entry) => entry[0] === time);
            if (existingEntry) {
                existingEntry[1]++;
            } else {
                acc.push([time, 1]);
            }
            return acc;
        }, [] as [number, number][]),
    ];

    const operationTypeData = [
        ['Operation Type', 'Count'],
        ...requests.reduce((acc, request) => {
            const existingEntry = acc.find((entry) => entry[0] === request.operationType);
            if (existingEntry) {
                existingEntry[1]++;
            } else {
                acc.push([request.operationType, 1]);
            }
            return acc;
        }, [] as [string, number][]),
    ];

    return (
        <div className="container">
            <div className="connector-details">
                <h3>Connector Details</h3>
                <p>Name: {connector.name}</p>
                <p>Database: {connector.database}</p>
                <p>Status: {connector.status}</p>
                <p>Last Updated: {connector.lastUpdated}</p>
            </div>

            <div className="settings-menu">
                {/* Add settings menu component here */}
            </div>

            <div className="requests-table">
                <h3>Requests</h3>
                <Chart
                    chartType="Table"
                    data={requestsData}
                    options={{ showRowNumber: true }}
                    width="100%"
                    height="400px"
                />
            </div>

            <div className="charts">
                <div className="chart">
                    <h3>Request Count</h3>
                    <Chart
                        chartType="LineChart"
                        data={requestCountData}
                        options={{
                            title: 'Request Count Over Time',
                            hAxis: { title: 'Time (Hour)' },
                            vAxis: { title: 'Request Count' },
                        }}
                        width="100%"
                        height="300px"
                    />
                </div>

                <div className="chart">
                    <h3>Operation Type Distribution</h3>
                    <Chart
                        chartType="PieChart"
                        data={operationTypeData}
                        options={{ title: 'Operation Type Distribution' }}
                        width="100%"
                        height="300px"
                    />
                </div>
            </div>
        </div>
    );
};

export default ShowConnector;