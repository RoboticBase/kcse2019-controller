module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  globals: {
    speechSynthesis: null,
    SpeechSynthesisUtterance: null,
    navigator: null,
  },
  collectCoverage: true
}
