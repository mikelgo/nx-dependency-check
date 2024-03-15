import * as process from 'process';
import { join } from 'path';
import { ExecutorContext, Hash, hashArray, HasherContext, readTargetOptions, Task, workspaceRoot } from '@nx/devkit';
import { Hasher } from './hasher';

export default async function run(task: Task, context: HasherContext): Promise<Hash> {
  // const taskHash = await context.hasher.hashTask(task, context.taskGraph, process.env);
  const taskHash = await context.hasher.hashTask(task, context.taskGraph);

  const command = taskHash.details.command;
  let selfSource = '';
  for (const n of Object.keys(taskHash.details)) {
    if (n.startsWith(`${task.target.project}:`)) {
      selfSource = taskHash.details.nodes[n];
    }
  }

  const executorContext: ExecutorContext = {
    root: workspaceRoot,
    cwd: process.cwd(),
    projectsConfigurations: context.projectsConfigurations,
    nxJsonConfiguration: context.nxJsonConfiguration,
    workspace: {
      ...context.projectsConfigurations,
      ...context.nxJsonConfiguration,
    },
    isVerbose: false,
    projectGraph: context.projectGraph,
  };

  const options = readTargetOptions(
    {
      project: task.target.project,
      target: task.target.target,
      configuration: task.target.configuration,
    },
    executorContext
  ) satisfies { backendRoot?: string; inputs: Array<string> };

  const basePath = join(executorContext.root, options.backendRoot ?? '');
  const hasher = new Hasher(basePath);

  const hash = hasher.getHash(options.inputs).digest('hex');

  return {
    value: hashArray([command, selfSource, hash]),
    details: {
      command,
      nodes: { [task.target.project]: selfSource },
    },
  };
}
