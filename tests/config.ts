const e2eConfig = {
  /**
   * Setting this timeout for actions like `.click()` will allow us to skip
   * unnecessary (intermediary) visibility checks on elements that are supposed
   * to be immediately visible (e.g. a static button).
   *
   * Due to our internal convention, if we see a 987 ms timeout error in a test
   * report, then this would mean that a necessary element is missing.
   */
  actionTimeout: 987,
};

export default e2eConfig;
