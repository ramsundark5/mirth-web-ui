type Argument<T> = T extends (arg: infer U, callback: infer X) => any ? U : any;
type Callback<T> = T extends (arg: infer U, callback: infer X) => any ? X : any;

export default function promisify<
  S extends (arg: Argument<S>, callback: Callback<S>) => void,
>(fn: S): (arg: Argument<S>) => Promise<Argument<Callback<S>>> {
  return arg =>
    new Promise((resolve, reject) => {
      try {
        const callback = (d: Argument<Callback<S>>) => {
          resolve(d);
        };
        fn(arg, callback as Callback<typeof fn>);
      } catch (e) {
        reject(e);
      }
    });
}
