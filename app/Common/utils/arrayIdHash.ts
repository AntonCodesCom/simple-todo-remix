import md5 from 'md5';

interface ObjectWithId {
  id: string;
  [key: string]: any;
}

/**
 * Collects `id`s of array elements, then sorts and concatenates (joins)
 * them together, eventually returns an MD5 hash of this.
 *
 * We can thus make a conclusion whether different arrays of an entity objects
 * contain the same entities, even if some of their properties differ between
 * arrays (for example for comparing entity list displayed on a web page to
 * those we have in the database).
 *
 * @param arr array of elements each containing an `id` string property (typically UUID)
 * @returns MD5 hash of the `id`s
 */
export default function arrayIdHash(arr: ObjectWithId[]): string {
  return md5(
    arr
      .map((x) => x.id)
      .sort((a, b) => (a > b ? 1 : -1))
      .join(),
  );
}
