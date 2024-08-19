import axios from 'axios';
import React, { useEffect, useState } from 'react';

import './home.css';

import ShowConnector from './connector';
import CreateConnector from './CreateConnector';

interface Connector {
    id: string;
    name: string;
    database: string;
    status: string;
    lastUpdated: string;
}

const HomePage = ({ user_id } : {user_id: string}) => {
    const [connectors, setConnectors] = useState<Connector[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [showConnectorPerformance, setShowConnectorPerformance] = useState(false);
    const [selectedConnectorId, setSelectedConnectorId] = useState('');
    const [createNewConnector, setCreateNewConnector] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchConnectors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/connectors');
            setConnectors(response.data);
        } catch (err) {
            setError(new Error(String(err)));
        } finally {
            setIsLoading(false);
        }
    };

    fetchConnectors();
    }, []);

    if (isLoading) {
        return <div>Loading connectors...</div>;
    }

    if (error) {
        return <div>Error fetching connectors: {error.message}</div>;
    }

    function handleEdit(id: string): void {
        setSelectedConnectorId(id);
    }

    function handlePerformance(id: string): void {
        setSelectedConnectorId(id);
        setShowConnectorPerformance(true);
    }

    function handleDelete(id: string): void {
        setSelectedConnectorId(id);
    }

    function handleCreate(): void {
        setCreateNewConnector(true);
        setUserId(user_id);
    }

    return (
        showConnectorPerformance ?
            <ShowConnector id={selectedConnectorId} /> :
            createNewConnector ?
            <CreateConnector id={userId}/> :
        <div className="container">
            <h1 className="title">CDC Connector Management</h1>

            <div className="connectors-list">
                <h2>Your Connectors</h2>
                <ul>
                    {connectors.map((connector) => (
                        <li key={connector.id}>
                            <div className="connector-info">
                                <h3>{connector.name}</h3>
                                <p>Database: {connector.database}</p>
                                <p>Status: {connector.status}</p>
                                <p>Last Updated: {connector.lastUpdated}</p>
                            </div>
                            <div className="connector-actions">
                                <button onClick={() => handleEdit(connector.id)}>Edit</button>
                                <button onClick={() => handlePerformance(connector.id)} className="perf">Performance</button>
                                <button onClick={() => handleDelete(connector.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="create-connector">
                <button onClick={() => handleCreate()}></button>
                
            </div>

            <div className="performance-monitoring">
                <h2>Performance Monitoring</h2>
                
            </div>
        </div>
    );
};

export default HomePage;