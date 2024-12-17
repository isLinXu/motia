import React from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './styles.css';

import { useMotiaFlow, nodeTypes } from '../motia-ui';

export default function App() {
  const { nodes, edges, loading, error } = useMotiaFlow();

  if (loading) return <div>Loading workflows...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background variant="lines" gap={20} size={1} color="#555" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
