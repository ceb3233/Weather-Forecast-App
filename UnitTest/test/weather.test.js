
/**
 * @jest-environment jsdom
 */

const {validate, convertDate, getDayOfTheWeek} = require('../../src/app')

global.alert = jest.fn();

describe("validate", function() {
   
    it("should return false if the input is less than 3 characters long", function() {
        expect(validate("ab")).toBe(false);
    });
    it("should return false if the input contains numbers", function() {
        expect(validate("ab1")).toBe(false);
    });
    it("should return true if the input is valid", function() {
        expect(validate("abc")).toBe(true);
    });
});

describe('convertDate', () => {
    it('should convert date to MM-DD-YYYY', () => {
      expect(convertDate('2022-12-23')).toEqual('12-23-2022');
    });
  });

  describe('getDayOfTheWeek', () => {
    it('should return the day of the week', () => {
        const timestamp = 1671753600;
        const expected = 'Friday';
        const actual = getDayOfTheWeek(timestamp);
        expect(actual).toEqual(expected);
    });
});
