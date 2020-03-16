/* eslint no-undef: 0, no-global-assign: 0 */
speechSynthesis = {
  getVoices: jest.fn().mockReturnValue(Array.from(Array(37), (k, v) => v)),
  speak: jest.fn(),
}
SpeechSynthesisUtterance = jest.fn()
navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue(null)
}
