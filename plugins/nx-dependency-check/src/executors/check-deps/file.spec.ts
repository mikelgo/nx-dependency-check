import { HasherContext, Task, TaskHasher } from '@nx/devkit';
import { anything, instance, mock, when } from 'ts-mockito';
import run from './file';
import { Hasher } from './hasher';

jest.mock('./hasher');
jest.mock(
  '@nx/devkit',
  jest.fn().mockImplementation(() => ({
    readTargetOptions: () => ({
      backendRoot: '../backend',
      inputs: [],
    }),
    workspaceRoot: '/root',
    hashArray: (items: Array<string>) => items.join(':'),
  }))
);

describe('File hasher', () => {
  let projectName: string;
  let task: Task;
  let context: HasherContext;
  let hasher: TaskHasher;

  beforeEach(() => {
    projectName = 'core';
    task = {
      id: 'taskId',
      target: {
        project: ':libs:core',
        target: 'frontend-api-generate',
      },
      overrides: {},
      outputs: ['libs/core/src/api'],
    };

    const projectGraph = {
      nodes: {},
      dependencies: {},
    };

    const taskGraph = {
      roots: ['/root'],
      tasks: {},
      dependencies: {},
    };

    hasher = mock<TaskHasher>();
    when(hasher.hashTask(task, taskGraph, anything())).thenResolve({
      value: 'hash',
      details: {
        command: 'frontendApiGenerate',
        nodes: {},
      },
    });

    context = {
      hasher: instance(hasher),
      projectGraph,
      taskGraph,
      projectsConfigurations: {
        version: 2,
        projects: {
          [projectName]: {
            root: `libs/${projectName}`,
            sourceRoot: `libs/${projectName}/src`,
            targets: {},
          },
        },
      },
      nxJsonConfiguration: {},
    };

    (Hasher as jest.Mock).mockImplementation((basePath: string) => ({
      getHash: (inputs: Array<string>) => ({
        digest: () => `${basePath}:${inputs.join()}`,
      }),
    }));
  });

  it('sollte den korrekten Hash liefern', async () => {
    // WHEN
    const hash = await run(task, context);

    // THEN
    expect(hash).toEqual({
      details: {
        command: 'frontendApiGenerate',
        nodes: {
          ':libs:core': '',
        },
      },
      value: 'frontendApiGenerate::\\backend:',
    });
  });
});
