// autobind decorator
export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    // true の記載推奨
    configurable: true,
    get() {
      const boundFn = originMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}
