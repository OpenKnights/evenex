import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'

const env = process.env.NODE_ENV // umd 模式的编译结果文件输出的全局变量名称
const entries = ['src/index.ts']
const plugins = [
  resolve(),
  commonjs(),
  json(),
  typescript(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: [...DEFAULT_EXTENSIONS, '.ts']
  })
]
if (env === 'production') plugins.push(terser())

const rollupConfig = [
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.esm.js'),
        format: 'es'
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.cjs.js'),
        format: 'cjs'
      }
    ],
    plugins
  })),
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.d.ts'),
        format: 'esm'
      }
    ],
    plugins: [dts({ respectExternal: true })]
  }))
]

export default rollupConfig
