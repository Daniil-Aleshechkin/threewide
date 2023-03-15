function* zip<T>(...arrays: Array<Array<T>>): Generator<Array<T>> {
    const iterators = arrays.map(array => array[Symbol.iterator]());
    while (true) {
      const nexts = iterators.map(iterator => iterator.next());
      if (nexts.some(next => next.done)) {
        return;
      }
      yield nexts.map(next => next.value) as Array<T>;
    }
}
  

  
export default zip