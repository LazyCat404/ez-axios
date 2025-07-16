import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, char => char[1].toUpperCase());
  } catch {
    throw new Error('Name property in package.json is missing.');
  }
};

module.exports = defineConfig({
  base: './',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'packages/index.ts'),
      name: getPackageNameCamelCase()
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  },
  plugins: [
    dts({
      outDir: 'dist', // 声明文件输出目录
      rollupTypes: true, // 关键配置：将所有类型合并为单个文件
      exclude: ['./test'], // 排除测试文件
      tsconfigPath: './tsconfig.json', // 指定 tsconfig.json 路径
      compilerOptions: {
        declarationMap: false // 不生成声明映射文件
      }
    })
  ]
});
