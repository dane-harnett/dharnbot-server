export default class Randomizer {
  static createNull(randomValue: number) {
    return new NullRandomizer(randomValue);
  }
  getRandomValue() {
    return Math.random();
  }
}

class NullRandomizer extends Randomizer {
  randomValue: number;
  constructor(randomValue: number) {
    super();
    this.randomValue = randomValue;
  }
  getRandomValue() {
    return this.randomValue;
  }
}
