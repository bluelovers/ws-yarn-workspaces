/**
 * 將 file/gitignore / file/npmignore 分割為 test/fixtures/split/ 的分類片段
 * Split file/gitignore & file/npmignore into classified fragments under test/fixtures/split/
 *
 * 單一事實來源：主題（{@link TOPICS}）、分類 ↔ 檔名（{@link IGNORE_SPLIT_TARGETS}）、
 * 共用輔助區塊（{@link IGNORE_SPLIT_GENERATORS}）與片段路徑慣例（{@link getSplitFragmentPath}）
 * 皆引用 ./lib/ignore-split；本檔只保留分類邏輯本身。
 *
 * Single source of truth: topics ({@link TOPICS}), bucket ↔ file name
 * ({@link IGNORE_SPLIT_TARGETS}), shared generated blocks
 * ({@link IGNORE_SPLIT_GENERATORS}), and the fragment path convention
 * ({@link getSplitFragmentPath}) all come from ./lib/ignore-split; this script
 * only owns the classification logic itself.
 *
 * 分類流程：比對主題 → 命中共用輔助的重複語法改寫為佔位行 → 同檔重複與冗餘規則
 * 捨棄（寫入 other/）→ 段落註解併入下一個規則行的主題 → 依分類與主題寫出片段。
 *
 * Classification flow: match the topic → replace repeated matrices covered by a
 * shared generator with a placeholder line → drop same-file duplicates and
 * redundant rules (recorded in other/) → attach each section comment to the
 * topic of the following rule line → write out fragments by bucket and topic.
 *
 * 規格語意（必須保留）：`x/` 只針對目錄、`/x` 只錨定根目錄，兩者與 `x` 皆為
 * 不同規則；本檔所有比對（共用判定、同檔重複、輔助產生、冗餘判定）都以完整
 * 字串進行，不做任何正規化；冗餘表只允許「廣義規則的匹配集合嚴格包含該行」。
 *
 * Pattern semantics (must be preserved): `x/` targets directories only and `/x`
 * anchors to the root, so both differ from `x`; every comparison in this script
 * (shared detection, same-file duplicates, generator matching, redundancy) uses
 * the full string with no normalization, and the redundancy table only allows a
 * broader rule whose match set strictly contains the line.
 *
 * 執行 / run: tsx packages/@yarn-tool/static-file/test/scripts/split-ignore-files.ts
 * 輸出 / output: test/fixtures/split/{git,npm,shared,other}/*.txt
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { __ROOT } from '../__root';
import type {
	IIgnoreSplitEmittedBucket,
	IIgnoreSplitTargetBucket,
	IIgnoreSplitTopicId,
} from './lib/ignore-split';
import {
	EMITTED_BUCKETS,
	IGNORE_SPLIT_GENERATORS,
	IGNORE_SPLIT_TARGETS,
	SPLIT_ROOT,
	TOPICS,
	getSplitFragmentPath,
} from './lib/ignore-split';

/**
 * 片段檔標頭中的分類名稱（僅輸出分類需要標頭；other 有固定檔頭不經此表）
 * Bucket names shown in fragment headers (only emitted buckets need a header;
 * other has its own fixed header and does not use this table)
 */
const BUCKET_LABEL: Record<IIgnoreSplitEmittedBucket, string> = {
	git: 'git 專用 / git only',
	npm: 'npm 發布專用 / npm publish only',
	shared: '兩類共用 / shared',
};

/**
 * 冗餘規則：已被更廣泛的規則涵蓋，不輸出到組合結果，僅記錄於 other/ 供稽核
 * Redundant rules: covered by a broader rule, never emitted into the composed
 * output, only recorded in other/ for auditing
 *
 * 鍵為 `<分類>:<規則>`；只有該分類專屬（非共用）的行才會比對。
 * Keyed as `<bucket>:<rule>`; only bucket-specific (non-shared) lines are matched.
 *
 * 「涵蓋」指語意上的匹配集合包含（例：`coverage` 匹配任意層級，故包含只針對
 * 根目錄的 `/coverage`），絕非字串相同或正規化後相同；`x/`（只針對目錄）與
 * `/x`（只錨定根目錄）都是獨立規則，每條的廣義規則必須仍然存在於同一份來源
 * 檔，否則該條不得列為冗餘。
 * "Covered" means semantic containment of the match sets (e.g. `coverage`
 * matches any depth and therefore contains root-anchored `/coverage`), never
 * string equality or equality after normalization; `x/` (directories only) and
 * `/x` (root-anchored only) are rules in their own right, and each broader rule
 * must still exist in the same source file or the entry must not be listed.
 */
const REDUNDANT: Record<string, string> = {
	'git:/coverage': '已被 `coverage` 涵蓋 / covered by `coverage`',
	'git:/.next/': '已被 `.next` 涵蓋 / covered by `.next`',
	'git:/out/': '已被 `/out` 涵蓋 / covered by `/out`',
	'git:**/node_modules': '已被 `node_modules` 涵蓋 / covered by `node_modules`',
	'git:test/temp*/': '已被輔助產生的 `test/temp*` 涵蓋 / covered by generated `test/temp*`',
	'npm:/node_modules/': '已被 `node_modules` 涵蓋 / covered by `node_modules`',
	'npm:**/node_modules/': '已被 `node_modules` 涵蓋 / covered by `node_modules`',
	'npm:jest.config.js': '已被 `jest.config.*` 涵蓋 / covered by `jest.config.*`',
};

/**
 * 每個目標分類的「另一份」來源分類；共用規則即以「同時出現在另一份」判定
 * The complementary source bucket of each target; a rule counts as shared when
 * it also appears in that other source
 */
const COMPLEMENT: Record<IIgnoreSplitTargetBucket, IIgnoreSplitTargetBucket> = {
	git: 'npm',
	npm: 'git',
};

/**
 * 主題分類規則（依序比對，第一個符合者勝出）
 * Topic rules (checked in order; the first match wins)
 */
const RULES: [RegExp, IIgnoreSplitTopicId][] = [
	[/^!\*\.d\.(ts|mts|cts)$/, '05-source'],
	[/^!\/src\/\*\*/, '05-source'],
	[/^!\/(README|CHANGELOG)\.md$/, '10-project'],
	/**
	 * `!.github` 必須排在「巢狀 .github 排除規則」（原檔 163 < 201）之前，
	 * 否則嵌套 .github 會被白名單重新放行；`!/.github`（202）維持 99。
	 * `!.github` must stay before the nested-.github exclusion rule (original
	 * line 163 < 201) so nested .github remains re-excluded; `!/.github` (202)
	 * stays in 99.
	 */
	[/^!\.github$/, '10-project'],
	[/^!/, '99-whitelist'],
	/**
	 * 根目錄隱藏檔規則須早於 `!*.d.ts`（原檔 17 < 26），
	 * 否則根目錄的 *.d.ts 會被後置的 `/.*` 重新排除。
	 * The root hidden-file rule must precede `!*.d.ts` (original line 17 < 26),
	 * otherwise root *.d.ts files get re-excluded by the later `/.*`.
	 */
	[/^\/\.\*$/, '01-hidden'],
	[/^\*\.ts$/, '05-source'],
	[/^\/bin\//, '05-source'],
	/**
	 * 環境與 IDE 規則須早於測試規則：`.env.test.local` 含 `.test.` 但並非測試檔
	 * Environment and IDE rules must precede the test rules: `.env.test.local`
	 * contains `.test.` but is not a test file
	 */
	[/^\.env/, '40-env'],
	[/^\/certificates$/, '40-env'],
	[/\.pem$/, '40-env'],
	[/vercel|\.nowignore|^\/?now\.json$/, '40-env'],
	[/^\.?nvmrc$|^\.node-version$/, '40-env'],
	[/^\.?(idea|vscode)$/, '30-ide'],
	[/\.(suo|ntvs\*|njsproj|sln|sw\?)$/, '30-ide'],
	[/^(clinerules|kilocode|cline|junie|gemini|copilot|claude|agents|aiassistant)$/, '30-ide'],
	[/intellij/, '30-ide'],
	[/^(tests?|__tests?__|__mocks__|__snapshots__|__fixtures__|__file_snapshots__)$/, '20-test'],
	[/^\/?(tests?|__tests?__|__mocks__|__snapshots__|__fixtures__|fixture)\//, '20-test'],
	[/\/test\//, '20-test'],
	[/\.(spec|test|node-spec|node-test|stories)\./, '20-test'],
	[/^\.gitkeep$/, '20-test'],
	[/jest|karma|mocha|nyc|coverage/i, '20-test'],
	[/\.snap(shot)?$/, '20-test'],
	[/\/stories\//, '20-test'],
	[/^\.DS_Store$/, '90-misc'],
	[/^~ci\.|^\/~\*/, '90-misc'],
	[/\.stackdump$|^\*\.bak$|^\*\.old$/, '90-misc'],
	[/^\.opt-(in|out)$|^\*\.stat$|^\.codenomad$|^\.logs$|^\.agentbridge$|^openspec\/$|^cz-adapter$/, '90-misc'],
	[/.*/, '10-project'],
];

/**
 * 每個輔助區塊涵蓋的規則集合（排除空行與說明註解），
 * 用於在來源檔中找出該以佔位行取代的重複行
 * The rule set covered by each generator (blank lines and description comments
 * excluded), used to find the repeated source lines that a placeholder replaces
 */
const GENERATOR_RULE_SETS: Record<string, ReadonlySet<string>> = Object.fromEntries(
	Object.entries(IGNORE_SPLIT_GENERATORS).map(([name, { generate }]) => [
		name,
		new Set(generate().filter(line => line !== '' && !line.startsWith('#'))),
	]),
);

/**
 * 分割統計，僅供執行結束時輸出 / Split statistics, printed at the end of a run
 */
interface ISplitReport
{
	fragments: Record<string, number>;
	gen: Record<string, number>;
	dropped: {
		redundant: { bucket: IIgnoreSplitTargetBucket; line: string; note: string }[];
		dup: { bucket: IIgnoreSplitTargetBucket; line: string }[];
	};
}

const report: ISplitReport = {
	fragments: {},
	gen: {},
	dropped: {
		redundant: [],
		dup: [],
	},
};

/**
 * 行指派的種類：以 enum 取代字串聯合，避免字串筆誤；
 * 字串值與原字面值一致，report 與 JSON 輸出不受影響
 * The kind of a line assignment: an enum instead of a string union, so a typo
 * cannot slip in; the string values match the previous literals, keeping the
 * report and JSON output unchanged
 */
enum EnumIgnoreSplitLineKind
{
	Comment = 'comment',
	Gen = 'gen',
	Dropped = 'dropped',
	Fragment = 'fragment',
}

/**
 * 單一行的分類指派（判別聯合，依 {@link EnumIgnoreSplitLineKind} 收斂）
 * The classification assigned to a single line (a discriminated union narrowed by {@link EnumIgnoreSplitLineKind})
 */
type ILineAssignment =
	| { kind: EnumIgnoreSplitLineKind.Comment }
	| { kind: EnumIgnoreSplitLineKind.Gen; bucket: IIgnoreSplitTargetBucket; topic: IIgnoreSplitTopicId; genName: string }
	| { kind: EnumIgnoreSplitLineKind.Dropped; topic: IIgnoreSplitTopicId }
	| { kind: EnumIgnoreSplitLineKind.Fragment; bucket: IIgnoreSplitEmittedBucket; topic: IIgnoreSplitTopicId };

/**
 * 已解析的行指派：第二輪會把每個段落註解改為 Fragment，
 * 故回傳型別不再包含 Comment，後續只會遇到 Gen / Dropped / Fragment
 * Resolved line assignment: the second pass converts every section comment into
 * a Fragment, so the returned type no longer includes Comment and later stages
 * only see Gen / Dropped / Fragment
 */
type IResolvedAssignment = Exclude<ILineAssignment, { kind: EnumIgnoreSplitLineKind.Comment }>;

/**
 * 判斷單一規則行所屬的主題
 * Decide which topic a single rule line belongs to
 */
function classifyTopic(line: string): IIgnoreSplitTopicId
{
	for (const [re, topic] of RULES)
	{
		if (re.test(line))
		{
			return topic;
		}
	}

	return '10-project';
}

/**
 * 讀取來源檔並去除結尾空行 / Read a source file and strip its trailing blank lines
 */
function readLines(path: string): string[]
{
	const lines = readFileSync(path, 'utf8').split(/\r?\n/);

	while (lines.length > 0 && lines[lines.length - 1] === '')
	{
		lines.pop();
	}

	return lines;
}

/**
 * 判斷單一來源檔每一行的分類與主題
 * Decide the bucket and topic of every line in one source file
 *
 * @param file - 來源所屬的目標分類 / The target bucket of the source file
 * @param lines - 來源檔的所有行 / Every line of the source file
 * @param otherSet - 另一份來源檔的非空行集合（共用判定基準）/ The non-blank line set of the complementary source (the shared-bucket basis)
 */
function processFile(
	file: IIgnoreSplitTargetBucket,
	lines: string[],
	otherSet: ReadonlySet<string>,
): { lines: string[]; assign: (IResolvedAssignment | null)[] }
{
	const seen = new Set<string>();
	const assign = new Array<ILineAssignment | null>(lines.length).fill(null);

	for (let i = 0; i < lines.length; i++)
	{
		const line = lines[i];

		if (line === '')
		{
			continue;
		}

		/**
		 * 段落註解為「# 後接空白」的形式；`#jest.config.js` 這類被註解掉的規則
		 * 不符合此形式，仍視為規則行走一般分類
		 * A section comment is `#` followed by whitespace; a commented-out rule
		 * like `#jest.config.js` does not match and is classified as a rule line
		 */
		if (/^#\s/.test(line))
		{
			assign[i] = { kind: EnumIgnoreSplitLineKind.Comment };
			continue;
		}

		/**
		 * 規則行：同時出現在另一份來源檔即為共用分類
		 * A rule line that also appears in the other source belongs to the shared bucket
		 */
		const bucket: IIgnoreSplitEmittedBucket = otherSet.has(line) ? 'shared' : file;

		/**
		 * 1. 命中共用輔助的重複語法 → 以佔位行取代
		 * 1. A repeated matrix covered by a shared generator → replaced by a placeholder
		 */
		let genName: string | undefined;

		if (bucket === file)
		{
			for (const [name, ruleSet] of Object.entries(GENERATOR_RULE_SETS))
			{
				const generator = IGNORE_SPLIT_GENERATORS[name];

				if (generator.bucket === file && ruleSet.has(line))
				{
					genName = name;
					break;
				}
			}
		}

		if (genName)
		{
			assign[i] = { kind: EnumIgnoreSplitLineKind.Gen, bucket: file, topic: IGNORE_SPLIT_GENERATORS[genName].topic, genName };
			report.gen[genName] = (report.gen[genName] || 0) + 1;
			continue;
		}

		const topic = classifyTopic(line);

		/**
		 * 2. 同檔內重複出現 → other
		 * 2. Repeated within the same file → other
		 */
		if (seen.has(line))
		{
			assign[i] = { kind: EnumIgnoreSplitLineKind.Dropped, topic };
			report.dropped.dup.push({ bucket: file, line });
			continue;
		}
		seen.add(line);

		/**
		 * 3. 冗餘（已被更廣泛的規則涵蓋）→ other
		 * 3. Redundant (covered by a broader rule) → other
		 */
		const redundantNote = REDUNDANT[`${file}:${line}`];

		if (bucket === file && redundantNote)
		{
			assign[i] = { kind: EnumIgnoreSplitLineKind.Dropped, topic };
			report.dropped.redundant.push({ bucket: file, line, note: redundantNote });
			continue;
		}

		/**
		 * 4. 一般規則 → 分類到 fragment
		 * 4. An ordinary rule → classified into a fragment
		 */
		assign[i] = { kind: EnumIgnoreSplitLineKind.Fragment, bucket, topic };
	}

	/**
	 * 段落註解：主題採用下一個規則行的主題；分類採用同主題且會輸出的規則行。
	 * 規則行被佔位或丟棄時，繼續向後找同主題的下一個輸出行。
	 * A section comment adopts the topic of the next rule line and the bucket of
	 * an emitted line of that topic; when that line is dropped or replaced by a
	 * placeholder, it keeps scanning forward for the next emitted line of the
	 * same topic.
	 */
	for (let i = 0; i < lines.length; i++)
	{
		const current = assign[i];

		if (!current || current.kind !== EnumIgnoreSplitLineKind.Comment)
		{
			continue;
		}

		/**
		 * git 檔案首行的官方說明保留為 00-header 片段
		 * The official note on line 1 of the gitignore becomes the 00-header fragment
		 */
		if (i === 0 && file === 'git')
		{
			assign[i] = { kind: EnumIgnoreSplitLineKind.Fragment, bucket: 'git', topic: '00-header' };
			continue;
		}

		let topic: IIgnoreSplitTopicId | undefined;

		for (let j = i + 1; j < lines.length; j++)
		{
			const next = assign[j];

			if (!next || next.kind === EnumIgnoreSplitLineKind.Comment)
			{
				continue;
			}

			topic = next.topic;
			break;
		}

		const resolvedTopic = topic ?? '90-misc';
		let bucket: IIgnoreSplitEmittedBucket = file;

		for (let j = i + 1; j < lines.length; j++)
		{
			const next = assign[j];

			if (!next || next.kind !== EnumIgnoreSplitLineKind.Fragment || next.topic !== resolvedTopic)
			{
				continue;
			}

			bucket = next.bucket;
			break;
		}

		assign[i] = { kind: EnumIgnoreSplitLineKind.Fragment, bucket, topic: resolvedTopic };
	}

	return { lines, assign: assign as (IResolvedAssignment | null)[] };
}

/**
 * 依分類取出被丟棄的規則行（供 other/ 片段分段列出）
 * Collect the dropped rule lines of one bucket (for the sections of other/)
 */
function droppedLines(
	entries: readonly { bucket: IIgnoreSplitTargetBucket; line: string }[],
	bucket: IIgnoreSplitTargetBucket,
): string[]
{
	return entries.filter(entry => entry.bucket === bucket).map(entry => entry.line);
}

/**
 * 腳本進入點：分割兩份來源檔並寫出分類片段
 * Script entry: split both source files and write out the classified fragments
 */
function main(): void
{
	/**
	 * 讀取兩份來源檔（檔名來自 {@link IGNORE_SPLIT_TARGETS}）
	 * Read both source files (file names come from {@link IGNORE_SPLIT_TARGETS})
	 */
	const files = {} as Record<IIgnoreSplitTargetBucket, string[]>;

	for (const { bucket, fileName } of IGNORE_SPLIT_TARGETS)
	{
		files[bucket] = readLines(join(__ROOT, 'file', fileName));
	}

	const ruleLineSets = {} as Record<IIgnoreSplitTargetBucket, ReadonlySet<string>>;

	for (const { bucket } of IGNORE_SPLIT_TARGETS)
	{
		ruleLineSets[bucket] = new Set(files[bucket].filter(line => line !== ''));
	}

	const results = {} as Record<IIgnoreSplitTargetBucket, ReturnType<typeof processFile>>;

	for (const { bucket } of IGNORE_SPLIT_TARGETS)
	{
		results[bucket] = processFile(bucket, files[bucket], ruleLineSets[COMPLEMENT[bucket]]);
	}

	/**
	 * 建立 groups[分類][主題] = 行陣列（依原始順序）
	 * Build groups[bucket][topic] = line arrays (in original order)
	 */
	const groups = {} as Record<IIgnoreSplitEmittedBucket, Record<IIgnoreSplitTopicId, string[]>>;

	for (const bucket of EMITTED_BUCKETS)
	{
		groups[bucket] = Object.fromEntries(TOPICS.map(({ id }) => [id, [] as string[]])) as Record<IIgnoreSplitTopicId, string[]>;
	}

	const emittedGen = new Set<string>();

	for (const { bucket: file } of IGNORE_SPLIT_TARGETS)
	{
		const { lines, assign } = results[file];

		for (let i = 0; i < lines.length; i++)
		{
			const current = assign[i];

			if (!current || current.kind === EnumIgnoreSplitLineKind.Dropped)
			{
				continue;
			}

			/**
			 * 共用規則只在 git 通過時寫入（避免 git / npm 各推一次造成重複）
			 * Shared rules are written only during the git pass (to avoid pushing once per source file)
			 */
			if (current.bucket === 'shared' && file === 'npm')
			{
				continue;
			}

			if (current.kind === EnumIgnoreSplitLineKind.Gen)
			{
				const key = `${current.bucket}|${current.topic}|${current.genName}`;

				if (emittedGen.has(key))
				{
					continue;
				}
				emittedGen.add(key);
				groups[current.bucket][current.topic].push(`# %gen:${current.genName}%`);
				continue;
			}

			groups[current.bucket][current.topic].push(lines[i]);
		}
	}

	const written = new Set<string>();

	for (const bucket of EMITTED_BUCKETS)
	{
		for (const { id: topic, zh, en } of TOPICS)
		{
			const content = groups[bucket][topic];
			const path = getSplitFragmentPath(bucket, topic);

			if (content.length === 0)
			{
				/**
				 * 該分類 × 主題已無內容：刪除舊檔，避免組合腳本讀到過期片段
				 * This bucket × topic is now empty: remove the stale file so the compose script cannot read outdated content
				 */
				if (existsSync(path))
				{
					unlinkSync(path);
				}

				continue;
			}

			const header = `# ${zh} / ${en} · ${BUCKET_LABEL[bucket]}`;

			mkdirSync(dirname(path), { recursive: true });
			writeFileSync(path, [header, ...content].join('\n') + '\n', 'utf8');

			written.add(path);
			report.fragments[`${bucket}/${topic}`] = content.length;
		}
	}

	/**
	 * other：不輸出的冗餘與重複規則，僅留存供稽核
	 * other: duplicated and redundant rules, kept for auditing only
	 */
	{
		const content = [
			'# 其他：不輸出的重複與冗餘規則 / other: duplicated & redundant rules (never emitted)',
			'# 本目錄規則不會進入 out/gitignore 或 out/npmignore；僅留存供稽核 / these rules are never emitted into out/gitignore or out/npmignore; kept for auditing only',
			'# 重複語法（測試矩陣、*.map…）改由共用輔助產生，見 test/scripts/lib/ignore-split.ts / repetitive matrices are generated by the shared helper, see test/scripts/lib/ignore-split.ts',
			'',
			'# git 專用檔：已被更廣泛的規則涵蓋 / gitignore source: covered by a broader rule',
			...droppedLines(report.dropped.redundant, 'git'),
			'',
			'# npm 發布專用檔：已被更廣泛的規則涵蓋 / npmignore source: covered by a broader rule',
			...droppedLines(report.dropped.redundant, 'npm'),
			'',
			'# git 專用檔中重複出現 / duplicated in the gitignore source',
			...droppedLines(report.dropped.dup, 'git'),
			'',
			'# npm 發布專用檔中重複出現 / duplicated in the npmignore source',
			...droppedLines(report.dropped.dup, 'npm'),
		];

		const path = getSplitFragmentPath('other', '90-duplicates');

		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, content.join('\n') + '\n', 'utf8');

		written.add(path);
	}

	/**
	 * 清理未重寫的片段檔（主題改名或刪除後的殘留），
	 * 以逐檔 unlink 取代整目錄刪除，避免破壞性操作
	 * Remove fragment files not rewritten by this run (leftovers after a topic
	 * rename or removal); per-file unlink instead of a destructive directory wipe
	 */
	for (const bucket of [...EMITTED_BUCKETS, 'other'])
	{
		const dir = join(SPLIT_ROOT, bucket);

		if (!existsSync(dir))
		{
			continue;
		}

		for (const entry of readdirSync(dir))
		{
			if (!entry.endsWith('.txt'))
			{
				continue;
			}

			const path = join(dir, entry);

			if (!written.has(path))
			{
				unlinkSync(path);
			}
		}
	}

	console.log(JSON.stringify({ fragments: report.fragments, gen: report.gen, dropped: report.dropped }, null, 2));
}

main();
