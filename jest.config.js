module.exports = {
  verbose: true,
  rootDir: './',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules'],
  setupFilesAfterEnv: ['<rootDir>/enzyme.config.js'],
};
