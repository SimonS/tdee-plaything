import fetch from 'node-fetch';
import realData from '../__FIXTURES__/realData';
import getAllCheckins from './getAllCheckins';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');
let allCheckins;

beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (fetch as any).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(realData))),
  );
  allCheckins = await getAllCheckins('foo');
});

test('throws an error when no id provided', () => {
  expect(getAllCheckins('')).rejects.toThrowError('invalid ID');
});

test('first checkin has correct implicit date', () => {
  expect(allCheckins[0]).toMatchObject({
    date: new Date(2019, 3, 29, 2),
  });
});

test('further checkins in that week have correct calculated date', () => {
  expect(allCheckins[2]).toMatchObject({
    date: new Date(2019, 4, 1, 2),
  });
});

test('further checkins in next week have correct calculated date', () => {
  expect(allCheckins[8]).toMatchObject({
    date: new Date(2019, 4, 7, 2),
  });
});

test('first checkin has weight', () => {
  expect(allCheckins[0]).toMatchObject({ weight: 89.4 });
});

test('first checkin consolidates weight and calories', () => {
  expect(allCheckins[0]).toMatchObject({ calories: 2572 });
});

test('further checkins consolidate weight and calories', () => {
  expect(allCheckins[11]).toMatchObject({ calories: 2064 });
});

test('checkins should be sorted by date', () => {
  expect(allCheckins[20]).toMatchObject({ date: new Date('2019-05-19T01:00:00.000Z') });
});
