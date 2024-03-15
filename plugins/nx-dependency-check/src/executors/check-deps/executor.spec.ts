import { CheckDepsExecutorSchema } from './schema';
import executor from './executor';

const options: CheckDepsExecutorSchema = {};

describe('CheckDeps Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
