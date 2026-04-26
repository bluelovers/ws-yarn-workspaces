/** 環境開發模式標記 / Environment development mode flag */
declare var __DEV__: boolean;

/** TSDX 輸出格式定義（例如 esm, cjs, umd）/ Defines the TSDX output format (e.g., esm, cjs, umd) */
declare var __TSDX_FORMAT__: 'esm' | 'cjs' | 'umd';

/** Node.js 環境的流程變數命名空間 / Namespace for NodeJS environment process variables */
declare namespace NodeJS {
	/** 處理器環境接口定義 / Definition of the handler environment interface */
	interface ProcessEnv
	{
		/** TSDX 輸出格式（來自全局類型）/ TSDX output format (from global type) */
		TSDX_FORMAT?: typeof __TSDX_FORMAT__;

		/** 當前運行環境，例如 'test', 'development' 或 'production' / Current running environment, e.g., 'test', 'development' or 'production' */
		NODE_ENV?: string | 'test' | 'development' | 'production';
	}
}
