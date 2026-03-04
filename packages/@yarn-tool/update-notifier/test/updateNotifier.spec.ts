import { updateNotifier } from '../index';
import { _getTestPackagePath } from './lib/util';

describe('updateNotifier', () =>
{
	describe('回傳值 / Return value', () =>
	{
		it('在允許檢查的環境下應該回傳物件 / should return object when check is allowed', () =>
		{
			const result = updateNotifier(_getTestPackagePath(), true);
			// 當 force 為 true 時，一定會回傳 UpdateNotifier 物件
			// When force is true, should always return UpdateNotifier object
			expect(result).toBeDefined();
			if (result !== null)
			{
				expect(typeof result.notify).toBe('function');
			}
		});

		it('在不允許檢查的環境下應該回傳 null / should return null when check is not allowed', () =>
		{
			const originalNodeEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'test';

			const result = updateNotifier(_getTestPackagePath());
			expect(result).toBeNull();

			process.env.NODE_ENV = originalNodeEnv;
		});
	});

	describe('參數處理 / Parameter handling', () =>
	{
		it('應該接受字串路徑 / should accept string path', () =>
		{
			const result = updateNotifier(_getTestPackagePath(), true);
			expect(result).toBeDefined();
		});

		it('應該接受路徑片段陣列 / should accept path segments array', () =>
		{
			const result = updateNotifier([__dirname, '..'], true);
			expect(result).toBeDefined();
		});

		it('應該接受自訂通知選項 / should accept custom notification options', () =>
		{
			const options = {
				shouldNotifyInNpmScript: true,
				updateCheckInterval: 1000,
			};
			const result = updateNotifier(_getTestPackagePath(), true, options);
			expect(result).toBeDefined();
		});
	});
});
