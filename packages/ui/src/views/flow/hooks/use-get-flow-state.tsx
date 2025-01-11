import { Edge, Node, useEdgesState, useNodesState } from '@xyflow/react'
import { useEffect, useState } from 'react'
import type { EdgeData, NodeData } from '../nodes/nodes.types'
import { TriggerNode } from '../nodes/trigger-node'
import { NoopNode } from '../nodes/noop-node'
import { BaseFlowNode } from '../nodes/base-flow-node'

type Emit = string | { type: string; label?: string; conditional?: boolean }

type FlowStep = {
  id: string
  name: string
  type: 'base' | 'trigger'
  description?: string
  subscribes?: string[]
  emits: Emit[]
  action?: 'webhook' | 'cron'
  webhookUrl?: string
  cron?: string
  nodeComponentPath?: string
}

export type FlowResponse = {
  id: string
  name: string
  steps: FlowStep[]
}

type FlowState = {
  nodes: Node<NodeData>[]
  edges: Edge<EdgeData>[]
  nodeTypes: Record<string, React.ComponentType<any>>
}

async function importFlow(flow: FlowResponse): Promise<FlowState> {
  const nodeTypes: Record<string, React.ComponentType<any>> = {
    base: BaseFlowNode,
    trigger: TriggerNode,
    noop: NoopNode,
  }

  for (const step of flow.steps) {
    if (step.nodeComponentPath) {
      const module = await import(step.nodeComponentPath)
      nodeTypes[step.nodeComponentPath] = module.default
    }
  }

  console.log(nodeTypes)

  // we need to check all subscribes and emits to connect the nodes using edges
  const nodes: Node<NodeData>[] = flow.steps.map((step) => ({
    id: step.id,
    type: step.nodeComponentPath ? step.nodeComponentPath : step.type,
    position: { x: 0, y: 0 },
    data: step,
  }))

  const edges: Edge<EdgeData>[] = []

  // For each node that emits events
  flow.steps.forEach((sourceNode) => {
    const emits = sourceNode.emits || []

    // Check all other nodes that subscribe to those events
    flow.steps.forEach((targetNode) => {
      const subscribes = targetNode.subscribes || []

      // For each matching emit->subscribe, create an edge
      emits.forEach((emit) => {
        const emitType = typeof emit === 'string' ? emit : emit.type

        if (subscribes.includes(emitType)) {
          const label = typeof emit !== 'string' ? emit.label : undefined
          const variant = typeof emit !== 'string' && emit.conditional ? 'conditional' : 'default'
          const data: EdgeData = { variant, label }

          edges.push({
            id: `${sourceNode.id}-${targetNode.id}`,
            type: 'base',
            source: sourceNode.id,
            target: targetNode.id,
            label,
            data,
          })
        }
      })
    })
  })

  return { nodes, edges, nodeTypes }
}

export const useGetFlowState = (flow: FlowResponse) => {
  const [nodeTypes, setNodeTypes] = useState<Record<string, React.ComponentType<any>>>()
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<EdgeData>>([])

  useEffect(() => {
    if (!flow) return

    importFlow(flow).then(({ nodes, edges, nodeTypes }) => {
      setNodes(nodes)
      setEdges(edges)
      setNodeTypes(nodeTypes)
    })
  }, [flow])

  return { nodes, edges, onNodesChange, onEdgesChange, nodeTypes }
}
