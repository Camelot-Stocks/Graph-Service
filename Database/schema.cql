CREATE KEYSPACE IF NOT EXISTS stockHistory
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};
    -- WITH replication = {'class': 'NetworkTopologyStrategy', 'node1' : 2, 'node2' : 2};

