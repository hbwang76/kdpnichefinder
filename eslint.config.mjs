export default [
  { ignoredPaths: ['api/**', '((?!.*\\..*).)*'] },
  { protocols: ['https'] },
  {
    rule: { kind: 'host', value: 'kdpnichefinder\\.net' },
  },
]
