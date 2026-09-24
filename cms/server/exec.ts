import { spawn } from 'node:child_process';

export interface ExecResult {
  code: number;
  stdout: string;
  stderr: string;
}

/** Run a command, collect output. Never throws – check `code`. */
export function run(cmd: string, args: string[], cwd: string, onLine?: (line: string) => void): Promise<ExecResult> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, env: { ...process.env, FORCE_COLOR: '0', GIT_TERMINAL_PROMPT: '0' } });
    let stdout = '';
    let stderr = '';
    const feed = (chunk: Buffer, isErr: boolean) => {
      const text = chunk.toString();
      if (isErr) stderr += text;
      else stdout += text;
      if (onLine) for (const l of text.split('\n')) if (l.trim()) onLine(l);
    };
    child.stdout.on('data', (c: Buffer) => feed(c, false));
    child.stderr.on('data', (c: Buffer) => feed(c, true));
    child.on('error', (err) => resolve({ code: 127, stdout, stderr: stderr + String(err) }));
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

export const git = (cwd: string, ...args: string[]) => run('git', args, cwd);

/** Run a package.json script with the same Yarn that started the editor. */
export function yarnRun(cwd: string, script: string, onLine?: (l: string) => void) {
  const execPath = process.env.npm_execpath;
  if (execPath && /\.c?js$/.test(execPath)) return run(process.execPath, [execPath, 'run', script], cwd, onLine);
  return run('yarn', ['run', script], cwd, onLine);
}

export function tail(text: string, lines = 30): string {
  return text.trim().split('\n').slice(-lines).join('\n');
}
