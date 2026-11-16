// @ts-ignore
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testMatch: /.*\.playwright(?:-|\.)(?:spec|test)\.(?:ts)/,
});
