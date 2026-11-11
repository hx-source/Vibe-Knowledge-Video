import assert from 'node:assert/strict';
import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const readJson = async (relative) => JSON.parse(await readFile(path.join(root, relative), 'utf8'));
const required = ['src/compositions', 'src/components', 'src/scenes', 'src/timeline',
  'src/themes', 'src/audio', 'src/review', 'scripts', 'templates/starter/scenes',
  'templates/starter/assets', 'projects', 'assets', 'public', 'outputs', 'tests', 'docs', 'releases'];

try {
  for (const dir of required) assert.ok((await stat(path.join(root, dir))).isDirectory(), dir);
  const jsonFiles = [];
  async function visit(dir) {
    for (const item of await readdir(path.join(root, dir), {withFileTypes: true})) {
      if (['node_modules', '.git', 'outputs', 'prepared', '.cache', 'dist', 'build', '.remotion'].includes(item.name)) continue;
      const relative = path.join(dir, item.name);
      if (item.isDirectory()) await visit(relative);
      else if (item.name.endsWith('.json')) { await readJson(relative); jsonFiles.push(relative); }
    }
  }
  await visit('');
  const pkg = await readJson('package.json');
  const base = 'templates/starter';
  const project = await readJson(`${base}/project.json`);
  assert.equal(project.contract, 'knowledge-video-remotion');
  assert.equal(project.templateVersion, pkg.version);
  for (const relative of Object.values(project.files)) {
    const resolved = path.resolve(root, base, relative);
    const local = path.relative(path.join(root, base), resolved);
    assert.ok(!local.startsWith('..') && !path.isAbsolute(local), `模板引用越界: ${relative}`);
    assert.ok((await stat(resolved)).isFile(), `模板引用缺失: ${relative}`);
  }
  const theme = await readJson(`src/themes/${project.themeId}.json`);
  assert.equal(theme.id, project.themeId);
  const board = await readJson(`${base}/${project.files.storyboard}`);
  const segments = new Map();
  for (const segment of board.segments) {
    assert.ok(!segments.has(segment.id), `片段重复: ${segment.id}`);
    assert.ok(Number.isFinite(segment.durationSeconds) && segment.durationSeconds > 0);
    for (const time of Object.values(segment.events)) {
      assert.ok(Number.isFinite(time) && time >= 0 && time <= segment.durationSeconds);
    }
    segments.set(segment.id, segment);
  }
  const captions = await readJson(`${base}/${project.files.captions}`);
  for (const caption of captions.items) {
    const segment = segments.get(caption.segmentId);
    assert.ok(segment, `字幕片段不存在: ${caption.id}`);
    const start = segment.events[caption.start.event];
    const end = segment.events[caption.end.event];
    assert.ok(Number.isFinite(start) && Number.isFinite(end) && end > start, `字幕事件无效: ${caption.id}`);
  }
  const audio = await readJson(`${base}/${project.files.audioPlan}`);
  assert.equal(audio.schemaVersion, 2);
  for (const field of ['clips', 'cues', 'rhythms', 'ducking']) assert.deepEqual(audio[field], []);
  console.log(`骨架检查通过：${required.length} 个职责目录，${jsonFiles.length} 个 JSON，模板引用及示例事件一致。`);
  console.log('检查范围仅为当前骨架；Remotion 预览、混音、渲染和人工审片尚未验证。');
} catch (error) {
  console.error(`骨架检查失败：${error.message}`);
  process.exitCode = 1;
}
